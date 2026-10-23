# SpendingTrendCard — Component Specification

**Version:** 0.1 (draft) | **Date:** 24 October 2026
**Sources:** `docs/PRODUCT_VISION.md` v1.1 · `design-system/STYLE_GUIDE.md` v0.1 · `design-system/tokens.json` v0.1.0 · `references/REFERENCE_CATALOG.md` v0.6
**Primary reference:** REF-G02 (Groww — values above a simple line chart, solid vs dotted series, time-range pill row)
**Status:** Implementation-ready specification. No code.

---

## 1. Purpose and role

SpendingTrendCard sits directly below SpendingSummaryCard and shows **how spending moved over time**. It contains the period total, one simple chart and the time-range selector that controls the dashboard's period. It supports understanding, not analysis: one series, minimal chrome, and a text summary that says what the chart shows.

## 2. Relevant product requirements

| Requirement | Source |
|---|---|
| Calm, readable dashboard with useful trends. | Vision §6 |
| Do not double-count the same transaction because it has multiple tags. | Vision §6, §9 |
| Groww: simple, comprehensible financial summary and insights; no investment complexity. | Vision §6, §7 |
| Progressive disclosure of detail. | Vision §7 |

## 3. Visual anatomy

```
 ┌───────────────────────────────────────────┐
 │ (1) Spending trend                        │
 │ (2) ₹1,24,350  this month                 │
 │ (3) ↑ ₹8,200 vs last month                │
 │ ┌───────────────────────────────────────┐ │
 │ │ (4)            ╱‾‾‾╲      ╱           │ │
 │ │        ___╱‾‾‾      ‾‾‾‾‾             │ │
 │ │ (5) 1     8     15     22     29      │ │
 │ └───────────────────────────────────────┘ │
 │ (6) (Week) (Month) (3M) (Year)            │
 │ (7) See breakdown ›                       │
 └───────────────────────────────────────────┘
```

| # | Part | Description |
|---|---|---|
| 1 | Title | Card title. |
| 2 | Period total | The number the chart supports; tabular figures. Same distinct-expense total as SpendingSummaryCard. |
| 3 | Change line | Optional neutral change vs previous period (arrow + sign). |
| 4 | Plot | Single accent line (Month, 3 Months, Year) or simple columns (Week). No gridlines. No comparison series in the initial release (D-13). |
| 5 | X-axis labels | Few, short labels (dates, weeks or months). No y-axis gridlines; y-axis labels optional, max 3. |
| 6 | Time-range control | Pill row directly below the chart; exactly one active. |
| 7 | Detail link | Text button to the category breakdown / period detail. |

## 4. Properties and accepted values

| Property | Type | Accepted values | Default | Notes |
|---|---|---|---|---|
| `range` | enum | `week`, `month`, `3months`, `year` | `month` | **The shared dashboard reporting period** (D-11, approved) — the same value as SpendingSummaryCard's `period`. Option set proposed by SG-36 (still an open question in Style Guide Appendix B). |
| `series` | list of points | (bucket date, amount ≥ 0) | — (required) | Each bucket's amount is the sum of **distinct** expenses in that bucket (SG-34). |
| `bucket` | derived | `day` for week and month; `week` for 3 months; `month` for year | from `range` | See open decision D-12. |
| `chartType` | derived | `columns` for week; `line` otherwise | from `range` | SG-35. |
| `comparison` | — | — | — | **Excluded from the initial release** (D-13, approved). Tokens for a future dashed comparison line exist but are not rendered. |
| `total` | decimal amount | ≥ 0 | — (required) | Must equal SpendingSummaryCard's total for the same period. |
| `summaryText` | text | One sentence describing the trend | generated | Required for screen readers (SG-41). |
| `state` | enum | `ready`, `loading`, `empty`, `error` | `ready` | See §5. |
| `onRangeChange` | action | — | — (required) | Changes the shared dashboard period; this card and SpendingSummaryCard update together. |
| `onOpenBreakdown` | action | — | — | Opens breakdown/detail (SG-04). |

## 5. States

### 5.1 Card states

| State | Content | Tokens |
|---|---|---|
| **Ready** | Title, total, chart, time-range row, detail link. | §9 |
| **Empty / too little data** (< 2 buckets with spending) | Total shown; chart area replaced by "Add a few more expenses to see your trend"; time-range row still usable. | `typography.body.default`, `color.text.secondary` |
| **Loading** | Card frame with subtle-grey placeholder for total and plot; time-range row visible but inactive. | `color.surface.subtle` |
| **Error** | Icon + "Couldn't load your trend." + **Try again** text button. | `color.status.error.foreground`, `color.text.accent` |

### 5.2 Time-range option states

