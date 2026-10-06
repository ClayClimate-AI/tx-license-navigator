---
inclusion: always
---

# Product: Texas Second Chance License Navigator (HVAC focus)

## What it is
A small one page web app. A person with a criminal record picks a Texas TDLR license
type and a county, and sees how many people hold that license with that county listed
as their business county. The count is a demand signal: more holders usually means more
shops and more hiring nearby. A count is not a job listing.

## Who it is for
- Primary user: someone with a record deciding whether an HVAC trade is worth training
  for or applying to in their county.
- Builder: Joseph Clay, Next Chapter Phase 2, Week 4 (Mon Oct 5 to Fri Oct 9, 2026).
- Demo story: Joseph is licensed in the trade, so this count is what he would check for
  demand where he works. The demo never opens his personal license row.

## The one job of the MVP
1. Load the license type list from the live API on page load.
2. Default the pick to `A/C Technician` (the other HVAC type is `A/C Contractor`).
3. Pick a county, press "Show license count", see one real number.
4. Show loading, empty, and error states. Never crash, never show a blank screen.

## How it is graded (assignment criteria)
Grade is control, not complexity.
- Build skill: app runs, calls the live TDLR API, loading, empty, and error states work.
- Control: every diff reviewed, small commits, Prompt Log filled in, at least one caught
  agent mistake, Joseph can explain any part.
- Demo: about 2 minutes, live run, one good result, one failure case, one accepted agent
  change explained, one caught mistake named.
- Meets the spec: public API, error handling, on GitHub with a README that has the API URL
  and run steps.

## Data source (verified)
- TDLR All Licenses on data.texas.gov (Socrata), dataset `7358-krk7`, no key needed.
- Endpoint: `https://data.texas.gov/resource/7358-krk7.json`

## Out of scope this week
Database, saved searches, accounts, routing, charts, maps, job listings, multi agent
workflows, and anything in the stretch layer until the MVP gate is passed
(see privacy-and-scope.md).
