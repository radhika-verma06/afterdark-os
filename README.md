# AfterDark OS

**Better-lit paths. Smarter repairs. Safer campuses.**

AfterDark OS is a local MVP for Aster Campus, a fictional university. It maps a connected synthetic pathway network, tracks maintenance reports, and uses an exact budget-constrained optimiser to identify repair combinations with the highest estimated footfall-weighted lighting-coverage improvement.

> All campus names, geometry, repair costs, coverage values, and reports are deterministic synthetic demo data. Coverage is a planning estimate, not a photometric measurement, safety score, or claim about a real institution.

## Start locally

Requires Node.js 20+ and npm.

```bash
npm install
npm run setup
npm run dev
```

Open `http://localhost:3000`. `npm run setup` creates a local `.env` with SQLite defaults when missing, creates the Prisma schema in SQLite, and seeds Aster Campus. To reset the demo from the UI, use **Reset demo data** in the lower-left navigation.

## What works

- **Overview:** live SQLite-derived open-issue, current coverage, candidate, and estimated-cost metrics; map, top repair opportunities, and current-versus-projected coverage.
- **Campus map:** 20 connected pathways, 20 lights, 12 seeded issues, 12 named buildings, coverage layers, open-issue layer, clickable pathways and assets, keyboard-selectable map features, and zoom controls. The map is schematic and explicitly marked not to scale.
- **Repair planner:** budget slider/input (₹1,000–₹15,000), exact deterministic subset enumeration, per-path overlap capping, before/after map, coverage chart, save/compare scenarios, and CSV export. Changing the budget recalculates from the current database state.
- **Issue tracker:** search/filter, a three-step map-based report flow, optional JPG/PNG/WebP upload (4 MB limit), timestamped lifecycle history, and strict one-step status transitions. Estimated coverage changes only when the issue is advanced to **Field-checked**, where a maintenance note is required.
- **Reset:** restores seeded synthetic data and clears saved scenarios.

The optimiser enumerates every feasible subset of at most 20 candidates. Its objective is `Σ(path length × evening footfall weight × capped coverage gain)` subject to total estimated repair cost ≤ budget. The displayed overall coverage is length-weighted, as defined in the brief. It does not call an LLM.

## Optional Gemini photo categorisation

Manual categorisation is always available and is the only categorisation path in this MVP. `.env.example` documents `GEMINI_API_KEY` for a future explicitly user-triggered photo-assistance feature; no image is sent to an AI service currently.

## HERHACK 2026 submission

- **Event:** HERHACK 2026, Student Innovation track
- **Team:** [ADD 2–5 TEAM MEMBERS AND ROLES]
- **Public repository:** [ADD PUBLIC GITHUB URL]
- **Working demo:** https://afterdark-os.vercel.app
- **Demo video:** https://afterdark-os.vercel.app/demo.mp4
- **Submission copy:** [SUBMISSION.md](SUBMISSION.md)
- **License:** [MIT](LICENSE)

The submission checklist and eligibility notes are in `SUBMISSION.md`. All campus
names, geometry, costs, coverage values and reports are deterministic synthetic
demo data. Coverage is a planning estimate, not a photometric measurement or a
safety score.

## Checks

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

The optimiser unit suite checks deterministic output, budget constraints, overlapping-impact caps, and nondecreasing optimal objective at higher budgets.

## Hackathon submission pack

See [SUBMISSION.md](SUBMISSION.md) for paste-ready project copy, a 90-second demo flow, limitations, and screenshots in `submission/screenshots/`.
