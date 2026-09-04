# 007 — Persistence volume

## Problem
Volume attached but state vanished (`/app/.dsh`, `/root`).

## Solution
`DSH_HOME=/data/dsh`, `HOME=/data/home`, cwd `/data/workspace`.

## Verify
`host.describe` shows those paths; redeploy keeps sessions.
