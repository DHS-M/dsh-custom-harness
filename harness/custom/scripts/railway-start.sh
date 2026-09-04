#!/bin/bash
set -euo pipefail
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=850}"
export OPENCODE_PUBLIC_KEY="${OPENCODE_PUBLIC_KEY:-public}"
export DSH_HOME="${DSH_HOME:-/data/dsh}"
export DSH_WORKSPACE="${DSH_WORKSPACE:-/data/workspace}"
export HOME="${HOME:-/data/home}"
export npm_config_cache="${npm_config_cache:-/data/npm-cache}"
export XDG_CACHE_HOME="${XDG_CACHE_HOME:-/data/cache}"
export TMPDIR="${TMPDIR:-/data/tmp}"

mkdir -p "$DSH_HOME" "$DSH_WORKSPACE" "$HOME" \
  "$npm_config_cache" "$XDG_CACHE_HOME" "$TMPDIR" \
  "$DSH_HOME/sessions" "$DSH_HOME/profiles" "$DSH_HOME/storages" \
  "$DSH_HOME/profiles/web/node_modules/@custom"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if ! command -v dsh >/dev/null 2>&1; then
  npm install -g @deepseek-ai/dsh@0.1.1-rc.2
fi

node "$ROOT/scripts/apply-trust-all-patch.js" || true

link_plugin() {
  local name="$1"
  local src="$ROOT/plugins/$name"
  [ -d "$src" ] || return 0
  for base in /usr/lib/node_modules/@deepseek-ai/dsh /usr/local/lib/node_modules/@deepseek-ai/dsh \
              /usr/lib/node_modules /usr/local/lib/node_modules; do
    mkdir -p "$base/@custom" 2>/dev/null || true
    rm -rf "$base/@custom/$name" 2>/dev/null || true
    cp -a "$src" "$base/@custom/$name" 2>/dev/null || true
  done
  mkdir -p "$DSH_HOME/profiles/web/node_modules/@custom"
  rm -rf "$DSH_HOME/profiles/web/node_modules/@custom/$name"
  cp -a "$src" "$DSH_HOME/profiles/web/node_modules/@custom/$name"
}
link_plugin llm-opencode
link_plugin web-search-pi
link_plugin telegram-settings

cd "$DSH_WORKSPACE"
exec dsh web --no-open --host 0.0.0.0 --port "${PORT:-3080}"
