# AfterDark OS — HackCamp 2026

**Tagline:** Turn scattered campus lighting reports into one map — and a budget-aware plan that lights the most walked paths first.

**Track:** Social Good · **Team:** [1–4 registered hackers — add names]

## Inspiration

A campus after dark is a different place. A path that feels fine at 3 pm can feel unsafe at 9 pm, and the reports about it are scattered across emails, spreadsheets and maintenance tickets. When the budget is limited, teams need a clear way to decide which repair buys the most useful light. AfterDark OS turns that inbox into one map and one defensible decision.

## What it does

AfterDark OS puts campus lighting reports, pathways, lights and buildings on one map. Each report moves through a strict lifecycle — reported, assessed, scheduled, repaired and field-checked — and coverage changes only after a field check. The repair planner takes a budget and compares every feasible repair combination using path length, evening footfall and capped overlapping coverage gains. It returns the combination that improves the most walked paths for the money, with before/after coverage, saved scenarios and CSV export.

**Gemini-assisted reporting:** when a visitor attaches a photo, the app can ask Gemini for a suggested category, title and factual description. The suggestion fills the form; the reporter reviews and edits it before submitting. Manual categorisation always remains available. Gemini never decides whether a repair happens and never changes the coverage baseline.

## How we built it

Next.js App Router, React, TypeScript, Tailwind CSS, Prisma and SQLite. The campus, costs and reports are deterministic synthetic data so the demo is repeatable. The optimiser is an exact deterministic subset search — it enumerates feasible repair sets, caps overlapping gains per pathway, applies length and footfall weights, and returns the best plan under the budget. Zod validates input; Recharts renders coverage; Framer Motion handles the interface. Gemini vision is called server-side from `/api/classify`; the API key never reaches the browser.

## Challenges we ran into

- Preventing overlapping repairs from double-counting the same coverage gain.
- Making a synthetic campus feel like a connected network rather than unrelated dots.
- Keeping the exact planner fast enough for a live budget slider.
- Designing a lifecycle strict enough to trust but simple enough for a phone.
- Running a SQLite demo on a read-only serverless filesystem; the public demo seeds a runtime copy in `/tmp`.
- Getting Gemini to return strict JSON within the token budget while keeping the photo suggestion factual.

## Accomplishments that we're proud of

- A complete flow: report → map → budget plan → field check.
- An exact optimiser that gives visibly different plans at ₹3,000 and ₹5,000.
- A 20-pathway, 20-light, 12-building synthetic campus with 12 seeded reports.
- A working Gemini photo-assist that suggests a category but leaves the decision with the reporter.
- A public deployed demo, an open-source repo and a narrated 47-second walkthrough.
- An honest dataset: every screen says coverage is a planning estimate, not a measurement or safety score.

## What we learned

Small, well-modelled decisions are easier to trust than a single black-box score. Showing the selected repairs and the before/after coverage makes the budget conversation concrete. Synthetic data must be labelled everywhere it appears. Exact search is practical at this scale; the hard parts are the interface and the data model. Gemini is useful as a fast first pass on a photo, but the reporter still needs to confirm what is actually visible.

## What's next for AfterDark

- Real campus geometry and measured lighting levels.
- Persistent production database and an audited maintenance history.
- A richer Gemini workflow: photo, location and report text together, with confidence and a visible “why”.
- Work orders and contractor cost tracking.
- Field testing with campus operations staff.

## Built with

Next.js, React, TypeScript, Tailwind CSS, Prisma, SQLite, Zod, Recharts, Framer Motion, Lucide, Gemini API, Vercel.

## Try it out

- **Live demo:** https://afterdark-os.vercel.app
- **Source:** https://github.com/radhika-verma06/afterdark-os
- **Demo video:** https://afterdark-os.vercel.app/demo.mp4

## Run locally

```bash
npm install
npm run setup
npm run dev
```

Open `http://localhost:3000`.

## Eligibility and originality

- HackCamp is open to admitted hackers; each team has 1–4 registered members who are present at the event.
- One project submission per team; no collaboration between teams.
- This project is the team’s own work. Confirm it was built for HackCamp and not submitted to another event before submitting.
- The campus, costs, coverage values and reports are synthetic demo data; they are not records about a real institution.
