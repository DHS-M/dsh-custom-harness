import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const name = "telegram-settings";
export const inject = [];

function home() {
  return process.env.DSH_HOME || "/data/dsh";
}

function cfgPath() {
  return join(home(), "telegram.json");
}

function readCfg() {
  try {
    return JSON.parse(readFileSync(cfgPath(), "utf8"));
  } catch {
    return { token: "", enabled: false, dshUrl: "" };
  }
}

function writeCfg(next) {
  mkdirSync(home(), { recursive: true });
  const merged = { ...readCfg(), ...next, updatedAt: new Date().toISOString() };
  writeFileSync(cfgPath(), JSON.stringify(merged, null, 2));
  return merged;
}

export function apply(ctx) {
  if (process.env.TELEGRAM_BOT_TOKEN && !readCfg().token) {
    writeCfg({
      token: process.env.TELEGRAM_BOT_TOKEN,
      enabled: true,
      dshUrl: process.env.DSH_PUBLIC_URL || process.env.DSH_URL || "",
    });
  }
  try {
    ctx.logger?.info?.(`telegram-settings ready (${cfgPath()})`);
  } catch {}
}
