# SpendingSummaryCard — Component Specification

**Version:** 0.1 (draft) | **Date:** 24 October 2026
**Sources:** `docs/PRODUCT_VISION.md` v1.1 · `design-system/STYLE_GUIDE.md` v0.1 · `design-system/tokens.json` v0.1.0 · `references/REFERENCE_CATALOG.md` v0.6
**Primary reference:** REF-G01 (Groww — overline label, dominant amount, subordinate label/value rows)
**Status:** Implementation-ready specification. No code.

---

## 1. Purpose and role

SpendingSummaryCard is the first thing on the dashboard. It answers one question — **"How much did I spend in this period?"** — with one large, trustworthy number, followed by at most three supporting facts. Detail is one tap away, never on the card itself.

## 2. Relevant product requirements

| Requirement | Source |
|---|---|
| Calm, readable dashboard showing total spending. | Vision §6 |
| **Do not double-count a transaction in the total because it has multiple tags.** | Vision §6, §9 |
| Groww-inspired hierarchy and readability, not investment complexity. | Vision §6, §7 |
| Visibility and understanding over restriction; no judgment. | Vision §10 |
| Progressive disclosure: only what the current decision needs. | Vision §7 |

## 3. Visual anatomy

```
 ┌───────────────────────────────────────────┐
 │ (1) THIS MONTH ▾                  (6) ›   │
 │ (2) ₹1,24,350                             │
 │ ───────────────────────────────── (3)     │
 │ (4) Expenses               42             │
 │     Uncategorized           5             │
 │     vs last month       ↑ ₹8,200          │
 └───────────────────────────────────────────┘
   (5) card surface with light outline
```

| # | Part | Description |
|---|---|---|
| 1 | Period label | Overline, uppercase, e.g. THIS MONTH. Reflects the selected period. |
| 2 | Total | Headline amount; largest text on the dashboard; no decimals. |
| 3 | Divider | Hairline separating total from supporting metrics. |
| 4 | Supporting metrics | Up to 3 rows: label left (secondary), value right (primary, tabular). |
| 5 | Card | White surface, rounded corners, decorative light outline. |
| 6 | Detail affordance | Chevron indicating the card opens period detail. |

## 4. Properties and accepted values

| Property | Type | Accepted values | Default | Notes |
|---|---|---|---|---|
| `period` | enum | `week`, `month`, `3months`, `year` | `month` | **Shared dashboard reporting period** (D-11, approved). Owned by the dashboard, not by this card; the same value drives SpendingTrendCard. |
| `periodLabel` | derived text | `This week`, `This month`, `Last 3 months`, `This year` (rendered uppercase) | from `period` | Never set independently of `period`. |
| `total` | decimal amount | ≥ 0 | — (required) | **Sum of distinct expenses** in the period (SG-34). Displayed rounded to the nearest rupee. |
| `metrics` | list (0–3) | Items from: `Expenses` (count), `Uncategorized` (count), `vs last period` (signed amount) | `Expenses`, `Uncategorized`, `vs last period` | Max 3 (SG-33). Labels in plain language; no investment terms. |
| `state` | enum | `ready`, `loading`, `empty`, `error` | `ready` | See §5. |
| `onOpenDetail` | action | — | — | Opens period detail / transaction list (SG-04). |
| `onRetry` | action | — | — | Used in `error` state. |

**Calculation rules (SG-34):**
- `total` = Σ amount of each expense dated in the period, **counted once regardless of how many tags it has**. Uncategorized and Unknown expenses are included.
- `Expenses` = count of distinct expenses.
- `vs last period` = this period's total − previous period's total (same distinct-expense rule).

## 5. States

| State | Content | Tokens |
|---|---|---|
| **Ready** | Period label, total, divider, metrics, chevron. | §9 |
| **Empty** (no expenses in period) | Total "₹0"; one line "No expenses yet this month"; no metrics; no chevron. | `typography.body.default`, `color.text.secondary` |
| **Loading** | Card frame with placeholder blocks in subtle grey where the total and metrics will appear; no fake numbers; layout size unchanged. | `color.surface.subtle` |
| **Error** | "Couldn't load your spending." with an icon and a **Try again** text button. Last known values are not shown as if current. | `color.status.error.foreground`, `color.text.accent` |
| **Pressed** | Card shows subtle grey fill under content within 100 ms. | `color.surface.subtle`, `motion.duration.pressFeedback` |
| **Focused** | Standard focus ring around the card. | `color.focus.ring`, `borderWidth.thick` |

Disabled and selected states do not apply.

## 6. Interaction behavior and feedback

