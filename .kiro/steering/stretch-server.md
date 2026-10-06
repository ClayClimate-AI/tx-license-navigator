---
inclusion: fileMatch
fileMatchPattern: ["server/**/*", "knowledge/**/*", "src/components/AskPanel.jsx", ".env*"]
---

# Stretch layer rules (load only when touching stretch files)

Only valid after the MVP gate is passed (see privacy-and-scope.md). If Joseph has not
said "MVP gate passed", stop and remind him.

- Knowledge chunks in `knowledge/*.md`: Joseph pastes the text. Each file starts with a
  title line and a `Source:` URL. You never write or paraphrase legal text.
- Retrieval: plain keyword scoring in one function, top 3. If the best score is 0, return
  "Not in my sources" and make no model call.
- Proxy: Node server, `POST /api/ask` with body `{ question }`. Key read from `.env`
  (`ANTHROPIC_API_KEY` default, `XAI_API_KEY` when `LLM_PROVIDER=grok`). Responses:
  400 empty question, 500 missing key, 502 model call failed. Never echo or log a key.
- Vite proxies `/api` to the server. The browser never sees a key.
- AskPanel shows the answer, a citation list (title and source URL of each retrieved
  chunk), and the fixed line "Information, not legal advice."
- Providers: Claude by default, Grok as the swap. Never OpenAI.
