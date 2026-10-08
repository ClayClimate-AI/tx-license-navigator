---
inclusion: always
---

# Report format (how every task reply ends)

End every task reply with this short report. About 10 lines. No paragraphs.
Use plain language. Keep technical terms, but explain them briefly.

## Changed
- One line per file: `path/to/file` (new or modified) and what it does now.

## Check it
1. Numbered steps Joseph runs himself.
2. Exact commands go in a code block, one command per line.
3. Never chain commands into one long line.

## Problems
- Only if there are any: errors, broken rules, anything you deleted, anything that
  differs from the plan in tasks.md. If there are none, leave this section out.

## Next
- The exact commit, with one `git add` per file:
  ```
  git add src/components/Example.jsx
  git commit -m "feat: short message"
  ```
- Never use `git add .` and never add `README.md`.
- Then name the next task id from tasks.md.

## Rules
- Never commit or push unless Joseph asks you to.
- If Joseph asks "what can I ignore", answer with two short lists:
  Noise (safe to skip) and Risky (read this).
- No hyphens, en dashes, or em dashes as punctuation in prose. Filenames are fine.