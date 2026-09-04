# Agent contribution guide (DHS-M)

## Layout (do not invert)

- **`harness/src`** — upstream DeepSeek Harness (clone). Keep its READMEs.
- **`harness/custom`** — our plugins/scripts only.
- **`contributors/`** — `PROTOCOL.md`, `CHANGELOG.md`, `docs/changes/`, `logs/`.

## Before work

1. Ensure `harness/src` exists (`bash harness/bootstrap-upstream.sh` if not).
2. Read `contributors/PROTOCOL.md` and the latest `contributors/docs/changes/*`.
3. Read the latest `contributors/logs/*`.

## After work

1. Code under `harness/custom/` (or intentional upstream edits in `harness/src` with clear notes).
2. Add `contributors/docs/changes/NNN-slug.md`.
3. Add `contributors/logs/YYYY-MM-DD-….md`.
4. Bump `contributors/CHANGELOG.md` if user-facing.

## Cloud rules

- Volume paths: `DSH_HOME=/data/dsh`, workspace `/data/workspace`, `HOME=/data/home`
- Client plugin inject = Cordis service names (`slots`), not package ids
- No secrets in git