1. **Summary first (SG-04, SG-33).** The card shows only the total and ≤ 3 metrics. All breakdowns live elsewhere.
2. **Open detail (SG-04).** Tapping anywhere on the card opens the period detail (transaction list for the period). One tap deep; Back returns to the dashboard at the same scroll position.
3. **Neutral amounts (SG-11).** Total and all amounts use primary text color. "vs last period" shows an arrow (↑/↓) and sign in neutral text — never red or green.
4. **Number formatting (SG-14, SG-15).** Headline total has no decimals and uses Indian grouping in en-IN. Prefer the full value; if it cannot fit on one line even at the minimum size (§8), an abbreviation such as ₹1.2Cr may be used, and the full value is shown on tap (detail) and given to screen readers. See open decision D-10.
5. **No double counting (SG-34).** Because the card shows only distinct-expense figures, no overlap note is needed here. The overlap note is required wherever per-tag totals appear (category breakdown, out of scope for this package).
6. **Shared reporting period (D-11).** The dashboard holds one reporting period. SpendingTrendCard's time-range control changes it; this card and the trend card always show the same period and the same distinct-expense total. Label and figures update together; with reduced motion, without animation.

## 7. Accessibility requirements

| Requirement | Detail | Rule |
|---|---|---|
| Role and name | Card is one button: "This month, spent one lakh twenty-four thousand three hundred fifty rupees. 42 expenses, 5 uncategorized, up eight thousand two hundred rupees versus last month. Opens details." | SG-41 |
| Full values | Abbreviated values (if any) are read in full. | SG-15, SG-41 |
| Heading | Period label is exposed as a heading so screen-reader users can jump to it. | SG-41 |
| Change direction | Spoken as "up/down", not via arrow glyph names or color. | SG-11, SG-41, SG-42 |
| Contrast | Total 18.11:1; metric labels 7.56:1; overline 4.83:1. Card outline is decorative; the **chevron** is the interactive cue (card boundary alone is 1.24:1). | SG-06, SG-09 |
| Touch target | Whole card is the target (well above 48 px). | SG-17 |
| States | Loading announced as busy; error message announced once. | SG-41 |
| Text scaling | Total shrinks to fit one line down to Heading 1 size, then wraps; metrics wrap. | SG-43 |

**Verification status:** component-level accessibility is **unverified**.

## 8. Responsive behavior

| Context | Behavior | Rule / token |
|---|---|---|
| Phone | Full width within gutters; card padding 16 px. | SG-39, SG-40, `component.card.padding` |
| Tablet / web | Within the 480 px content column. | SG-39, `layout.screen.maxContentWidth` |
| Long totals / large text | Headline shrinks to fit one line, minimum `font.size.2xl` (Heading 1 size), then wraps. | SG-43 |
| Metric rows | Label left, value right; if they collide at large text, value moves below its label (still right-aligned). | SG-40, SG-43 |
| Spacing to next card | 24 px. | `layout.card.gap` |

## 9. Design tokens used

| Token path | Resolved value |
|---|---|
| `component.card.background` → `color.surface.default` | `#FFFFFF` |
| `component.card.padding` → `layout.card.padding` | 16 px |
| `component.card.radius` → `radius.md` | 12 px *(proposal)* |
| `component.card.border` → `color.border.divider` | `#E5E7EB` *(proposal)* |
| `component.card.borderWidth` → `borderWidth.thin` | 1 px |
| `component.spendingSummaryCard.periodLabel` → `typography.overline` | Inter 12 px / 16 px, 600, uppercase, 0.96 px tracking |
| `component.spendingSummaryCard.totalTypography` → `typography.amount.headline` | Inter 36 px / 44 px, 600, tabular |
| `component.spendingSummaryCard.totalForeground` → `color.amount.foreground` | `#14161A` |
| `component.spendingSummaryCard.metricTypography` → `typography.body.default` | Inter 15 px / 22 px, 400 |
| `component.spendingSummaryCard.metricForeground` → `color.text.secondary` | `#4B5563` (metric labels) |
| `component.spendingSummaryCard.maxSupportingMetrics` | 3 |
| `color.text.primary` | `#14161A` (metric values) |
| `color.text.tertiary` | `#6B7280` (period label color) |
| `color.border.divider` | `#E5E7EB` (divider) |
| `layout.card.contentGap` → `space.3` | 12 px *(proposal)* |
| `layout.card.gap` → `space.6` | 24 px *(proposal)* |
| `size.icon.md` | 24 px (chevron, error icon) |
| `color.surface.subtle` | `#F1F3F6` (pressed, loading placeholders) |
| `color.focus.ring` | `#1D4ED8` |
| `borderWidth.thick` | 2 px (focus ring) |
| `color.status.error.foreground` | `#B91C1C` (error icon/text) |
| `color.text.accent` | `#1D4ED8` (Try again) |
| `font.size.2xl` | 24 px (minimum headline size when shrinking) |
| `motion.duration.pressFeedback` | 100 ms |
| `layout.screen.maxContentWidth` | 480 px |

## 10. Applicable Style Guide rules

