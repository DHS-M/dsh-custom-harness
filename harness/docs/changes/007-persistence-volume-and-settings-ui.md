# 007 — Persistence volume

## Problem
Volume attached but sessions vanished: DSH wrote under `/app/.dsh` and agent HOME under `/root`.

## Solution
`DSH_HOME=/data/dsh`, `HOME=/data/home`, `cwd=/data/workspace`, caches under `/data/*`.

## Verify
`host.describe` shows home `/data/home` and cwd `/data/workspace`; redeploy keeps sessions.
