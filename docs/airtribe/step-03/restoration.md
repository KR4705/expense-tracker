# Restoration — CategoryTile returned to its compliant state

**Status: restored and verified.** No deliberate violations remain on the branch.

## How it was restored

The violations were introduced in a single commit and removed with `git revert`, so the restoration exactly mirrors [`violations.diff`](violations.diff).

| Commit | Purpose |
|---|---|
| `68c0973` | Agent definition only; `src/` identical to `main` |
| `2a8c56c` | **Temporary:** introduced the three violations in `CategoryTile.tsx` and `CategoryTile.module.css` |
| `dc4792e` | `git revert` of `2a8c56c`; restores both files |

## Verification performed (24 Oct 2026, ≈ 04:00 IST)

| Check | Command | Result |
|---|---|---|
| `src/` identical to `main` | `git diff --quiet main -- src` | Exit 0: **no differences** |
| File content identical to `main` | `sha256sum` of each working file vs `git show main:<file> \| sha256sum` | `CategoryTile.tsx` `6408885b…2955` = main; `CategoryTile.module.css` `3c9d7787…550d` = main |
| No planted patterns left | `grep -rnE "padding: 10px\|text-overflow: ellipsis" src` | No matches |
| Badge rendering restored | `CategoryTile.tsx` lines 47–51 contain `{selected ? (<span className={styles.badge}…` and line 1 imports `Check` | Present |
| Full project validation | `npm run validate` (token check, category validation, 48 data tests, 21 UI tests, typecheck) | Exit 0: **48/48 data tests and 21/21 UI tests pass**, including `marks selected tiles with a check badge`, which failed on the violated code |
| Diff still reproduces the experiment | `git apply --check docs/airtribe/step-03/violations.diff` | Applies cleanly to the restored tree (see README) |

## Not verified

- **No visual or browser check** of the restored page was made in this session (for example on a Vercel preview or at 360 × 640). Restoration is proven at source level, where the files are byte-identical to `main`, which was the reviewed and merged state from PR #7.
- A post-restoration audit run of the subagent was **not** performed. Because `src/` is byte-identical to the code audited in [`baseline-audit.md`](baseline-audit.md), that baseline report applies to the restored state.
