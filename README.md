# DHS-M · dsh-m

Our product is **dsh-m**: DeepSeek Harness with DHS-M builtins, install script, and cloud defaults.

Branch `feat/dsh-m-install-and-builtins` implements the install path (this work).

## Layout

```text
install/                    ← dsh-m-install.sh, dsh-m-start.sh
harness/
  src/                      ← optional upstream clone (bootstrap)
  custom/
    builtins/               ← first-party plugins + manifest.json
    scripts/                ← trust-all patch (runs at install, not every start)
    deploy/                 ← railway / render
contributors/               ← PROTOCOL, CHANGELOG, docs/changes, logs
```

## Install & run

```bash
bash install/dsh-m-install.sh
bash install/dsh-m-start.sh
```

Cloud: set volume at `/data`, `DSH_HOME=/data/dsh`, then the same install + start.

## Builtins

See `harness/custom/builtins/manifest.json`. Enable/disable without deleting code.

## Agents

Read **AGENTS.md**. Write history only under **contributors/**.