| State | Appearance | Tokens |
|---|---|---|
| **Inactive** | No fill or border; secondary text; regular weight. | `component.spendingTrendCard.timeRange.inactiveForeground` |
| **Active** | Tint fill, 2 px accent outline, primary text, semibold. Exactly one active. | `component.spendingTrendCard.timeRange.activeBackground`, `component.spendingTrendCard.timeRange.activeBorder`, `component.spendingTrendCard.timeRange.activeBorderWidth`, `component.spendingTrendCard.timeRange.activeForeground` |
| **Pressed** | Subtle grey fill within 100 ms. | `color.surface.subtle`, `motion.duration.pressFeedback` |
| **Focused** | Standard focus ring. | `color.focus.ring`, `borderWidth.thick` |
| **Disabled** | Only while loading: options inactive, announced as unavailable. | — |

### 5.3 Chart point inspection

| State | Appearance |
|---|---|
| **Inspecting** | While the user touches or drags on the plot, a vertical marker and a small label show the bucket and its amount (e.g. "12 Oct · ₹4,200"). Released → label hides. |

## 6. Interaction behavior and feedback

1. **Number before chart (SG-35).** The period total is always shown above the chart; the chart supports it.
2. **Changing range (SG-36).** Tapping an option makes it active, then the total, change line, chart and SpendingSummaryCard all update together. Without reduced motion the chart may transition within `motion.duration.max`; with reduced motion it switches instantly (SG-44).
3. **Inspecting values.** Touch-and-drag on the plot shows the nearest bucket's value. Taps on the plot do **not** navigate, so inspection and navigation never conflict.
4. **Detail (SG-04).** "See breakdown" opens the category breakdown for the active period (out of scope for this package; it must carry the SG-34 overlap note).
5. **No double counting (SG-34).** Each bucket sums distinct expenses; tags never multiply an amount.
6. **Neutral presentation (SG-11).** Line and columns use the accent color; the change line is neutral with arrow + sign.
7. **Formatting (SG-15).** Total uses full Indian-grouped value. Axis labels may use short forms (₹50K, ₹1.2L) with full values in the inspection label and the text summary.
8. **Comparison series — not in the initial release (D-13).** SG-35 permits an optional previous-period line. It is deferred. If added later, it must be a dashed grey line labeled in text and never distinguished by color alone, using the comparison tokens listed in §9.

## 7. Accessibility requirements

| Requirement | Detail | Rule |
|---|---|---|
| Text summary | The chart has a concise text alternative, e.g. "Spending this month: ₹1,24,350. Highest on 12 October at ₹9,800. Up ₹8,200 from last month." | SG-41 |
| Data access | A "View as list" option (or equivalent accessible list) exposes each bucket and amount; amounts read in full. | SG-15, SG-41 |
| Time-range semantics | Pill row is a single-select group (tabs or radio group) labelled "Time range"; each option has a full name ("3 months", not "3M"). | SG-36, SG-41 |
| Active option cue | Outline + weight + tint (not color alone). | SG-36, SG-42 |
| Contrast | Line/columns 6.70:1 on white; comparison 4.83:1; inactive labels 7.56:1; active border 6.03:1 on tint. | SG-09, SG-35 |
| Touch targets | Each option ≥ 48 px tall with ≥ 8 px gaps; plot inspection hit area spans the whole plot. | SG-17, SG-36 |
| Updates | When the range changes, the new total is announced once via a polite live region. | SG-41 |
| Reduced motion | No chart animation; inspection marker appears without animation. | SG-44 |

**Verification status:** component-level accessibility is **unverified**, including chart summary quality and list alternative.

## 8. Responsive behavior

| Context | Behavior | Rule / token |
|---|---|---|
| Phone 320 px | Four pills share the row; if spelled-out labels do not fit, use "W / M / 3M / Y" visually with full accessible names. | SG-36 — see open decision D-14 |
| Phone 360–430 px | Spelled-out labels "Week, Month, 3 months, Year" where they fit. | SG-36 |
| Plot size | Full card content width. Plot height is **fixed per viewport** so the card does not jump between ranges. Proposed responsive default (G-9, pending visual testing): 50 % of the card's content width (viewport − 2 × 16 px gutter − 2 × 16 px card padding), clamped to 144–200 px — 144 px at 320 px viewport, 148 px at 360 px, 163 px at 390 px, 183 px at 430 px and 200 px at the 480 px content cap. | SG-35 — gap G-9 |
| Tablet / web | Within the 480 px content column. | SG-39, `layout.screen.maxContentWidth` |
| Large text | Pill row wraps to two lines rather than shrinking text; axis labels reduce to first and last only. | SG-43 |
| X-axis labels | Max ~5 labels; never rotated. | SG-35 |

