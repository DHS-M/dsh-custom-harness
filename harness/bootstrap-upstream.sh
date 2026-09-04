#!/usr/bin/env bash
# Clone DeepSeek Harness into harness/src and strip unused bulk.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
SRC="$ROOT/src"
REPO_URL="${DSH_UPSTREAM_URL:-https://github.com/deepseek-ai/deepseek-harness.git}"
BRANCH="${DSH_UPSTREAM_BRANCH:-master}"

if [ -d "$SRC/.git" ]; then
  echo "harness/src already present; fetch latest..."
  git -C "$SRC" fetch --depth 1 origin "$BRANCH"
  git -C "$SRC" checkout "origin/$BRANCH"
else
  rm -rf "$SRC"
  git clone --depth 1 --branch "$BRANCH" "$REPO_URL" "$SRC"
fi

# Remove paths not needed for our cloud customization work
rm -rf \
  "$SRC/website" \
  "$SRC/snapshots" \
  "$SRC/packages/experimental" \
  "$SRC/packages/test-support" \
  "$SRC/.agents" \
  "$SRC/.claude" \
  "$SRC/BENCHMARK.md" \
  "$SRC/BRAND_GUIDELINES.md" \
  "$SRC/BRAND_GUIDELINES.zh.md" \
  "$SRC/BRAND_GUIDELINES.i18n.yaml" \
  2>/dev/null || true

if [ "${DSH_KEEP_TESTS:-0}" != "1" ]; then
  find "$SRC" -type f \( -name '*.test.ts' -o -name '*.test.tsx' -o -name '*.spec.ts' \) -delete 2>/dev/null || true
  find "$SRC" -type d -name '__tests__' -prune -exec rm -rf {} + 2>/dev/null || true
fi

echo "Upstream ready at harness/src"
ls "$SRC"/README.md "$SRC"/LICENSE 2>/dev/null || true
