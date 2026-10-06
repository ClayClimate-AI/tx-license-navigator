# Requirements: Navigator MVP (HVAC license demand by county)

Source of truth: `week4-plan-and-spec.md` (acceptance criteria, ordered tasks) and
`navigator-daily-guide.md` (Thursday MVP steps 1 to 6, MVP acceptance list).
Format: EARS (WHEN / WHILE / IF ... THE SYSTEM SHALL ...).
Each requirement lists the assignment criterion it serves and the task that builds it.

## Introduction
A one page React app that reads the public TDLR All Licenses dataset on data.texas.gov
(`https://data.texas.gov/resource/7358-krk7.json`) and shows how many people hold a chosen
license type with a chosen county as their business county. HVAC is the focus:
`A/C Technician` is the default, `A/C Contractor` is the other HVAC type. Counts only.

## Glossary
- **Holder count**: the string returned by `count(*)`, for example `"12095"`.
- **HVAC types**: the exact `license_type` values `A/C Technician` and `A/C Contractor`.
  (`A/C CE Provider` also starts with "A/C" but is not a trade license.)
- **Status**: one of `idle`, `loading`, `success`, `empty`, `error`.

---

## Requirement 1: Project runs locally
**User story:** As Joseph, I want a scaffold that runs with two commands, so that anyone
can start the app from the README.
Criteria: Build skill, Meets the spec. Task: 1 (README text in task 6).

1.1 WHEN a user runs `npm install` and then `npm run dev` THE SYSTEM SHALL serve the app
    at `http://localhost:5173` with no errors in the terminal or browser console.
1.2 THE SYSTEM SHALL use React, Vite, and Tailwind CSS only, with no extra runtime
    dependencies.
1.3 THE SYSTEM SHALL include a `.gitignore` that lists `node_modules`, `dist`, and `.env`.

## Requirement 2: License types load from the live API
**User story:** As a visitor, I want the license type list to come from real state data,
so that I can trust the choices.
Criteria: Build skill, Control. Tasks: 2 and 3.

2.1 WHEN the page loads THE SYSTEM SHALL request the license types query (group by
    `license_type`, `count(*) AS holders`, nulls filtered, ordered by holders descending,
    limit 50) exactly once.
2.2 WHEN the license types response arrives THE SYSTEM SHALL fill the License type select
    with every returned `license_type` value, text unchanged.
2.3 WHEN the list contains `A/C Technician` THE SYSTEM SHALL preselect it.
2.4 WHEN the list contains the HVAC types THE SYSTEM SHALL show them first (for example
    in an "HVAC" option group) and match them by exact string, not by prefix.
2.5 IF the license types request fails THEN THE SYSTEM SHALL show the error state with the
    HTTP status (or "no connection") and SHALL NOT render an empty, unusable form.
2.6 WHILE the license types request is in flight THE SYSTEM SHALL show the loading state
    and keep the submit button disabled.

## Requirement 3: County choice
**User story:** As a visitor, I want to pick my county by name, so that I do not need to
know how the data is stored.
Criteria: Build skill. Task: 3.

3.1 THE SYSTEM SHALL offer a County select with readable Title Case labels and a hint:
    "The county where the business is listed."
3.2 WHEN the form is submitted THE SYSTEM SHALL send the county in upper case to match
    `business_county` values (for example `HARRIS`).
3.3 IF the form is submitted with no county chosen THEN THE SYSTEM SHALL show
    "There is a problem: Choose a county." next to the field and SHALL NOT send a request.

## Requirement 4: Holder count and result card
**User story:** As a visitor, I want one clear number for my license type and county, so
that I can judge local demand.
Criteria: Build skill, Control, Demo. Task: 4.

4.1 WHEN the user selects "Show license count" with a license type and a county THE SYSTEM
    SHALL request `$select=count(*) AS holders` with
    `$where=license_type='<type>' AND business_county='<COUNTY>'`, encoded with
    `URLSearchParams`, with single quotes inside values doubled.
4.2 WHEN the count response is `[{"holders":"<n>"}]` with n greater than 0 THE SYSTEM SHALL
    convert the string with `Number()` and show it formatted with `toLocaleString()` plus a
    sentence: "people hold this license with <County> County listed as their business
    county."
4.3 THE SYSTEM SHALL show the exact request URL in the result card (for example inside a
    "See the exact data request" disclosure) so the number can be checked in a browser.
4.4 WHEN Joseph opens that same URL in a browser THE SYSTEM's displayed number SHALL match
    the browser JSON (verified Oct 6, 2026: `A/C Technician` + `HARRIS` = 12095).
