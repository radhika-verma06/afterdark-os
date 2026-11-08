# AfterDark OS — judge brief

**One-line pitch:** Turn scattered campus lighting reports into one map — and a budget-aware plan that lights the most walked paths first.

## Public links

- **Live demo:** https://afterdark-os.vercel.app
- **Source repository:** https://github.com/radhika-verma06/afterdark-os
- **Demo video:** https://afterdark-os.vercel.app/demo.mp4

## What to try — 90 seconds

1. Open the **Overview**. Note the open reports, current coverage and estimated repair cost.
2. Open **Campus map**. Select a pathway or a report marker.
3. Open **Repair planner**. Set the budget to ₹3,000, then ₹5,000. Compare the selected repairs and the projected coverage. Toggle **Before / After**.
4. Open **Issue tracker**. Record a maintenance note and advance an example report through Reported → Assessed → Scheduled → Repaired → Field-checked. The coverage baseline changes only at the field check.
5. Use **Save scenario** and **Export CSV** to see the decision leave the app.
6. In **Issue tracker → New report**, attach a photo and tap **Suggest with Gemini**. The suggestion fills the category, title and description; edit it if needed and submit. Manual categorisation works without Gemini. See `submission/screenshots/gemini-suggest.png`.

## What is real and what is synthetic

The application, optimiser, map, workflow and database are real. The campus, pathway geometry, lighting coverage, costs, building inventory and seeded reports are a **deterministic synthetic dataset** for Aster Campus. Coverage is a planning estimate, not a photometric measurement or a safety score. Repair costs are estimates. The app says this in the interface.

The optimiser is an exact deterministic subset search. It is not an LLM and does not call an external model.

## Technical summary

- Next.js App Router, React 19, TypeScript, Tailwind CSS
- Prisma + SQLite
- Zod input validation
- Recharts coverage visualisation
- Framer Motion transitions
- Exact budget-constrained subset search with per-path overlap capping
- Vercel deployment with a seeded runtime SQLite copy for the public demo

## Known limitations

- Synthetic campus data, not a real institution.
- The deployed demo writes to a `/tmp` SQLite copy; writes may reset when a serverless instance recycles.
- Gemini photo assistance is optional and server-side; it suggests a category, title and description, while the reporter reviews the result. Manual categorisation remains available.
- Coverage and costs are estimates, not measurements.

## Run locally

```bash
npm install
npm run setup
npm run dev
```

Open `http://localhost:3000`.

## Licence

MIT — see `LICENSE`.

## Team

Team members and roles are listed on the Devpost project page.
