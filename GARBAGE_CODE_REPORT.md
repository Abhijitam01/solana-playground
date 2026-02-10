# Garbage Code & Cleanup Plan

This document outlines files and directories identified as "garbage" or technical debt—items that are unused, temporary, or misplaced—and provides a plan to remove or refactor them.

## 1. Unused / Temporary Files

These files serve no runtime purpose and can be safely deleted.

- **`verify_scaffold.js`**
  - **Description**: A standalone script likely used to verify the program scaffolding logic manually. It duplicates logic found in `apps/web/lib/scaffold.ts`.
  - **Action**: Delete.

- **`unused` and `unused2`**
  - **Description**: File/Folder artifacts with empty JSON content (looks like empty Jupyter notebook metadata).
  - **Action**: Delete.

- **`test-results.txt`**
  - **Description**: A large text file containing the output of a test run. This should be git-ignored and not committed to the repo.
  - **Action**: Delete and add `test-results.txt` to `.gitignore`.

- **`scripts/generate-template-checklists.js`**
  - **Description**: A utility script used to bulk-create `checklist.json` files. Since these checklists are now generated and committed, this script is likely obsolete unless you plan to regenerate them frequently.
  - **Action**: Delete (or move to a `tools/` directory if you want to keep it for future reference).

- **`dump_context.js` / `dump_templates.js` / `write_checklists.js`** (If present)
  - **Description**: Temporary scripts created during development to inspect or modify files in bulk.
  - **Action**: Delete.

## 2. Misplaced or Redundant Test Files

The test suite structure has some overlap and configuration issues causing failures.

- **`apps/web/tests/example.test.tsx`**
  - **Description**: A trivial boilerplate test file (`expect(true).toBe(true)`).
  - **Action**: Delete.

- **`apps/web/tests/e2e/` (Playwright Specs)**
  - **Issue**: These files (`home.spec.ts`, `landing.spec.ts`, etc.) are being picked up by the `vitest` runner, causing "Playwright Test did not expect test() to be called here" errors. Vitest is for unit tests; Playwright is for E2E.
  - **Action**: Ensure your `vitest.config.ts` excludes the `e2e` directory, or move these files to a dedicated `e2e` folder at the root (or `apps/web/e2e`) that is ignored by the Vitest configuration.

## 3. Deprecated / Legacy Code

- **`apps/web/tests/unit/` (Duplicate/Old Tests)**
  - **Issue**: There are pairs of test files that look like duplicates or older versions:
    - `home.test.tsx` vs `home-page.test.tsx`
    - `landing.test.tsx` vs `landing-page.test.tsx`
    - `playground-ui.test.tsx` vs `playground-page.test.tsx`
  - **Action**: Review these pairs. Keep the one that aligns with the current component implementation (likely the `-page` ones or the ones importing the actual page components) and delete the others. The "React is not defined" errors in `landing.test.tsx` suggest it might be using an older setup or missing imports.

## cleanup Command

You can run the following command to remove the obvious files immediately:

```bash
rm verify_scaffold.js unused unused2 test-results.txt apps/web/tests/example.test.tsx scripts/generate-template-checklists.js
```

## Recommended Next Steps

1.  Run the removal command above.
2.  Update `.gitignore` to include `test-results.txt`.
3.  Fix the Vitest configuration to exclude `tests/e2e`.
4.  Consolidate the unit tests in `apps/web/tests/unit` to remove duplicates.
