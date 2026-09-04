# Protocol (dsh-m)

1. Change narratives: `contributors/docs/changes/NNN-slug.md` only.
2. Builtin plugins: `harness/custom/builtins/` + `manifest.json` (`enabled` true/false).
3. Install path: `install/dsh-m-install.sh` (npm + patch once + link builtins).
4. Start path: `install/dsh-m-start.sh` (no re-patch).
5. Cloud: volume `/data`, `DSH_HOME=/data/dsh`, workspace `/data/workspace`, `HOME=/data/home`.
6. Default model: `llm-opencode`; official DeepSeek provider disabled by install patch unless user turns it on.
7. Client Cordis inject uses **service names** (e.g. `slots`), not package ids.
