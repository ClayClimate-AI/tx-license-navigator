---
inclusion: always
---

# Project structure

Target layout when the MVP is done. Create files only when the current task needs them.

```
tx-second-chance/
├── .kiro/
│   ├── steering/            product, tech, structure, privacy-and-scope, extras
│   ├── specs/navigator-mvp/ requirements.md, design.md, tasks.md
│   └── hooks/               optional privacy guard (off by default)
├── docs/
│   ├── reference/           mvp-map.md, ui-reference.md (read only references)
│   ├── prompts.md           one prompt per MVP step
│   ├── prompt-log-template.md
│   └── screenshot.png       added in task 6
├── PROMPT_LOG.md            Joseph writes this himself (graded). Agents never edit it.
├── README.md                what it is, API URL, how to run, privacy note
├── .gitignore               node_modules, dist, .env
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx             mounts <App />
    ├── index.css            @import "tailwindcss";
    ├── App.jsx              holds state: licenseTypes, type, county, status, count, error
    ├── api/
    │   └── tdlr.js          buildTypesUrl, fetchLicenseTypes, buildCountUrl, fetchHolderCount
    ├── data/
    │   └── counties.js      short county list for the select (Title Case labels)
    └── components/
        ├── SiteHeader.jsx   header landmark and site name (task 6)
        ├── TrustNote.jsx    "counts only" promise (task 6)
        ├── LicensePicker.jsx form: license type select, county select, submit button
        ├── StatusMessage.jsx one line, role="status", aria-live="polite"
        ├── ResultCard.jsx   success, empty, error panels, exact query URL
        └── SourceNote.jsx   dataset link, "General information, not legal advice." (task 6)
```

## Conventions
- One component per file, default export, PascalCase file names in `src/components/`.
- All network code lives in `src/api/tdlr.js`. Components never call `fetch` directly.
- `App.jsx` owns state and passes props down. Components stay presentational.
- Short comments that explain why, not what. No commented out code.
- Status values are exactly: `'idle' | 'loading' | 'success' | 'empty' | 'error'`.

## Never edit
- `PROMPT_LOG.md` (Joseph's graded reflections).
- `docs/reference/*` (copies of Joseph's guides).
- `.kiro/steering/*` unless Joseph asks for a steering change.
