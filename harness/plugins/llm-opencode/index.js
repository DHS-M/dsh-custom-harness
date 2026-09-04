export const name = "llm-opencode";
export const inject = ["llm"];
export function apply(ctx) {
  if (!process.env.OPENCODE_PUBLIC_KEY) process.env.OPENCODE_PUBLIC_KEY = "public";
  ctx.logger.info("llm-opencode active");
}
