# GitHub Actions Verification Workflow Template

The repository should run the full audit suite and release gate in GitHub Actions. The current automation token cannot create `.github/workflows/*` files because GitHub rejected the push without `workflow` OAuth scope.

To enable CI, add this file as `.github/workflows/verify.yml` using a token or GitHub UI session with workflow permission:

```yaml
name: Verify

on:
  push:
    branches:
      - main
  pull_request:

permissions:
  contents: read

jobs:
  audit:
    name: Audit and release gate
    runs-on: ubuntu-latest
    steps:
      - name: Check out repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright Chromium
        run: npx playwright install --with-deps chromium

      - name: Run full verification suite
        run: npm run verify

      - name: Run public release gate
        run: npm run release:verify
```

Until this workflow is installed, local release approval still requires:

```sh
npm run verify
npm run release:verify
```
