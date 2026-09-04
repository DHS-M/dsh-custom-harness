# 013 — dsh-m install script and builtin plugins

## Problem
Earlier work mixed runtime patch-on-every-boot, incomplete plugins, and no single install entry. We need our own product path: **dsh-m**.

## Solution
- Branch `feat/dsh-m-install-and-builtins`
- `install/dsh-m-install.sh` — npm install DSH, apply trust-all **once**, link enabled builtins from `harness/custom/builtins/manifest.json`
- `install/dsh-m-start.sh` — start only (no re-patch)
- Builtins: `llm-opencode`, `web-search-pi`, `telegram-settings` enabled; `telegram-adapter` disabled (sidecar later)

## Efficiency
Patch at install time, not every process start. Full source fork under `harness/src` remains optional when we need deeper upstream edits.

## Verify
```bash
bash install/dsh-m-install.sh
bash install/dsh-m-start.sh
# check models list includes llm-opencode; no plugin load errors for enabled builtins
```
