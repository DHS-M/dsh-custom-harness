# DHS-M · DeepSeek Harness (custom)

Organization workspace for a **cloud-ready** customization of [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness): public URLs, free OpenCode models, Telegram, volume persistence, and multi-agent collaboration.

## Layout

```text
.
├── README.md                 ← you are here
├── AGENTS.md                 ← how coding agents must contribute
├── CONTRIBUTING.md           ← humans + process overview
├── harness/                  ← product code, scripts, change narratives
└── contributors/             ← who did what (agents + humans)
```

| Path | Purpose |
|------|---------|
| [`harness/`](./harness/) | Source of truth: plugins, deploy scripts, protocol, change log |
| [`contributors/`](./contributors/) | Work logs so the next agent can continue |

## Quick start (agents)

1. Read **[`AGENTS.md`](./AGENTS.md)** end-to-end.
2. Read **[`harness/PROTOCOL.md`](./harness/PROTOCOL.md)** and the latest files under `harness/docs/changes/`.
3. Read the newest entry in **`contributors/logs/`**.
4. Implement in `harness/`, write a change narrative, append a contributor log, push.

## Deploy

See [`harness/README.md`](./harness/README.md). Always mount durable storage at **`/data`**.

## License

Custom plugins and scripts in this repo are for DHS-M collaboration. Upstream `@deepseek-ai/dsh` remains under its own license.
