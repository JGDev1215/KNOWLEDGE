import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const requiredDocs = ["AUDIT.md", "FACT_REGISTER.md", "SOURCES.md", "USAGE_TEST_REPORT.md", "RELEASE_READINESS.md"];
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
const provenanceSource = read("src/provenance.ts");

for (const file of knowledgeFiles) {
  assert(provenanceSource.includes(`"${file}"`), `Missing provenance metadata for Knowledge/${file}`);
}

const danteParadise = read("Knowledge/dante_in_paradise.html");
assert(!danteParadise.includes("Imperium"), "Knowledge/dante_in_paradise.html still contains the incorrect term Imperium");
assert(danteParadise.includes("Empyrean"), "Knowledge/dante_in_paradise.html does not contain corrected Empyrean terminology");

const appSource = read("src/App.tsx");
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

const releaseReadiness = read("RELEASE_READINESS.md");
for (const marker of ["Not public-release ready", "Lecture transcript rights", "Missing raw provenance", "Broad lecture claims"]) {
  assert(releaseReadiness.includes(marker), `RELEASE_READINESS.md missing blocker marker: ${marker}`);
}

if (failures.length > 0) {
  console.error("Audit check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Audit check passed for ${knowledgeFiles.length} knowledge pages and ${requiredDocs.length} audit documents.`);
