# Agent contribution guide (DHS-M)

Mandatory for any coding agent working on this repository. Follow it so another agent can continue without re-discovering context.

## 1. Scope

| Area | Location |
|------|----------|
| Product code & deploy | `harness/` |
| Narrative of our changes | `harness/docs/changes/NNN-slug.md` |
| Protocol | `harness/PROTOCOL.md` |
| Who did what | `contributors/logs/` |

Do **not** leave one-off notes only in chat. Persist under `contributors/logs/` or a numbered change doc.

## 2. Before you change anything

1. Read latest `main`.
2. Skim `harness/PROTOCOL.md`.
3. Read the **last 3** files in `harness/docs/changes/` (highest numbers).
4. Read the **latest** `contributors/logs/*.md`.
5. If the task touches Railway/cloud: read `harness/docs/changes/007-*`, `010-*`, and `harness/deploy/`.

## 3. How to implement

1. Prefer editing under `harness/plugins/` and `harness/scripts/`.
2. Runtime installs stock `@deepseek-ai/dsh`; we **patch + inject** `@custom/*` plugins at start.
3. Paths on cloud **must** use the volume:
   - `DSH_HOME=/data/dsh`
   - `DSH_WORKSPACE=/data/workspace`
   - `HOME=/data/home`
4. Cordis **client** plugins inject **service names** (e.g. `slots`), never npm package ids.
5. Do not re-enable official DeepSeek provider by default; default model stays `llm-opencode`.
6. Do not add password/auth layers unless explicitly requested (trust-all cloud design).

## 4. After every meaningful change

1. Add `harness/docs/changes/NNN-short-slug.md` with Problem, Solution, reasoning, Files, Verify.
2. Append `contributors/logs/YYYY-MM-DD-agent-short-slug.md` using `contributors/TEMPLATE.md`.
3. Update `harness/CHANGELOG.md` one bullet if user-facing.
4. Push to `main` (or open a PR if required).

## 5. Continuity packet

```text
Repo: DHS-M/dsh-custom-harness
Last change doc: harness/docs/changes/NNN-...
Last contributor log: contributors/logs/...
Open risks: (list)
Blocked on: (tokens, volume, etc.)
```

## 6. Forbidden

- Committing secrets (tokens, bot keys).
- Durable state under `/app`, `/root`, or outside `/data` on cloud.
- Breaking ModuleLoader client bundles with bad regex patches.
- Claiming work in chat without a contributor log.

## 7. Verification checklist (cloud)

- [ ] HTTP 200 on service URL
- [ ] `host.describe` → home `/data/home`, cwd `/data/workspace`
- [ ] Models list includes `llm-opencode`
- [ ] No Failed to load plugins for `@custom/*`
- [ ] Settings → Telegram loads (if enabled)
