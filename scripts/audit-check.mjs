import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const requiredDocs = [
  "AUDIT.md",
  "FACT_REGISTER.md",
  "SOURCES.md",
  "USAGE_TEST_REPORT.md",
  "RELEASE_READINESS.md",
  "RIGHTS_CLEARANCE.md",
  "RELEASE_GATE.md",
  "CLAIM_CITATION_BACKLOG.md",
  "COMPLETION_AUDIT.md",
];
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
const expectedKnowledgeFiles = ["divine_comedy.html", "iliad.html", "paradise-lost.html"];
assert(
  JSON.stringify(knowledgeFiles) === JSON.stringify(expectedKnowledgeFiles),
  `Tracked Knowledge files must remain release-cleared only: ${knowledgeFiles.join(", ")}`,
);

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

const removedPublicSourceFiles = [
  "Knowledge/dante_in_paradise.html",
  "Knowledge/dantes_hierarchy_of_hell.html",
  "Knowledge/dantes_la_commedia.html",
  "Knowledge/dantes_revolution.html",
  "Knowledge/gay_taleses_sparks_of_light.html",
  "Knowledge/great_books_1_secrets_of_the_universe.html",
  "Knowledge/great_books_5_the_odyssey.html",
  "Knowledge/newton-daniel-study.html",
  "Knowledge/the_anti_homer.html",
  "Knowledge/the_poetry_of_empire.html",
  "RawScripts/ Great Books #13: Gay Talese's Sparks of Light.md",
  "RawScripts/ Great Books #7: The Anti-Homer.md",
  "RawScripts/ Great Books #9: Dante's La Commedia.md",
  "RawScripts/Great Books #10: Dante's Hierarchy of Hell.md",
  "RawScripts/Great Books #11: Dante's Revolution.md",
  "RawScripts/Great Books #12: Dante in Paradise.md",
  "RawScripts/Great Books #8: The Poetry of Empire.md",
];

