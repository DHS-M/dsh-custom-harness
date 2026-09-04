/**
 * @custom/llm-opencode
 *
 * OpenCode Zen as a dsh-llm-pi-ai custom provider.
 * Models must be listed in settings.yaml — pi-ai does not auto-pull /v1/models.
 * Install/start runs sync-opencode-models.js to populate the full catalog (60+ ids).
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

export const name = "llm-opencode";
export const inject = ["llm"];

export function apply(ctx) {
  if (!process.env.OPENCODE_PUBLIC_KEY) process.env.OPENCODE_PUBLIC_KEY = "public";

  // Best-effort refresh so long-running processes still get catalog updates
  try {
    const here = dirname(fileURLToPath(import.meta.url));
    const script = join(here, "../../scripts/sync-opencode-models.js");
    spawnSync(process.execPath, [script], {
      env: process.env,
      stdio: "ignore",
      timeout: 25000,
    });
  } catch {}

  try {
    ctx.logger?.info?.("[dsh-m] llm-opencode active (catalog synced from OpenCode /v1/models when possible)");
  } catch {}
}
