# MVP map (compact extract)

Extract of `navigator-mvp-visual-guide.html` (source: `mvp-visual-guide/src/data.ts` and
`src/sections/*`). Read only. For Kiro chat: attach with `#reference-docs` or pick this
file with `#` then File.

## Project in one line
HVAC focused holder counts from TDLR All Licenses (data.texas.gov) so someone with a
record can check demand by county. Counts only, never personal rows (including Joseph's
own license row).

## Four grade bars (assignment criteria)
| Bar | Pass looks like | For this project |
|---|---|---|
| Build skill | App runs, calls the live TDLR API, loading, empty, error work, no crash, no blank screen | Types load on page load; HVAC type + county shows a real count; loading shows; empty says no records match; failure shows friendly text + status code |
| Control | Reviewed every diff, small commits, Prompt Log, caught at least one agent mistake, can explain any part | One focused Kiro ask per change; three review questions on every diff; PROMPT_LOG.md has accept AND reject; one caught mistake written down |
| Demo | About 2 minutes: live run, one good result, one failure case, one accepted agent change, one mistake caught | HVAC story; live pick type + county; one empty or error on purpose; one diff open to narrate |
| Meets the spec | Public API, error handling, GitHub repo with README (API URL + run steps) | Endpoint in README; error and empty coded; `npm install` + `npm run dev`; pushed before Friday; privacy counts only |

Grade is control, not complexity. Main risk is overbuilding.

## Build path (MVP map increments) and the Kiro task numbers
The MVP map lists 7 increments. Increment 1 is prep by hand. Increments 2 to 7 are the
Thursday MVP steps 1 to 6 and the Kiro tasks 1 to 6.

| MVP map | Kiro task | Title | Bars | Tip from the map |
|---|---|---|---|---|
| 1 | 0 (by hand) | Folder, git, one liner, privacy, find HVAC string | Control, Meets the spec | Do not guess the string. Copy it from a real JSON row. |
| 2 | 1 | Scaffold Vite React Tailwind | Build skill, Control | Reject anything that adds features beyond a blank running page. |
| 3 | 2 | tdlr fetch license types | Build skill, Control | Compare the first few labels by eye before wiring a picker. |
| 4 | 3 | License picker from live data | Build skill, Control | Default to the exact HVAC string you copied in step 1. |
| 5 | 4 | Holder count plus result card | Build skill, Control, Demo | Socrata counts often arrive as strings. Coerce or display carefully. |
| 6 | 5 | Loading, error, empty | Build skill, Control, Demo, Meets the spec | Empty is HTTP 200 with []. Error is 4xx or 5xx or network failure. |
| 7 | 6 | Polish, README, screenshot, push | Control, Demo, Meets the spec | Freeze here. Stretch only after this is explainable. |

Increment details:
1. Create `tx-second-chance`. `git init`. PROMPT_LOG.md with the one liner and privacy
   rule. Open the API in a browser and find the exact HVAC `license_type` string.
2. One Kiro job: scaffold Vite + React + Tailwind. Stop when a blank page runs. One commit.
3. Small fetch module. Call the group and count query for `license_type`. Log the list.
   Verify against the same URL in a browser.
4. Fill a select from the live list. HVAC type easy to find or defaulted. County next to it.
5. Fetch `count(*)` for the selected `license_type` and `business_county`. Result card.
   Verify the number by hand against the browser URL.
6. Status UI. Force a bad column (HTTP 400). Force a combo that returns []. Friendly
   messages with status codes. No crash.
7. Light polish. README with what it is, API URL, run steps. Screenshot. Push to GitHub.

Freeze: stop here for MVP. If Thursday arrives and steps are not solid, cut stretch.

## MVP gate (all true before stretch)
- License type list loads from the live API on page load
- HVAC related type + county shows a real count that matches the same URL in a browser
- Loading shows; empty says no TDLR records match that combination
- API failure shows a friendly message with the status code; no crash
- No individual names, addresses, or phones anywhere
- README has API URL and run steps; pushed to GitHub
- You can explain every file and every fetch in your own words

