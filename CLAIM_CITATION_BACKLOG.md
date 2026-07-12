# Claim Citation Backlog

Audit date: 2026-07-12

This backlog controls claims that cannot yet be certified as neutral fact from the evidence tracked in this repository. A claim can leave this file only after the repository records enough source evidence to support it, or after the claim is removed/reworded so it no longer reads as an uncited factual assertion.

## Rules

1. `Interpretive / needs source` claims remain lecture thesis material unless a reliable citation is added to `SOURCES.md` and the relevant page/provenance metadata is updated.
2. Hyperbolic claims may remain only as clearly labeled lecture interpretation, not as literal certified fact.
3. Missing-provenance pages stay private/local-study only until the raw source, edition metadata, or permission trail is documented.
4. Rights-clearance blockers are tracked in `RIGHTS_CLEARANCE.md`; this file tracks factual and source-citation blockers.
5. Any closure must update `FACT_REGISTER.md`, `SOURCES.md`, in-page audit notes, and the relevant provenance metadata before the item is marked resolved.

## Open Citation Items

| ID | Location | Claim or issue | Current treatment | Evidence needed for certification |
| --- | --- | --- | --- | --- |
| F-005 | `Knowledge/dante_in_paradise.html` | "There have been three great poets" and "Dante will end the Dark Ages." | In-page audit note; lecture thesis only; not certified fact. | Scholarly literary-history source for the ranking and historical-impact framing, or reword/remove the claim. |
| F-006 | `Knowledge/dantes_revolution.html` | Dante's Comedy gave rise to the Reformation, Scientific Revolution, Enlightenment, Renaissance, and modernity itself. | In-page audit note; broad causation claim remains uncited. | Multiple reliable scholarly sources supporting the specific causation chain, or reframe as a lecture argument. |
| F-007 | `Knowledge/the_poetry_of_empire.html` | Dante "destroy[ed] the Roman Empire and the Catholic Church" with The Divine Comedy. | In-page audit note; hyperbolic lecture thesis only. | Scholarly source supporting a literal version of the claim, or retain only as marked rhetorical interpretation. |
| F-008 | `Knowledge/the_poetry_of_empire.html` | Virgil's Aeneid is "anti-Homer" and responds to Iliad/Odyssey. | In-page audit note and primary-text sources; interpretive claim only. | Classical-scholarship citation if the page wants to present the framing as established fact. |
| F-009 | `Knowledge/the_anti_homer.html` | Homer becomes the basis/infrastructure of Greek civilization. | In-page audit note; broad historical claim remains interpretive. | Classical-scholarship citation for the civilization-scale claim, or narrower wording. |
| F-011 | `Knowledge/great_books_5_the_odyssey.html` | Odyssey page provenance is not backed by a tracked raw script. | Mixed-source page; not public-release eligible. | Raw script/source origin, edition metadata, and rights/provenance record. |
| F-014 | `Knowledge/newton-daniel-study.html` | Prophetic chronology and identification claims are Newton's theological interpretations. | Treated as Newton's interpretation, not modern historical consensus. | Keep labels wherever summarized; add secondary scholarship only if making broader claims about reception or historical accuracy. |
| F-020 | `Knowledge/great_books_1_secrets_of_the_universe.html` | Page has no matching raw script or source register entry beyond local HTML. | Missing-source page; not public-release eligible. | Raw script/source origin, edition metadata, and rights/provenance record. |

## Closure Checklist

Before any item is removed from this backlog:

- Add or correct the source in `SOURCES.md`.
- Update the row in `FACT_REGISTER.md` from unresolved status to the correct resolved status.
- Update any affected in-page audit note so the user sees the right caution level.
- Update `src/provenance.full.ts` and `src/provenance.public.ts` if release scope changes.
- Run `npm run verify` and `npm run release:verify`.

Until these checks pass, the full app must not be described as 100% fact-certified.
