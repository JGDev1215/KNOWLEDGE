const blockers = [
  "Lecture transcript rights are not documented for seven tracked raw scripts.",
  "Great Books #1 and Great Books #5 lack complete raw-source provenance.",
  "Gay Talese material concerns modern copyrighted works and remains citation-only.",
  "Broad lecture claims remain interpretive unless scholarly citations are added.",
];

console.error("Full-app public release is blocked.");
console.error("");
console.error("Use the public-domain release gate instead:");
console.error("  npm run release:verify");
console.error("");
console.error("Blocking evidence is recorded in:");
console.error("  RELEASE_READINESS.md");
console.error("  RIGHTS_CLEARANCE.md");
console.error("  FACT_REGISTER.md");
console.error("");
console.error("Unresolved blockers:");
for (const blocker of blockers) {
  console.error(`- ${blocker}`);
}

process.exit(1);
