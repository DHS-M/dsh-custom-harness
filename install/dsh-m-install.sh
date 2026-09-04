#!/usr/bin/env bash
# dsh-m-install.sh — install stock DSH, apply DHS-M patches once, register builtins, sync model catalog.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CUSTOM="$REPO_ROOT/harness/custom"
BUILTINS="$CUSTOM/builtins"
PATCH_JS="$CUSTOM/scripts/apply-trust-all-patch.js"
SYNC_JS="$CUSTOM/scripts/sync-opencode-models.js"
MANIFEST="$BUILTINS/manifest.json"

SKIP_NPM=0
DSH_HOME_DIR="${DSH_HOME:-${HOME:+$HOME/.dsh-m}}"
DSH_HOME_DIR="${DSH_HOME_DIR:-/data/dsh}"
export DSH_HOME="$DSH_HOME_DIR"
export OPENCODE_PUBLIC_KEY="${OPENCODE_PUBLIC_KEY:-public}"

for arg in "$@"; do
  case "$arg" in
    --skip-npm) SKIP_NPM=1 ;;
    --dsh-home=*) DSH_HOME_DIR="${arg#*=}"; export DSH_HOME="$DSH_HOME_DIR" ;;
  esac
done

log() { printf '[dsh-m-install] %s\n' "$*"; }

if [ "$SKIP_NPM" -eq 0 ]; then
  log "Installing @deepseek-ai/dsh..."
  npm install -g "@deepseek-ai/dsh@${DSH_VERSION:-0.1.1-rc.2}"
fi

[ -f "$PATCH_JS" ] && node "$PATCH_JS" || log "WARN: no patch script"

link_builtin() {
  local name="$1"
  local src="$BUILTINS/$name"
  [ -d "$src" ] || return 0
  for base in \
    /usr/lib/node_modules/@deepseek-ai/dsh \
    /usr/local/lib/node_modules/@deepseek-ai/dsh \
    "$(npm root -g 2>/dev/null)/@deepseek-ai/dsh" \
    "$(npm root -g 2>/dev/null)"; do
    [ -n "$base" ] && [ -d "$base" ] || continue
    mkdir -p "$base/@custom" 2>/dev/null || true
    rm -rf "$base/@custom/$name"
    cp -a "$src" "$base/@custom/$name"
    log "linked @custom/$name"
  done
  mkdir -p "$DSH_HOME_DIR/profiles/web/node_modules/@custom"
  rm -rf "$DSH_HOME_DIR/profiles/web/node_modules/@custom/$name"
  cp -a "$src" "$DSH_HOME_DIR/profiles/web/node_modules/@custom/$name"
}

if [ -f "$MANIFEST" ]; then
  mapfile -t NAMES < <(node -e 'const m=require(process.argv[1]);for (const p of m.plugins||[]) if (p.enabled!==false) console.log(p.name)' "$MANIFEST")
  for name in "${NAMES[@]}"; do link_builtin "$name"; done
fi

mkdir -p "$DSH_HOME_DIR" "$DSH_HOME_DIR/sessions" "$DSH_HOME_DIR/profiles" "$DSH_HOME_DIR/storages"

log "Syncing full OpenCode model catalog into settings.yaml..."
if [ -f "$SYNC_JS" ]; then
  node "$SYNC_JS" || log "WARN: model sync failed — UI may show incomplete list"
else
  log "WARN: missing $SYNC_JS"
fi

log "Done. Start: bash install/dsh-m-start.sh"
