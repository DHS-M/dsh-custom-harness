# 2026-09-04 — Grok — dsh-m install + builtins branch

## Actor
- Type: agent
- Name/model: Grok (xAI)

## Goal
New branch; own install script; builtin plugins via manifest; stop implying we forked upstream source.

## Done
- Branch `feat/dsh-m-install-and-builtins`
- `install/dsh-m-install.sh`, `install/dsh-m-start.sh`
- `harness/custom/builtins/` + manifest (3 enabled, telegram-adapter off)

## Handoff
- Flesh llm-opencode / web-search-pi registration against live cordis APIs after bootstrap
- Delete duplicate `harness/plugins` paths on main when merging
- Optional: source fork path if install-time patch is not enough
