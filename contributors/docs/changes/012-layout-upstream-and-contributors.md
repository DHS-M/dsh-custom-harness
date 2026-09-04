# 012 — Layout: upstream under harness, docs under contributors

## Problem
Repo had no real DeepSeek Harness tree; PROTOCOL/CHANGELOG/change docs sat under `harness/` instead of the collaboration folder.

## Solution
- `harness/src` — upstream via `bootstrap-upstream.sh` / submodule
- `harness/custom` — DHS-M plugins only
- `contributors/` — PROTOCOL, CHANGELOG, `docs/changes/`, logs

## Verify
Root README layout section matches the tree; `bash harness/bootstrap-upstream.sh` leaves `harness/src/README.md` present.
