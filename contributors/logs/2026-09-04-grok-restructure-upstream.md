# 2026-09-04 — Grok — Restructure: upstream clone + contributors docs

## Actor
- Type: agent
- Name/model: Grok (xAI)

## Goal
Fix layout: real DeepSeek Harness under harness; PROTOCOL/CHANGELOG/change docs under contributors.

## Done
- `harness/bootstrap-upstream.sh` + `.gitmodules` for upstream
- Docs moved to `contributors/`
- Custom plugins path: `harness/custom/`

## Handoff
Run `bash harness/bootstrap-upstream.sh` after clone.
