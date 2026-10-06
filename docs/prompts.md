# Kiro prompts, one per MVP step

Use these in **Kiro IDE chat** with **Supervised** mode on. One prompt, one task, one
commit. Each prompt names the task, points at the spec and reference docs, limits the
files, and tells Kiro to stop after the diff.

## How to attach context
- Type `#` in the chat input. Kiro opens a picker. Choose the item so it shows as a chip.
- `#spec:navigator-mvp` attaches requirements.md, design.md, and tasks.md together.
- `#reference-docs` is a manual steering file that pulls in `docs/reference/mvp-map.md`
  and `docs/reference/ui-reference.md`. If it does not show in the picker, attach the two
  files with `#` then File instead.
- product.md, tech.md, structure.md, and privacy-and-scope.md load automatically
  (inclusion: always). You do not need to attach them.
- Start a fresh chat session (the `+` in the chat panel) for each task so old context does
  not leak in.
- Pick a Claude model in the model picker before you start (not Auto, which can route to
  other providers).

## Warm up (Day 2 style, read only)
```text
#spec:navigator-mvp #reference-docs
Read only. Do not change any file.
In five short bullets: what is this project, what are tasks 1 to 6, and which privacy
rules apply to every task? Then list anything in the spec that looks unclear or wrong.
```

---

## Step 1 · Kiro task 1 · MVP map increment 2
**Attach:** `#spec:navigator-mvp` `#reference-docs`
**Look at:** mvp-map.md "Build path" row 2 · ui-reference.md "Pattern 1" (target look only)
**Commit:** `chore: scaffold vite react tailwind`

```text
#spec:navigator-mvp #reference-docs
Implement task 1 only: "Scaffold Vite + React + Tailwind; blank page runs".
Follow the steering files and MVP map increment 2.

Scope:
1. Vite React app in plain JavaScript, in the repo root (not a subfolder).
2. Tailwind v4 through the @tailwindcss/vite plugin. src/index.css contains only
   @import "tailwindcss";
3. App.jsx renders one h1 "Texas Second Chance License Navigator" with one Tailwind class.
4. .gitignore lists node_modules, dist, and .env.

Do not add components, fetch code, a router, demo logos or counters, or any package beyond
react, react-dom, vite, @vitejs/plugin-react, tailwindcss, @tailwindcss/vite.
Leave .kiro/, docs/, and PROMPT_LOG.md untouched. If the scaffold tool says the folder is
not empty, stop and tell me instead of deleting anything.

When done:
1. List each file you created or changed, one sentence each on why.
2. Tell me the exact commands to test it.
3. Stop. Do not start task 2. Do not run git commit or git push.
```

**Watch for:** a subfolder app, Tailwind v3 style config files (`tailwind.config.js`,
`postcss.config.js`) instead of the v4 plugin, leftover counter demo code, extra packages.

---

## Step 2 · Kiro task 2 · MVP map increment 3
**Attach:** `#spec:navigator-mvp` `#reference-docs`
**Look at:** mvp-map.md "Verified data facts" and "Concepts" · design.md "API module"
**Commit:** `feat: fetch license types from TDLR`

```text
#spec:navigator-mvp #reference-docs
Implement task 2 only: "tdlr.js: fetch license types; verify against the browser URL".
Follow the steering files and MVP map increment 3.

Scope:
1. Create src/api/tdlr.js with DATASET_URL, HVAC_TYPES = ['A/C Technician',
   'A/C Contractor'], a quote() helper (wrap in single quotes, double any inner single
   quote), buildTypesUrl(), and async fetchLicenseTypes().
2. buildTypesUrl() uses URLSearchParams:
   $select = license_type, count(*) AS holders
   $where  = license_type IS NOT NULL
   $group  = license_type
   $order  = holders DESC
   $limit  = 50
3. fetchLicenseTypes() returns [{ licenseType, holders }] with holders converted by
   Number(). If the response is not ok, throw an Error that has a status property. If
   fetch itself fails, rethrow with status null.
4. In App.jsx call fetchLicenseTypes() once in useEffect and console.log the result.
   Catch errors and console.error them.

Do not build any UI. Do not add packages. Select no field except license_type and count(*).

When done:
1. List each file you changed, one sentence each on why.
2. Print the full URL buildTypesUrl() returns so I can open it in a browser.
3. Tell me which JSON field holds the count and what type it arrives as.
4. Stop. Do not start task 3. Do not run git commit or git push.
```

