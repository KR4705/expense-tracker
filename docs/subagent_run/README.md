# Airtribe Step 3 — Design-System Compliance Subagent: Evidence

**Course:** Agentic AI and AI Systems in Production · **Project:** Expense Tracker (`KR4705/expense-tracker`)
**Branch:** `feat/design-compliance-auditor` (not merged into `main`; not deployed)
**Date:** 24 October 2026 (IST)

## Objective

Create a reusable, **read-only** Claude Code subagent that audits frontend implementation against the existing design system. Then show that it finds three deliberately introduced violations and cites the exact style-guide rules they break.

## Result

| Item | Outcome |
|---|---|
| Subagent | [`.claude/agents/design-compliance-auditor.md`](../../.claude/agents/design-compliance-auditor.md) — tools limited to `Read`, `Grep`, `Glob` (no edit, write or shell) |
| Baseline on compliant code | **0** confirmed violations (no false positives) |
| Detection | **3 / 3** violations found, each with the correct SG rule ID and accurate file:line |
| Restoration | `CategoryTile` restored; `src/` byte-identical to `main`; all tests pass |

## The three deliberate violations

All three are in the CategoryTile component. The exact code changes are in [`violations.diff`](violations.diff).

| # | File (line at `2a8c56c`) | Change | Rule broken | Why it breaks the rule |
|---|---|---|---|---|
| 1 | `src/components/category/CategoryTile.tsx` (badge block after line 46; `Check` import at line 1) | Removed the check badge from the selected state | **SG-24** Unmistakable Selected State (Multi-Cue) | SG-24 requires a tint, a 2 px accent border **and** a check badge. Its Acceptance says "border + check alone suffice" to identify selection without the tint. |
| 2 | `src/components/category/CategoryTile.module.css:69–71` | Added `white-space: nowrap; overflow: hidden; text-overflow: ellipsis;` to `.label` | **SG-27** Category Label Rules | Labels must wrap to at most two lines; "Never truncate with an ellipsis." |
| 3 | `src/components/category/CategoryTile.module.css:18` | `padding: var(--component-category-tile-padding)` → `padding: 10px` | **SG-38** 4-Point Spacing Scale | Spacing must come from 4, 8, 12, 16, 24, 32, 40, 48; 10 px is off-scale and bypasses the 12 px token. |

The original comments that claimed compliance (for example "never shrinks or truncates (SG-27)") were left in place on purpose. This tested the subagent's instruction to treat comments as non-authoritative.

## Files in this folder

| File | Contents |
|---|---|
| [`README.md`](README.md) | This summary, the method, and missing evidence |
| [`baseline-audit.md`](baseline-audit.md) | Complete, unedited subagent report on the compliant code |
| [`violations.diff`](violations.diff) | Exact `git diff` of the three violations (`68c0973..2a8c56c -- src`) |
| [`compliance-audit.md`](compliance-audit.md) | Complete, unedited subagent report on the violated code |
| [`evaluation.md`](evaluation.md) | Ground truth vs. findings, false positives, run-to-run variation, limitations |
| [`restoration.md`](restoration.md) | How the component was restored and how that was verified |

## Method (as executed)

| Step | Commit / action | Time (IST, 24 Oct) |
|---|---|---|
| 1. Inspected `STYLE_GUIDE.md` v0.3, `tokens.json` v0.1.0, `design-system/components/`, `src/components/category/`, `CategorySelectionPage.tsx` | — | ≈ 03:47 |
| 2. Wrote and committed the subagent definition | `68c0973` | 03:49 |
| 3. Baseline audit run on unchanged code | subagent run 1 | ≈ 03:54–03:57 |
| 4. Baseline `npm run validate`: 48 data + 21 UI tests pass | — | ≈ 03:56 |
| 5. Introduced three violations and committed them | `2a8c56c` | 03:57 |
| 6. Compliance audit with the same prompt | subagent run 2 | ≈ 03:58–04:00 |
| 7. `vitest` on violated code: 1 test failed (badge) | — | ≈ 03:59 |
| 8. Reverted violations | `dc4792e` | 04:00 |
| 9. Verified restoration (`git diff`, SHA-256, `npm run validate`) | — | ≈ 04:00 |
| 10. Wrote evidence files and committed | this commit | ≈ 04:05 |

