import { spawnSync } from "node:child_process";

// Cross-platform env-setting wrapper: node scripts/dev-env.mjs VAR=1 ... -- <command...>
const args = process.argv.slice(2);
const separatorIndex = args.indexOf("--");
const assignments = separatorIndex === -1 ? args : args.slice(0, separatorIndex);
const command = separatorIndex === -1 ? [] : args.slice(separatorIndex + 1);

for (const assignment of assignments) {
  const equalsIndex = assignment.indexOf("=");
  if (equalsIndex === -1) continue;
  process.env[assignment.slice(0, equalsIndex)] = assignment.slice(equalsIndex + 1);
}

const result = spawnSync(command[0], command.slice(1), {
  stdio: "inherit",
  env: process.env,
  shell: process.platform === "win32",
});

process.exit(result.status ?? 1);