**Watch for:** a missing `await`, `$select=*` or no `$select` (privacy), reading
`data.count` instead of `rows[i].holders`, holders left as strings, hand built URLs with
no encoding.

---

## Step 3 · Kiro task 3 · MVP map increment 4
**Attach:** `#spec:navigator-mvp` `#reference-docs`
**Look at:** ui-reference.md "Screen inventory" rows 3 and 4, "Copy bank" Labels and
Hints, "Accessibility" · sample page sections F, H, I
**Commit:** `feat: license picker from live TDLR data`

```text
#spec:navigator-mvp #reference-docs
Implement task 3 only: "License picker filled from live data".
Follow the steering files, MVP map increment 4, and the UI reference (Pattern 1 form).

Scope:
1. src/data/counties.js exports Title Case names: Harris, Dallas, Tarrant, Bexar, Travis,
   Collin, Denton, Fort Bend, El Paso, Hidalgo, Lubbock, Jefferson, Loving.
2. src/components/LicensePicker.jsx: a form with a License type select and a County
   select, each with a visible label and a hint tied by aria-describedby. Hints:
   "Technicians work for a company. Contractors run the business." and
   "The county where the business is listed." Submit button text: "Show license count".
3. License type options come from fetchLicenseTypes(). Put the HVAC_TYPES first in an
   "HVAC" optgroup, matched by exact string (A/C CE Provider must not be in that group).
   Default the value to 'A/C Technician' once the list loads. While loading, show
   "Loading license types…" and disable the select and button.
4. State lives in App.jsx. On submit with no county, show "There is a problem: Choose a
   county." next to the County field and do nothing else. Do not fetch a count yet.
5. Remove the console.log from task 2.

Do not restyle the page, add a county API call, or add packages.

When done:
1. List each file you changed, one sentence each on why.
2. Tell me how to check that the list is live and not hard coded.
3. Stop. Do not start task 4. Do not run git commit or git push.
```

**Watch for:** a prefix match on "A/C" that pulls in `A/C CE Provider`, a hard coded
type list, the default set before the list arrives (race), placeholder only labels.

---

## Step 4 · Kiro task 4 · MVP map increment 5
**Attach:** `#spec:navigator-mvp` `#reference-docs`
**Look at:** ui-reference.md "Five states" Success row, "Result panel copy" · mvp-map.md
"String counts" · sample page sections B and G (Success)
**Commit:** `feat: holder count and result card`

```text
#spec:navigator-mvp #reference-docs
Implement task 4 only: "Fetch holder count + result card; verify the number by hand".
Follow the steering files, MVP map increment 5, and the UI reference Success state.

Scope:
1. In src/api/tdlr.js add buildCountUrl(type, county) and async
   fetchHolderCount(type, county). Use URLSearchParams with
   $select = count(*) AS holders
   $where  = license_type=<quote(type)> AND business_county=<quote(county upper case)>
   Return Number(rows[0].holders), or 0 when rows is empty. If the number is NaN, throw
   an Error with status null. Same error contract as fetchLicenseTypes().
2. src/components/ResultCard.jsx shows: heading "{type} in {County} County", the number
   with toLocaleString(), the sentence "people hold this license with {County} County
   listed as their business county.", the line "A count is not a job listing.", and a
   details element "See the exact data request" with the URL from buildCountUrl().
3. Wire the LicensePicker submit in App.jsx. A plain "Checking…" text while waiting and
   a plain error text in catch are enough for now.

Do not build the full status system yet. No charts, no per county lists, no new packages.

When done:
1. List each file you changed, one sentence each on why.
2. Print the exact URL for A/C Technician in Harris so I can compare it in a browser.
3. Stop. Do not start task 5. Do not run git commit or git push.
```

