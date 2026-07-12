# Release Gate

Audit date: 2026-07-12

This project has one release-approved artifact path:

```sh
npm run release:verify
```

That command builds the public-domain-only bundle and runs the public static and browser audits. The default `npm run build` command now also uses the public-domain-only bundle path to reduce accidental-publication risk. Use `npm run build:local` only for private full-study review.

## Gate Rules

Before publishing or deploying `dist/`, all of these must be true:

1. `npm run release:verify` passed in the current checkout.
2. If installed, the GitHub Actions `Verify` workflow passed for the commit being released. `CI_WORKFLOW_TEMPLATE.md` records the required workflow; installing it requires GitHub `workflow` permission.
3. The generated app renders `Public-domain release mode.`
4. The generated app renders exactly the cleared public-domain works.
5. Lecture-derived, mixed-source, missing-provenance, and modern-author material is absent from public cards, search results, and the bundle markers checked by `scripts/audit-public.mjs`.
6. `RIGHTS_CLEARANCE.md` still marks the full local-study app as blocked unless every non-public-domain or uncertain item has been cleared, removed, or private-scoped.
7. `CLAIM_CITATION_BACKLOG.md` still marks the full local-study app as not 100% fact-certified unless every open factual/citation item has been cited, removed, or reworded.

## Non-Release Commands

- `npm run build` creates the public-domain-only bundle.
- `npm run build:local` creates a full local-study bundle. Do not publish it.
- `npm run audit:full` proves the full local-study bundle still contains expected caution material. It is not a public-release approval.
- `npm run release:full` intentionally fails and prints the unresolved full-app release blockers.
- `npm run verify` runs all audits for development confidence, but the release artifact is still the public-domain bundle produced during `npm run release:verify` or `npm run audit:public`.
