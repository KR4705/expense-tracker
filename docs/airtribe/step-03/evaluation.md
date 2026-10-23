# Evaluation — did the subagent find the planted violations?

**Detection result: 3 / 3 violations correctly identified**, each with the correct SG rule ID and an accurate file and line. There were no false positives: the baseline run on compliant code reported 0 confirmed violations.

Sources: [`violations.diff`](violations.diff) (ground truth), [`baseline-audit.md`](baseline-audit.md), [`compliance-audit.md`](compliance-audit.md).

## 1. Ground truth vs. findings

Line numbers are for the violated files at commit `2a8c56c`.

| # | Planted violation (ground truth) | Intended rule | Auditor finding | Rule cited | Location cited | Line accurate? | Verdict |
|---|---|---|---|---|---|---|---|
| 1 | Check badge removed from the selected state (`CategoryTile.tsx`; the `{selected ? <span className={styles.badge}>…` block and the `Check` import deleted) | **SG-24** Unmistakable Selected State | **V1** "Check badge is never rendered on selected tiles" (High) | SG-24 | `CategoryTile.tsx:41–46`, plus orphaned `.badge` / `.badgeIcon` styles at `CategoryTile.module.css:82–101` | Yes. Lines 41–46 are the plate and label spans, which are now the tile's only children; the badge was removed after line 46. Lines 82 and 101 are the start and end of the orphaned styles. | ✅ Correct |
| 2 | Label truncated onto one line: `white-space: nowrap; overflow: hidden; text-overflow: ellipsis;` (`CategoryTile.module.css`) | **SG-27** Category Label Rules | **V2** "Tile label is forced onto one line and cut off with an ellipsis" (High) | SG-27 (secondary SG-22, SG-43) | `CategoryTile.module.css:69`, `:70`, `:71` | Yes, exact | ✅ Correct |
| 3 | Tile padding changed from `var(--component-category-tile-padding)` (12 px) to raw `10px` | **SG-38** 4-Point Spacing Scale | **V3** "Tile padding is off the spacing scale and bypasses the token" (Low) | SG-38 | `CategoryTile.module.css:18` | Yes, exact | ✅ Correct |

Line numbers were checked against the violated files with `sed -n` before restoration. All quoted code matches the cited lines.

## 2. Quality of each finding against the subagent's requirements

| Requirement (from the Step 3 brief) | V1 | V2 | V3 |
|---|---|---|---|
| Exact source file and line | ✅ | ✅ | ✅ |
| Exact style-guide rule ID | ✅ SG-24 | ✅ SG-27 | ✅ SG-38 |
| Expected vs. actual explained | ✅ quotes the rule's "(3) a check badge" clause and the Acceptance test | ✅ quotes "wrap instead. Never truncate with an ellipsis" | ✅ quotes the 4-point scale |
| Rule → token → CSS variable chain | ✅ `component.categoryTile.selected.indicator` / `checkBadgeSize` | ✅ `component.categoryTile.label.maxLines` | ✅ `component.categoryTile.padding` → `space.3` (12 px) |
| Correction recommended, not applied | ✅ restores the exact JSX that was removed | ✅ remove lines 69–71 | ✅ `var(--component-category-tile-padding)` |
| Confirmed vs. possible issues kept separate | ✅ Runtime-dependent concerns (200 % text, screen-reader output, Other reachability) were reported only as P1–P3 | | |

Additional observations:
- **The auditor did not trust misleading comments.** The violated CSS kept its original comments: line 65 still says the label "wraps to at most 2 lines; never shrinks or truncates (SG-27)", and the selected-state comment still lists "+ badge (SG-24)". V2 notes that the comment says the opposite of what the code does.
- **It cross-checked an existing test.** V1 notes that `CategoryGrid.test.tsx:136` expects two SVGs and "should fail". That turned out to be correct: running `vitest` against the violated code failed exactly that one test (1 failed, 20 passed). See §4.
- **Severity was reasonable.** The two violations that harm users (selection cue, truncated labels) were rated High. The off-scale padding was rated Low.

## 3. False positives and consistency

| Check | Baseline (compliant code) | Compliance run (violated code) |
|---|---|---|
| Confirmed violations | **0** | **3** (all planted) |
| False-positive confirmed violations | 0 | 0 |
| Possible issues | 4 | 3 |
| Undocumented choices / spec gaps | 9 | 8 |

**Run-to-run variation (an honest limitation).** The non-violation sections were not identical across the two runs, even though the unchanged files were the same:
- Baseline **P1** (the focus ring depends on CSS `:has()` support) and **P4** (touch `:active` feedback on iOS) did not appear in the second run. The second run listed focus under "Checked and compliant" instead.
- The second run added **P3** (verify Other is reachable at 360 × 640). The baseline treated this as a static estimate under "Checked and compliant".

None of these differences affected a confirmed violation. They do show that the subagent's lower-confidence sections vary between LLM runs. Each configuration was run **once**, so detection consistency across repeated runs has not been measured.

## 4. Comparison with existing automated tests

The project's own test suite was run against the violated code (`npx vitest run`) while the compliance audit was in progress.

| Violation | Caught by existing tests? | Caught by subagent? |
|---|---|---|
| SG-24 badge removed | Yes: `CategoryGrid.test.tsx > selection > marks selected tiles with a check badge` failed | Yes |
| SG-27 ellipsis truncation | No | Yes |
| SG-38 raw 10 px padding | No | Yes |

The subagent caught two violations the existing tests miss. Tests cannot easily assert on CSS values such as padding and text overflow in jsdom.

## 5. Factors that make this result easier than a real-world audit

These are recorded so the 3/3 result is not overstated:
1. **The violations were chosen by the same AI session that wrote the subagent prompt.** The prompt's checklist and search patterns explicitly list `ellipsis|line-clamp|nowrap` (SG-27) and off-scale spacing values (SG-38). Those two detections were therefore anticipated by the prompt design. The SG-24 finding needed structural reasoning about a missing element, which no search pattern covers.
2. The subagent prompt lists "documented, accepted patterns" from the baseline code. That list was written after inspecting the same files, which reduces false positives on this codebase specifically.
3. All three violations are in one component and are statically visible. Violations that only appear at runtime (rendered contrast, layout at 200 % text) would land in "Possible issues" and need visual verification.
4. Sample size is one run per configuration.
