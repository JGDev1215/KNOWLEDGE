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
| Build | Pass | `npm run build` completed successfully. |
| Dependency audit | Pass | `npm audit --audit-level=moderate` found 0 vulnerabilities. |

## Issues Found

| ID | Severity | Status | Detail |
| --- | --- | --- | --- |
| U-001 | High | Fixed | Flashcard reviews were recorded in `quizScores`, causing false quiz averages. |
| U-002 | High | Fixed | Imported section HTML was sanitized only partially before rendering with `dangerouslySetInnerHTML`. |
| U-003 | Medium | Fixed | `/study?work=divine-comedy` now resolves to the same selected-work view as `/study/divine-comedy`. |
| U-004 | Low | Needs manual verification | Browser automation blocked the `Open Source` blob-window click under its security policy. |

## Recommended Next Tests

1. Add repeatable Playwright tests for library, search, reader, study, and review.
2. Add a unit test or browser test proving unsafe imported HTML is stripped before reader rendering.
3. Add a route test covering both `/study/:workId` and `/study?work=:workId`.
4. Manually verify `Open Source` in a normal browser session.
