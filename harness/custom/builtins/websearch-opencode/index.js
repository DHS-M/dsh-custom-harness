/**
 * @custom/websearch-opencode — dsh-m builtin
 *
 * OpenCode's built-in websearch is NOT model-hosted search; it is a local tool that
 * POSTs JSON-RPC tools/call to Exa MCP (default) or Parallel MCP.
 * Source reference: anomalyco/opencode packages/core/src/tool/websearch.ts
 *
 * This plugin exposes the same backends to DeepSeek Harness via ctx.tools when available.
 */
import { websearch, NO_RESULTS } from "./search.js";

export const name = "websearch-opencode";
export const inject = [];

const TOOL_DESCRIPTION = `Search the web using OpenCode-compatible backends (Exa MCP primary, Parallel MCP fallback).
Use for current information beyond knowledge cutoff.
Optional: numResults (default 8, max 20), livecrawl (fallback|preferred), type (auto|fast|deep),
contextMaxCharacters (default 10000). The current year is ${new Date().getFullYear()}.`;

function registerTool(ctx) {
  const tools = ctx.tools || ctx.tool;
  if (!tools || typeof tools.register !== "function") {
    ctx.logger?.warn?.( 
      "[dsh-m] websearch-opencode: no ctx.tools.register — search API available via import('@custom/websearch-opencode/search')"
    );
    return false;
  }

  const def = {
    name: "websearch",
    description: TOOL_DESCRIPTION,
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "Websearch query" },
        numResults: { type: "number", description: "Results to return (default 8, max 20)" },
        livecrawl: {
          type: "string",
          enum: ["fallback", "preferred"],
          description: "Live crawl mode",
        },
        type: {
          type: "string",
          enum: ["auto", "fast", "deep"],
          description: "Search type",
        },
        contextMaxCharacters: {
          type: "number",
          description: "Max context characters (default 10000)",
        },
        provider: {
          type: "string",
          enum: ["auto", "exa", "parallel"],
          description: "Backend override",
        },
      },
      required: ["query"],
    },
    async execute(args, context) {
      try {
        const out = await websearch({
          ...args,
          sessionId: context?.sessionID || context?.sessionId || "dsh-m",
        });
        return out.text || NO_RESULTS;
      } catch (e) {
        return `Unable to search the web for ${args?.query}: ${e?.message || e}`;
      }
    },
  };

  try {
    tools.register(def);
    return true;
  } catch {
    try {
      tools.register({ websearch: def });
      return true;
    } catch (e2) {
      ctx.logger?.warn?.("[dsh-m] websearch-opencode register failed: " + (e2?.message || e2));
      return false;
    }
  }
}

export function apply(ctx) {
  const ok = registerTool(ctx);
  ctx.logger?.info?.(
    `[dsh-m] websearch-opencode active (tool=${ok ? "registered" : "api-only"})`
  );

  // Always expose programmatic search on ctx for other plugins
  try {
    ctx.set?.("websearchOpencode", { search: websearch });
  } catch {}
}

export { websearch, NO_RESULTS };
