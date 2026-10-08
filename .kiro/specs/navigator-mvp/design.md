# Design: Navigator MVP

UI pattern: **Pattern 1, government lookup** from the UI UX sample guide
(`docs/reference/ui-reference.md`). One page: header, trust line, one form with two
labeled selects and one button, a status line, a result region, a source footer.

## Overview

```
Browser (React)                                    data.texas.gov (Socrata)
┌───────────────────────────────┐                  ┌──────────────────────────┐
│ App.jsx  (state lives here)   │  GET types       │ /resource/7358-krk7.json │
│  ├─ SiteHeader                │ ───────────────▶ │  group by license_type   │
│  ├─ TrustNote                 │ ◀─────────────── │  [{license_type,holders}]│
│  ├─ LicensePicker  ──submit──▶│                  │                          │
│  ├─ StatusMessage             │  GET count       │  count(*) for type+county│
│  ├─ ResultCard                │ ───────────────▶ │  [{"holders":"12095"}]   │
│  └─ SourceNote                │ ◀─────────────── │  or 400 / [] / "0"       │
└──────────────┬────────────────┘                  └──────────────────────────┘
               │ all network code
               ▼
        src/api/tdlr.js
```

No server, no key, no database in the MVP. The browser calls Socrata directly (CORS
allows it).

## Components

| Component | File | Props | Job | Task |
|---|---|---|---|---|
| App | `src/App.jsx` | none | Owns state, calls `tdlr.js`, picks which panel shows | 2 to 5 |
| LicensePicker | `src/components/LicensePicker.jsx` | `types, type, county, onTypeChange, onCountyChange, onSubmit, busy, fieldError` | `<form>` with two `<label htmlFor>` + `<select>` pairs and a submit button "Show license count" | 3 |
| ResultCard | `src/components/ResultCard.jsx` | `status, type, county, count, queryUrl, errorCode, onRetry, onReset` | Success, empty, and error panels; exact request URL in a `<details>` | 4, 5 |
| StatusMessage | `src/components/StatusMessage.jsx` | `status, type, county, errorCode` | One line in `role="status" aria-live="polite"` | 5 |
| SiteHeader | `src/components/SiteHeader.jsx` | none | `<header>` with the site name as text | 6 |
| TrustNote | `src/components/TrustNote.jsx` | none | Privacy promise line | 6 |
| SourceNote | `src/components/SourceNote.jsx` | none | `<footer>`: dataset name, data.texas.gov link, not legal advice | 6 |

Task 3 to 5 may render plain markup inside `App.jsx` first; task 6 extracts the header,
trust, and source pieces. That keeps early diffs small.

## API module: `src/api/tdlr.js`

```js
export const DATASET_URL = 'https://data.texas.gov/resource/7358-krk7.json'
export const HVAC_TYPES = ['A/C Technician', 'A/C Contractor']

function quote(value)                     // 'A/C Technician' → "'A/C Technician'", doubles inner '
export function buildTypesUrl()           // group + count query, limit 50
export async function fetchLicenseTypes() // → [{ licenseType: 'A/C Technician', holders: 60809 }, ...]
export function buildCountUrl(type, county)   // county sent upper case
export async function fetchHolderCount(type, county) // → number (0 means empty)
```

Query params (built with `URLSearchParams`):

| Function | `$select` | `$where` | `$group` | `$order` | `$limit` |
|---|---|---|---|---|---|
| buildTypesUrl | `license_type, count(*) AS holders` | `license_type IS NOT NULL` | `license_type` | `holders DESC` | `50` |
| buildCountUrl | `count(*) AS holders` | `license_type=<quoted> AND business_county=<QUOTED UPPER>` | none | none | none |

Error contract: on `!response.ok` throw `Object.assign(new Error('TDLR API answered HTTP ' +
status), { status })`. On a network failure `fetch` rejects; rethrow with `status: null`.

Parsing: `rows.length === 0` → `0`. Otherwise `Number(rows[0].holders)`. If the result is
`NaN`, throw an error (`status: null`) instead of showing `NaN`.

## State in `App.jsx`

| State | Type | Start | Notes |
|---|---|---|---|
| `licenseTypes` | array of strings | `[]` | from `fetchLicenseTypes()` on mount |
| `typesLoading` | boolean | `true` | select shows "Loading license types…" and is disabled |
| `type` | string | `'A/C Technician'` | set after types load if present |
| `county` | string | `''` | all caps `business_county` value (for example `HARRIS`); the Title Case label is looked up from `src/data/counties.js` only for display and saved in `result` as `countyLabel` |
| `status` | `'idle' \| 'loading' \| 'success' \| 'empty' \| 'error'` | `'idle'` | drives StatusMessage and ResultCard |
| `result` | `{ type, countyLabel, count, queryUrl }` or null | `null` | saved when a search finishes; shown in ResultCard |
| `errorCode` | number or null | `null` | `null` + error status means no connection |
| `fieldError` | string or null | `null` | "Choose a county." |