## Verified data facts (Oct 4 and Oct 6, 2026)
- Endpoint: `https://data.texas.gov/resource/7358-krk7.json` (no key, CORS allowed)
- HVAC `license_type` values: `A/C Technician`, `A/C Contractor`
  (`A/C CE Provider` exists too; it is not a trade license)
- County column: `business_county`, ALL CAPS values (`HARRIS`, `FORT BEND`)
- `A/C Technician` + `HARRIS` = 12095. Counts come back as strings.
- Bad column → HTTP 400. Unknown value → 200 with `[]` (grouped) or `[{"holders":"0"}]`
  (plain count).

Browser check URLs:
```
https://data.texas.gov/resource/7358-krk7.json?$select=license_type,count(*) AS holders&$where=license_type IS NOT NULL&$group=license_type&$order=holders DESC&$limit=50
https://data.texas.gov/resource/7358-krk7.json?$select=count(*) AS holders&$where=license_type='A/C Technician' AND business_county='HARRIS'
```

## Concepts to explain out loud
- **async and await**: `fetch` returns a Promise. Missing `await` gives
  `Promise { <pending> }`. Wrap calls in try/catch so failures become the error UI.
- **Encoding**: values with spaces and slashes (`A/C Technician`) break raw URLs. Use
  `URLSearchParams` or `encodeURIComponent`. Verify the final URL in a browser.
- **String counts**: `[{"holders":"12095"}]`. The value is a string. `Number()` it.
  Strong caught mistake story.
- **Browser vs Node errors**: browser code errors show in DevTools; Node errors in the
  terminal. `document is not defined` means browser code ran in Node.
- **Commits as save points**: test, verify, then commit. If the agent loops, go back to
  the last good commit and take a smaller step.
- **400 vs empty**: malformed SoQL or bad column → 400 (error UI). Valid query, no
  rows → 200 with `[]` or count `"0"` (empty UI).

## Control loop (Kiro)
Ask → review diff → accept or reject → test → verify data → commit.
Three review questions on every diff:
1. Do I understand it?
2. Does it do what I asked?
3. Is it touching anything I did not expect?
If any answer is no, reject or ask for a redo.

## Two minute demo
| Time | Beat | Say |
|---|---|---|
| 0:00 | What + which API (20s) | HVAC holder counts from TDLR All Licenses on data.texas.gov so someone with a record can check demand in the trade. |
| 0:20 | Run it live (40s) | Pick HVAC type and county, show the count, then show empty or error. Licensed in the trade, personal record never opened. |
| 1:00 | Control moment (45s) | Open one diff. What changed, why accepted. Name the mistake and how it was caught. |
| 1:45 | Next (15s) | Next week: save searches in a database. |
| 2:00 | Questions | "Let me open the code and check" is a strong move. |

## Risks
| Bad | Good |
|---|---|
| Overbuilding RAG or polish before MVP | Freeze after increment 7 |
| Looking up or displaying Joseph's personal TDLR row | Counts only |
| Secrets committed to git | `.env` gitignored before any key exists; MVP needs no key |
| Auto mode or parallel agents for the graded build | One focused job at a time |
| Letting Kiro invent Chapter 53 text | Joseph pastes from real sources |
| Starting a database this week | Saved searches are next week |

## Stretch stages (locked until the MVP gate)
1. Local markdown chunks: 6 to 10 files, title + source URL, Joseph pastes text from
   Texas Occupations Code Ch. 53 (e.g. 53.021, 53.022, 53.023, 53.0231, 53.025, 53.102,
   53.104) and the State Auditor guide (Aug 2020). Kiro may only create empty files.
2. Keyword retrieve top 3. If nothing scores, "Not in my sources" and no model call.
3. Tiny Node proxy `POST /api/ask`, key in `.env`, Claude default, Grok swap,
   400 / 502 / 500 without leaking the key.
4. AskPanel: answer, citations (title + source URL), "Information, not legal advice."
5. Database / saved searches: NEXT WEEK. Locked.