| Rule | How it applies |
|---|---|
| SG-03 Three-Level Information Hierarchy | Total ≫ metrics ≫ label. |
| SG-04 Progressive Disclosure | Detail one tap away; nothing detailed on the card. |
| SG-06 Neutral Light Surfaces with Identifiable Controls | Chevron as the interactive cue. |
| SG-09 Text Contrast Floor | All text pairs. |
| SG-11 Spending Amounts Are Neutral | No red/green on amounts or change. |
| SG-13 Type Scale | Overline, headline, body. |
| SG-14 Financial Amount Typography | No decimals in headline; tabular. |
| SG-15 Indian Number Formatting | Grouping; abbreviation only with full value available. |
| SG-33 Headline Spending Total | Overline + total + ≤ 3 metrics. |
| SG-34 No Double Counting; Overlap Is Explained | Distinct-expense totals. |
| SG-39 Mobile-First Layout Frame | Width cap. |
| SG-40 Consistent Alignment | Labels left, values right; 16 px padding. |
| SG-41 Screen Reader Semantics | Combined accessible name; full values. |
| SG-43 Text Scaling | Shrink-then-wrap. |

## 11. Acceptance criteria

1. The total is the largest text on the dashboard and has no decimal part. *(SG-14, SG-33)*
2. With test data containing one ₹1,000 expense tagged Food + Charity and one ₹500 expense tagged Food, the total shows ₹1,500 and Expenses shows 2. *(SG-34)*
3. No more than 3 supporting metrics are shown. *(SG-33)*
4. No amount or change value uses success or error color; change direction is conveyed by arrow + sign + spoken "up/down". *(SG-11, SG-42)*
5. 1500000 displays as "₹15,00,000" in en-IN. Any abbreviated total is read in full by screen readers and shown in full on the detail screen. *(SG-15)*
6. Tapping the card opens period detail in one tap; Back returns to the same dashboard scroll position. *(SG-04)*
7. Screen readers read the period, total, metrics and "opens details" in one announcement. *(SG-41)*
8. Empty, loading and error states never show placeholder numbers as real data. *(SG-32)*
9. At 200 % text, the total is fully visible (shrunk to ≥ 24 px or wrapped). *(SG-43)*
10. After changing the time range on SpendingTrendCard, this card shows the same period and the same total as the trend card. *(SG-34, SG-36)*

## 12. Traceability

| Component property | Design token | Style Guide rule | Reference |
|---|---|---|---|
| Card surface | `component.card.background` | SG-06 | REF-G01 |
| Card padding | `component.card.padding` | SG-40 | REF-G01 |
| Card radius | `component.card.radius` | SG-06 *(proposal value)* | REF-G01 |
| Card outline | `component.card.border`, `component.card.borderWidth` | SG-06 *(proposal value)* | REF-G01 |
| Period label style | `component.spendingSummaryCard.periodLabel` | SG-13, SG-33 | REF-G01 |
| Period label color | `color.text.tertiary` *(shared semantic)* | SG-03 | REF-G01 |
| Total style | `component.spendingSummaryCard.totalTypography` | SG-14, SG-33 | REF-G01 |
| Total color | `component.spendingSummaryCard.totalForeground` | SG-11 | — |
| Metric label style | `component.spendingSummaryCard.metricTypography` | SG-03, SG-33 | REF-G01 |
| Metric label color | `component.spendingSummaryCard.metricForeground` | SG-03 | REF-G01 |
| Metric value color | `color.text.primary` | SG-03, SG-40 | REF-G01 |
| Metric count limit | `component.spendingSummaryCard.maxSupportingMetrics` | SG-33 | — |
| Divider | `color.border.divider` | SG-06 | REF-G01 |
| Content gap | `layout.card.contentGap` | SG-38 *(proposal value)* | — |
| Gap to next card | `layout.card.gap` | SG-38 *(proposal value)* | — |
| Detail chevron | `size.icon.md` | SG-04, SG-06 | — |
| Focus ring | `color.focus.ring`, `borderWidth.thick` | SG-19 | — |
| Minimum headline size | `font.size.2xl` | SG-43 | — |
| Distinct-expense total | — (behavioral) | SG-34 | — |
| Indian grouping / abbreviation rule | — (behavioral) | SG-15 | REF-G01 |
| Detail one tap away | — (behavioral) | SG-04 | REF-G01 |
| Shared dashboard reporting period | — (behavioral; decision D-11) | SG-36 | — |
| Combined accessible announcement | — (behavioral) | SG-41 | — |

**Complete chain example:**
REF-G01 ("LONG TERM (5)" overline above "₹10,00,000" headline) ⟶ **SG-33** Headline Spending Total ⟶ `font.size.4xl` ⟶ `typography.amount.headline` ⟶ `component.spendingSummaryCard.totalTypography` ⟶ dashboard total at 36 px semibold.

*(⟶ reads "is the source of". In the token tables above, → means "aliases".)*
