import { cpSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Copies the vendored Electron prebuilt binary (lib/better_sqlite3.node) into
// every installed better-sqlite3 package so no Visual Studio toolchain is
// needed on Windows.
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(repoRoot, "lib", "better_sqlite3.node");
const pnpmDir = join(repoRoot, "node_modules", ".pnpm");

if (!existsSync(source)) {
  console.error(`[better-sqlite3] Prebuilt binary not found: ${source}`);
  process.exit(1);
}

if (!existsSync(pnpmDir)) {
  console.warn("[better-sqlite3] node_modules/.pnpm not found; run pnpm install first.");
  process.exit(0);
}

let copied = 0;
for (const entry of readdirSync(pnpmDir)) {
  if (!entry.startsWith("better-sqlite3@")) continue;
  const targetDir = join(pnpmDir, entry, "node_modules", "better-sqlite3", "build", "Release");
  mkdirSync(targetDir, { recursive: true });
  cpSync(source, join(targetDir, "better_sqlite3.node"));
  copied += 1;
}

console.log(`[better-sqlite3] Copied Electron prebuilt binary to ${copied} location(s).`);
