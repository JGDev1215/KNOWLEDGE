# Completion Audit

Audit date: 2026-07-12

Status: **Full exercise not complete**

This file records the completion gate for the full objective: make the project fact-audited, usage-audited, legitimate, correct, and ready without false confidence.

## Command

```sh
npm run completion:gate
```

This command intentionally fails while required evidence is missing. It is separate from `npm run verify` because `verify` proves the current allowed scope; it does not claim full fact certification or full public-release clearance.

## Requirement Matrix

| Requirement | Current evidence | Status |
| --- | --- | --- |
| Repository setup | `main` tracks `origin/main`; build and verification scripts are present. | Satisfied |
| App usage audit | `USAGE_TEST_REPORT.md` and `scripts/audit-usage.mjs` cover library, search, reader, Open Source popup, review, study, sanitizer behavior, and public-mode workflows. | Satisfied for current allowed scope |
| Public-domain release path | `npm run release:verify` builds and audits the public-domain-only bundle. | Satisfied |
| Full local-study app warning controls | App surfaces provenance, local-only labels, uncertified study prompts, and release-readiness banners. | Satisfied as mitigation |
| Full fact certification | `CLAIM_CITATION_BACKLOG.md` still contains open citation/provenance items. | Blocked |
| Full rights clearance | `RIGHTS_CLEARANCE.md` still records uncleared transcript rights, unknown sources, and modern-material restrictions. | Blocked |
| Full public release | `RELEASE_READINESS.md` says the full app is not public-release ready; `npm run release:full` fails intentionally. | Blocked |
| CI workflow | `CI_WORKFLOW_TEMPLATE.md` is present, but installing `.github/workflows/verify.yml` requires GitHub `workflow` permission. | Pending external permission |

## Blocking Evidence Required

| Blocker | Required evidence |
| --- | --- |
| Transcript rights | Permission, ownership, license, or removal/private-scoping for every lecture transcript and derived page. |
| Great Books #1 and #5 provenance | Raw source origin, edition metadata, and rights/provenance record. |
| Broad lecture claims | Reliable citations, or rewritten/removed claims that no longer read as neutral factual assertions. |
| Modern copyrighted material | Continued citation-only treatment or documented permission for any broader use. |
| CI install | A GitHub token or UI session with `workflow` permission to install the workflow template. |

## Current Gate Decision

The current repository is strong enough for local study with warnings and for the public-domain-only release path. It is not strong enough to mark the whole exercise complete because completion requires evidence that is not present in the repository.

Do not mark the full exercise complete until `npm run completion:gate` exits successfully after the blocking evidence is added and `npm run verify` plus `npm run release:verify` pass.
