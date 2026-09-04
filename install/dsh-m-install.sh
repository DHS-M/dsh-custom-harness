#!/usr/bin/env bash
# dsh-m-install.sh — install stock DSH, apply DHS-M patches once, register builtins.
# Usage: bash install/dsh-m-install.sh [--skip-npm] [--dsh-home PATH]
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CUSTOM="$REPO_ROOT/harness/custom"
BUILTINS="$CUSTOM/builtins"
PATCH_JS="$CUSTOM/scripts/apply-trust-all-patch.js"
MANIFEST="$BUILTINS/manifest.json"

SKIP_NPM=0
DSH_HOME_DIR="${DSH_HOME:-${HOME:+$HOME/.dsh-m}}"
DSH_HOME_DIR="${DSH_HOME_DIR:-/data/dsh}"

for arg in "$@"; do
  case "$arg" in
    --skip-npm) SKIP_NPM=1 ;;
    --dsh-home=*) DSH_HOME_DIR="${arg#*=}" ;;
  esac
done

log() { printf '[dsh-m-install] %s\n' "$*"; }

if [ "$SKIP_NPM" -eq 0 ]; then
  log "Installing @deepseek-ai/dsh (global)..."
  npm install -g "@deepseek-ai/dsh@${DSH_VERSION:-0.1.1-rc.2}"
fi

if [ ! -f "$PATCH_JS" ]; then
  log "ERROR: missing patch script $PATCH_JS"
  exit 1
fi

log "Applying trust-all + default-provider patch (once at install)..."
node "$PATCH_JS"

link_builtin() {
  local name="$1"
  local src="$BUILTINS/$name"
  [ -d "$src" ] || { log "skip missing builtin $name"; return 0; }

  local targets=()
  for base in \
    /usr/lib/node_modules/@deepseek-ai/dsh \
    /usr/local/lib/node_modules/@deepseek-ai/dsh \
    "$(npm root -g 2>/dev/null)/@deepseek-ai/dsh" \
    "$(npm root -g 2>/dev/null)"; do
    [ -n "$base" ] && [ -d "$base" ] || continue
    mkdir -p "$base/@custom" 2>/dev/null || true
    rm -rf "$base/@custom/$name"
    cp -a "$src" "$base/@custom/$name"
    log "linked @custom/$name -> $base/@custom/$name"
  done

  mkdir -p "$DSH_HOME_DIR/profiles/web/node_modules/@custom"
  rm -rf "$DSH_HOME_DIR/profiles/web/node_modules/@custom/$name"
  cp -a "$src" "$DSH_HOME_DIR/profiles/web/node_modules/@custom/$name"
}

if [ -f "$MANIFEST" ]; then
  log "Registering builtins from manifest..."
  # shell-friendly: list enabled names via node
  mapfile -t NAMES < <(node -e '
    const m=require(process.argv[1]);
    for (const p of m.plugins||[]) {
      if (p.enabled !== false) console.log(p.name);
    }
  ' "$MANIFEST")
  for name in "${NAMES[@]}"; do
    link_builtin "$name"
  done
else
  log "WARN: no manifest at $MANIFEST; linking all dirs under builtins/"
  for d in "$BUILTINS"/*/; do
    [ -d "$d" ] || continue
    link_builtin "$(basename "$d")"
  done
fi

mkdir -p "$DSH_HOME_DIR" "$DSH_HOME_DIR/sessions" "$DSH_HOME_DIR/profiles" "$DSH_HOME_DIR/storages"
if [ ! -f "$DSH_HOME_DIR/settings.yaml" ]; then
  cat > "$DSH_HOME_DIR/settings.yaml" << 'YAML'
# Written by dsh-m-install — default free provider
llm-pi-ai:
  providers:
    llm-opencode:
      displayName: OpenCode (free)
      apiKeyEnv: OPENCODE_PUBLIC_KEY
      api: openai-completions
      baseURL: https://opencode.ai/zen/v1
      headers:
        User-Agent: opencode/1.15.5
        x-opencode-client: cli
        x-opencode-project: dsh-m
      models:
        - id: big-pickle
          name: Big Pickle
          contextWindow: 200000
          maxTokens: 128000
agent-default-model:
  provider: llm-opencode
  model: big-pickle
YAML
  log "wrote default settings -> $DSH_HOME_DIR/settings.yaml"
fi

log "Done. Start with: DSH_HOME=$DSH_HOME_DIR dsh web --no-open"
log "Or: bash install/dsh-m-start.sh"
