# KNOWLEDGE Audit

Audit date: 2026-07-12  
Repository: `https://github.com/JGDev1215/KNOWLEDGE.git`

## Status

The tracked public source set is now release-cleared. The repository previously contained local-only/uncleared lecture-derived and missing-provenance material; because the GitHub repository is public, that material was removed from tracked source.

## Baseline Checks

| Check | Result | Evidence |
| --- | --- | --- |
| Git remote | Pass | `origin` points to `https://github.com/JGDev1215/KNOWLEDGE.git` |
| Working branch | Pass | `main` tracks `origin/main` |
| Production build | Pass | `npm run build` generates the public-domain-only bundle |
| Dependency audit | Pass | `npm audit --audit-level=moderate` found 0 vulnerabilities |
| Audit invariant check | Pass | `npm run audit:check` passed for 3 knowledge pages and 9 audit documents |
| Full bundle audit | Pass | `npm run audit:full` verifies the complete tracked source bundle |
| Browser usage audit | Pass | `npm run audit:usage` checks library, search, local full-text reader, Open Full Text popup, review, study, not-found behavior, and rendered reader sanitization |
| Public release subset | Pass | `npm run audit:public` builds and verifies the public-domain-only bundle plus public-mode browser workflows |
| Completion gate | Pass | `npm run completion:gate` passes for the tracked public source set |
| CI verification | Pending external permission | `CI_WORKFLOW_TEMPLATE.md` is present, but workflow installation requires GitHub `workflow` permission |

## Tracked Knowledge Pages

| File | Title | Current provenance status |
| --- | --- | --- |
| `Knowledge/divine_comedy.html` + `SourceTexts/divine_comedy.txt` | La Divina Commedia - Dante Alighieri | Public-domain primary text bundled locally; Longfellow source recorded |
| `Knowledge/iliad.html` + `SourceTexts/iliad.txt` | The Iliad - Primary Text Explorer | Public-domain primary text bundled locally; Samuel Butler source recorded |
| `Knowledge/paradise-lost.html` + `SourceTexts/paradise-lost.txt` | Paradise Lost - John Milton | Public-domain primary text bundled locally; Milton source recorded |

## Corrections And Controls

1. `src/content.ts`: reader HTML sanitization removes active controls, embedded documents, inline handlers, inline style attributes, `srcdoc`, and unsafe URL protocols before rendering imported HTML.
2. `src/App.tsx`: flashcard and passage reviews do not update quiz averages; only quiz answers affect quiz scores.
3. `npm run build`: default production build uses the public-domain-only bundle path.
4. `scripts/audit-usage.mjs`: Playwright browser audits cover full tracked source mode and public-domain mode.
5. `RIGHTS_CLEARANCE.md`: records that lecture transcripts, transcript-derived pages, missing-provenance pages, and modern-author lecture material were removed from tracked public source.
6. `COMPLETION_AUDIT.md` and `npm run completion:gate`: record and verify the completion state for the tracked public source set.

## Source References Used

- Project Gutenberg, Dante Divine Comedy Longfellow translation: https://www.gutenberg.org/ebooks/1004
- Project Gutenberg, Iliad Samuel Butler translation: https://www.gutenberg.org/files/2199/2199-h/2199-h.htm
- Project Gutenberg, Paradise Lost: https://www.gutenberg.org/ebooks/20

## Current Verdict

The tracked public source set is fact-audited, usage-audited, release-cleared, and protected by repeatable gates. Future content expansion must add rights/provenance evidence before new source files are tracked.
