# 014 — websearch-opencode builtin (OpenCode Exa/Parallel MCP)

## Problem
Stock DSH web search was tied to the official DeepSeek provider. OpenCode ships a **provider-independent** `websearch` tool that calls Exa MCP (and optionally Parallel MCP).

## Investigation
OpenCode core (`packages/core/src/tool/websearch.ts`):
- Tool name: `websearch`
- Exa: `POST https://mcp.exa.ai/mcp` JSON-RPC `tools/call` → `web_search_exa`
- Parallel: `POST https://search.parallel.ai/mcp` → `web_search`
- Args: `query`, `numResults`, `livecrawl` (fallback|preferred), `type` (auto|fast|deep), `contextMaxCharacters`
- Verified: Exa responds **200 without API key** when `User-Agent: opencode/1.15.5`

## Solution
Builtin `@custom/websearch-opencode`:
- `search.js` — pure MCP client
- `index.js` — Cordis `apply` + best-effort `ctx.tools.register`
- Manifest: **enabled**; `web-search-pi` disabled

## Verify
```bash
node -e "import('./harness/custom/builtins/websearch-opencode/search.js').then(m=>m.websearch({query:'Node.js LTS',numResults:2}).then(console.log))"
```
Expect `provider: 'exa'` and non-empty `text`.
