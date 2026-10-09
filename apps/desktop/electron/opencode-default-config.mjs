import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { globalOpencodeConfigDir } from "@openwork/paths";

/**
 * First-launch seed for the global OpenCode config
 * (~/.config/opencode/opencode.json). Written only when neither
 * opencode.jsonc nor opencode.json exists, so user edits are never
 * overwritten.
 */
const DEFAULT_PROVIDERS = {
  "volcengine-agent-plan": {
    npm: "@ai-sdk/openai",
    name: "Volcano Engine（Responses API）",
    options: {
      baseURL: "https://ark.cn-beijing.volces.com/api/plan/v3",
      apiKey: "{env:ARK_KEY}",
    },
    models: {
      "ark-code-latest": {
        name: "ark-code-latest",
        limit: { context: 256000, output: 32000 },
        modalities: { input: ["text", "image"], output: ["text"] },
      },
    },
  },
  "psbcwm-agent-plan": {
    npm: "@ai-sdk/openai",
    name: "Psbc Wm（Responses API）",
    options: {
      baseURL: "https://ark.cn-beijing.volces.com/api/plan/v3",
      apiKey: "{env:ARK_KEY}",
    },
    models: {
      "psbcwm-code-latest": {
        name: "psbcwm-code-latest",
        limit: { context: 256000, output: 32000 },
        modalities: { input: ["text", "image"], output: ["text"] },
      },
    },
  },
};

export function ensureDefaultOpencodeConfig() {
  const dir = globalOpencodeConfigDir();
  const jsonc = path.join(dir, "opencode.jsonc");
  const json = path.join(dir, "opencode.json");
  if (existsSync(jsonc) || existsSync(json)) return false;

  const config = {
    $schema: "https://opencode.ai/config.json",
    model: "volcengine-agent-plan/ark-code-latest",
    provider: DEFAULT_PROVIDERS,
  };
  mkdirSync(dir, { recursive: true });
  writeFileSync(json, `${JSON.stringify(config, null, 2)}\n`, "utf8");
  return true;
}