4.5 THE SYSTEM SHALL state "A count is not a job listing."

## Requirement 5: Loading, empty, and error states
**User story:** As a visitor who may be nervous about my record, I want calm, clear
messages, so that I never think I broke something.
Criteria: Build skill, Demo, Meets the spec. Task: 5.

5.1 WHILE a count request is in flight THE SYSTEM SHALL show "Checking Texas license
    records." and "This usually takes a few seconds.", and SHALL disable the submit button
    and change its text to "Checking…".
5.2 WHEN the response is `[]` or the count is `"0"` THE SYSTEM SHALL show the empty state:
    "No matching records found" plus "Try a nearby county or the other license type."
    The empty state SHALL NOT look like an error.
5.3 IF the API returns HTTP 4xx or 5xx THEN THE SYSTEM SHALL show "We could not reach the
    Texas data service." with the status code in parentheses, plus "This is a problem on
    our side, not something you did. Your choices are saved." and a "Try again" button.
5.4 IF the request fails with no response (network down) THEN THE SYSTEM SHALL show the
    same error state with "no connection" in place of a code.
5.5 THE SYSTEM SHALL never crash or render a blank screen in any of these cases.
5.6 THE SYSTEM SHALL announce status changes in one line with `role="status"` and
    `aria-live="polite"`.
5.7 WHEN Joseph forces a bad column (HTTP 400) and a no match county THE SYSTEM SHALL show
    the error and empty states respectively, with no console errors other than the failed
    request itself.

## Requirement 6: Privacy, counts only
**User story:** As a visitor and as Joseph, I want no personal data anywhere, so that the
tool is safe to use and to demo.
Criteria: Meets the spec, Control. Tasks: all.

6.1 THE SYSTEM SHALL only use `license_type`, `business_county`, and `count(*)` in any
    query.
6.2 THE SYSTEM SHALL NOT request, log, store, or render any personal field (names,
    addresses, phones, license numbers, expiration dates).
6.3 THE SYSTEM SHALL NOT look up or display Joseph's own license record.
6.4 THE SYSTEM SHALL show the trust line: "We show counts only. We never show names,
    addresses, or personal license records."

## Requirement 7: Repo, README, and secrets
**User story:** As a grader, I want to clone and run the repo, so that I can check the spec.
Criteria: Meets the spec, Control, Demo. Task: 6.

7.1 THE SYSTEM SHALL have a README with: what the app is, the API URL, the two example
    query URLs, `npm install` and `npm run dev`, the privacy rule, and a screenshot.
7.2 THE SYSTEM SHALL contain no secrets: `git log -p | grep -i key` finds no key values.
7.3 THE SYSTEM SHALL be pushed to a public GitHub repo before Friday Oct 9, 2026.
7.4 THE SYSTEM SHALL show a source footer naming the dataset with a link to
    data.texas.gov and the line "General information, not legal advice."

## Requirement 8: Controlled agent process
**User story:** As Joseph, I want every change small and reviewable, so that I earn the
Control grade and can explain any line.
Criteria: Control, Demo. Tasks: all.

8.1 WHEN Kiro implements a task THE AGENT SHALL change only the files that task names and
    SHALL stop after showing the diff.
8.2 THE AGENT SHALL work in Supervised mode, one task at a time, with no parallel task
    runs and no subagents.
8.3 THE AGENT SHALL NOT run `git commit` or `git push` and SHALL NOT edit `PROMPT_LOG.md`.
8.4 WHEN a task is accepted Joseph SHALL test, verify data against the browser URL, and
    commit once with the message listed in tasks.md.

---

## MVP acceptance (all must be true before any stretch work)
- [ ] License type list loads from the live API on page load (2.1, 2.2)
- [ ] HVAC type + county shows a real count that matches the same URL in a browser (4.4)
- [ ] Loading shows; empty says no TDLR records match that combination (5.1, 5.2)
- [ ] API failure shows a friendly message with the status code; no crash (5.3, 5.5)
- [ ] No individual names, addresses, or phones anywhere (6.1, 6.2)
- [ ] `.env` gitignored; no secrets in git history (1.3, 7.2)
- [ ] `npm install` then `npm run dev` works; README says how; pushed to GitHub (7.1, 7.3)
- [ ] Joseph can explain every file and every fetch in his own words (8.4)

## Out of scope for this spec
Stretch layer (knowledge chunks, keyword retrieval, `/api/ask` proxy, AskPanel). Create a
separate spec for it only after the MVP gate. Database and saved searches are next week.