The result card reads only from `result`, so the heading, number, and link always describe
the same search, even if a dropdown changes afterward.

## The 5 UI states (from the UI UX sample States board)

```
          submit                 200, n > 0
 ┌──────┐ ─────▶ ┌─────────┐ ──────────────▶ ┌─────────┐
 │ idle │        │ loading │                 │ success │
 └──────┘ ◀───── └─────────┘ ──┐             └─────────┘
    ▲   new search   │  ▲      │ 200, n = 0 or []
    │                │  │      ▼
    │          fail  │  │ try again   ┌───────┐
    │                ▼  │             │ empty │
    │            ┌───────┐            └───────┘
    └─────────── │ error │
                 └───────┘
```

| State | When it happens | What the visitor sees (copy bank) | In the code |
|---|---|---|---|
| idle | Page loaded, or "Clear form" | Status: "Ready. Choose a license type and a county." Panel: "Your result will appear here" | `status === 'idle'` |
| loading | Form submitted, fields valid | "Checking Texas license records." "This usually takes a few seconds." Button "Checking…" disabled | `setStatus('loading')` then `await fetchHolderCount(...)` |
| success | HTTP 200 and count > 0 | Big number with commas, "people hold this license with Harris County listed as their business county.", "A count is not a job listing.", exact request | `setCount(n); setStatus('success')` |
| empty | HTTP 200 and `[]` or `"0"` | "No matching records found" "Try a nearby county or the other license type." Not red. | `if (n === 0) setStatus('empty')` |
| error | HTTP 4xx/5xx or network failure | "We could not reach the Texas data service. (error 400)" "This is a problem on our side, not something you did. Your choices are saved." Button "Try again" | `catch (e) { setErrorCode(e.status ?? null); setStatus('error') }` |

Status line text (StatusMessage):
- idle: "Ready. Choose a license type and a county."
- loading: "Checking Texas license records."
- success: "Done. Showing results for {type} in {County} County."
- empty: "Done. No matching records for {type} in {County} County."
- error: "Something went wrong (error {code}). Your choices are saved."

## Sequence: one search

```
Visitor        LicensePicker      App.jsx                tdlr.js              data.texas.gov
  │ choose type+county │             │                      │                       │
  │ "Show license count"──onSubmit──▶│ validate county      │                       │
  │                    │             │ status = loading     │                       │
  │                    │             │──fetchHolderCount───▶│ GET buildCountUrl()   │
  │                    │             │                      │──────────────────────▶│
  │                    │             │                      │◀── 200 [{"holders":"12095"}]
  │                    │             │◀──── 12095 (number) ─│                       │
  │                    │             │ status = success     │                       │
  │◀──── ResultCard shows 12,095 + sentence + exact URL     │                       │
```

## Forcing the failure cases (task 5 and Demo)
- Empty: choose a county with no holders for that type (try `Loving`), or check the
  grouped URL with a made up county, which returns `[]`.
- Error 400: a dev only switch. If the page URL has `?break=column`, `buildCountUrl` uses
  the column `business_countyy`, which returns HTTP 400. One small, explainable branch.
- No connection: DevTools, Network tab, set throttling to Offline, then submit.

## Accessibility (from the sample site)
- Every select has a visible `<label htmlFor>` and a hint tied with `aria-describedby`.
- Submit is a real `<button type="submit">` so Enter works.
- Visible focus ring (`focus-visible:outline`), text contrast at least 4.5 to 1.
- After a search, focus moves to the result heading (`tabIndex={-1}` + `ref.focus()`).

## Visual tokens (light, task 6 only)
Navy for action (`#14304F`), info blue (`#1F5C99`), hint gray (`#4A5A6A`), page
`#F3F5F8`, white cards with one radius and a left accent bar on the result. Three type
sizes: label, body, one big number.

## Testing and verification strategy
No test framework this week (no new deps). Each task ends with a manual check:
1. `npm run dev` runs, browser console clean.
2. Compare the app with the same URL opened in a browser tab.
3. For task 5, trigger empty, 400, and offline on purpose.
Record what you checked in `PROMPT_LOG.md` (Joseph writes it).
