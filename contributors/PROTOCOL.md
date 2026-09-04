# Protocol

1. Every core change gets `contributors/docs/changes/NNN-slug.md` (problem, solution, reasoning, verify).
2. Custom product code lives under `harness/custom/` (plugins, deploy scripts).
3. Upstream DeepSeek Harness lives under `harness/src/` (clone of deepseek-ai/deepseek-harness).
4. Cloud assumes volume `/data` and trust-all public URL behavior.
5. Agents follow root `AGENTS.md` and log work under `contributors/logs/`.
6. Default model provider is `llm-opencode`; official DeepSeek stays disabled unless the user enables it.
7. Cordis client plugins inject service names (e.g. `slots`), never npm package IDs.
