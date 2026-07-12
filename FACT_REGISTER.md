# Fact and Provenance Register

Audit date: 2026-07-12

Status meanings:

- `Verified`: supported by a primary or reliable external source.
- `Corrected`: a high-confidence error was fixed.
- `Removed`: removed from tracked public source because the repository lacked sufficient rights/provenance evidence.

| ID | File or control | Claim or content issue | Status | Evidence / source | Required action |
| --- | --- | --- | --- | --- | --- |
| F-001 | `Knowledge/divine_comedy.html` | The page uses Dante's Divine Comedy in Henry Wadsworth Longfellow's translation and identifies it as public domain. | Verified | Project Gutenberg eBook 1004: https://www.gutenberg.org/ebooks/1004 | Shared source recorded in `SOURCES.md`. |
| F-002 | `Knowledge/divine_comedy.html` | The Divine Comedy is divided into Inferno, Purgatorio, and Paradiso and has 100 cantos. | Verified | Project Gutenberg eBook 1004; Museo Casa di Dante overview: https://www.museocasadidante.it/en/dante-alighieri/the-divine-comedy/ | Keep. |
| F-003 | Removed Dante lecture page | Paradise ascent transcript term `Imperium` was previously corrected to `Empyrean`. | Corrected / Removed | Corrected before the lecture-derived page was removed from public source. | Do not reintroduce without source provenance and permission. |
| F-010 | `Knowledge/iliad.html` | Iliad passages are from Samuel Butler's public-domain translation. | Verified | Project Gutenberg Samuel Butler Iliad: https://www.gutenberg.org/files/2199/2199-h/2199-h.htm | Shared source recorded in `SOURCES.md`. |
| F-012 | `Knowledge/paradise-lost.html` | Paradise Lost text is public-domain Milton material. | Verified | Project Gutenberg Paradise Lost: https://www.gutenberg.org/ebooks/20 | Shared source recorded in `SOURCES.md`. |
| F-023 | Build/release scope | The project should have a release-cleared mode that excludes unresolved transcript/mixed/unverified risks. | Verified | `npm run build`, `npm run release:verify`, and `npm run audit:public` use the public-domain-only bundle. | Keep under regression test coverage. |
| F-031 | `package.json` | Default production builds should not include local-only or uncleared material. | Verified | `npm run build` delegates to `scripts/build-public.mjs`; `npm run build:local` uses the same cleared source set after removal; `npm run audit:check` enforces both script definitions. | Keep default build public-domain-only unless fully cleared source is added. |
| F-032 | Removed source material | Lecture transcripts, transcript-derived pages, missing-provenance pages, modern-author lecture material, and local-only interpretation pages should not be distributed from this public repository without evidence. | Removed | Files were removed from tracked public source; `RIGHTS_CLEARANCE.md` records the removal decision. | Do not reintroduce without permission/provenance evidence. |

## Summary

The currently tracked app source is limited to public-domain primary-text works. Prior local-only or uncertain material was removed from tracked public source and must not be reintroduced without recorded rights/provenance evidence.
