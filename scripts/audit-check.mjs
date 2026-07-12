import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const requiredDocs = ["AUDIT.md", "FACT_REGISTER.md", "SOURCES.md", "USAGE_TEST_REPORT.md", "RELEASE_READINESS.md", "RIGHTS_CLEARANCE.md"];
const failures = [];

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

for (const doc of requiredDocs) {
  const fullPath = join(root, doc);
  assert(statSync(fullPath, { throwIfNoEntry: false })?.isFile(), `Missing required audit document: ${doc}`);
}

const knowledgeFiles = readdirSync(join(root, "Knowledge")).filter((file) => file.endsWith(".html")).sort();
const provenanceSource = read("src/provenance.full.ts");

for (const file of knowledgeFiles) {
  assert(provenanceSource.includes(`"${file}"`), `Missing full provenance metadata for Knowledge/${file}`);
}

const publicProvenanceSource = read("src/provenance.public.ts");
for (const file of ["divine_comedy.html", "iliad.html", "paradise-lost.html"]) {
  assert(publicProvenanceSource.includes(`"${file}"`), `Missing public provenance metadata for Knowledge/${file}`);
}

const publicContentSource = read("src/content-source.public.ts");
for (const file of ["divine_comedy.html", "iliad.html", "paradise-lost.html"]) {
  assert(publicContentSource.includes(`../Knowledge/${file}`), `Missing public content import for Knowledge/${file}`);
}

const danteParadise = read("Knowledge/dante_in_paradise.html");
assert(!danteParadise.includes("Imperium"), "Knowledge/dante_in_paradise.html still contains the incorrect term Imperium");
assert(danteParadise.includes("Empyrean"), "Knowledge/dante_in_paradise.html does not contain corrected Empyrean terminology");

const inPageCautionMarkers = {
  "Knowledge/dante_in_paradise.html": ["Audit note - lecture thesis", "not certified fact"],
  "Knowledge/dantes_hierarchy_of_hell.html": ["Audit note - lecture thesis", "not certified fact"],
  "Knowledge/dantes_la_commedia.html": ["Audit note - lecture thesis", "not certified fact"],
  "Knowledge/dantes_revolution.html": ["Audit note - lecture thesis", "not certified fact"],
  "Knowledge/the_anti_homer.html": ["Audit note - lecture thesis", "not certified fact"],
  "Knowledge/the_poetry_of_empire.html": ["Audit note - lecture thesis", "not certified fact"],
  "Knowledge/gay_taleses_sparks_of_light.html": ["Audit note - evaluative lecture claim", "do not certify claims like greatest journalist"],
  "Knowledge/great_books_1_secrets_of_the_universe.html": ["Audit note - source not fully documented", "not certified fact"],
  "Knowledge/great_books_5_the_odyssey.html": ["Audit note - mixed source", "not certified fact"],
};

for (const [file, markers] of Object.entries(inPageCautionMarkers)) {
  const source = read(file);
  for (const marker of markers) {
    assert(source.includes(marker), `${file} missing in-page caution marker: ${marker}`);
  }
}

const appSource = read("src/App.tsx");
const packageJson = read("package.json");
assert(
  appSource.includes('item.type === "quiz"') && appSource.includes(": state.quizScores"),
  "Study review logic may again be recording non-quiz reviews as quiz scores",
);
assert(
  appSource.includes('params.get("work")'),
  "Study route no longer supports /study?work=:workId compatibility",
);
assert(
  appSource.includes("ProvenanceNotice") && appSource.includes("provenance.statusLabel"),
  "App no longer renders visible provenance metadata",
);
assert(
  appSource.includes("AuditReadinessBanner") && appSource.includes("Not public-release ready"),
  "App no longer renders the release-readiness blocker",
);
assert(
  appSource.includes("Public-domain release mode") && appSource.includes("VITE_CONTENT_SCOPE"),
  "App no longer exposes the public-domain release mode",
);
assert(
  appSource.includes("currentWork") && appSource.includes("result.work.provenance.statusLabel"),
  "Search or study surfaces may no longer show per-item provenance",
);

const contentSource = read("src/content.ts");
for (const token of ["iframe", "object", "embed", "srcdoc", "!isSafeEmbeddedUrl", "http:", "https:"]) {
  assert(contentSource.includes(token), `Sanitizer/source safety check missing token: ${token}`);
}

const factRegister = read("FACT_REGISTER.md");
for (const marker of ["Needs source", "Provenance risk", "Interpretive", "Corrected", "Verified"]) {
  assert(factRegister.includes(marker), `FACT_REGISTER.md missing status marker: ${marker}`);
}

const sources = read("SOURCES.md");
for (const marker of [
  "https://www.gutenberg.org/ebooks/1001",
  "https://www.gutenberg.org/ebooks/1002",
  "https://www.gutenberg.org/ebooks/1003",
  "https://www.gutenberg.org/ebooks/1004",
  "https://www.gutenberg.org/files/2199/2199-h/2199-h.htm",
  "https://www.gutenberg.org/ebooks/1727",
  "https://www.gutenberg.org/ebooks/228",
  "https://www.gutenberg.org/ebooks/20",
  "https://www.gutenberg.org/ebooks/16878",
  "https://www.randomhouse.com/kvpa/talese/",
  "https://www.randomhouse.com/kvpa/talese/essays.html",
]) {
  assert(sources.includes(marker), `SOURCES.md missing source reference: ${marker}`);
}
assert(!sources.includes("https://www.gutenberg.org/ebooks/1728"), "SOURCES.md still references the wrong Odyssey eBook");

const releaseReadiness = read("RELEASE_READINESS.md");
for (const marker of ["not public-release ready", "Public-Domain-Only Release Build", "Lecture transcript rights", "Missing raw provenance", "Broad lecture claims"]) {
  assert(releaseReadiness.includes(marker), `RELEASE_READINESS.md missing blocker marker: ${marker}`);
}

const rightsClearance = read("RIGHTS_CLEARANCE.md");
for (const marker of [
  "Full-app public release is blocked",
  "Uncleared",
  "Unknown",
  "Great Books #7 transcript",
  "Great Books #13 transcript",
  "Great Books #1 source",
  "Gay Talese modern works",
  "npm run audit:public",
]) {
  assert(rightsClearance.includes(marker), `RIGHTS_CLEARANCE.md missing clearance marker: ${marker}`);
}

for (const marker of ["audit:full", "audit:public", "verify", "build-public.mjs"]) {
  assert(packageJson.includes(marker), `package.json missing verification marker: ${marker}`);
}

const publicBuildScript = read("scripts/build-public.mjs");
for (const marker of ["finally", "sync-provenance.mjs", "full", "public"]) {
  assert(publicBuildScript.includes(marker), `build-public.mjs missing restore marker: ${marker}`);
}

if (failures.length > 0) {
  console.error("Audit check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Audit check passed for ${knowledgeFiles.length} knowledge pages and ${requiredDocs.length} audit documents.`);
