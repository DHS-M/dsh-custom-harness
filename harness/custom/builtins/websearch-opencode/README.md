# @custom/websearch-opencode

OpenCode **built-in** websearch, ported as a dsh-m Cordis plugin.

## How OpenCode does it

From OpenCode core (`websearch` tool):

| Backend | URL | MCP tool | Key |
|---------|-----|----------|-----|
| **Exa** (default) | `https://mcp.exa.ai/mcp` | `web_search_exa` | Optional `EXA_API_KEY` (query param). Works **without** key using `User-Agent: opencode/…` |
| **Parallel** | `https://search.parallel.ai/mcp` | `web_search` | Optional `PARALLEL_API_KEY` |

Enabled in OpenCode when using Zen (`provider=opencode`) **or** `OPENCODE_ENABLE_EXA=1` / Parallel flag.

This is **not** the same as model-hosted search (Anthropic/OpenAI server tools). It is a **local tool** that calls hosted MCP search services.

## dsh-m usage

Linked by `install/dsh-m-install.sh` when enabled in `manifest.json`.

Env:

| Variable | Meaning |
|----------|---------|
| `EXA_API_KEY` | Optional Exa key |
| `PARALLEL_API_KEY` | Optional Parallel key |
| `DSH_M_WEBSEARCH_PROVIDER` | `exa` \| `parallel` \| `auto` |
| `WEBSEARCH_TIMEOUT_MS` | Default 25000 |

Programmatic:

```js
import { websearch } from "@custom/websearch-opencode/search";
const { provider, text } = await websearch({ query: "Node.js LTS" });
```

Agent tool name when registration succeeds: **`websearch`**.
