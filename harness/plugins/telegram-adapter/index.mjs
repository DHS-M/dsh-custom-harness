#!/usr/bin/env node
/**
 * Telegram sidecar entry. Full implementation modules live under ./lib/.
 * Env: TELEGRAM_BOT_TOKEN, DSH_URL (public harness base URL).
 */
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const token = process.env.TELEGRAM_BOT_TOKEN;
const dshUrl = process.env.DSH_URL || process.env.DSH_PUBLIC_URL;
if (!token) {
  console.error("TELEGRAM_BOT_TOKEN required");
  process.exit(1);
}
if (!dshUrl) {
  console.error("DSH_URL required");
  process.exit(1);
}

console.log("telegram-adapter starting", { dshUrl });
console.log("Wire bot polling in lib/telegram.mjs + lib/dsh.mjs (see README).");
console.log("This entry is a bootstrap; expand handlers from kenqtade/custom migration as needed.");
