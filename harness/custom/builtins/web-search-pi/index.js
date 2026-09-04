/** @custom/web-search-pi — web search path independent of official DeepSeek provider. */
export const name = "web-search-pi";
export const inject = ["web"];
export function apply(ctx) {
  try {
    ctx.logger?.info?.("[dsh-m] web-search-pi builtin active");
  } catch {}
}
