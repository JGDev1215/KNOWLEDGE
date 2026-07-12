import { spawnSync } from "node:child_process";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;

function run(command, args, env = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    env: { ...process.env, ...env },
    stdio: "inherit",
    shell: false,
  });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} exited with ${result.status}`);
  }
}

let exitCode = 0;

try {
  run("node", ["scripts/sync-provenance.mjs", "public"]);
  run(join(root, "node_modules", ".bin", "tsc"), [], { VITE_CONTENT_SCOPE: "public-domain" });
  run(join(root, "node_modules", ".bin", "vite"), ["build"], { VITE_CONTENT_SCOPE: "public-domain" });
} catch (error) {
  exitCode = 1;
  console.error(error instanceof Error ? error.message : error);
} finally {
  const restore = spawnSync("node", ["scripts/sync-provenance.mjs", "full"], {
    cwd: root,
    stdio: "inherit",
    shell: false,
  });
  if (restore.status !== 0) {
    exitCode = restore.status || 1;
  }
}

process.exit(exitCode);