for (const file of removedPublicSourceFiles) {
  assert(!statSync(join(root, file), { throwIfNoEntry: false })?.isFile(), `Removed local-only source file is tracked again: ${file}`);
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
for (const marker of ["ClearanceBadge", "Local-only / not release-cleared", "provenance.requiresCaution"]) {
  assert(appSource.includes(marker), `App no longer renders release-clearance marker: ${marker}`);
}
for (const marker of ["LibraryGroup", "Release-cleared works", "Local-only caution works"]) {
  assert(appSource.includes(marker), `App no longer groups library by clearance status: ${marker}`);
}
assert(
  appSource.includes("AuditReadinessBanner") && appSource.includes("Release-cleared content set"),
  "App no longer renders the release-cleared readiness state",
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
for (const token of ["applyStudyItemCaution", "Uncertified source check", "Provenance caution: not certified fact unless separately sourced"]) {
  assert(contentSource.includes(token), `Study item provenance caution missing token: ${token}`);
}

const factRegister = read("FACT_REGISTER.md");
for (const marker of ["Removed", "Verified", "Corrected"]) {
  assert(factRegister.includes(marker), `FACT_REGISTER.md missing status marker: ${marker}`);
}
assert(
  factRegister.includes("F-031") && factRegister.includes("Default production builds should not include local-only or uncleared material"),
  "FACT_REGISTER.md missing safe default build finding",
);
assert(factRegister.includes("F-032") && factRegister.includes("removed from tracked public source"), "FACT_REGISTER.md missing removed-source finding");

const claimCitationBacklog = read("CLAIM_CITATION_BACKLOG.md");
for (const marker of [
  "No Open Citation / Provenance Blockers",
  "Removed Material History",
  "removed from tracked public source",
  "Do not reintroduce",
]) {
  assert(claimCitationBacklog.includes(marker), `CLAIM_CITATION_BACKLOG.md missing claim-control marker: ${marker}`);
}

const sources = read("SOURCES.md");
for (const marker of [
  "https://www.gutenberg.org/ebooks/1004",
  "https://www.gutenberg.org/files/2199/2199-h/2199-h.htm",
  "https://www.gutenberg.org/ebooks/20",
]) {
  assert(sources.includes(marker), `SOURCES.md missing source reference: ${marker}`);
}
assert(!sources.includes("https://www.gutenberg.org/ebooks/1728"), "SOURCES.md still references the wrong Odyssey eBook");

const releaseReadiness = read("RELEASE_READINESS.md");
for (const marker of ["Release-cleared for the tracked public source set", "Release Build", "removed from tracked public source", "release:verify"]) {
  assert(releaseReadiness.includes(marker), `RELEASE_READINESS.md missing blocker marker: ${marker}`);
}

const rightsClearance = read("RIGHTS_CLEARANCE.md");
for (const marker of [
  "Removed from public repo",
  "Lecture transcripts",
  "Transcript-derived study pages",
  "Missing-provenance pages",
  "Do not reintroduce",
  "npm run release:verify",
]) {
  assert(rightsClearance.includes(marker), `RIGHTS_CLEARANCE.md missing clearance marker: ${marker}`);
}

const usageTestReport = read("USAGE_TEST_REPORT.md");
for (const marker of [
  "Removed local-only source material",
  "U-018",
  "U-019",
  "Safe default build",
]) {
  assert(usageTestReport.includes(marker), `USAGE_TEST_REPORT.md missing usage marker: ${marker}`);
}

for (const marker of ["audit:full", "audit:usage", "audit:usage:public", "audit:public", "completion:gate", "release:full", "release:verify", "verify", "build-public.mjs"]) {
  assert(packageJson.includes(marker), `package.json missing verification marker: ${marker}`);
}
assert(packageJson.includes('"build": "node scripts/build-public.mjs"'), "package.json default build must remain public-domain-only");
assert(packageJson.includes('"build:local": "node scripts/sync-provenance.mjs full && tsc && vite build"'), "package.json missing explicit full local-study build");
assert(packageJson.includes('"audit:full": "npm run build:local && node scripts/audit-full.mjs"'), "audit:full must use the explicit full local-study build");

const completionAudit = read("COMPLETION_AUDIT.md");
for (const marker of [
  "Full exercise complete for the tracked public source set",
  "npm run completion:gate",
  "Removed Material Rule",
  "Satisfied",
]) {
  assert(completionAudit.includes(marker), `COMPLETION_AUDIT.md missing completion marker: ${marker}`);
}

const completionGateScript = read("scripts/completion-gate.mjs");
for (const marker of [
  "Full exercise completion gate: passed.",
  "RIGHTS_CLEARANCE.md",
  "npm run verify",
  "npm run release:verify",
]) {
  assert(completionGateScript.includes(marker), `completion-gate.mjs missing completion marker: ${marker}`);
}

const releaseGate = read("RELEASE_GATE.md");
for (const marker of ["npm run release:verify", "npm run build", "npm run release:full", "Public-domain release mode", "RIGHTS_CLEARANCE.md"]) {
  assert(releaseGate.includes(marker), `RELEASE_GATE.md missing release-gate marker: ${marker}`);
}

const ciWorkflowTemplate = read("CI_WORKFLOW_TEMPLATE.md");
for (const marker of ["workflow permission", "npm ci", "npx playwright install --with-deps chromium", "npm run verify", "npm run release:verify"]) {
  assert(ciWorkflowTemplate.includes(marker), `CI_WORKFLOW_TEMPLATE.md missing CI marker: ${marker}`);
}

const usageAuditScript = read("scripts/audit-usage.mjs");
for (const marker of [
  "chromium",
  "vite",
  "Release-cleared content set",
  "Public-domain release mode",
  "Review dashboard",
  "runPublicUsageAudit",
  "assertSanitizedReaderContent",
  "assertOpenSourcePopup",
]) {
  assert(usageAuditScript.includes(marker), `audit-usage.mjs missing workflow marker: ${marker}`);
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