**Watch for:** county not upper cased (Harris returns 0 and looks "empty"), the string
`"12095"` shown with no commas because `toLocaleString()` ran on a string, double quotes
in `$where`, raw concatenated URLs. This is the best spot for a caught mistake.

---

## Step 5 · Kiro task 5 · MVP map increment 6
**Attach:** `#spec:navigator-mvp` `#reference-docs`
**Look at:** ui-reference.md "Five states", "Status line copy", "Copy bank" Loading,
Empty, Error · design.md "Forcing the failure cases" · sample page section G
**Commit:** `feat: loading, empty, and error states`

```text
#spec:navigator-mvp #reference-docs
Implement task 5 only: "Status messages: loading, error with status code, empty".
Follow the steering files, MVP map increment 6, and the five states in the UI reference.

Scope:
1. App.jsx status is exactly 'idle' | 'loading' | 'success' | 'empty' | 'error', plus
   errorCode (number or null).
2. src/components/StatusMessage.jsx: one line inside role="status" aria-live="polite",
   using the status line copy from the UI reference.
3. ResultCard.jsx renders all five panels with the copy bank text:
   idle "Your result will appear here", loading "Checking Texas license records" plus
   "This usually takes a few seconds.", success (from task 4), empty "No matching records
   found" plus "Try a nearby county or the other license type.", error "We could not reach
   the Texas data service." with "(error {code})" or "(no connection)", the line "This is
   a problem on our side, not something you did. Your choices are saved." and a
   "Try again" button that reruns the same search without clearing the choices.
4. Empty covers both [] and a count of 0. Empty must not look like an error.
5. While loading, the submit button is disabled and says "Checking…".
6. Dev only switch: if window.location.search contains break=column, buildCountUrl uses
   the column business_countyy so the API returns HTTP 400. Add one comment saying why.

Do not change layout or colors. No toast library, no timers, no automatic retries.

When done:
1. List each file you changed, one sentence each on why.
2. Give me the three exact manual checks: empty, HTTP 400, and offline.
3. Stop. Do not start task 6. Do not run git commit or git push.
```

**Watch for:** `[]` or `0` treated as an error, "0 people hold this license" shown as a
success, the status code dropped from the message, Try again that resets the form, a
`catch` that swallows the error with no UI.

---

## Step 6 · Kiro task 6 · MVP map increment 7
**Attach:** `#spec:navigator-mvp` `#reference-docs`
**Look at:** ui-reference.md "Polish layers", "Decision card", "Trust" copy, inventory
rows 1, 2, 7 · mvp-map.md "MVP gate" · sample page sections C, I, K
**Commit:** `docs: readme, screenshot, light layout` then `git push` (you, not Kiro)

```text
#spec:navigator-mvp #reference-docs
Implement task 6 only: "Light layout, README, screenshot, push".
Follow the steering files, MVP map increment 7, and the UI reference polish layers.

Scope:
1. Extract src/components/SiteHeader.jsx (header landmark, "Second Chance License
   Navigator", subtitle "HVAC license demand by Texas county"), TrustNote.jsx ("We show
   counts only. We never show names, addresses, or personal license records.") and
   SourceNote.jsx (footer: TDLR All Licenses dataset 7358-krk7, link to data.texas.gov,
   "General information, not legal advice.").
2. Light Pattern 1 styling with Tailwind only: max width container, spacing, navy submit
   button, visible focus ring on every control, white result card with a left accent bar,
   one big number. After each search move focus to the result heading.
3. README.md: what it is (one paragraph), the API URL, the two example query URLs from
   docs/reference/mvp-map.md, npm install and npm run dev, the privacy rule, and an image
   link to docs/screenshot.png (I will take the screenshot myself).

Do not change any logic in src/api/tdlr.js or the state flow in App.jsx beyond the focus
move. No animation libraries, no new packages. Do not run git commit or git push.

When done:
1. List each file you changed, one sentence each on why, and confirm no logic lines
   changed in tdlr.js.
2. Stop. This is the freeze point.
```

