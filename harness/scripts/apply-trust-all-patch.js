#!/usr/bin/env node
/** Force DSH cloud trust-all + default opencode provider. See docs/changes/002. */
const fs = require("fs");
const path = require("path");

function roots() {
  return [
    "/usr/lib/node_modules/@deepseek-ai/dsh/node_modules/@deepseek-ai",
    "/usr/local/lib/node_modules/@deepseek-ai/dsh/node_modules/@deepseek-ai",
  ].filter((r) => fs.existsSync(r));
}

function replaceFn(src, name, body) {
  const start = src.indexOf(`function ${name}(`);
  if (start < 0) return src;
  const brace = src.indexOf("{", start);
  let depth = 0, i = brace;
  for (; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}") {
      depth--;
      if (depth === 0) {
        i++;
        break;
      }
    }
  }
  return src.slice(0, start) + body + src.slice(i);
}

for (const r of roots()) {
  const index = path.join(r, "dsh-client-connection/lib/index.js");
  if (fs.existsSync(index)) {
    let s = fs.readFileSync(index, "utf8");
    if (!s.includes("DSH_TRUST_ALL")) {
      s = replaceFn(
        s,
        "isLoopbackHostname",
        "function isLoopbackHostname(hostname) {\n\t/* DSH_TRUST_ALL */\n\treturn true;\n}"
      );
      s = replaceFn(
        s,
        "isTrustedApiRequest",
        "function isTrustedApiRequest(request, trustedHosts) {\n\t/* DSH_TRUST_ALL */\n\treturn true;\n}"
      );
      fs.writeFileSync(index, s);
      console.log("trust server", index);
    }
  }
  const client = path.join(r, "dsh-client-connection/lib/client.js");
  if (fs.existsSync(client)) {
    let s = fs.readFileSync(client, "utf8");
    if (!s.includes("DSH_TRUST_ALL") && s.startsWith("window.__ModuleLoader__.load({")) {
      s = replaceFn(
        s,
        "isLoopbackHostname",
        "function isLoopbackHostname(hostname) {\n\t\t\t/* DSH_TRUST_ALL */\n\t\t\treturn true;\n\t\t}"
      );
      fs.writeFileSync(client, s);
      console.log("trust client");
    }
  }
  const patch = path.join(r, "dsh-base/cordis.patch.yml");
  if (fs.existsSync(patch)) {
    let t = fs.readFileSync(patch, "utf8");
    t = t.replace(
      /provider:\s*deepseek-official\s*\n\s*model:\s*deepseek-v4-flash/,
      "provider: llm-opencode\n        model: big-pickle"
    );
    t = t.replace(
      /- id: llm-deepseek\n\s*name: '@deepseek-ai\/dsh-llm-deepseek'/,
      "- id: llm-deepseek\n      name: '@deepseek-ai/dsh-llm-deepseek'\n      disabled: true"
    );
    if (!t.includes("@custom/llm-opencode")) {
      t = t.replace(
        /(id:\s*llm-pi-ai\s*\n\s*name:\s*'@deepseek-ai\/dsh-llm-pi-ai'\s*\n)/,
        "$1    - id: llm-opencode\n      name: '@custom/llm-opencode'\n    - id: web-search-pi\n      name: '@custom/web-search-pi'\n    - id: telegram-settings\n      name: '@custom/telegram-settings'\n"
      );
    }
    fs.writeFileSync(patch, t);
    console.log("cordis");
  }
}
