# Claim Citation Backlog

Audit date: 2026-07-12

This backlog controls claims and source gaps that cannot yet be certified as neutral fact from the evidence tracked in this repository. A claim can leave the open blocker table only after the repository records enough source evidence to support it, after the claim is removed/reworded so it no longer reads as an uncited factual assertion, or after the app constrains it to explicitly local-only lecture interpretation on every user-facing surface.

## Rules

1. `Interpretive / needs source` claims remain lecture thesis material unless a reliable citation is added to `SOURCES.md` and the relevant page/provenance metadata is updated.
2. Hyperbolic claims may remain only as clearly labeled lecture interpretation, not as literal certified fact.
3. Missing-provenance pages stay private/local-study only until the raw source, edition metadata, or permission trail is documented.
4. Rights-clearance blockers are tracked in `RIGHTS_CLEARANCE.md`; this file tracks factual and source-citation blockers.
5. Any closure must update `FACT_REGISTER.md`, `SOURCES.md`, in-page audit notes, and the relevant provenance metadata before the item is marked resolved.

## Open Citation / Provenance Blockers

| ID | Location | Claim or issue | Current treatment | Evidence needed for certification |
| --- | --- | --- | --- | --- |
| F-011 | `Knowledge/great_books_5_the_odyssey.html` | Odyssey page provenance is not backed by a tracked raw script. | Mixed-source page; not public-release eligible. | Raw script/source origin, edition metadata, and rights/provenance record. |
| F-020 | `Knowledge/great_books_1_secrets_of_the_universe.html` | Page has no matching raw script or source register entry beyond local HTML. | Missing-source page; not public-release eligible. | Raw script/source origin, edition metadata, and rights/provenance record. |

## Controlled Interpretive Claims

These claims are not certified as neutral fact. They remain allowed only because the app and source pages constrain them as local-only lecture interpretation: in-page audit notes say they are `not certified fact`, the full app marks them `Local-only / not release-cleared`, study prompts say `Uncertified source check`, study footers say `Provenance caution: not certified fact unless separately sourced`, and the public-domain bundle excludes them.

| ID | Location | Claim or issue | Control now in place | Certification path if needed later |
| --- | --- | --- | --- | --- |
| F-005 | `Knowledge/dante_in_paradise.html` | "There have been three great poets" and "Dante will end the Dark Ages." | Controlled as lecture thesis only; not certified fact. | Add scholarly literary-history source, or reword/remove. |
| F-006 | `Knowledge/dantes_revolution.html` | Dante's Comedy gave rise to the Reformation, Scientific Revolution, Enlightenment, Renaissance, and modernity itself. | Controlled as broad lecture causation thesis only. | Add multiple reliable scholarly sources for the specific causation chain, or keep local-only. |
| F-007 | `Knowledge/the_poetry_of_empire.html` | Dante "destroy[ed] the Roman Empire and the Catholic Church" with The Divine Comedy. | Controlled as hyperbolic lecture interpretation only. | Add scholarly source supporting a literal version, or keep rhetorical/local-only. |
| F-008 | `Knowledge/the_poetry_of_empire.html` | Virgil's Aeneid is "anti-Homer" and responds to Iliad/Odyssey. | Controlled as literary interpretation; primary-source excerpts are separately sourced. | Add classical-scholarship citation before presenting as established fact. |
| F-009 | `Knowledge/the_anti_homer.html` | Homer becomes the basis/infrastructure of Greek civilization. | Controlled as broad lecture historical thesis only. | Add classical-scholarship citation, or keep local-only. |
| F-014 | `Knowledge/newton-daniel-study.html` | Prophetic chronology and identification claims are Newton's theological interpretations. | Controlled as Newton's interpretation, not modern historical consensus. | Add secondary scholarship only for broader reception or accuracy claims. |

## Closure Checklist

Before any item is removed from this backlog:

- Add or correct the source in `SOURCES.md`.
- Update the row in `FACT_REGISTER.md` from unresolved status to the correct resolved status.
- Update any affected in-page audit note so the user sees the right caution level.
- Update `src/provenance.full.ts` and `src/provenance.public.ts` if release scope changes.
- Run `npm run verify` and `npm run release:verify`.

Until these checks pass, the full app must not be described as 100% fact-certified. Controlled interpretive claims may be described only as local-only lecture interpretation, never as certified neutral fact.
