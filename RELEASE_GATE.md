# Release Gate

Audit date: 2026-07-12

This project has one release-approved artifact path:

```sh
npm run release:verify
```

The default production build also uses the cleared public-domain source set:

```sh
npm run build
```

## Gate Rules

Before publishing or deploying `dist/`, all of these must be true:

1. `npm run release:verify` passed in the current checkout.
2. If installed, the GitHub Actions `Verify` workflow passed for the commit being released. `CI_WORKFLOW_TEMPLATE.md` records the required workflow; installing it requires GitHub `workflow` permission.
3. The generated app renders `Public-domain release mode.` or the cleared source equivalent.
4. The generated app renders exactly the cleared public-domain works.
5. Lecture-derived, mixed-source, missing-provenance, and modern-author material is absent from tracked source and from bundle markers checked by `scripts/audit-public.mjs`.
6. `RIGHTS_CLEARANCE.md` still records removed material and the rule against reintroducing it without rights/provenance evidence.

## Commands

- `npm run build` creates the public-domain-only bundle.
- `npm run build:local` currently builds the same cleared tracked source set.
- `npm run release:verify` builds and audits the release bundle.
- `npm run release:full` delegates to `npm run release:verify` because the tracked source set is now release-cleared.
- `npm run verify` runs all audits for development confidence.
