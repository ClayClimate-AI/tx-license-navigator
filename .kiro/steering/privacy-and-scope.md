---
inclusion: always
---

# Privacy and scope rules (hard rules, no exceptions)

## Privacy: counts only
- The TDLR dataset contains names, addresses, phone numbers, and license numbers.
  This app shows aggregate counts only.
- Allowed fields in any query: `license_type`, `business_county`, and `count(*)`.
  Nothing else may appear in `$select`, `$where`, `$group`, or `$order`.
- Never request raw rows. Every request must have a `$select` with `count(*)`.
- Never select, filter on, log, store, or render any personal field. That includes owner
  or business names, any address, any phone, license numbers, and expiration dates.
  Do not even write those column names in `src/`; use the allowlist above instead.
- Never look up Joseph's own license row, not even "just to test". The demo uses county
  counts only.
- Never `console.log` a whole API response in shipped code. Logging the license type list
  in task 2 is fine because it is aggregate only; remove the log in task 3.

## Secrets
- The MVP needs no API key. Do not add one.
- `.gitignore` must contain `.env` before any key exists.
- Never put a key in browser code, in `VITE_` variables, in steering files, in docs, or
  in a commit. Keys only ever live in a gitignored `.env` read by a Node server (stretch).

## Scope: MVP first, then freeze
- Work only on the current task in `.kiro/specs/navigator-mvp/tasks.md`.
- No stretch work (knowledge chunks, retrieval, `/api/ask` proxy, AskPanel, model calls)
  until all of these are true: tasks 1 to 6 done, MVP acceptance checklist passed, pushed
  to GitHub, and Joseph says "MVP gate passed" in chat.
- Never write legal text. Texas Occupations Code Chapter 53 and State Auditor guide text
  is pasted by Joseph from the official pages. You may create empty files with title and
  source placeholders only.
- No database, saved searches, accounts, or routing this week, even if it seems easy.
- No parallel agents, no subagents, no "Run all Tasks", no autonomous spec runs.

## Joseph's graded writing
- Agents may fill verified facts in `PROMPT_LOG.md`. Agents never write or change
  Reflection or Explained.
- Do not write demo narration or the "change I will explain / mistake I caught" line.
