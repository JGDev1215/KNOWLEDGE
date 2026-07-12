# KNOWLEDGE Audit

Audit date: 2026-07-12  
Audited commit at start: `f62bfeb540d6fe5d5d7a8489c732b95ed359ff0b`  
Repository: `https://github.com/JGDev1215/KNOWLEDGE.git`

## Status

This is an initial correctness and legitimacy audit pass. The project is not yet certified as "100% fact-correct" because several lecture-derived claims are broad interpretations that need either source attribution, wording changes, or explicit labeling as interpretation.

## Baseline Checks

| Check | Result | Evidence |
| --- | --- | --- |
| Git remote | Pass | `origin` points to `https://github.com/JGDev1215/KNOWLEDGE.git` |
| Working branch | Pass | `main` tracks `origin/main` |
| Production build | Pass | `npm run build` completed successfully |
| Dependency audit | Pass | `npm audit --audit-level=moderate` found 0 vulnerabilities |
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

## Legitimacy Risks

| Risk | Severity | Detail | Required resolution |
| --- | --- | --- | --- |
| Lecture-derived opinions presented as facts | High | Several pages quote or convert lecture claims into study cards without clearly marking them as interpretation. | Add source/interpretation labels or rewrite as lecture claims. |
| Modern copyright/provenance | High | Gay Talese material and raw lecture transcripts may not be public-domain. | Confirm ownership/permission for transcripts and avoid copying copyrighted article/book text. |
| Missing source files | Medium | Great Books #1 and #5 lack raw script provenance. | Add source scripts or document source origin. |
| Primary-text translation provenance | Low | Primary pages state public-domain translations; exact source URLs are now centralized in `SOURCES.md`. | Add per-page source blocks if public deployment needs page-level provenance. |
| Source-opening browser automation | Low | Automated click was blocked by the browser security policy for blob/source opening. | Manually verify in a normal browser or add an app-level test seam. |

## Source References Used

- Project Gutenberg, Dante Longfellow translation: https://www.gutenberg.org/ebooks/1004
- Project Gutenberg, Dante Paradise Longfellow translation: https://www.gutenberg.org/ebooks/1003
- Project Gutenberg, Iliad Samuel Butler translation: https://www.gutenberg.org/files/2199/2199-h/2199-h.htm
- Project Gutenberg, Odyssey: https://www.gutenberg.org/ebooks/1728
- Project Gutenberg, Paradise Lost: https://www.gutenberg.org/ebooks/20
- Project Gutenberg, Newton Observations: https://www.gutenberg.org/ebooks/16878
- Penguin Random House Gay Talese author page: https://www.randomhouse.com/kvpa/talese/
- Penguin Random House Talese essays index: https://www.randomhouse.com/kvpa/talese/essays.html

## Current Verdict

The app is technically usable and now safer than the starting state, but the content is not yet fully certified. The remaining work is primarily content provenance and fact wording: separate primary-text facts, lecture interpretations, theological readings, and unsupported causation claims.