**Watch for:** logic lines hiding inside a "style" diff, README missing the API URL or run
steps, Kiro offering to push or to start the stretch layer (say no).

---

## Review checklist (apply before every Accept)

The three questions:
1. Do I understand every changed line?
2. Does it do what I asked, and only that?
3. Is it touching anything I did not expect?

Then check:
- [ ] Only the files the task names changed (look at the file list and line counts in chat)
- [ ] `package.json`: no new or upgraded packages (except task 1's scaffold)
- [ ] Privacy: no field except `license_type`, `business_county`, `count(*)` in any query;
      no raw rows; no names, addresses, phones, license numbers anywhere
- [ ] No keys, tokens, or `.env` content; `.env` still in `.gitignore`
- [ ] `PROMPT_LOG.md`, `docs/reference/`, and `.kiro/steering/` untouched
- [ ] Kiro did not run git commit, git push, or delete anything
- [ ] Reject hunks you do not understand. Ask "explain this hunk" with inline chat first
- [ ] After Accept: `npm run dev`, browser console clean, number checked against the
      browser URL
- [ ] Then commit yourself with the task's message, and write your Prompt Log entry

If any box is unchecked: Reject (or reject the hunk), say why in chat, and ask for a
smaller redo. A rejected diff with a clear reason is Control evidence.

---

## Stretch prompts (LOCKED until the MVP gate passes)
Only after tasks 1 to 6 are committed and pushed, the MVP acceptance list in
requirements.md is all true, and you can explain every file. Start each with the line
"MVP gate passed." so the steering rules allow it.

### Stretch 1 · Knowledge chunk files (you paste the text)
```text
MVP gate passed. Stretch stage 1 only.
Create knowledge/ with 8 empty markdown files: one each for Occupations Code
53.021, 53.022, 53.023, 53.0231, 53.025, 53.102, 53.104, plus one for the State Auditor
guide. Each file has only: a "# Title" line with a placeholder, a "Source:" line with a
placeholder URL, and "PASTE TEXT HERE". Do not write, summarize, or paraphrase any legal
text. Stop after the diff. Do not commit.
```

### Stretch 2 · Keyword retrieve top 3
```text
MVP gate passed. Stretch stage 2 only.
Add server/retrieve.js with retrieveTop3(question, chunks): split on words, lower case,
count overlaps, title words count double, return the top 3 with scores. If the best score
is 0 return an empty list so the caller can answer "Not in my sources" with no model call.
Add a tiny node script server/check-retrieve.js that prints results for two sample
questions. No new packages. Stop after the diff. Do not commit.
```

### Stretch 3 · Node proxy POST /api/ask
```text
MVP gate passed. Stretch stage 3 only.
Add server/index.js: POST /api/ask with body { question }. Use retrieveTop3. If nothing
scores, return { answer: "Not in my sources", citations: [] } with no model call.
Otherwise call Claude by default (ANTHROPIC_API_KEY) or Grok when LLM_PROVIDER=grok
(XAI_API_KEY), telling the model to answer only from the given chunks. Errors: 400 empty
question, 500 missing key, 502 model call failed. Never log or return a key. Add
.env.example with empty values, add a Vite proxy for /api, and an npm script "server".
You may add express as the one new package. Stop after the diff. Do not commit.
```

### Stretch 4 · AskPanel with citations
```text
MVP gate passed. Stretch stage 4 only.
Add src/components/AskPanel.jsx below the result card: question input, Ask button,
loading text, answer, a citation list (title and source URL of each retrieved chunk), and
the fixed line "Information, not legal advice." Show "Not in my sources" when the server
says so. No new packages. Do not change the license lookup. Stop after the diff.
```

### Stretch 5 · Database / saved searches
Do not ask. Next week. Saying no here is a Control win.
