# Baseline Audit — compliant code (before violations)

| Field | Value |
|---|---|
| Subagent | `design-compliance-auditor` (`.claude/agents/design-compliance-auditor.md`, introduced in commit `68c0973`) |
| Code audited | Branch `feat/design-compliance-auditor` at commit `68c0973`; `src/` identical to `main` (`f4dbed4`) |
| Run | 24 October 2026, ≈ 03:54–03:57 IST (22:24–22:27 UTC, 23 Oct); 22 tool calls; ≈ 196 s |
| Prompt | Identical to the compliance run — see [README](README.md#exact-prompt-used-for-both-runs) |
| Result | **0 confirmed violations** · 4 possible issues · 9 undocumented choices |

**Capture method.** The text below the line is the subagent's final report, extracted programmatically (Python, unmodified bytes) from the last assistant message in the subagent's session transcript. It has not been edited, reformatted or abridged. Intermediate tool calls are not included (see [README — Missing evidence](README.md#missing-evidence-and-outstanding-issues)).

---

# Design Compliance Audit

**Scope:**
- `/home/claude/expense-tracker/src/components/category/CategoryTile.tsx`
- `/home/claude/expense-tracker/src/components/category/CategoryTile.module.css`
- `/home/claude/expense-tracker/src/components/category/CategoryGrid.tsx`
- `/home/claude/expense-tracker/src/components/category/CategoryGrid.module.css`
- `/home/claude/expense-tracker/src/pages/CategorySelectionPage.tsx`
- `/home/claude/expense-tracker/src/pages/CategorySelectionPage.module.css`

I also read these for context only: `categoryIcons.ts`, `src/data/categories.ts`, `src/data/categories.json`, `src/styles/base.css`, `src/app/AppShell.module.css`, `src/App.tsx`.

**Sources:** STYLE_GUIDE.md v0.3, tokens.json v0.1.0, component specs CategoryTile.md v0.2 and CategoryGrid.md v0.2.

**Result:** 0 confirmed violations · 4 possible issues · 9 undocumented choices / spec gaps

## Confirmed violations

None. I read every in-scope file in full and ran the §4 pattern sweeps over `src/`. Every hit was either an accepted pattern or a false lead:
- The visually-hidden input (lines 35–42) and the 431 px breakpoint are accepted patterns.
- The `circle-ellipsis` hit is an icon identifier, not truncation.

Every `var(--…)` name used in the six files maps back to a token that exists in `tokens.json`.

## Possible issues — need visual or runtime verification

### P1 — The tile's focus ring works only in browsers that support `:has()`
- **Related rule:** SG-19 (focus: "2 px accent focus ring with 2 px offset"), SG-42
- **Location:** `/home/claude/expense-tracker/src/components/category/CategoryTile.module.css:125`
- **Code:** `.tile:has(.input:focus-visible) {`
- **Why unconfirmed:** The native checkbox is hidden (1 × 1 px, clipped), so this rule is the only visible focus indicator. In a browser without `:has()` support (Safari < 15.4, Firefox < 121, older Android WebViews), keyboard or switch focus would show nothing at all. Whether that matters depends on which browsers the product targets, and the style guide does not say.
- **How to verify:** Tab through the grid in the oldest supported iOS Safari, Android Chrome/WebView and desktop Firefox. Expected: a 2 px blue ring, 2 px outside each focused tile. If any target lacks `:has()`, add a fallback such as `.tile:focus-within`.

### P2 — The large-text fallback may not re-run when only text size changes, and long labels at 320 px are unmeasured
- **Related rule:** SG-43, SG-23 (2 columns when a label would exceed two lines), SG-27
- **Location:** `/home/claude/expense-tracker/src/components/category/CategoryGrid.tsx:109`, `/home/claude/expense-tracker/src/components/category/CategoryTile.module.css:69`
- **Code:** `if (grid.clientWidth !== width) {` / `overflow-wrap: normal;`
- **Why unconfirmed:**
  - The grid re-measures only when its width changes or web fonts finish loading. If the user changes the system or browser text size while the page is open, the width may not change, so the grid could stay at 3 columns with overflowing labels.
  - At 320 px a 3-column tile is about 88 px wide, leaving about 64 px for the label. `overflow-wrap: normal` never breaks a word, so a long word in weight 600 (e.g. "Charity", "Transit") could spill past the tile edge if the measurement does not trigger. Nothing is clipped, because there is no `overflow: hidden`.
  - The exact trigger is still open decision D-3.
- **How to verify:**
  - Viewport 320 × 568: select every tile at 100 % text and check that no label crosses the tile edge.
  - Then raise the text size to 200 % without reloading (iOS Dynamic Type, Android font scale, or the Chrome default-font-size setting). Expected: 2 columns, every label on ≤ 2 lines, nothing clipped.

### P3 — Screen-reader output: group name and summary may be read twice
- **Related rule:** SG-41, SG-25 (CategoryGrid acceptance 7: "announced once")
- **Location:** `/home/claude/expense-tracker/src/components/category/CategoryGrid.tsx:51-52`, `/home/claude/expense-tracker/src/components/category/CategoryGrid.tsx:68`, `/home/claude/expense-tracker/src/pages/CategorySelectionPage.tsx:22`
- **Code:** `aria-describedby={summaryId}` together with `<p id={summaryId} className={styles.summary} role="status">`
- **Why unconfirmed:**
  - The summary is both a polite live region and the group's description. A screen reader may announce a change through the live region and then read it again as the group description when focus moves between tiles.
  - The page `section` and the inner group are both labelled by the heading, so "Choose categories" may be spoken twice when entering the grid.
  - The real wording depends on the screen reader.
- **How to verify:** With VoiceOver (iOS) and TalkBack (Android):
  - Toggle Food and then Charity. Expected: "2 selected: Food, Charity" spoken once per change, and each tile read as "Food, checkbox, checked".
  - An inactive tile should be read as unavailable (test with modified data, since every category is currently `active: true`).

### P4 — Pressed feedback on touch devices
- **Related rule:** SG-19 ("immediate response within 100 ms")
- **Location:** `/home/claude/expense-tracker/src/components/category/CategoryTile.module.css:101-104`
- **Code:** `.tile:not([data-disabled]):active {`
- **Why unconfirmed:** iOS Safari applies `:active` on touch only under certain conditions, and the native highlight is turned off (`-webkit-tap-highlight-color: transparent`, line 26). If `:active` does not fire, a touch user gets no pressed feedback.
- **How to verify:** On a physical iPhone and an Android phone, press and hold a tile. Expected: the fill turns `#F1F3F6` within 100 ms, and a disabled tile shows no pressed state.

## Undocumented implementation choices / spec gaps

- `/home/claude/expense-tracker/src/pages/CategorySelectionPage.tsx:11-14`: the page has no PrimaryActionButton and no ExpenseProgressIndicator, and the selection summary therefore does not sit "above the primary button". The file says it is a standalone page built ahead of the Step 2 flow. **Needs a human decision:** once it becomes the Step 2 screen, SG-01, SG-20, SG-25 (summary placement) and SG-28 apply, and leaving these out would then be a violation.
- `/home/claude/expense-tracker/src/pages/CategorySelectionPage.tsx:25`: the heading reads "Choose categories", but CategoryGrid §4 proposes "What was it for?". The spec calls this a content proposal still to be confirmed, and no SG rule covers it.
- `/home/claude/expense-tracker/src/components/category/CategoryTile.module.css:54` and `:88`: `border-radius: 50%` is used on the icon plate and badge, although `radius.full` exists and lists CategoryTile in its trace. The result looks the same and no rule requires the token. Using `var(--radius-full)` would be more consistent (not applied).
- `/home/claude/expense-tracker/src/components/category/CategoryTile.module.css:26`: `-webkit-tap-highlight-color: transparent` uses a named colour keyword to turn off the browser highlight, not as a design colour. No rule covers it (see P4).
- `/home/claude/expense-tracker/src/components/category/CategoryTile.tsx:33` with `CategoryTile.module.css:131-136`: no spec covers a tile that is both selected and disabled (e.g. a restored selection for a category that later became inactive). The disabled fill and border override the selected ones while the badge stays visible, and `CategoryGrid.tsx:40` still lists the label in the summary. This is a spec gap.
- `/home/claude/expense-tracker/src/components/category/CategoryGrid.tsx:28`: "Other last" (SG-26) depends entirely on `displayOrder` in the data (Other = 9 in `categories.json:83`), which the build-time `scripts/validate-categories.mjs` reportedly checks. The grid does not enforce it, and I did not audit that script.
- `/home/claude/expense-tracker/src/components/category/CategoryTile.tsx:43`: if an icon is not registered, the tile renders label-only and logs an error only in development. This would break SG-22, but all 9 current icons are registered (`categoryIcons.ts:19-29`).
- Known gaps used as documented:
  - G-3: focus offset reuses `--component-primary-action-button-focused-ring-offset` (`CategoryTile.module.css:127`).
  - G-6: `--color-text-primary` for the tile label and icon (`:23`).
  - G-7: `--space-1` badge inset (`:81-82`).
  - `.badgeIcon` is set to 70 % of the badge (`:95-96`) because no token exists.
- Spec and token inconsistencies to report (style guide wins):
  - `tokens.json:3190` describes `component.categoryGrid.columns` as "360-430px phones", and CategoryTile.md §8 says "Phone 360–430 px". SG-23 v0.2 says 3 columns for 320–430 px.
  - `tokens.json` metadata (lines 2, 6) says it was derived from STYLE_GUIDE **v0.1**, while both specs cite v0.3.

## Checked and compliant

- **SG-06 / SG-08 / SG-09 (colour roles):**
  - Default boundary: `--component-category-tile-default-border` → `#8A919C`, 3.18:1 (`CategoryTile.module.css:21`).
  - Divider grey only on the disabled tile (`:133`), as §C.5 specifies.
  - Accent used only for the selected border, badge and focus ring.
  - No raw colours, and no `#8A919C` used as text.
- **SG-13 / SG-43 (typography):**
  - Tile label uses `typography.label.tile` (15/20, 500) via tokens that output `rem` (`:71-75`).
  - Heading uses Heading 1 (`CategorySelectionPage.module.css:16-20`).
  - Helper and summary use body default (`CategorySelectionPage.module.css:26-30`, `CategoryGrid.module.css:39-43`).
  - No font size in `px` and no text below 12 px.
- **SG-27:** labels are centred and wrap. No `ellipsis`, `line-clamp`, `nowrap` + `overflow: hidden`, or shrink-to-fit on label containers (`CategoryTile.module.css:66-76`). The only `nowrap` is in the accepted visually-hidden input (`:42`).
- **SG-23 / SG-38 / SG-39 (layout):**
  - 3 columns from a token, 12 px gap, 4 columns only from 431 px (accepted pattern), 2 columns under large text (`CategoryGrid.module.css:14-15, 24-33`).
  - `min-height` 96 px with no fixed height; 12 px radius and padding.
  - All spacing from tokens on the SG-38 scale (8 / 12 / 24 px).
  - 480 px cap and 16 px gutters come from AppShell.
- **SG-17:** tiles are at least 88 × 96 px with a 12 px gap.
- **SG-24 / SG-42 (selected state):**
  - Tint fill, 2 px accent border, white plate, label weight 600 (`CategoryTile.module.css:107-118`).
  - Check badge rendered whenever the tile is selected (`CategoryTile.tsx:48-52`).
  - 150 ms transition from a token.
  - Disabled state: fill, divider border, tertiary label, icon at 0.4 opacity (`CategoryTile.module.css:131-140`).
- **SG-19 (states):** pressed uses the subtle fill at 100 ms and is suppressed on disabled tiles (`:101-104`). There is no `outline: none`.
- **SG-44:** both durations are ≤ 300 ms. `prefers-reduced-motion` removes the transitions on the tile and plate (`:143-148`), and nothing translates or scales.
- **SG-21 / SG-26 (equal weight):** no per-category or per-position styling. `data-category-id` (`CategoryTile.tsx:40`) is not targeted by any CSS, and Other uses the same tokens.
- **SG-22:** every tile renders an icon and a visible label. The icon is hidden from assistive technology; the label is not.
- **SG-25 / SG-26 (selection logic):** native checkbox semantics. The toggle only adds or removes one ID (`CategoryGrid.tsx:33-38`), with no limit and no exclusivity. A live summary uses `role="status"` with the spec's wording (`:41-44, 68`).
- **SG-45:** inactive categories render in place with `disabled={!category.active}` (`CategoryGrid.tsx:63`). Nothing is filtered out, and the native `disabled` attribute blocks tap, Space and assistive-technology activation (`CategoryTile.tsx:38`).
- **SG-41:** the tile is a real checkbox named by its visible label, and the grid is a labelled `role="group"` (`CategoryGrid.tsx:50-51`). There is no `role="radio"`, no `tabIndex={-1}`, and no click handler on a non-focusable element.
- **SG-26 reachability:** a static estimate puts Other's row at about 480 px from the top on 360 × 640 (9 tiles in 3 rows), so it should be visible without scrolling. Confirm visually.

No files were changed.
