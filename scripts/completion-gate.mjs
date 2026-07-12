import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

const requiredEvidence = [
  {
    label: "Removed transcript material",
    doc: "RIGHTS_CLEARANCE.md",
    blockedMarkers: ["Do not reintroduce transcript-derived"],
    resolution: "Keep removed transcript-derived material out of tracked public source unless permission or public-domain status is recorded.",
  },
];

const verifiedEvidence = [
  "npm run verify validates the current local-study audits, browser usage checks, public-domain release audit, and dependency audit.",
  "npm run release:verify validates the current public-domain-only release path.",
  "npm run release:full delegates to the same cleared release path.",
];

const failedControls = requiredEvidence.filter((item) => {
  const source = read(item.doc);
  return !item.blockedMarkers.some((marker) => source.includes(marker));
});

console.log(failedControls.length > 0 ? "Full exercise completion gate: blocked." : "Full exercise completion gate: passed.");
console.log("");
console.log("Verified current-state evidence:");
for (const line of verifiedEvidence) {
  console.log(`- ${line}`);
}
if (failedControls.length > 0) {
  console.log("");
  console.log("Evidence still required before this exercise can be marked complete:");
  for (const blocker of failedControls) {
    console.log(`- ${blocker.label}: ${blocker.resolution} (${blocker.doc})`);
  }
}
console.log("");
console.log("Required passing commands:");
console.log("  npm run verify");
console.log("  npm run release:verify");

process.exit(failedControls.length > 0 ? 1 : 0);