Both subagent runs were invoked through Claude Code's Agent tool with `subagent_type: design-compliance-auditor`. In both runs the subagent used only `Read`, `Grep` and `Glob` and changed no files.

### Exact prompt used for both runs

```
Audit the category-selection frontend in the repository at /home/claude/expense-tracker against the design system.

Scope (audit these files):
- /home/claude/expense-tracker/src/components/category/CategoryTile.tsx
- /home/claude/expense-tracker/src/components/category/CategoryTile.module.css
- /home/claude/expense-tracker/src/components/category/CategoryGrid.tsx
- /home/claude/expense-tracker/src/components/category/CategoryGrid.module.css
- /home/claude/expense-tracker/src/pages/CategorySelectionPage.tsx
- /home/claude/expense-tracker/src/pages/CategorySelectionPage.module.css

Design system: /home/claude/expense-tracker/design-system/ (STYLE_GUIDE.md, tokens.json, components/).

Follow your standard workflow and return the full report in your standard format.
```

The prompt did not mention that violations existed, how many there were, or which rules they broke.

### Reproducing

```bash
git checkout feat/design-compliance-auditor
git apply docs/subagent_run/violations.diff   # re-introduce the violations
# In Claude Code: ask the design-compliance-auditor subagent to audit the files above
git checkout -- src/                               # restore
```

## Traceability chain example

REF-U01 (selected ride row tinted; REF-D01 check icon) → **SG-24** → token `component.categoryTile.selected.indicator` → `color.selection.indicator` → `#1D4ED8` → CSS `--component-category-tile-selected-indicator` → `.badge` background in `CategoryTile.module.css`. Violation 1 broke the last link: the styled element was no longer rendered. The subagent reported this chain in V1.

## Missing evidence and outstanding issues

Stated plainly so nothing here is overstated:

1. **Timing of this evidence.** The Step 3 instructions treated implementation as complete, but when this evidence was prepared no violations had yet been introduced and no audit had been run on any branch. Everything in this folder was produced in a single session on 24 October 2026 between ≈ 03:47 and 04:05 IST, in the order shown above. Nothing was reconstructed after the fact.
2. **Who chose the violations.** The three violations were chosen and introduced by Claude (the same AI session that wrote the subagent), not by a human. See `evaluation.md` §5 for how this makes two of the detections easier.
3. **Only final reports are captured.** `baseline-audit.md` and `compliance-audit.md` contain each subagent's complete final report, byte-for-byte. The intermediate transcripts (each tool call and its output) were **not** committed; they remain only in the Claude Code session.
4. **No screenshots or recordings** of the subagent running, and no visual or browser check of the page before, during or after the violations.
5. **One run per configuration.** Detection consistency across repeated runs was not measured. The non-violation sections already varied between the two runs (see `evaluation.md` §3).
6. **Possible issues raised by the subagent were not verified.** These are `:has()` focus-ring support, the large-text fallback at 320 px and 200 % text, duplicate screen-reader announcements, iOS touch `:active` feedback, and Other's reachability at 360 × 640. They need device or browser testing.
7. **Documentation inconsistencies the subagent reported (not fixed; standards were not modified):**
   - The `tokens.json` description of `component.categoryGrid.columns` says "360–430px phones", and CategoryTile.md §8 says "Phone 360–430 px". SG-23 v0.2 says 320–430 px.
   - The `tokens.json` metadata names STYLE_GUIDE **v0.1** as its source; the specs cite v0.3.
8. **Second agent on another branch.** `feat/airtribe-step3-compliance-agent` (commit `f401c6a`, 03:39 IST) contains a different agent, `.claude/agents/design-system-auditor.md`. It was not used for this evidence. Decide which agent to keep before merging, to avoid two overlapping auditors.
9. **Environment note.** `src/styles/tokens.css` (generated, git-ignored) was created by `npm run validate` while the baseline audit was running. Neither audit report lists it among the files read: both list the in-scope files plus a few context files such as `categoryIcons.ts`, `base.css` and `categories.json`. The generated file is not committed.
