# 015 — Full OpenCode model catalog sync

## Problem
Deployed dsh-m showed **only one model** in the picker.

## Root cause
`dsh-llm-pi-ai` custom providers take models from the static `models:` list in `settings.yaml`. They do **not** call the provider’s `/v1/models` endpoint to populate the UI. Our start/install scripts had hardcoded a single model (e.g. `big-pickle`) or a tiny free subset.

## Solution
1. `harness/custom/scripts/sync-opencode-models.js` — keyless `GET https://opencode.ai/zen/v1/models` (Bearer `public`), write **every** id into `llm-pi-ai.providers.llm-opencode.models`.
2. Run sync from `dsh-m-install.sh` and `dsh-m-start.sh`.
3. Catalog currently ~66 models (verified against live API).

## Verify
After install/start, open Models / session model picker — expect dozens of `llm-opencode/*` entries, not one.
`$DSH_HOME/opencode-models.json` should list `count` ≈ 66.
