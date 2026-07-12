import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

const requiredEvidence = [
  {
    label: "Transcript rights",
    doc: "RIGHTS_CLEARANCE.md",
    blockedMarkers: ["Uncleared", "Great Books #7 transcript", "Great Books #13 transcript"],
    resolution: "Document ownership or publication permission for every tracked lecture transcript, or remove/private-scope the derived material.",
  },
  {
    label: "Missing raw provenance",
    doc: "RIGHTS_CLEARANCE.md",
    blockedMarkers: ["Great Books #1 source", "Unknown"],
    resolution: "Add raw source/provenance records for Great Books #1 and Great Books #5, including edition metadata and rights status.",
  },
  {
    label: "Uncertified factual claims",
    doc: "CLAIM_CITATION_BACKLOG.md",
    blockedMarkers: ["F-005", "F-006", "F-007", "F-008", "F-009", "F-011", "F-020"],
    resolution: "Add reliable citations, reword/remove the claims, or keep them explicitly local-only lecture interpretation.",
  },
  {
    label: "Full-app release status",
    doc: "RELEASE_READINESS.md",
    blockedMarkers: ["Full app not public-release ready", "Not Allowed Without Further Clearance"],
    resolution: "Clear every blocker and then update release readiness, release gate, and provenance metadata.",
  },
];

const verifiedEvidence = [
  "npm run verify validates the current local-study audits, browser usage checks, public-domain release audit, and dependency audit.",
  "npm run release:verify validates the current public-domain-only release path.",
  "npm run release:full intentionally fails while the full app remains blocked.",
];

const openBlockers = requiredEvidence.filter((item) => {
  const source = read(item.doc);
  return item.blockedMarkers.some((marker) => source.includes(marker));
});

console.error("Full exercise completion gate: blocked.");
console.error("");
console.error("Verified current-state evidence:");
for (const line of verifiedEvidence) {
  console.error(`- ${line}`);
}
console.error("");
console.error("Evidence still required before this exercise can be marked complete:");
for (const blocker of openBlockers) {
  console.error(`- ${blocker.label}: ${blocker.resolution} (${blocker.doc})`);
}
console.error("");
console.error("Use these passing commands for the current approved scope:");
console.error("  npm run verify");
console.error("  npm run release:verify");

process.exit(openBlockers.length > 0 ? 1 : 0);
