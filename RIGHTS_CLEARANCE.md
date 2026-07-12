# Rights Clearance Register

Audit date: 2026-07-12

This register records whether each source category has enough evidence for public distribution. It is not legal advice. It is a project control document for deciding what can be shipped from this repository.

## Current Decision

The repository is public. To keep the public repo legitimate, local lecture transcripts, transcript-derived HTML pages, missing-provenance study pages, and modern-author lecture material have been removed from tracked public source.

The current release path is the public-domain-only bundle produced by:

```sh
npm run release:verify
```

`npm run build` uses the same public-domain-only content set. `npm run build:local` currently builds the same cleared source set because no private/local-only source files remain tracked in this public repository.

## Public Source Scope

| Category | Current status | Evidence currently in repo | Release decision |
| --- | --- | --- | --- |
| Public-domain primary texts | Cleared for repository release | `SOURCES.md` records Project Gutenberg sources for Dante, Homer, and Milton. | Included in app and release bundle. |
| Lecture transcripts | Removed from public repo | Previously tracked raw scripts were removed because ownership/permission was not documented. | Not included in tracked source or release bundle. |
| Transcript-derived study pages | Removed from public repo | Previously tracked local-only HTML pages were removed with their source transcripts. | Not included in tracked source or release bundle. |
| Missing-provenance pages | Removed from public repo | Great Books #1 and #5 pages were removed because raw source provenance was missing. | Not included in tracked source or release bundle. |
| Modern-author lecture material | Removed from public repo | Gay Talese lecture page and raw transcript were removed; external source URLs may remain only as audit history. | Not included in tracked source or release bundle. |

## Removed Local-Only Material

The following material was removed from tracked public source:

- `RawScripts/ Great Books #7: The Anti-Homer.md`
- `RawScripts/Great Books #8: The Poetry of Empire.md`
- `RawScripts/ Great Books #9: Dante's La Commedia.md`
- `RawScripts/Great Books #10: Dante's Hierarchy of Hell.md`
- `RawScripts/Great Books #11: Dante's Revolution.md`
- `RawScripts/Great Books #12: Dante in Paradise.md`
- `RawScripts/ Great Books #13: Gay Talese's Sparks of Light.md`
- `Knowledge/the_anti_homer.html`
- `Knowledge/the_poetry_of_empire.html`
- `Knowledge/dantes_la_commedia.html`
- `Knowledge/dantes_hierarchy_of_hell.html`
- `Knowledge/dantes_revolution.html`
- `Knowledge/dante_in_paradise.html`
- `Knowledge/gay_taleses_sparks_of_light.html`
- `Knowledge/great_books_1_secrets_of_the_universe.html`
- `Knowledge/great_books_5_the_odyssey.html`
- `Knowledge/newton-daniel-study.html`

## Rule

Do not reintroduce transcript-derived, missing-provenance, or modern copyrighted source material into this public repository unless written permission, ownership evidence, a license grant, or public-domain status is recorded first.
