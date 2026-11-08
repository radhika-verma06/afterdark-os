import { NextResponse } from "next/server";

export const runtime = "nodejs";

const CATEGORIES = ["Streetlight", "Pathway lighting", "Obstruction", "Other"] as const;

type Suggestion = {
  category: (typeof CATEGORIES)[number];
  title: string;
  description: string;
  confidence: number;
};

function parseSuggestion(text: string): Suggestion | null {
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  try {
    const value = JSON.parse(cleaned) as Partial<Suggestion>;
    if (!CATEGORIES.includes(value.category as (typeof CATEGORIES)[number])) return null;
    const title = String(value.title || "").trim().slice(0, 90);
    const description = String(value.description || "").trim().slice(0, 800);
    if (title.length < 4 || description.length < 8) return null;
    const confidence = Number(value.confidence);
    return {
      category: value.category as (typeof CATEGORIES)[number],
      title,
      description,
      confidence: Number.isFinite(confidence) ? Math.max(0, Math.min(1, confidence)) : 0,
    };
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Gemini is not configured on this deployment." },
      { status: 503 },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Send the photo as multipart form data." }, { status: 400 });
  }
  const photo = form.get("photo");
  if (!(photo instanceof File) || !photo.size) {
    return NextResponse.json({ error: "Choose a photo to classify." }, { status: 400 });
  }
  if (photo.size > 4 * 1024 * 1024) {
    return NextResponse.json({ error: "Use a photo under 4 MB." }, { status: 400 });
  }
  if (!["image/jpeg", "image/png", "image/webp"].includes(photo.type)) {
    return NextResponse.json({ error: "Use a JPG, PNG or WebP photo." }, { status: 400 });
  }

  const base64 = Buffer.from(await photo.arrayBuffer()).toString("base64");
  const model = process.env.GEMINI_MODEL || "gemini-3.6-flash";
  const prompt =
    "You are assisting a campus facilities report. Look only at the supplied photo. " +
    "Return strict JSON with category (one of Streetlight, Pathway lighting, Obstruction, Other), " +
    "a factual title of at most 90 characters, a factual description of at most 300 characters, " +
    "and confidence from 0 to 1. Do not invent a location, a repair cost or a safety conclusion. " +
    "If the photo is unclear, use Other and say what is visible.";

  let response: Response;
  try {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": key,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: prompt }] },
          contents: [
            {
              role: "user",
              parts: [
                { text: "Categorise this campus lighting report photo." },
                { inlineData: { mimeType: photo.type, data: base64 } },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1200,
            responseMimeType: "application/json",
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      },
    );
  } catch {
    return NextResponse.json({ error: "Could not reach Gemini." }, { status: 502 });
  }

  if (!response.ok) {
    return NextResponse.json(
      { error: `Gemini returned HTTP ${response.status}. Check the API key and model access.` },
      { status: 502 },
    );
  }

  const payload = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("");
  const suggestion = text ? parseSuggestion(text) : null;
  if (!suggestion) {
    return NextResponse.json(
      { error: "Gemini returned an unreadable suggestion. Keep the manual category." },
      { status: 422 },
    );
  }

  return NextResponse.json({ suggestion });
}
