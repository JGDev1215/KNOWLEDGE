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
assert(statSync(distPath, { throwIfNoEntry: false })?.isDirectory(), "dist/ is missing; run build first");

const assetsPath = join(distPath, "assets");
const bundleText = [
  read("dist/index.html"),
  ...readdirSync(assetsPath)
    .filter((file) => file.endsWith(".js") || file.endsWith(".css"))
    .map((file) => read(`dist/assets/${file}`)),
].join("\n");

const expectedFullMarkers = [
  "Not public-release ready",
  "Lecture-derived interpretation",
  "Lecture-derived modern-author material",
  "Source not fully documented",
  "Primary text plus missing local source",
  "La Divina Commedia",
  "Gay Talese",
  "Great Books #1: Secrets of the Universe",
  "The Anti-Homer",
  "The Poetry of Empire",
  "Dante's Revolution",
  "Paradise Lost",
];

for (const marker of expectedFullMarkers) {
  assert(bundleText.includes(marker), `Full build missing expected marker: ${marker}`);
}

if (failures.length > 0) {
  console.error("Full build audit failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Full build audit passed for the complete local-study bundle.");
