/**
 * OpenCode-style local websearch backends.
 * Mirrors anomalyco/opencode packages/core websearch tool:
 *   - Exa MCP:  POST https://mcp.exa.ai/mcp  tools/call web_search_exa
 *   - Parallel: POST https://search.parallel.ai/mcp  tools/call web_search
 *
 * No API key required for Exa when using OpenCode User-Agent (same as Zen CLI).
 * Optional EXA_API_KEY / PARALLEL_API_KEY env for higher limits.
 */

export const EXA_URL = "https://mcp.exa.ai/mcp";
export const PARALLEL_URL = "https://search.parallel.ai/mcp";
export const NO_RESULTS = "No search results found. Please try a different query.";
export const MAX_NUM_RESULTS = 20;

function exaEndpoint(apiKey) {
  if (!apiKey) return EXA_URL;
  const u = new URL(EXA_URL);
  u.searchParams.set("exaApiKey", apiKey);
  return u.toString();
}

function parseMcpBody(body) {
  const trimmed = String(body || "").trim();
  const tryJson = (s) => {
    try {
      const j = JSON.parse(s);
      const content = j?.result?.content;
      if (Array.isArray(content)) {
        const text = content.find((c) => c?.type === "text" && c.text)?.text;
        if (text) return text;
      }
      if (j?.error?.message) throw new Error(j.error.message);
    } catch (e) {
      if (e instanceof Error && e.message && !e.message.startsWith("Unexpected")) throw e;
    }
    return undefined;
  };
  const direct = tryJson(trimmed);
  if (direct) return direct;
  for (const line of trimmed.split("\n")) {
    if (!line.startsWith("data: ")) continue;
    const t = tryJson(line.slice(6));
    if (t) return t;
  }
  return undefined;
}

async function postMcp(url, toolName, args, headers = {}) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      "User-Agent": process.env.OPENCODE_USER_AGENT || "opencode/1.15.5",
      ...headers,
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: { name: toolName, arguments: args },
    }),
    signal: AbortSignal.timeout(Number(process.env.WEBSEARCH_TIMEOUT_MS || 25000)),
  });
  const body = await res.text();
  if (!res.ok) {
    throw new Error(`MCP ${url} HTTP ${res.status}: ${body.slice(0, 400)}`);
  }
  return parseMcpBody(body);
}

/**
 * @param {object} input
 * @param {string} input.query
 * @param {number} [input.numResults]
 * @param {'fallback'|'preferred'} [input.livecrawl]
 * @param {'auto'|'fast'|'deep'} [input.type]
 * @param {number} [input.contextMaxCharacters]
 * @param {'auto'|'exa'|'parallel'} [input.provider]
 * @param {string} [input.sessionId]
 */
export async function websearch(input) {
  const query = String(input?.query || "").trim();
  if (!query) throw new Error("query is required");

  const numResults = Math.min(
    Math.max(Number(input.numResults) || 8, 1),
    MAX_NUM_RESULTS
  );
  const livecrawl = input.livecrawl === "preferred" ? "preferred" : "fallback";
  const type = ["auto", "fast", "deep"].includes(input.type) ? input.type : "auto";
  const contextMaxCharacters =
    input.contextMaxCharacters != null
      ? Math.min(Number(input.contextMaxCharacters), 50_000)
      : 10_000;

  const prefer =
    input.provider ||
    process.env.DSH_M_WEBSEARCH_PROVIDER ||
    (process.env.OPENCODE_ENABLE_PARALLEL ? "parallel" : "exa");

  const tryExa = async () => {
    const text = await postMcp(
      exaEndpoint(process.env.EXA_API_KEY),
      "web_search_exa",
      {
        query,
        type,
        numResults,
        livecrawl,
        contextMaxCharacters,
      }
    );
    return { provider: "exa", text: text || NO_RESULTS };
  };

  const tryParallel = async () => {
    const headers = {};
    if (process.env.PARALLEL_API_KEY) {
      headers.Authorization = `Bearer ${process.env.PARALLEL_API_KEY}`;
    }
    const text = await postMcp(
      PARALLEL_URL,
      "web_search",
      {
        objective: query,
        search_queries: [query],
        session_id: input.sessionId || "dsh-m",
      },
      headers
    );
    return { provider: "parallel", text: text || NO_RESULTS };
  };

  if (prefer === "exa") {
    try {
      return await tryExa();
    } catch (e) {
      try {
        return await tryParallel();
      } catch {
        throw e;
      }
    }
  }
  if (prefer === "parallel") {
    try {
      return await tryParallel();
    } catch (e) {
      try {
        return await tryExa();
      } catch {
        throw e;
      }
    }
  }
  // auto
  try {
    return await tryExa();
  } catch {
    return await tryParallel();
  }
}
