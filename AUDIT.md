# KNOWLEDGE Audit

Audit date: 2026-07-12  
Audited commit at start: `f62bfeb540d6fe5d5d7a8489c732b95ed359ff0b`  
Repository: `https://github.com/JGDev1215/KNOWLEDGE.git`

## Status

This is an active correctness and legitimacy audit. The app now visibly labels provenance and interpretation risk, but the project is not yet certified as "100% fact-correct" because several lecture-derived claims still need either source attribution, wording changes, or explicit confirmation of transcript rights.

## Baseline Checks

| Check | Result | Evidence |
| --- | --- | --- |
| Git remote | Pass | `origin` points to `https://github.com/JGDev1215/KNOWLEDGE.git` |
| Working branch | Pass | `main` tracks `origin/main` |
| Production build | Pass | `npm run build` now generates the public-domain-only bundle successfully |
| Dependency audit | Pass | `npm audit --audit-level=moderate` found 0 vulnerabilities |
| Audit invariant check | Pass | `npm run audit:check` passed for 13 knowledge pages and 9 audit documents |
| Full bundle audit | Pass | `npm run audit:full` verifies the full local-study bundle contains all expected caution material |
| Browser usage audit | Pass | `npm run audit:usage` checks library, search, reader, Open Source popup, review, study, and rendered reader sanitization against the built app |
| Public release subset | Pass | `npm run audit:public` builds with public-only generated modules and verifies the public-domain-only bundle plus public-mode browser workflows |
| Full completion gate | Blocked as expected | `npm run completion:gate` intentionally fails until rights, provenance, and citation blockers are cleared |
| CI verification | Pending external permission | `CI_WORKFLOW_TEMPLATE.md` is present, but GitHub rejected direct workflow creation without `workflow` OAuth scope |
| Provenance UI | Pass | Browser check found 13 library provenance notices and reader warnings for modern-author material |
| In-page caution notes | Pass | Lecture-derived and missing-source/mixed-source pages now include visible audit notes enforced by `npm run audit:check` |
| Release readiness | Blocked | `RELEASE_READINESS.md` and the app banner mark the project as not public-release ready |
| Generated files ignored | Pass | `node_modules/`, `dist/`, and `.DS_Store` are ignored |

Build note: Vite reports a large JavaScript chunk warning above 500 kB. This is a performance warning, not a build failure.

## Inventory

Tracked knowledge pages:

| File | Title | Current provenance status |
| --- | --- | --- |
| `Knowledge/dante_in_paradise.html` | Dante in Paradise | Lecture-derived; factual term corrected from `Imperium` to `Empyrean` |
| `Knowledge/dantes_hierarchy_of_hell.html` | Dante's Hierarchy of Hell | Lecture-derived; interpretive theology claims need labels |
| `Knowledge/dantes_la_commedia.html` | Dante's La Commedia | Lecture-derived; interpretive claims need labels |
| `Knowledge/dantes_revolution.html` | Dante's Revolution | Lecture-derived; broad causation claims need sources |
| `Knowledge/divine_comedy.html` | La Divina Commedia - Dante Alighieri | Primary-text page; Longfellow public-domain source indicated |
| `Knowledge/gay_taleses_sparks_of_light.html` | Gay Talese's Sparks of Light | Lecture-derived; modern-author/copyright provenance needs confirmation |
| `Knowledge/great_books_1_secrets_of_the_universe.html` | Great Books #1: Secrets of the Universe | No matching raw script currently tracked |
| `Knowledge/great_books_5_the_odyssey.html` | Great Books #5: The Odyssey | No matching raw script currently tracked |
| `Knowledge/iliad.html` | The Iliad - Primary Text Explorer | Primary-text page; Samuel Butler public-domain source indicated |
| `Knowledge/newton-daniel-study.html` | Newton - Observations upon the Prophecies of Daniel | Primary/theological study page; interpretive claims need labels |
| `Knowledge/paradise-lost.html` | Paradise Lost - John Milton | Primary-text page; public-domain source indicated |
| `Knowledge/the_anti_homer.html` | The Anti-Homer | Lecture-derived; interpretive claims need labels |
| `Knowledge/the_poetry_of_empire.html` | The Poetry of Empire | Lecture-derived; broad causation claims need sources |

