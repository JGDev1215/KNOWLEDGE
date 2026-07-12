# Usage Test Report

Test date: 2026-07-12

## Automated/Observed Checks

| Area | Result | Evidence |
| --- | --- | --- |
| Library load | Pass | Browser usage audit verifies the home screen renders 3 release-cleared works. |
| Search | Pass | Search for `Dante` returns public-domain primary-text results. |
| Reader route | Pass | `/work/divine-comedy` loads the reader with section navigation and locally bundled full source text. |
| Completion toggle | Pass | `Mark Complete` changes to `Completed` and appears in review. |
| Bookmark toggle | Pass | `Bookmark` changes to `Bookmarked` and appears in review. |
| Study flashcard reveal | Pass | `/study/divine-comedy` reveals an answer and advances. |
| Review dashboard | Pass | Review shows completed, bookmarked, and reviewed counts without console errors. |
| Provenance labels | Pass | Library, search, reader, and study surfaces render public-domain provenance labels. |
| Library clearance grouping | Pass | `npm run audit:usage` verifies only the release-cleared group renders in the tracked source set. |
| Removed local-only source material | Pass | `npm run audit:usage` verifies removed Gay Talese/Dante local-only routes are not found; `npm run audit:check` verifies removed files are absent. |
| Safe default build | Pass | `npm run build` creates the public-domain-only bundle; no tracked local-only source remains. |
| Browser usage audit | Pass | `npm run audit:usage` verifies library, search, reader, review, study, and `study?work=` not-found behavior in Chromium. |
| Reader sanitizer audit | Pass | `npm run audit:usage` verifies rendered reader content has no active embedded elements, inline handlers, unsafe protocols, or inline styles. |
| Open Full Text popup audit | Pass | `npm run audit:usage` verifies `Open Full Text` opens a blob-backed source document and renders expected bundled source text. |
| Public browser usage audit | Pass | `npm run audit:usage:public` verifies public-domain mode renders only cleared works. |
| Audit invariant script | Pass | `npm run audit:check` passed for 3 knowledge pages and 9 audit documents. |
| Full bundle audit | Pass | `npm run audit:full` verified the complete tracked source bundle. |
| Public release audit | Pass | `npm run audit:public` built and checked the public-domain-only bundle, then restored cleared metadata. |
| Build | Pass | `npm run build` completed successfully and passed `scripts/audit-public.mjs`. |
| Dependency audit | Pass | `npm audit --audit-level=moderate` found 0 vulnerabilities. |

## Issues Found

| ID | Severity | Status | Detail |
| --- | --- | --- | --- |
| U-001 | High | Fixed | Flashcard reviews were recorded in `quizScores`, causing false quiz averages. |
| U-002 | High | Fixed | Imported section HTML was sanitized only partially before rendering with `dangerouslySetInnerHTML`. |
| U-003 | Medium | Fixed | `/study?work=divine-comedy` resolves to the same selected-work view as `/study/divine-comedy`. |
| U-004 | Low | Fixed | `npm run audit:usage` verifies the `Open Full Text` blob popup in Chromium. |
| U-014 | High | Fixed | Public-domain build had static bundle checks but no browser workflow check; `audit:usage:public` now verifies cleared-mode runtime behavior. |
| U-018 | High | Fixed | The default production build previously generated the full local-study bundle; it now generates the public-domain-only bundle. |
| U-019 | High | Fixed | The public repository previously tracked local-only/uncleared source material; those files were removed from tracked public source. |

## Recommended Next Tests

No remaining usage-specific manual test is required by this report. Any future content expansion must add source provenance and rights evidence before files are tracked.
