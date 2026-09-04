# harness — product tree

Cloud-ready DeepSeek Harness customization: plugins, start scripts, deploy blueprints, and change narratives.

## Contents

| Path | Role |
|------|------|
| `plugins/` | `@custom/llm-opencode`, `web-search-pi`, `telegram-settings`, `telegram-adapter`, `settings-ui` |
| `scripts/` | `railway-start.sh`, `render-start.sh`, trust-all helpers |
| `deploy/` | `railway.toml`, `render.yaml`, template vars |
| `docs/changes/` | Numbered problem→solution narratives |
| `PROTOCOL.md` | How we customize |

## Deploy

### Railway
- Start: `bash scripts/railway-start.sh` (see `deploy/railway.toml`)
- Volume: **`/data`**
- Template descriptions: `deploy/railway-template-vars.json`

### Render
- Blueprint: `deploy/render.yaml`
- Start: `bash scripts/render-start.sh`

## Persistence

| Env | Path |
|-----|------|
| `DSH_HOME` | `/data/dsh` |
| `DSH_WORKSPACE` | `/data/workspace` |
| `HOME` | `/data/home` |

Default model provider: **`llm-opencode`**.
