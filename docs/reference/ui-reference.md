# UI UX reference (compact extract)

Extract of `navigator-uiux-sample.html` (source: `uiux-sample-guide/src`). Read only.
The sample runs on fake numbers; the real app reads live data.

Section letters in the sample page: B Prototype · C Logic to polish · D Patterns ·
E Pick · F Inventory · G States · H Copy · I Access · J Build order · K Decide.

## Pattern 1: government lookup (recommended)
Simply: a clean sign on top, a short form, and the answer right below. Like a library
catalog terminal.
Real: single page. `<header>` landmark, one `<form>` with two `<select>` fields and a
submit button, then a result region with `aria-live`. One fetch per submit.
Why: fastest to build and test, every element maps to one component you can explain,
looks trustworthy to people nervous about records. Plain, one question at a time.

Page copy:
- Site name: "Second Chance License Navigator", subtitle "HVAC license demand by Texas county"
- Page heading: "Look up HVAC license demand by county"
- Intro: "See how many people hold an HVAC license in a Texas county. Use it to judge
  local demand before you train or apply."

## Screen inventory (F): seven pieces, seven components
| # | Piece | Component | Real terms |
|---|---|---|---|
| 1 | Header | `SiteHeader` | `<header>` landmark, site name as real text, small nav |
| 2 | Trust line | `TrustNote` | Static text: public data, counts only, no names |
| 3 | Form | `LicensePicker` | `<form onSubmit>`, `<fieldset>` + `<legend>`, two `<label htmlFor>` + `<select>` pairs, values in `useState`, error summary when something is missing |
| 4 | Primary button | `button[type=submit]` | Inside the form so Enter works. Disabled while loading; text changes to "Checking…" |
| 5 | Status line | `StatusMessage` | `role="status"` + `aria-live="polite"` |
| 6 | Result | `ResultCard` | Switches on status (success, empty, error). `Number(rows[0].count)` because Socrata returns strings. Heading takes focus after each search |
| 7 | Source footer | `SourceNote` | `<footer>`: dataset name, link to data.texas.gov, not legal advice |

Component tree: `App.jsx` holds state and renders SiteHeader, TrustNote, LicensePicker,
StatusMessage, ResultCard, SourceNote. LicensePicker submit calls `api/tdlr.js`.

## Five states (G): one result region, design all five
| State | When it happens | What the visitor sees | In the code |
|---|---|---|---|
| Idle | Page just loaded, or "Clear form" | Friendly placeholder telling them what to do | `status = 'idle'` |
| Loading | Form submitted and both fields valid | Spinner or skeleton; button says Checking and is disabled | `setStatus('loading')` then `await fetchHolderCount(type, county)` |
| Success | Response 200 and count above zero | Big number, what it means, the exact request | `setCount(Number(rows[0].count)); setStatus('success')` (real app: `rows[0].holders`, see note) |
| Empty | Response 200 but count is 0 or an empty array | No matching records, plus a next step. Not an error | `if (n === 0) setStatus('empty')` |
| Error | Network failure or HTTP 400 or 500, caught | Plain apology, status code, Try again. Choices kept | `catch (e) { setErrorCode(e.status); setStatus('error') }` |

Note: the sample reads `rows[0].count`. The real app's query says `count(*) AS holders`, so
the field is `rows[0].holders`. Same idea, different key. Check the browser JSON.

Transitions: idle → loading (submit); loading → success (200, n>0); loading → empty
(200, n=0); loading → error (fail); error → loading (try again); success → idle (new search).

Status line copy:
- Idle: "Ready. Choose a license type and a county."
- Loading: "Checking Texas license records."
- Success: "Done. Showing results for {type} in {county} County."
- Empty: "Done. No matching records for {type} in {county} County."
- Error: "Something went wrong (error {code}). Your choices are saved."

Result panel copy:
- Idle: "Your result will appear here" / "Pick a license type and a county, then select
  Show license count."
