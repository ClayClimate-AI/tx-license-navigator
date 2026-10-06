---
inclusion: always
---

# Tech stack and constraints

## Stack (fixed)
- React + Vite + Tailwind CSS (Tailwind v4 through the `@tailwindcss/vite` plugin).
- Plain JavaScript with JSX (`.js` and `.jsx`). No TypeScript this week.
- Browser `fetch` with `async` and `await`. No axios, no SWR, no React Query.
- No router, no state library, no UI component library, no test framework.
- Node 20 or newer. Scripts: `npm run dev`, `npm run build`, `npm run preview`.

## Dependency rule
Do not add, remove, or upgrade any npm package unless the task says so or Joseph says yes
in chat first. If you think a package is needed, stop and ask.

## Socrata (data.texas.gov) facts you must respect
- Base URL: `https://data.texas.gov/resource/7358-krk7.json`
- Build query strings with `URLSearchParams` so values like `A/C Technician` are encoded.
- In SoQL, string values use single quotes. Double any single quote inside a value
  (`O'Brien` becomes `'O''Brien'`).
- License types query (group and count):
  `$select=license_type, count(*) AS holders` `$where=license_type IS NOT NULL`
  `$group=license_type` `$order=holders DESC` `$limit=50`
- Holder count query:
  `$select=count(*) AS holders`
  `$where=license_type='A/C Technician' AND business_county='HARRIS'`
- `business_county` values are ALL CAPS (HARRIS, DALLAS). Show Title Case in the UI, send
  upper case in the query.
- Counts come back as strings: `[{"holders":"12095"}]`. Convert with `Number(...)` before
  formatting. Display with `toLocaleString()`.
- A bad column name returns HTTP 400 with JSON `{"errorCode":"query.soql.no-such-column"}`.
- A valid query that matches nothing: a plain count returns `[{"holders":"0"}]`, a grouped
  query returns `[]`. Treat both as the empty state, not an error.
- A network failure throws before any status exists. Treat it as an error with no code.
- Verified Oct 6, 2026: `A/C Technician` + `HARRIS` = 12095. Statewide `A/C Technician`
  = 60809, `A/C Contractor` = 20436. Numbers can change when TDLR updates the data.

## Error handling pattern
- `fetch` helpers throw an `Error` with a `status` property (number, or `null` for a
  network failure) and a plain message. UI code catches and sets the error state.
- Never swallow an error silently. Never `console.log` whole rows.

## Agent working rules (Kiro)
- One task per request. Touch only the files the task names.
- Supervised mode. Show the diff and stop. Joseph accepts or rejects each hunk.
- Do not run `git commit`, `git push`, or any command that deletes files. Joseph commits.
- Do not refactor, rename, or restyle code outside the task.
- Explain each changed file in one plain sentence when you finish.
- When unsure about the JSON shape, say so and give Joseph the browser URL to check.

## Models
Joseph prefers Claude (and Grok for the stretch proxy). Never OpenAI or Codex.
