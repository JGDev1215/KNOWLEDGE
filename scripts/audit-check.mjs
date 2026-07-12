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
for (const marker of ["ClearanceBadge", "Local-only / not release-cleared", "provenance.requiresCaution"]) {
  assert(appSource.includes(marker), `App no longer renders release-clearance marker: ${marker}`);
}
for (const marker of ["LibraryGroup", "Release-cleared works", "Local-only caution works"]) {
  assert(appSource.includes(marker), `App no longer groups library by clearance status: ${marker}`);
}
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
for (const token of ["applyStudyItemCaution", "Uncertified source check", "Provenance caution: not certified fact unless separately sourced"]) {
  assert(contentSource.includes(token), `Study item provenance caution missing token: ${token}`);
}

const factRegister = read("FACT_REGISTER.md");
for (const marker of ["Needs source", "Provenance risk", "Interpretive", "Corrected", "Verified"]) {
  assert(factRegister.includes(marker), `FACT_REGISTER.md missing status marker: ${marker}`);
}
assert(factRegister.includes("CLAIM_CITATION_BACKLOG.md"), "FACT_REGISTER.md no longer points unresolved claims to the citation backlog");
assert(
  factRegister.includes("F-028") &&
    factRegister.includes("Uncertified source check") &&
    factRegister.includes("Provenance caution: not certified fact unless separately sourced"),
  "FACT_REGISTER.md missing study-card caution finding",
);
assert(
  factRegister.includes("F-029") && factRegister.includes("Local-only / not release-cleared"),
  "FACT_REGISTER.md missing local-only release-clearance finding",
);

const claimCitationBacklog = read("CLAIM_CITATION_BACKLOG.md");
for (const marker of [
  "F-005",
  "F-006",
  "F-007",
  "F-008",
  "F-009",
  "F-011",
  "F-014",
  "F-020",
  "Interpretive / needs source",
  "not certified fact",
  "Closure Checklist",
  "npm run verify",
  "npm run release:verify",
]) {
  assert(claimCitationBacklog.includes(marker), `CLAIM_CITATION_BACKLOG.md missing claim-control marker: ${marker}`);
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
for (const marker of ["not public-release ready", "Public-Domain-Only Release Build", "Lecture transcript rights", "Missing raw provenance", "Broad lecture claims", "CLAIM_CITATION_BACKLOG.md", "release:verify"]) {
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
  "npm run release:verify",
]) {
  assert(rightsClearance.includes(marker), `RIGHTS_CLEARANCE.md missing clearance marker: ${marker}`);
}

const usageTestReport = read("USAGE_TEST_REPORT.md");
for (const marker of [
  "Study-card claim caution",
  "Release-clearance labels",
  "U-015",
  "U-016",
  "Uncertified source check",
  "Local-only / not release-cleared",
  "not certified fact unless separately sourced",
]) {
  assert(usageTestReport.includes(marker), `USAGE_TEST_REPORT.md missing usage marker: ${marker}`);
}

for (const marker of ["audit:full", "audit:usage", "audit:usage:public", "audit:public", "completion:gate", "release:full", "release:verify", "verify", "build-public.mjs"]) {
  assert(packageJson.includes(marker), `package.json missing verification marker: ${marker}`);
}

const completionAudit = read("COMPLETION_AUDIT.md");
for (const marker of [
  "Full exercise not complete",
  "npm run completion:gate",
  "Transcript rights",
  "Great Books #1 and #5 provenance",
  "Broad lecture claims",
  "Do not mark the full exercise complete",
]) {
  assert(completionAudit.includes(marker), `COMPLETION_AUDIT.md missing completion marker: ${marker}`);
}

const completionGateScript = read("scripts/completion-gate.mjs");
for (const marker of [
  "Full exercise completion gate: blocked.",
  "RIGHTS_CLEARANCE.md",
  "CLAIM_CITATION_BACKLOG.md",
  "RELEASE_READINESS.md",
  "npm run verify",
  "npm run release:verify",
]) {
  assert(completionGateScript.includes(marker), `completion-gate.mjs missing completion marker: ${marker}`);
}

const releaseGate = read("RELEASE_GATE.md");
for (const marker of ["npm run release:verify", "npm run release:full", "Do not publish", "Public-domain release mode", "RIGHTS_CLEARANCE.md", "CLAIM_CITATION_BACKLOG.md"]) {
  assert(releaseGate.includes(marker), `RELEASE_GATE.md missing release-gate marker: ${marker}`);
}

const fullReleaseBlockScript = read("scripts/release-full-blocked.mjs");
for (const marker of ["Full-app public release is blocked", "npm run release:verify", "Lecture transcript rights", "Great Books #1"]) {
  assert(fullReleaseBlockScript.includes(marker), `release-full-blocked.mjs missing blocker marker: ${marker}`);
}

const ciWorkflowTemplate = read("CI_WORKFLOW_TEMPLATE.md");
for (const marker of ["workflow permission", "npm ci", "npx playwright install --with-deps chromium", "npm run verify", "npm run release:verify"]) {
  assert(ciWorkflowTemplate.includes(marker), `CI_WORKFLOW_TEMPLATE.md missing CI marker: ${marker}`);
}

const usageAuditScript = read("scripts/audit-usage.mjs");
for (const marker of [
  "chromium",
  "vite",
  "Not public-release ready",
  "Public-domain release mode",
  "Lecture-derived",
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