Tracked raw scripts:

| File | Maps to |
| --- | --- |
| `RawScripts/ Great Books #7: The Anti-Homer.md` | `Knowledge/the_anti_homer.html` |
| `RawScripts/Great Books #8: The Poetry of Empire.md` | `Knowledge/the_poetry_of_empire.html` |
| `RawScripts/ Great Books #9: Dante's La Commedia.md` | `Knowledge/dantes_la_commedia.html` |
| `RawScripts/Great Books #10: Dante's Hierarchy of Hell.md` | `Knowledge/dantes_hierarchy_of_hell.html` |
| `RawScripts/Great Books #11: Dante's Revolution.md` | `Knowledge/dantes_revolution.html` |
| `RawScripts/Great Books #12: Dante in Paradise.md` | `Knowledge/dante_in_paradise.html` |
| `RawScripts/ Great Books #13: Gay Talese's Sparks of Light.md` | `Knowledge/gay_taleses_sparks_of_light.html` |

Missing raw scripts: Great Books #1 and #5 are represented as HTML pages but do not have matching markdown source files in `RawScripts/`.

## Corrections Made

1. `src/App.tsx`: flashcard and passage reviews no longer update `quizScores`. Only actual quiz answers now affect quiz averages.
2. `src/content.ts`: reader HTML sanitization now removes active controls, embedded documents, inline handlers, inline style attributes, `srcdoc`, and unsafe URL protocols before rendering imported HTML through `dangerouslySetInnerHTML`.
3. `Knowledge/dante_in_paradise.html`: corrected visible Dante terminology from `Imperium` to `Empyrean`.
4. `src/provenance.ts`: added per-work provenance metadata covering all 13 knowledge pages.
5. `src/App.tsx`: library, reader, and selected-work study screens now show visible provenance and caution labels.
6. `scripts/audit-check.mjs`: added repeatable checks for audit files, provenance coverage, known terminology correction, study route compatibility, non-quiz scoring, and sanitizer drift.
7. `RELEASE_READINESS.md`: added explicit release blockers for transcript rights, modern author material, missing raw provenance, and broad lecture claims.
8. `src/App.tsx`: search results and individual study cards now show provenance status, including all-works study mode.
9. `VITE_CONTENT_SCOPE=public-domain`: added a public-domain-only app mode using generated public-only content/provenance modules.
10. `scripts/audit-public.mjs`: added a public release audit that fails if blocked lecture/mixed/unverified markers appear in the public build.
11. `scripts/audit-full.mjs`: added a full bundle audit that fails if full local mode accidentally shrinks to the public subset.
12. `scripts/build-public.mjs`: public builds now restore full mode in a `finally` block even if TypeScript or Vite fails.
13. Lecture-derived and missing-source/mixed-source HTML pages now include in-page audit notes that distinguish quoted lecture theses from certified facts.
14. `RIGHTS_CLEARANCE.md`: added a formal clearance register for transcript rights, missing-source provenance, and modern-author material.
15. `scripts/audit-usage.mjs`: added Playwright browser smoke audits for full mode and public-domain mode, covering library, search, reader, Open Source popup, review/study where applicable, route compatibility, exclusion behavior, and rendered reader sanitization.
16. `RELEASE_GATE.md` and `npm run release:verify`: added an explicit release-approved public-domain artifact gate.
17. `CI_WORKFLOW_TEMPLATE.md`: added the GitHub Actions workflow template for the full verification suite and release gate. Direct workflow creation is pending a GitHub token/session with `workflow` permission.
18. `npm run release:full`: added an intentionally failing full-app release command that prints unresolved blockers.
19. `CLAIM_CITATION_BACKLOG.md`: added a formal claim-control backlog for unresolved factual/citation items that prevent full fact certification.
20. `src/content.ts`: study drills generated from provenance-sensitive works now use "Uncertified source check" prompts and carry "not certified fact unless separately sourced" in their source footer.
21. `src/App.tsx`: caution works now render "Local-only / not release-cleared" across library, search, reader, and study surfaces.
22. `COMPLETION_AUDIT.md` and `npm run completion:gate`: added a formal completion gate that fails until full rights, provenance, and citation evidence is present.
23. `src/App.tsx`: library cards are grouped into release-cleared works and local-only caution works.
24. `package.json`: default `npm run build` now creates the public-domain-only bundle; full local-study builds require `npm run build:local`.

