# Agent contribution guide (dsh-m)

## Product model

We ship **dsh-m**: stock `@deepseek-ai/dsh` + **install-time** patch + **builtin** plugins under `harness/custom/builtins/`.

We are **not** (yet) maintaining a full upstream source fork unless a change requires it. Prefer:

1. Builtin plugin in `harness/custom/builtins/<name>/`
2. Register in `builtins/manifest.json`
3. Wire in `install/dsh-m-install.sh` / patch scripts if cordis profile needs it

## Layout

| Path | Role |
|------|------|
| `install/` | `dsh-m-install.sh`, `dsh-m-start.sh` |
| `harness/custom/builtins/` | First-party plugins + `manifest.json` |
| `harness/custom/scripts/` | Install-time patches (trust-all, provider defaults) |
| `harness/src/` | Optional upstream clone |
| `contributors/` | PROTOCOL, CHANGELOG, `docs/changes/`, logs |

## Before work

1. Branch from `feat/dsh-m-install-and-builtins` or `main` as directed.
2. Read latest `contributors/docs/changes/` and `contributors/logs/`.
3. Do **not** put process docs under `harness/`.

## After work

1. Code under `harness/custom/` or `install/`.
2. `contributors/docs/changes/NNN-….md` + `contributors/logs/…`.
3. Prefer patch **at install**, not every `dsh-m-start`.
