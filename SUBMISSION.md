# AfterDark OS

**Better-lit paths. Smarter repairs. Safer campuses.**

HERHACK 2026 · Student Innovation track · Team of [2-5 members]

## Elevator pitch

Campus lighting reports are scattered across emails and spreadsheets. AfterDark OS puts them on one campus map, then finds the repair combination that improves the most walked paths for a chosen budget.

## Inspiration

A dark path is easy to report and hard to prioritise. Campus teams need to know which repair gives the most useful light for the money, not just which report arrived first. We wanted a tool that a facilities team could open before a night walk and use to make a defensible budget decision.

## What it does

- **Overview:** open reports, current pathway coverage, candidate repairs and estimated cost.
- **Campus map:** connected pathways, lights, buildings and reported issues; select a path or asset to inspect it.
- **Repair planner:** choose a budget, evaluate every feasible repair subset, and compare before/after coverage with saved scenarios and CSV export.
- **Issue tracker:** report a lighting problem, add an optional photo, and track it through a strict maintenance lifecycle.
- **Gemini photo assist:** tap **Suggest with Gemini** to get a suggested category, title and description from the attached photo; the reporter reviews and edits it before submitting, and manual categorisation always remains available.
- **Field check:** estimated coverage changes only after an issue is advanced to Field-checked with a maintenance note.

## How we built it

The app is a Next.js App Router project with React, TypeScript, Tailwind CSS, Prisma and SQLite. The campus, lights, pathways and seeded reports are deterministic synthetic data, so the demo is repeatable. The repair planner is an exact deterministic subset search: it enumerates feasible repair combinations, accounts for pathway length, evening footfall, capped overlapping coverage gains and estimated cost, and returns the best objective under the budget. Zod validates API input; Recharts renders the before/after coverage; Framer Motion handles the interface transitions.

## Challenges we ran into

- Keeping overlapping repairs from double-counting the same coverage gain.
- Making a synthetic campus feel like a real network rather than a set of unrelated dots.
- Designing a maintenance lifecycle that is strict enough to trust but simple enough to use on a phone.
- Keeping the planner exact without making the demo slow.

## Accomplishments we are proud of

- A working end-to-end flow from report to prioritised repair plan.
- An exact optimiser that gives visibly different plans at ₹3,000 and ₹5,000.
- A map and issue workflow that work with keyboard navigation as well as touch.
- A submission demo whose core planner runs locally with no API key; Gemini photo help is optional, explicit and server-side.

## What we learned

Small, well-modelled decisions are easier to trust than a black-box score. Showing the before/after coverage and the exact selected repairs makes the budget conversation concrete. Synthetic data also needs a clear label: a planning estimate is not a photometric measurement or a safety assessment.

## What's next

- Replace synthetic geometry with a real campus survey and measured lighting levels.
- Extend the Gemini assistant to combine photo, location and report text with a visible rationale.
- Export a maintenance work order and track contractor costs.
- Test the prioritisation with campus operations staff.

## Built with

Next.js, TypeScript, React, Tailwind CSS, Prisma, SQLite, Zod, Recharts, Framer Motion, Lucide.

## Try it out

- **Public source repository:** https://github.com/radhika-verma06/afterdark-os
- **Working demo:** https://afterdark-os.vercel.app
- **Demo video:** https://afterdark-os.vercel.app/demo.mp4

### Run locally

```bash
npm install
npm run setup
npm run dev
```

Open `http://localhost:3000`.

## 90-second demo flow

1. Open **Overview** and point out the open reports and estimated pathway coverage.
2. Open **Campus map** and select a lighting issue.
3. Open **Repair planner**. Run the plan at ₹3,000, then change it to ₹5,000.
4. Compare the selected repairs and projected coverage. Toggle Before and After.
5. Open **Issue tracker**, record a maintenance update, then advance an example report to Field-checked.
6. Explain that the baseline changes only at field check.

## Eligibility and originality

- Participants are 18 or older.
- The HERHACK team is 2–5 members and follows the organiser’s women-focused participation guidelines.
- The application code is the team’s own work; open-source libraries are used under their licences.
- The project has not been submitted to another hackathon. Confirm this before submitting.
- The campus, costs, coverage values and reports are synthetic demo data; they are not records about a real institution.

## Screenshots

- [Overview](submission/screenshots/overview.png)
- [Campus map](submission/screenshots/map.png)
- [Repair planner](submission/screenshots/planner.png)
- [Issue tracker](submission/screenshots/issues.png)
- [Gemini photo suggestion](submission/screenshots/gemini-suggest.png)

## Technical note and limitations

The repair planner uses deterministic exhaustive subset search, not an LLM. Coverage is a planning estimate from synthetic baseline values, not measured illumination or a safety score. Repair costs are estimates. The issue tracker is a local MVP; it does not dispatch work orders or contact contractors. Gemini photo assistance is optional and server-side: it suggests a category, title and description, while the reporter reviews and edits the result. It never decides whether a repair happens and never changes the coverage baseline; manual categorisation remains available.

## Submission checklist

- [x] Add the public repository URL.
- [x] Add the deployed demo URL.
- [x] Add the demo video URL.
- [ ] Add all 2–5 team members and roles.
- [ ] Confirm the project was built for HERHACK and not submitted elsewhere.
- [ ] Submit on Devpost before **10 November 2026, 11:45 pm EST**.

## License

MIT. See [LICENSE](LICENSE).
