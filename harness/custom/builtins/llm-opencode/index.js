/** @custom/llm-opencode — free OpenCode Zen provider (register via install patch + settings). */
export const name = "llm-opencode";
export const inject = ["llm"];
export function apply(ctx) {
  if (!process.env.OPENCODE_PUBLIC_KEY) process.env.OPENCODE_PUBLIC_KEY = "public";
  try {
    ctx.logger?.info?.("[dsh-m] llm-opencode builtin active");
  } catch {}
}
