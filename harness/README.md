# harness

Two layers:

| Path | What |
|------|------|
| **`src/`** | Full **DeepSeek Harness** upstream (clone / submodule of [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)) |
| **`custom/`** | DHS-M overlays: plugins, start scripts, deploy blueprints |

Upstream READMEs and license stay inside `src/` once bootstrapped — do not delete them.

## Bootstrap upstream

```bash
bash harness/bootstrap-upstream.sh
```

Clones `deepseek-ai/deepseek-harness` into `harness/src` and removes bulky unused paths. Essential READMEs, `packages/`, `apps/`, `scripts/`, and license files are kept.

## Custom plugins

See `custom/plugins/`.

Collaboration history (PROTOCOL, CHANGELOG, change narratives) lives in **`../contributors/`**, not here.
