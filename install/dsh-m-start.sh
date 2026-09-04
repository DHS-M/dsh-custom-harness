#!/usr/bin/env bash
# Start dsh-m after install. Does NOT re-patch every boot (install already did).
set -euo pipefail

export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=850}"
export OPENCODE_PUBLIC_KEY="${OPENCODE_PUBLIC_KEY:-public}"
export DSH_HOME="${DSH_HOME:-/data/dsh}"
export DSH_WORKSPACE="${DSH_WORKSPACE:-/data/workspace}"
export HOME="${HOME_OVERRIDE:-${HOME:-/data/home}}"
# Prefer HOME_OVERRIDE for cloud; leave local HOME alone if already set and not cloud
if [ -d /data ]; then
  export HOME="${HOME_OVERRIDE:-/data/home}"
  export npm_config_cache="${npm_config_cache:-/data/npm-cache}"
  export XDG_CACHE_HOME="${XDG_CACHE_HOME:-/data/cache}"
  export TMPDIR="${TMPDIR:-/data/tmp}"
fi

mkdir -p "$DSH_HOME" "$DSH_WORKSPACE" "$HOME" 2>/dev/null || true
mkdir -p "${npm_config_cache:-/tmp}" "${XDG_CACHE_HOME:-/tmp}" "${TMPDIR:-/tmp}" 2>/dev/null || true

if ! command -v dsh >/dev/null 2>&1; then
  echo "dsh not found. Run: bash install/dsh-m-install.sh" >&2
  exit 1
fi

cd "$DSH_WORKSPACE"
exec dsh web --no-open --host "${DSH_HOST:-0.0.0.0}" --port "${PORT:-3080}"
