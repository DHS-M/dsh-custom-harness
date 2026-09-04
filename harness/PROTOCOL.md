# Protocol

1. Every core change gets `docs/changes/NNN-slug.md` (problem, solution, reasoning, verify).
2. Plugins live under `plugins/<name>/` as packages named `@custom/<name>`.
3. Cloud assumes volume `/data` and trust-all public URL behavior.
4. Agents follow root `AGENTS.md` and log work under `contributors/logs/`.
5. Default model provider is `llm-opencode`; official DeepSeek stays disabled unless the user enables it.
6. Cordis client plugins inject service names (e.g. `slots`), never npm package IDs.
