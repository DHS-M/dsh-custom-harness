# DHS-M · DeepSeek Harness (custom)

Organization workspace around a **real DeepSeek Harness tree** plus DHS-M cloud customizations.

## Layout

```text
.
├── README.md
├── AGENTS.md                 ← agents must read this
├── CONTRIBUTING.md
├── harness/
│   ├── src/                  ← upstream clone (submodule / bootstrap-upstream.sh)
│   ├── custom/               ← our plugins, scripts, deploy
│   ├── bootstrap-upstream.sh
│   └── README.md
└── contributors/             ← PROTOCOL, CHANGELOG, change docs, work logs
    ├── PROTOCOL.md
    ├── CHANGELOG.md
    ├── docs/changes/
    └── logs/
```

| Path | Purpose |
|------|---------|
| `harness/src` | Upstream [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) |
| `harness/custom` | DHS-M plugins and deploy |
| `contributors` | How we work, what changed, who did it |

## First-time setup

```bash
git clone --recurse-submodules https://github.com/DHS-M/dsh-custom-harness.git
cd dsh-custom-harness
# if src empty:
bash harness/bootstrap-upstream.sh
```

## Agents

Read **[AGENTS.md](./AGENTS.md)**. History and protocol are under **`contributors/`**, not `harness/`.
