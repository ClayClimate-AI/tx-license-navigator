# Implementation Plan: Navigator MVP

How to run these tasks (read first):
- Supervised mode on. One task at a time. Either click the task's start action in this
  file, or paste the matching prompt from `docs/prompts.md` into chat.
- Never use **Run all Tasks** (it runs independent tasks in parallel waves) and never use
  `/spec run` in Kiro CLI (it runs every task autonomously). Both break the Control story.
- After each task: review every hunk, accept or reject, test, verify data, then Joseph
  runs `git add` and `git commit` with the message below. Kiro does not commit.
- Numbering matches the Thursday MVP steps 1 to 6 in `navigator-daily-guide.md`. The
  MVP map (`docs/reference/mvp-map.md`) has one prep increment first, so MVP map
  increment = task number + 1.
- Task 0 (MVP map increment 1: folder, git, one liner, privacy rule, find the HVAC
  string) is done by hand before task 1. No Kiro write.

- [ ] 1. Scaffold Vite + React + Tailwind; blank page runs
  - Maps to: MVP map increment 2 "Scaffold Vite React Tailwind" · Daily guide step 1
  - Moves: Build skill, Control
  - Do: Vite React (JavaScript) app in the repo root, Tailwind v4 via `@tailwindcss/vite`,
    `src/index.css` with `@import "tailwindcss";`, `App.jsx` renders one heading
    "Texas Second Chance License Navigator" with one Tailwind class. `.gitignore` lists
    `node_modules`, `dist`, `.env`.
  - Do not: add components, fetch code, router, extra packages, sample logos or counters.
  - Done when: `npm install` then `npm run dev` shows the heading at localhost:5173, the
    Tailwind class visibly applies, console is clean, and the diff touches only scaffold
    files.
  - Commit: `chore: scaffold vite react tailwind`
  - _Requirements: 1.1, 1.2, 1.3, 8.1_

- [ ] 2. tdlr.js: fetch license types; verify against the browser URL
  - Maps to: MVP map increment 3 "tdlr fetch license types" · Daily guide step 2
  - Moves: Build skill, Control
  - Do: create `src/api/tdlr.js` with `DATASET_URL`, `HVAC_TYPES`, `quote()`,
    `buildTypesUrl()`, `fetchLicenseTypes()` (throws an Error with `status`). In
    `App.jsx`, call it once in `useEffect` and `console.log` the parsed list.
  - Do not: build any UI, select personal fields, or log raw rows beyond this list.
  - Done when: the console shows about 50 `{ licenseType, holders }` items, `A/C
    Technician` and `A/C Contractor` are present, the first labels and numbers match
    `buildTypesUrl()` opened in a browser tab, and `holders` was converted from a string.
  - Commit: `feat: fetch license types from TDLR`
  - _Requirements: 2.1, 6.1, 6.2_

- [ ] 3. License picker filled from live data
  - Maps to: MVP map increment 4 "License picker from live data" · Daily guide step 3
  - Moves: Build skill, Control
  - Do: `src/components/LicensePicker.jsx` (form, two labeled selects, hints, submit
    button "Show license count"), `src/data/counties.js` (Title Case list: Harris,
    Dallas, Tarrant, Bexar, Travis, Collin, Denton, Fort Bend, El Paso, Hidalgo, Lubbock,
    Jefferson, Loving), state in `App.jsx`. HVAC types first in an "HVAC" option group,
    matched by exact string. Default `A/C Technician`. Missing county shows
    "There is a problem: Choose a county." Remove the task 2 `console.log`.
  - Do not: fetch the count yet, restyle the page, add a county API call.
  - Done when: the select shows the live list with `A/C Technician` preselected, `A/C CE
    Provider` is NOT in the HVAC group, county select works, submitting with no county
    shows the field message, console is clean.
  - Commit: `feat: license picker from live TDLR data`
  - _Requirements: 2.2, 2.3, 2.4, 2.6, 3.1, 3.3_

- [ ] 4. Fetch holder count + result card; verify the number by hand
  - Maps to: MVP map increment 5 "Holder count plus result card" · Daily guide step 4
  - Moves: Build skill, Control, Demo
  - Do: `buildCountUrl(type, county)` and `fetchHolderCount(type, county)` in `tdlr.js`
    (county upper case, values quoted, `URLSearchParams`, `Number(rows[0].holders)`).
    `src/components/ResultCard.jsx` shows the big number with `toLocaleString()`, the
    sentence, "A count is not a job listing.", and the exact URL in `<details>`.
  - Do not: build the full status system yet (a simple "Checking…" text is fine), add
    charts or per county lists.
  - Done when: `A/C Technician` + Harris shows 12,095 (or whatever the browser shows today
    for the URL in the card), the URL in the card opened in a browser gives the same
    number, and the value is not shown as a raw string or `NaN`.
  - Commit: `feat: holder count and result card`
  - _Requirements: 3.2, 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 5. Status messages: loading, error with status code, empty
  - Maps to: MVP map increment 6 "Loading, error, empty" · Daily guide step 5
  - Moves: Build skill, Control, Demo, Meets the spec
  - Do: `src/components/StatusMessage.jsx` (`role="status"`, `aria-live="polite"`) and the
    idle, loading, success, empty, error panels in `ResultCard.jsx` using the copy bank.
    Error shows the status code or "no connection" and a "Try again" button that keeps
    the choices. Empty covers both `[]` and `"0"`. Add the dev only `?break=column`
    switch in `buildCountUrl`.
  - Do not: change the layout or colors, add a toast library, add retries with timers.
  - Done when: Loving shows the empty state, `?break=column` shows "(error 400)",
    DevTools Offline shows "no connection", Try again recovers, nothing crashes.
  - Commit: `feat: loading, empty, and error states`
  - _Requirements: 2.5, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

- [ ] 6. Light layout, README, screenshot, push to GitHub
  - Maps to: MVP map increment 7 "Polish, README, screenshot, push" · Daily guide step 6
  - Moves: Control, Demo, Meets the spec
  - Do: extract `SiteHeader`, `TrustNote`, `SourceNote`; light Pattern 1 styling (max
    width, spacing, focus ring, navy button, left accent bar on the result, focus moves to
    result heading). README: what it is, API URL, the two example query URLs, `npm
    install` + `npm run dev`, privacy rule, screenshot at `docs/screenshot.png`.
  - Do not: change any logic in `tdlr.js` or the state flow; add animation libraries.
  - Done when: keyboard only run works, every diff hunk is styling or docs only, README
    steps work from a fresh clone, Joseph pushed to GitHub. FREEZE: stop and rehearse.
  - Commit: `docs: readme, screenshot, light layout` then Joseph runs `git push`
  - _Requirements: 6.4, 7.1, 7.2, 7.3, 7.4_