- Loading: "Checking Texas license records" / "This usually takes a few seconds."
- Success: "{type} in {county} County", big number, "people hold this license with
  {county} County listed as their business county." "What this means: a higher count
  usually means more shops and more hiring in that county. A count is not a job listing
  and does not mean any one employer will hire you." Disclosure: "See the exact data request".
- Empty: "No matching records found" / "TDLR lists no {type} licenses with {county}
  County as the business county. Try a nearby county or the other license type."
- Error: "We could not reach the Texas data service" + code + Try again.

## Copy bank (H): use, avoid, why
| Group | Use | Avoid | Why |
|---|---|---|---|
| Buttons | Show license count | Submit | Say what happens |
| Buttons | Clear form | Reset | Reset sounds like it could break something |
| Buttons | Try again | Retry request | Everyday words |
| Buttons | Start a new search | Back | Back is ambiguous on a one page app |
| Labels | License type | license_type | Never show a column name |
| Hints | Technicians work for a company. Contractors run the business. | (no hint) | Answers the question before they ask |
| Hints | The county where the business is listed. | business_county | Explains what the data means |
| Loading | Checking Texas license records. | Loading… | Name the thing you are fetching |
| Loading | This usually takes a few seconds. | Please wait | Sets an expectation |
| Success | people hold this license with Harris County listed as their business county. | Result: 12095 | A number always gets a sentence |
| Success | A count is not a job listing. | (nothing) | Honest about what data can say |
| Empty | No matching records found | Error: no data | Empty is not an error |
| Empty | Try a nearby county or the other license type. | 0 results | Always give a next step |
| Error | We could not reach the Texas data service. | Fetch failed: TypeError | Plain words first; code in parentheses |
| Error | This is a problem on our side, not something you did. Your choices are saved. | Something went wrong | People with records often assume they did something wrong |
| Error | There is a problem: Choose a county. | Invalid input | Says which field and what to do |
| Trust | We show counts only. We never show names, addresses, or personal license records. | Data from TDLR | Your privacy rule, said out loud |
| Trust | General information, not legal advice. | (nothing) | Required anywhere you mention Chapter 53 |

## Accessibility (I)
- Every box has a visible label above it, not just placeholder text.
- Keyboard only: you can always see focus and do everything.
- Text dark enough to read on a phone in sunlight (contrast 4.5 to 1).
- Screen reader hears "Checking…" and "Done" without the page jumping (`aria-live`).
- Missing input: says which box and what to do, in words, not only red color.
- Motion helps notice changes, but can be turned off (`prefers-reduced-motion`).

## Polish layers (C): only after logic works
1. Layout and spacing: 4 px rhythm, max width, two column form on wide screens.
2. Type hierarchy: label size, body size, one huge number with commas.
3. Color tokens: one navy for action, one blue for info, one gray for hints.
4. Surfaces: card borders, one radius, one soft shadow, left accent bar on the answer.
5. Microcopy: copy bank above.
6. Focus and labels: hints tied with `aria-describedby`, thick focus ring.
7. States and motion: light only; off when reduced motion is on.

## Build order in the sample (J) vs the MVP order
The sample suggests Sketch → static shell → hook up API → polish. The graded MVP order
is fetch first (tasks 2 to 5), then light polish (task 6), because "get the fetch working
and committed before making it pretty". Use the sample for names, states, and copy, not
for order. A paper sketch (15 min, no Kiro) before task 3 is still a good idea.

## Decision card (K): MVP checklist
SiteHeader with site name as text · TrustNote: counts only, no names · LicensePicker: two
labeled selects with hints · Submit button that says Show license count · StatusMessage in
a polite live region · ResultCard: big number plus one sentence · Error state with status
code and Try again · Visible focus ring on every control · SourceNote footer: dataset plus
not legal advice · Focus moves to the result heading after search.
Not now: filter chips, result cards per record, a full design system, animations beyond a
count roll up.
