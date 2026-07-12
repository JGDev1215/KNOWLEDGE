# KNOWLEDGE

A local React/Vite study library for the HTML knowledge pages and raw lecture scripts in this repository.

## Project Structure

- `src/` - React application, content ingestion, progress storage, and styles.
- `Knowledge/` - Source HTML study pages loaded by the app.
- `RawScripts/` - Original markdown transcript/script material.
- `index.html` - Vite app entry point.

## Setup

```sh
npm install
npm run dev
```

The dev server runs on `127.0.0.1` by default.

## Build

```sh
npm run build
```

The production bundle is generated into `dist/`, which is intentionally ignored by Git. This is the full local-study build, not the public release artifact.

## Public-Domain Build

```sh
npm run release:verify
```

This builds with `VITE_CONTENT_SCOPE=public-domain` and verifies that unresolved lecture-derived, mixed-source, unverified, and modern-author material is excluded from the generated bundle. Use this command, not `npm run build`, before publishing `dist/`.
The build script restores the full local provenance metadata after generating the public bundle.
Do not run full and public builds at the same time; both use generated content/provenance modules.

## Audit Check

```sh
npm run audit:check
npm run audit:full
npm run audit:usage
npm run audit:usage:public
npm run completion:gate
npm run release:full
npm run release:verify
npm run verify
```

This verifies that the audit documents exist, every knowledge page has provenance metadata, and several known correctness fixes remain in place.
`npm run verify` runs the invariant check, full-bundle audit, full browser usage audit, public-bundle audit, public browser usage audit, and dependency audit sequentially.
`npm run completion:gate` intentionally fails until the full exercise has the rights, provenance, and citation evidence needed for full certification.

`CI_WORKFLOW_TEMPLATE.md` contains the GitHub Actions workflow that should be installed with a token or UI session that has GitHub `workflow` permission. The current automation token cannot create workflow files directly.

## Audit

- `AUDIT.md` records the current technical, provenance, and legitimacy audit.
- `FACT_REGISTER.md` tracks verified, corrected, interpretive, and unresolved factual claims.
- `CLAIM_CITATION_BACKLOG.md` tracks the specific unresolved claims that still need scholarly citation, source provenance, or rewording before full fact certification.
- `USAGE_TEST_REPORT.md` records workflow checks and app issues found during testing.
- `SOURCES.md` records source/provenance references for public-domain and lecture-derived material.
- `RELEASE_READINESS.md` records why the project is not yet public-release ready.
- `RIGHTS_CLEARANCE.md` records transcript, missing-source, and modern-material clearance status.
- `RELEASE_GATE.md` records the command and rules for producing a release-approved public-domain artifact.
- `COMPLETION_AUDIT.md` records the full-exercise completion gate and remaining evidence blockers.
- `CI_WORKFLOW_TEMPLATE.md` records the GitHub Actions workflow needed to run `npm run verify` and `npm run release:verify` in CI.