## 9. Design tokens used

| Token path | Resolved value |
|---|---|
| `component.card.background` → `color.surface.default` | `#FFFFFF` |
| `component.card.padding` → `layout.card.padding` | 16 px |
| `component.card.radius` → `radius.md` | 12 px *(proposal)* |
| `component.card.border` → `color.border.divider` | `#E5E7EB` *(proposal)* |
| `component.card.borderWidth` → `borderWidth.thin` | 1 px |
| `component.spendingTrendCard.lineWidth` → `borderWidth.thick` | 2 px *(proposal)* |
| `component.spendingTrendCard.lineColor` → `color.chart.seriesPrimary` | `#1D4ED8` |
| `component.spendingTrendCard.comparisonColor` → `color.chart.seriesComparison` | `#6B7280` *(proposal; not rendered in initial release)* |
| `component.spendingTrendCard.comparisonStyle` | dashed *(not rendered in initial release)* |
| `component.spendingTrendCard.timeRange.minHeight` → `size.touchTarget.min` | 48 px |
| `component.spendingTrendCard.timeRange.radius` → `radius.full` | 9999 px |
| `component.spendingTrendCard.timeRange.gap` → `space.2` | 8 px |
| `component.spendingTrendCard.timeRange.inactiveForeground` → `color.text.secondary` | `#4B5563` *(proposal)* |
| `component.spendingTrendCard.timeRange.activeBackground` → `color.selection.background` | `#EEF3FF` |
| `component.spendingTrendCard.timeRange.activeBorder` → `color.selection.border` | `#1D4ED8` |
| `component.spendingTrendCard.timeRange.activeBorderWidth` → `borderWidth.thick` | 2 px |
| `component.spendingTrendCard.timeRange.activeForeground` → `color.text.primary` | `#14161A` |
| `typography.heading.2` | Inter 20 px / 28 px, 600 (title; **period total** — existing token adopted per G-10, with tabular figures applied per SG-12) |
| `typography.body.default` | Inter 15 px / 22 px, 400 (change line, pill labels, inspection label) |
| `font.weight.semibold` | 600 (active pill label) |
| `typography.caption` | Inter 13 px / 18 px, 400 (axis labels) |
| `color.text.tertiary` | `#6B7280` (axis labels) |
| `color.amount.foreground` | `#14161A` (period total) |
| `color.text.accent` | `#1D4ED8` (See breakdown, Try again) |
| `layout.card.contentGap` → `space.3` | 12 px *(proposal)* |
| `color.surface.subtle` | `#F1F3F6` |
| `color.focus.ring` | `#1D4ED8` |
| `borderWidth.thick` | 2 px |
| `color.status.error.foreground` | `#B91C1C` |
| `motion.duration.pressFeedback` | 100 ms |
| `motion.duration.max` | 300 ms |
| `layout.screen.maxContentWidth` | 480 px |

## 10. Applicable Style Guide rules

| Rule | How it applies |
|---|---|
| SG-03 Three-Level Information Hierarchy | Total → chart → controls. |
| SG-04 Progressive Disclosure | Breakdown one tap away. |
| SG-08 Blue Accent Reserved for Selection and Focus | Line color, active range, focus. |
| SG-09 Text Contrast Floor | Labels and axis text. |
| SG-11 Spending Amounts Are Neutral | No red/green; neutral change line. |
| SG-12 One Sans-Serif Family with Tabular Figures | Period total digits. |
| SG-15 Indian Number Formatting | Total, axis short forms, full values available. |
| SG-17 Minimum Touch Targets | Pill height and gaps. |
| SG-34 No Double Counting; Overlap Is Explained | Distinct-expense buckets. |
| SG-35 Simple, Single-Series Trend Chart | One line/columns; optional dashed comparison; no gridlines. |
| SG-36 Clear Time-Range Control | Pill row; one active; non-color cue. |
| SG-39 Mobile-First Layout Frame | Width cap. |
| SG-41 Screen Reader Semantics | Text summary, list alternative, range group. |
| SG-42 Non-Color Interaction States | Active range outline; dashed comparison. |
| SG-43 Text Scaling | Pills wrap; fewer axis labels. |
| SG-44 Reduced Motion | No chart animation. |

## 11. Acceptance criteria

