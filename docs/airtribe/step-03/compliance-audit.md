# Compliance Audit — code with three deliberate violations

| Field | Value |
|---|---|
| Subagent | `design-compliance-auditor` (`.claude/agents/design-compliance-auditor.md`) |
| Code audited | Branch `feat/design-compliance-auditor` at commit `2a8c56c` (violations from [`violations.diff`](violations.diff) applied) |
| Run | 24 October 2026, ≈ 03:58–04:00 IST (22:28–22:30 UTC, 23 Oct); 19 tool calls; ≈ 129 s |
| Prompt | Identical to the baseline run, with no hint that code had changed — see [README](README.md#exact-prompt-used-for-both-runs) |
| Result | **3 confirmed violations** · 3 possible issues · 8 undocumented choices |

**Capture method.** The text below the line is the subagent's final report, extracted programmatically (Python, unmodified bytes) from the last assistant message in the subagent's session transcript. It has not been edited, reformatted or abridged. Intermediate tool calls are not included (see [README — Missing evidence](README.md#missing-evidence-and-outstanding-issues)). Line numbers in the report refer to the files as they were at `2a8c56c`.

---

# Design Compliance Audit

**Scope:**
- `/home/claude/expense-tracker/src/components/category/CategoryTile.tsx`
- `/home/claude/expense-tracker/src/components/category/CategoryTile.module.css`
- `/home/claude/expense-tracker/src/components/category/CategoryGrid.tsx`
- `/home/claude/expense-tracker/src/components/category/CategoryGrid.module.css`
- `/home/claude/expense-tracker/src/pages/CategorySelectionPage.tsx`
- `/home/claude/expense-tracker/src/pages/CategorySelectionPage.module.css`

I also read `categoryIcons.ts`, `base.css`, `categories.json` and part of `CategoryGrid.test.tsx` for context only.

**Sources:** STYLE_GUIDE.md v0.3, tokens.json v0.1.0, component specs CategoryTile.md v0.2 and CategoryGrid.md v0.2
**Result:** 3 confirmed violations · 3 possible issues · 8 undocumented choices

## Confirmed violations

### V1 — Check badge is never rendered on selected tiles
- **Rule:** SG-24 — Unmistakable Selected State (Multi-Cue)
- **Location:** `src/components/category/CategoryTile.tsx:41–46` (the tile has only a plate and a label, with no badge element). The unused styles for it are at `src/components/category/CategoryTile.module.css:82–101` (`.badge`, `.badgeIcon`).
- **Code:** `<span className={styles.label} data-tile-label="">` is the last child of the `<label>`. Nothing references `styles.badge`.
- **Expected:** A selected tile shows "(3) a check badge in the top-right corner". The Acceptance text says selection must be identifiable "with the tint removed (border + check alone suffice)".
- **Actual:** Selection shows only through the tint, the 2 px border, the white plate and the 600 label weight. With the tint removed, the only cues left are the border and the weight, so the cue the rule calls decisive is missing. The test at `CategoryGrid.test.tsx:136` expects 2 SVGs (icon plus badge), so it should fail against this code.
- **Evidence chain:** SG-24 → `component.categoryTile.selected.indicator` (`#1D4ED8`) / `selected.onIndicator` (`#FFFFFF`) / `checkBadgeSize` (20 px) → `--component-category-tile-selected-indicator`, `--component-category-tile-check-badge-size` → `.badge` (styled but not in the DOM)
- **Recommended correction (not applied):** Inside the `<label>`, render `{selected ? <span className={styles.badge} aria-hidden="true"><Check className={styles.badgeIcon} aria-hidden="true" focusable="false" /></span> : null}`, with `Check` imported from `lucide-react`.
- **Severity:** High

### V2 — Tile label is forced onto one line and cut off with an ellipsis
- **Rule:** SG-27 — Category Label Rules. Secondary rules: SG-22 ("labels are never truncated") and SG-43 ("no clipped text").
- **Location:** `src/components/category/CategoryTile.module.css:69`, `:70`, `:71`
- **Code:** `white-space: nowrap;` / `overflow: hidden;` / `text-overflow: ellipsis;`
- **Expected:** Labels go to a "maximum two lines… wrap instead. Never truncate with an ellipsis."
- **Actual:** Labels can't wrap. Any label wider than its tile is clipped with "…". This happens with longer labels, at narrow widths (88 px tiles at 320 px) and at large text sizes. The 2-column fallback in `CategoryGrid.tsx:95` detects width overflow, but at 2 columns the label can still be truncated. The comment at line 65 says "wraps to at most 2 lines", but the code does the opposite.
- **Evidence chain:** SG-27 → `component.categoryTile.label.maxLines` (2) → `--component-category-tile-label-max-lines` → `.label` wrapping behaviour
- **Recommended correction (not applied):** Remove lines 69–71 and let the label wrap normally (`white-space: normal; overflow: visible;`). Don't add `line-clamp`. A label that would exceed 2 lines should be renamed (spec §8).
- **Severity:** High

### V3 — Tile padding is off the spacing scale and bypasses the token
- **Rule:** SG-38 — 4-Point Spacing Scale
- **Location:** `src/components/category/CategoryTile.module.css:18`
- **Code:** `padding: 10px;`
- **Expected:** "All spacing uses multiples of 4 px from this proposed scale: 4, 8, 12, 16, 24, 32, 40, 48."
- **Actual:** The value is 10 px, which is not on the scale. The defined `component.categoryTile.padding` token (12 px) is ignored, so tile padding drifts from the design system.
- **Evidence chain:** SG-38 → `component.categoryTile.padding` → `space.3` (12 px) → `--component-category-tile-padding` → `.tile` padding
- **Recommended correction (not applied):** Replace it with `padding: var(--component-category-tile-padding);`.
- **Severity:** Low

## Possible issues — need visual or runtime verification

### P1 — Behaviour at 200 % text and when the grid drops to 2 columns
- **Related rule:** SG-43 (and SG-23)
- **Location:** `src/components/category/CategoryGrid.tsx:89–99`, `src/components/category/CategoryGrid.module.css:31–33`
- **Why unconfirmed:** The switch to 2 columns depends on measured label height and width, font loading and ResizeObserver timing. While V2 is unfixed, the "too many lines" check can never fire, because labels are kept to one line. How the trigger should work is also still open (decision D-3).
- **How to verify:** After fixing V2, test a 360 px viewport with the OS or browser text size at 200 %. You should see 2 columns, every label fully visible within 2 lines, and tiles growing taller instead of clipping.

### P2 — Screen-reader output for the group, disabled tiles and the summary
- **Related rule:** SG-41 (and SG-25, SG-45)
- **Location:** `src/components/category/CategoryGrid.tsx:50–53`, `:68`; `src/components/category/CategoryTile.tsx:33–40`
- **Why unconfirmed:** The structure looks correct: a native checkbox with `disabled`, a `role="group"` labelled by the heading and helper, and a `role="status"` summary. But the actual announcement can't be checked by reading the code. Because the summary is both a live region and the group's `aria-describedby`, it may be read twice on focus or change.
- **How to verify:** With VoiceOver (iOS) and TalkBack (Android), check that each tile is read as "Food, checkbox, not checked", and that a disabled tile is read as "unavailable". Each toggle should announce "n selected: …" once (CategoryGrid acceptance item 7).

### P3 — Other visible or reachable on 360 × 640
- **Related rule:** SG-26
- **Location:** `src/pages/CategorySelectionPage.tsx:22–37`
- **Why unconfirmed:** This depends on the app shell's header, gutters and the rendered tile height, and the shell was outside this audit.
- **How to verify:** Open the page at a 360 × 640 viewport. Other, the 9th tile in row 3, should be visible without scrolling or reachable with one scroll.

## Undocumented implementation choices / spec gaps
- `CategoryTile.module.css:130` — The focus ring offset reuses `--component-primary-action-button-focused-ring-offset`. This is documented as gap G-3, so it is not a violation.
- `CategoryTile.module.css:23` — The tile label and icon use `--color-text-primary`. This is documented as gap G-6.
- `CategoryTile.module.css:84–85` — The badge inset uses `--space-1`. This is documented as gap G-7, but it has no effect until V1 is fixed.
- `CategoryTile.module.css:98–99` — `.badgeIcon` is sized at 70 % because no token exists for it. This is an accepted pattern.
- `CategoryTile.module.css:54`, `:91` — The plate and badge use `border-radius: 50%` instead of `radius.full`. No rule controls circle radius, so it is not a violation.
- `CategoryGrid.tsx:28` — Other comes last only because `categories.json` gives it `displayOrder: 9`. The code doesn't enforce the spec's "always rendered last" (CategoryGrid §4). That is compliant with today's data, but a data change could break it.
- `CategoryTile.tsx:26–29`, `:42` — If an icon isn't in the registry, the tile renders with a label and no icon, and the error is logged only in development. This would break SG-22, but the test checks the registry and all 9 current icons are present.
- `CategorySelectionPage.tsx:11–15`, `:25` — The page has no primary button and no progress indicator. This is documented as "built ahead" of the flow, so SG-01, SG-18, SG-20 and SG-28 can't be checked here yet. The heading "Choose categories" differs from the spec's proposed "What was it for?", but the spec marks that wording as a content proposal still to be confirmed. Separately, the tokens.json metadata names Style Guide **v0.1** as its source, while the specs reference v0.3. The guide's change log says tokens were unaffected, so this is only a documentation inconsistency.

## Checked and compliant
- **SG-06 / SG-08 / SG-09 colour:** no raw colours in any file in scope. The default border is the control token (`#8A919C`, 3.18:1), and the divider token is used only for the disabled state, as §C.5 specifies (CategoryTile.module.css:21, 136).
- **SG-21 / SG-26 equal weight:** no per-index or per-category selectors. `data-category-id` is not used in any CSS. Other uses the same tokens as every other tile.
- **SG-22:** the icon is decorative (`aria-hidden`), and the visible label is not hidden and serves as the accessible name (CategoryTile.tsx:41–46).
- **SG-23 grid:** 3 columns from a token, a 12 px gap token, the 4-column breakpoint at `min-width: 431px` (an accepted pattern), the 2-column large-text override, and the 96 px min-height token with no fixed height (CategoryGrid.module.css:12–33; CategoryTile.module.css:17, 19).
- **SG-24 other cues:** tint, 2 px accent border, white plate and selected weight 600 are all from tokens. The transition uses the 150 ms token (CategoryTile.module.css:27–29, 110–121).
- **SG-25 multi-select:** native checkboxes, a toggle built on a copied `Set` with no limit, and no clearing of other selections (CategoryGrid.tsx:33–38). The live summary lists selections in grid order (CategoryGrid.tsx:40–44, 68).
- **SG-45:** inactive tiles get `disabled={!category.active}` and nothing is filtered out (CategoryGrid.tsx:56–66). Disabled styling uses the tokens for fill, border, tertiary label and 0.4 icon opacity, and there is no pressed state on disabled tiles (CategoryTile.module.css:104, 134–143).
- **SG-19 / SG-42 focus:** a 2 px accent outline on `:focus-visible`, with no `outline: none` anywhere (CategoryTile.module.css:128–131). Pressed feedback uses the 100 ms token (CategoryTile.module.css:104–107).
- **SG-44:** all durations come from tokens (100 and 150 ms, both ≤ 300 ms), and transitions are removed under `prefers-reduced-motion` (CategoryTile.module.css:146–151).
- **SG-13 typography:** the heading uses the Heading 1 tokens, the helper and summary use the Body tokens, and the tile label uses the tile typography tokens. There are no `px` font sizes.
- **SG-38 elsewhere:** the page, header, grid and root gaps all come from tokens (24 / 8 / 12 px).
- **SG-17:** tiles are at least 96 px tall with 12 px gaps.
