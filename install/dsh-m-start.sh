#!/usr/bin/env bash
# Start dsh-m. Re-syncs OpenCode model catalog (fast) so the picker stays complete.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SYNC_JS="$REPO_ROOT/harness/custom/scripts/sync-opencode-models.js"

export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=850}"
export OPENCODE_PUBLIC_KEY="${OPENCODE_PUBLIC_KEY:-public}"
export DSH_HOME="${DSH_HOME:-/data/dsh}"
export DSH_WORKSPACE="${DSH_WORKSPACE:-/data/workspace}"

if [ -d /data ]; then
  export HOME="${HOME_OVERRIDE:-/data/home}"
  export npm_config_cache="${npm_config_cache:-/data/npm-cache}"
  export XDG_CACHE_HOME="${XDG_CACHE_HOME:-/data/cache}"
  export TMPDIR="${TMPDIR:-/data/tmp}"
fi

mkdir -p "$DSH_HOME" "$DSH_WORKSPACE" "${HOME:-/tmp}" 2>/dev/null || true

if [ -f "$SYNC_JS" ]; then
  node "$SYNC_JS" || true
fi

if ! command -v dsh >/dev/null 2>&1; then
  echo "dsh not found. Run: bash install/dsh-m-install.sh" >&2
  exit 1
fi

cd "$DSH_WORKSPACE"
exec dsh web --no-open --host "${DSH_HOST:-0.0.0.0}" --port "${PORT:-3080}"