## Legitimacy Risks

| Risk | Severity | Detail | Required resolution |
| --- | --- | --- | --- |
| Lecture-derived opinions presented as facts | Medium | Lecture-derived pages now carry app-level provenance, local-only release labels, separate library grouping, in-page audit notes, study-card source footers, and uncertified source-check drill prompts, but broad claims remain uncited and are tracked in `CLAIM_CITATION_BACKLOG.md`. | Keep as lecture interpretation, remove/reword, or add scholarly citations before treating as fact. |
| Modern copyright/provenance | High | Gay Talese material and raw lecture transcripts may not be public-domain. The app now warns users and `RIGHTS_CLEARANCE.md` records the uncleared status, but rights remain unproven. | Confirm ownership/permission for transcripts and avoid copying copyrighted article/book text. |
| Missing source files | Medium | Great Books #1 and #5 lack raw script provenance. | Add source scripts or document source origin. |
| Primary-text translation provenance | Low | Primary pages state public-domain translations; exact source URLs are now centralized in `SOURCES.md`. | Add per-page source blocks if public deployment needs page-level provenance. |
| Source-opening browser automation | Low | Fixed by `npm run audit:usage`, which verifies the `Open Source` blob popup in Chromium. | Keep under browser audit coverage. |

## Source References Used

- Project Gutenberg, Dante Divine Comedy Longfellow translation: https://www.gutenberg.org/ebooks/1004
- Project Gutenberg, Dante Inferno Longfellow translation: https://www.gutenberg.org/ebooks/1001
- Project Gutenberg, Dante Purgatorio Longfellow translation: https://www.gutenberg.org/ebooks/1002
- Project Gutenberg, Dante Paradiso Longfellow translation: https://www.gutenberg.org/ebooks/1003
- Project Gutenberg, Iliad Samuel Butler translation: https://www.gutenberg.org/files/2199/2199-h/2199-h.htm
- Project Gutenberg, Odyssey Samuel Butler translation: https://www.gutenberg.org/ebooks/1727
- Project Gutenberg, Aeneid John Dryden translation: https://www.gutenberg.org/ebooks/228
- Project Gutenberg, Paradise Lost: https://www.gutenberg.org/ebooks/20
- Project Gutenberg, Newton Observations: https://www.gutenberg.org/ebooks/16878
- Penguin Random House Gay Talese author page: https://www.randomhouse.com/kvpa/talese/
- Penguin Random House Gay Talese essays page: https://www.randomhouse.com/kvpa/talese/essays.html

## Current Verdict

The full app is technically usable, has repeatable audit checks, and warns users about provenance and interpretation risk at point of use and inside lecture-derived or unsupported source pages. The full app is explicitly not public-release ready, and `RIGHTS_CLEARANCE.md` records the unresolved rights evidence. `CLAIM_CITATION_BACKLOG.md` records the unresolved citation work that prevents full fact certification. `COMPLETION_AUDIT.md` records the full-exercise completion gate. A separate public-domain-only build is now available and audited. The remaining work is rights confirmation and scholarly citation if lecture-derived claims need to be treated as fact.