1. The period total appears above the chart and equals SpendingSummaryCard's total for the same period. *(SG-34, SG-35)*
2. A ₹1,000 expense tagged Food + Charity adds ₹1,000 (not ₹2,000) to its bucket. *(SG-34)*
3. Exactly one series is drawn in the initial release; no comparison line appears. *(SG-35; D-13)*
4. Exactly one time range is active; the active option is identifiable in grayscale. *(SG-36, SG-42)*
5. Each time-range option has a ≥ 48 px hit area at 320 px width; options never overlap. *(SG-17, SG-36)*
6. Changing the range changes the shared dashboard period: the total, chart and SpendingSummaryCard update together and show the same period. *(SG-36; D-11)*
11. The plot height does not change when switching ranges on the same device. *(SG-35; G-9)*
7. Screen readers get a text summary and can reach every bucket's value in full. *(SG-15, SG-41)*
8. No amount, line or column uses success or error color. *(SG-11)*
9. With reduced motion, the chart changes without animation. *(SG-44)*
10. "See breakdown" opens the breakdown in one tap. *(SG-04)*

## 12. Traceability

| Component property | Design token | Style Guide rule | Reference |
|---|---|---|---|
| Card surface / padding / radius / outline | `component.card.background`, `component.card.padding`, `component.card.radius`, `component.card.border` | SG-06, SG-40 | REF-G02 |
| Line width | `component.spendingTrendCard.lineWidth` | SG-35 *(proposal value)* | REF-G02 |
| Line color | `component.spendingTrendCard.lineColor` | SG-08, SG-35 | REF-G02 |
| Comparison color *(deferred, D-13)* | `component.spendingTrendCard.comparisonColor` | SG-35 *(proposal value)* | REF-G02 |
| Comparison line style *(deferred, D-13)* | `component.spendingTrendCard.comparisonStyle` | SG-35, SG-42 | REF-G02 (dotted "Invested" line) |
| Range option height | `component.spendingTrendCard.timeRange.minHeight` | SG-17, SG-36 | REF-G02 |
| Range option shape | `component.spendingTrendCard.timeRange.radius` | SG-36 | REF-G02 (pill) |
| Range option gap | `component.spendingTrendCard.timeRange.gap` | SG-17, SG-36 | — |
| Inactive label color | `component.spendingTrendCard.timeRange.inactiveForeground` | SG-36 *(proposal value)* | — |
| Active fill | `component.spendingTrendCard.timeRange.activeBackground` | SG-08, SG-36 | — |
| Active outline color | `component.spendingTrendCard.timeRange.activeBorder` | SG-36, SG-42 | REF-G02 (outlined "All") |
| Active outline width | `component.spendingTrendCard.timeRange.activeBorderWidth` | SG-36 | REF-G02 |
| Active label color | `component.spendingTrendCard.timeRange.activeForeground` | SG-36 | — |
| Range label style | `typography.body.default`, `font.weight.semibold` *(gap G-4)* | SG-36 | — |
| Title / period total style | `typography.heading.2`, `color.amount.foreground` | SG-12, SG-13, SG-35 | REF-G02 |
| Axis labels | `typography.caption`, `color.text.tertiary` | SG-09, SG-35 | — |
| Content spacing | `layout.card.contentGap` | SG-38 *(proposal value)* | — |
| Transition limit | `motion.duration.max` | SG-44 | — |
| Distinct-expense buckets | — (behavioral) | SG-34 | — |
| Shared dashboard reporting period | — (behavioral; decision D-11) | SG-36 | — |
| Plot height (responsive default) | — *(gap G-9; proposed, untokenized)* | SG-35 | — |
| Breakdown one tap away | — (behavioral) | SG-04 | — |
| Short-form axis values, full values available | — (behavioral) | SG-15 | — |
| Text summary and list alternative | — (behavioral) | SG-41 | — |

**Complete chain example:**
REF-G02 (time-range row with the active "All" option outlined) ⟶ **SG-36** Clear Time-Range Control ⟶ `color.palette.blue.700` ⟶ `color.selection.border` ⟶ `component.spendingTrendCard.timeRange.activeBorder` ⟶ active range outline `#1D4ED8`.

*(⟶ reads "is the source of". In the token tables above, → means "aliases".)*

### Known gaps (reported, not resolved)

- **G-4 — Time-range label typography.** No typography token for pill labels. Shared `typography.body.default` is used, with `font.weight.semibold` for the active option.
- **G-9 — Plot height (proposed default, pending visual testing).** No token for chart plot height. Proposed responsive default: 50 % of card content width, clamped to 144–200 px (bounds on the 4-point scale); examples in §8. To be confirmed in visual testing before tokenizing.
- **G-10 — Period total style.** No amount style sits between `typography.amount.headline` (36 px, used by SpendingSummaryCard) and `typography.amount.inline` (17 px). **Existing token adopted:** `typography.heading.2` (20 px / 600), with tabular figures applied per SG-12, so the trend total does not compete with the dashboard headline (SG-03). The gap is retained as a proposed token: an intermediate amount style that carries the tabular-numerals extension itself.
