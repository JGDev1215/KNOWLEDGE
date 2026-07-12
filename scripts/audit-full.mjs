import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const failures = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

const distPath = join(root, "dist");
assert(statSync(distPath, { throwIfNoEntry: false })?.isDirectory(), "dist/ is missing; run build:local first");

const assetsPath = join(distPath, "assets");
const bundleText = [
  read("dist/index.html"),
  ...readdirSync(assetsPath)
    .filter((file) => file.endsWith(".js") || file.endsWith(".css"))
    .map((file) => read(`dist/assets/${file}`)),
].join("\n");

const expectedFullMarkers = [
  "Release-cleared content set",
  "Cleared subset",
  "La Divina Commedia",
  "Local full text bundled in this app",
  "Midway upon the journey of our life",
  "Sing, O goddess, the anger of Achilles",
  "Of Mans First Disobedience",
  "The Iliad",
  "Paradise Lost",
];

for (const marker of expectedFullMarkers) {
  assert(bundleText.includes(marker), `Full build missing expected marker: ${marker}`);
}

for (const marker of ["Lecture-derived interpretation", "Gay Talese", "Great Books #1", "The Anti-Homer", "Dante's Revolution"]) {
  assert(!bundleText.includes(marker), `Full build includes removed/private marker: ${marker}`);
}

if (failures.length > 0) {
  console.error("Full build audit failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Full build audit passed for the complete local-study bundle.");
