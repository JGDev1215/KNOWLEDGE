# Rights Clearance Register

Audit date: 2026-07-12

This register records whether each non-public-domain or uncertain source has enough evidence for public distribution. It is not legal advice. It is a project control document for deciding what can be shipped from this repository.

## Clearance Rule

Full-app public release is blocked unless every non-public-domain or uncertain item has one of these outcomes:

- `Cleared`: written permission, ownership evidence, or a license grant is recorded.
- `Removed`: the material is removed from public builds and public-facing docs.
- `Private-only`: the material is explicitly limited to local/private study use.
- `Public-domain-only replacement`: the public release uses only public-domain source material instead.

An item with `Uncleared` or `Unknown` status must not be represented as rights-cleared.

## Current Decision

The current public-release path is the public-domain-only bundle produced by:

```sh
npm run audit:public
```

The full local-study app remains private/local-use only until the uncleared items below are resolved.

## Transcript and Derived-Page Clearance

| Item | Local material | Current status | Evidence currently in repo | Required evidence or action |
| --- | --- | --- | --- | --- |
| Great Books #7 transcript | `RawScripts/ Great Books #7: The Anti-Homer.md`; `Knowledge/the_anti_homer.html` | Uncleared | Local transcript exists; ownership/permission is not documented. | Add permission/ownership evidence, or keep private-only/excluded from public build. |
| Great Books #8 transcript | `RawScripts/Great Books #8: The Poetry of Empire.md`; `Knowledge/the_poetry_of_empire.html` | Uncleared | Local transcript exists; ownership/permission is not documented. | Add permission/ownership evidence, or keep private-only/excluded from public build. |
| Great Books #9 transcript | `RawScripts/ Great Books #9: Dante's La Commedia.md`; `Knowledge/dantes_la_commedia.html` | Uncleared | Local transcript exists; ownership/permission is not documented. | Add permission/ownership evidence, or keep private-only/excluded from public build. |
| Great Books #10 transcript | `RawScripts/Great Books #10: Dante's Hierarchy of Hell.md`; `Knowledge/dantes_hierarchy_of_hell.html` | Uncleared | Local transcript exists; ownership/permission is not documented. | Add permission/ownership evidence, or keep private-only/excluded from public build. |
| Great Books #11 transcript | `RawScripts/Great Books #11: Dante's Revolution.md`; `Knowledge/dantes_revolution.html` | Uncleared | Local transcript exists; ownership/permission is not documented. | Add permission/ownership evidence, or keep private-only/excluded from public build. |
| Great Books #12 transcript | `RawScripts/Great Books #12: Dante in Paradise.md`; `Knowledge/dante_in_paradise.html` | Uncleared | Local transcript exists; ownership/permission is not documented. | Add permission/ownership evidence, or keep private-only/excluded from public build. |
| Great Books #13 transcript | `RawScripts/ Great Books #13: Gay Talese's Sparks of Light.md`; `Knowledge/gay_taleses_sparks_of_light.html` | Uncleared | Local transcript exists; ownership/permission is not documented. | Add permission/ownership evidence, or keep private-only/excluded from public build. |

## Missing Provenance Clearance

| Item | Local material | Current status | Evidence currently in repo | Required evidence or action |
| --- | --- | --- | --- | --- |
| Great Books #1 source | `Knowledge/great_books_1_secrets_of_the_universe.html` | Unknown | No matching raw script/source register entry. | Add original source/provenance, or keep private-only/excluded from public build. |
| Great Books #5 source | `Knowledge/great_books_5_the_odyssey.html` | Unknown | Odyssey public-domain source is recorded, but modern lecture/source provenance is missing. | Add original source/provenance and exact edition metadata, or keep private-only/excluded from public build. |

## Modern Author Material

| Item | Local material | Current status | Evidence currently in repo | Required evidence or action |
| --- | --- | --- | --- | --- |
| Gay Talese modern works | `Knowledge/gay_taleses_sparks_of_light.html` | Citation-only / uncleared for reproduced text | Page includes Penguin Random House reference links and states that modern text is not embedded. | Do not add excerpts from modern copyrighted books/articles unless permission is recorded. |

## Public-Domain Material

The public-domain source register is maintained in `SOURCES.md`. Public-domain source URLs alone do not clear the lecture-derived commentary or missing-provenance pages above.
