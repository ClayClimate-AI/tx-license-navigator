---
inclusion: fileMatch
fileMatchPattern: "PROMPT_LOG.md"
---

# PROMPT_LOG.md format

Applies only when Joseph asks in chat for a Prompt Log update. The default rule in
privacy-and-scope.md still holds: agents do not edit `PROMPT_LOG.md` on their own.

## Rules
- Fill only facts verified in this session: tool output, `git log`, file lists, times from
  the chat. Mark estimated times with `~` or "by". If a fact is unknown, leave the cell blank.
- Leave **Reflection** and **Explained** blank. Joseph writes them.
- Never change Joseph's wording. Formatting only: wrapping, `<br>`, `<ul><li>`, `<code>`,
  color dots.
- Keep section order. Add new entries after the last entry and before **Lesson asks**.
- Do not touch existing entries unless Joseph names them.

## File layout (in order, `---` between sections)
1. Header
2. `## Legend`
3. `## Project info` (table: Field | Details; rows One liner, Privacy, Tools)
4. `## Entry N · <title>` blocks, oldest first
5. `## Lesson asks` (table: Day | Details; rows Day 1, Day 2, Day 3)
6. `## Friday submit` (table: Field | Details; rows Change I will explain, Mistake I caught)

## Header (exact)
```html
<p align="center"><img src="docs/assets/banner.png" alt="TX License Navigator banner" width="100%"></p>
<h1 align="center">Prompt Log</h1>
<p align="center"><b>TX License Navigator</b> · Week 4 · Kiro CLI · claude-opus-5.5</p>
```

## Legend colors
| Dot | Group | Files and packages |
|---|---|---|
| 🟦 | Entry | `index.html`, `src/main.jsx` |
| 🟩 | UI | `src/App.jsx`, `react`, `react-dom` |
| 🟧 | Style | `src/index.css`, `tailwindcss`, `@tailwindcss/vite` |
| 🟪 | Build tools | `vite.config.js`, `vite`, `@vitejs/plugin-react` |
| 🟨 | Dependencies | `package.json`, `package-lock.json` |
| 🟫 | API | `src/api/tdlr.js` |

- Put the dot in front of every file or package from this table, wherever it appears
  in a table cell: `🟩 <code>src/App.jsx</code>`.
- Files not in the legend (docs, `.gitignore`, `.env`, `node_modules`, `dist`) get
  `<code>` with no dot.
- New files in later tasks (for example `src/api/tdlr.js`, `src/components/*`) get a
  dot only after Joseph adds them to the legend. Until then, use `<code>` with no dot.
- Inside Joseph's own Reflection and Explained text, add no `<code>` and no dots
  unless he already wrote them.

## Entry block
Heading, then the date and time in italics, then a 2 column HTML table. Rows always appear
in this order, even when a cell is blank:

| Row | What goes in it |
|---|---|
| Tool | Tool and model, e.g. `Kiro CLI · claude-opus-5.5` |
| Asked | One line summary of the prompt |
| Context | Files attached or loaded, as `<ul><li>` |
| Changed | Files created or edited as `<ul><li>` with dots, or "no files" |
| Decision | accepted / rejected / asked to redo / n/a (read only) |
| Verified | `<ul><li>` of `<time> CT · <check>` |
| Commit | `<code>hash</code>` + message, or "none" |
| Reflection | blank (Joseph) |
| Explained | blank (Joseph) |

Template:
```html
## Entry N · <title>

*<Mon D> · <start> to <end> CT*

<table>
  <tr><th align="left">Field</th><th align="left">Details</th></tr>
  <tr><td><b>Tool</b></td><td></td></tr>
  <tr><td><b>Asked</b></td><td></td></tr>
  <tr><td><b>Context</b></td><td></td></tr>
  <tr><td><b>Changed</b></td><td></td></tr>
  <tr><td><b>Decision</b></td><td></td></tr>
  <tr><td><b>Verified</b></td><td></td></tr>
  <tr><td><b>Commit</b></td><td></td></tr>
  <tr><td><b>Reflection</b></td><td></td></tr>
  <tr><td><b>Explained</b></td><td></td></tr>
</table>
```

Markup inside cells: HTML only (`<br>`, `<ul><li>`, `<code>`, `<b>`). GitHub does not
render Markdown inside HTML table cells.

## Call graph (only when files change)
- Add one only if the entry's Changed row lists files. Read-only entries get none.
- Put it directly below the entry's table, under `### Entry N call graph`. Do not put it
  inside a table cell, because mermaid does not render there.
- Use a `mermaid` fenced block, `flowchart TD`. Show only the files changed in that
  entry and what they connect to. Use one `classDef` per legend color:

```text
classDef run   fill:#334155,color:#fff,stroke:#94a3b8
classDef entry fill:#1d4ed8,color:#fff,stroke:#93c5fd
classDef ui    fill:#15803d,color:#fff,stroke:#86efac
classDef css   fill:#c2410c,color:#fff,stroke:#fdba74
classDef tool  fill:#7e22ce,color:#fff,stroke:#d8b4fe
classDef deps  fill:#a16207,color:#fff,stroke:#fde68a
```

- Node labels are plain descriptions of what each file does in the code. If Joseph
  supplies the block, paste it unchanged.
