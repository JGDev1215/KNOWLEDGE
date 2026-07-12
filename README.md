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

The production bundle is generated into `dist/`, which is intentionally ignored by Git.

## Public-Domain Build

```sh
npm run audit:public
```

This builds with `VITE_CONTENT_SCOPE=public-domain` and verifies that unresolved lecture-derived, mixed-source, unverified, and modern-author material is excluded from the generated bundle.
The build script restores the full local provenance metadata after generating the public bundle.
Do not run full and public builds at the same time; both use generated content/provenance modules.

## Audit Check

```sh
npm run audit:check
npm run audit:full
npm run verify
```

This verifies that the audit documents exist, every knowledge page has provenance metadata, and several known correctness fixes remain in place.
`npm run verify` runs the invariant check, full-bundle audit, public-bundle audit, and dependency audit sequentially.

## Audit

- `AUDIT.md` records the current technical, provenance, and legitimacy audit.
- `FACT_REGISTER.md` tracks verified, corrected, interpretive, and unresolved factual claims.
- `USAGE_TEST_REPORT.md` records workflow checks and app issues found during testing.
- `SOURCES.md` records source/provenance references for public-domain and lecture-derived material.
- `RELEASE_READINESS.md` records why the project is not yet public-release ready.
- `RIGHTS_CLEARANCE.md` records transcript, missing-source, and modern-material clearance status.
