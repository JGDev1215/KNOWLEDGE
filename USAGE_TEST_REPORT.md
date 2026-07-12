# Usage Test Report

Test date: 2026-07-12  
Local URL: `http://127.0.0.1:5174/`

## Automated/Observed Checks

| Area | Result | Evidence |
| --- | --- | --- |
| Library load | Pass | Home screen loaded 13 works, 88 sections, 374 passages, and 397 study items with no console errors. |
| Search | Pass | Search for `Dante` returned 44 result cards. |
| Reader route | Pass | `/work/divine-comedy` loaded the reader with section navigation and source content. |
| Completion toggle | Pass | `Mark Complete` changed to `Completed` and persisted after reload. |
| Bookmark toggle | Pass | `Bookmark` changed to `Bookmarked` and persisted after reload. |
| Study flashcard reveal | Pass | `/study/divine-comedy` revealed an answer and advanced from card 1 to card 2. |
| Review dashboard | Pass | Review showed completed, bookmarked, and reviewed counts without console errors. |
| Flashcard scoring fix | Pass | Reviewing a flashcard for `The Anti-Homer` left the progress row at `No quiz score`. |
| Provenance labels | Pass | Library rendered 13 provenance notices; reader rendered warning/source links for Gay Talese material. |
| Release-clearance labels | Pass | `npm run audit:usage` verifies full-mode caution works render "Local-only / not release-cleared" in library, search, reader, and study surfaces; public mode renders no local-only labels. |
| Library clearance grouping | Pass | `npm run audit:usage` verifies the full library groups 3 release-cleared works separately from 10 local-only caution works; public mode renders only the release-cleared group. |
| Search provenance | Pass | Search for `Dante` returned 44 results and visible provenance badges on result cards. |
| All-works study provenance | Pass | `/study` rendered a study-card provenance badge and source links for the current card. |
| Study-card claim caution | Pass | `npm run audit:usage` verifies provenance-sensitive study drills render "Uncertified source check" prompts and "not certified fact unless separately sourced"; public-domain study cards do not render those cautions. |
| In-page caution notes | Pass | Lecture-derived and missing-source/mixed-source pages include visible audit notes distinguishing lecture thesis from certified fact. |
| Browser usage audit | Pass | `npm run audit:usage` verifies library, search, reader, review, study, and `study?work=` compatibility in Chromium. |
| Reader sanitizer audit | Pass | `npm run audit:usage` verifies rendered reader content has no active embedded elements, inline handlers, unsafe protocols, or inline styles. |
| Open Source popup audit | Pass | `npm run audit:usage` verifies `Open Source` opens a blob-backed source document and renders expected source text. |
| Public browser usage audit | Pass | `npm run audit:usage:public` verifies public-domain mode renders only cleared works and excludes blocked lecture/modern material. |
| Audit invariant script | Pass | `npm run audit:check` passed for 13 knowledge pages and 8 audit documents. |
| Full bundle audit | Pass | `npm run audit:full` verified the complete local-study bundle. |
| Public release audit | Pass | `npm run audit:public` built and checked the public-domain-only bundle, then restored full local metadata. |
| Release readiness banner | Pass | Library renders "Not public-release ready" with transcript-rights/source blockers. |
| Build | Pass | `npm run build` completed successfully. |
| Dependency audit | Pass | `npm audit --audit-level=moderate` found 0 vulnerabilities. |

## Issues Found

| ID | Severity | Status | Detail |
| --- | --- | --- | --- |
| U-001 | High | Fixed | Flashcard reviews were recorded in `quizScores`, causing false quiz averages. |
| U-002 | High | Fixed | Imported section HTML was sanitized only partially before rendering with `dangerouslySetInnerHTML`. |
| U-003 | Medium | Fixed | `/study?work=divine-comedy` now resolves to the same selected-work view as `/study/divine-comedy`. |
| U-004 | Low | Fixed | `npm run audit:usage` now verifies the `Open Source` blob popup in Chromium. |
| U-005 | High | Fixed | Source/provenance cautions were previously only in audit documents, not visible during app use. |
| U-006 | High | Fixed | Search results and all-works study cards did not show per-item provenance status. |
| U-007 | High | Fixed | There was no release-cleared build mode excluding unresolved lecture/transcript risks. |
| U-008 | High | Fixed | Public build could leave generated modules in public mode if a shell-command step failed. |
| U-009 | Medium | Fixed | There was no audit proving the full local build still contained all expected local-study material. |
| U-010 | Medium | Fixed | Unsupported lecture claims were labeled in the app shell but not inside the raw source pages themselves. |
| U-011 | High | Fixed | Runtime usage checks were manual-only; the app now has a repeatable Chromium smoke audit. |
| U-012 | High | Fixed | Sanitizer coverage was static only; the browser audit now checks rendered reader content for active/unsafe HTML. |
| U-013 | Low | Fixed | `Open Source` popup behavior was manual-only; the browser audit now verifies the blob source window. |
| U-014 | High | Fixed | Public-domain build had static bundle checks but no browser workflow check; `audit:usage:public` now verifies cleared-mode runtime behavior. |
| U-015 | Medium | Fixed | Generated study drills for provenance-sensitive works could still look like standalone fact cards; their prompts now identify them as uncertified source checks and their source footers say they are not certified fact unless separately sourced. |
| U-016 | Medium | Fixed | Caution works could still appear alongside cleared material without an explicit release-clearance label; they now render "Local-only / not release-cleared" across key app surfaces. |
| U-017 | Medium | Fixed | The library presented cleared and uncleared works in a single flat list; it now separates release-cleared works from local-only caution works. |

## Recommended Next Tests

No remaining usage-specific manual test is required by this report. Remaining project blockers are rights/provenance evidence and scholarly citations where lecture claims need to be treated as fact.
