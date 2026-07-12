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
assert(statSync(distPath, { throwIfNoEntry: false })?.isDirectory(), "dist/ is missing; run build:public first");

const assetsPath = join(distPath, "assets");
const bundleText = [
  read("dist/index.html"),
  ...readdirSync(assetsPath)
    .filter((file) => file.endsWith(".js") || file.endsWith(".css"))
    .map((file) => read(`dist/assets/${file}`)),
].join("\n");

const requiredPublicMarkers = [
  "Public-domain release mode",
  "Cleared subset",
  "La Divina Commedia",
  "The Iliad",
  "Paradise Lost",
];

for (const marker of requiredPublicMarkers) {
  assert(bundleText.includes(marker), `Public build missing expected marker: ${marker}`);
}

const blockedMarkers = [
  "Lecture-derived interpretation",
  "Lecture-derived modern-author material",
  "Source not fully documented",
  "Primary text plus missing local source",
  "Gay Talese",
  "Secrets of the Universe",
  "The Anti-Homer",
  "The Poetry of Empire",
  "Dante's Revolution",
];

for (const marker of blockedMarkers) {
  assert(!bundleText.includes(marker), `Public build includes blocked marker: ${marker}`);
}

if (failures.length > 0) {
  console.error("Public release audit failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Public release audit passed for the public-domain-only build.");
