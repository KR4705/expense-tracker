# Component Specifications — Expense Tracker

**Version:** 0.2 (for review in PR) | **Date:** 24 October 2026
**Design-system stage:** Step 3 — Component Specifications
**Sources (all from `main`):** `docs/PRODUCT_VISION.md` v1.1 · `design-system/STYLE_GUIDE.md` v0.1 · `design-system/tokens.json` v0.1.0 · `references/REFERENCE_CATALOG.md` v0.6

These specifications describe appearance and behavior only. They contain no application code. Neither the Style Guide nor `tokens.json` was modified to write them; gaps and contradictions are reported below for separate decision.

## 1. Index

| Component | Role | Primary reference | Spec |
|---|---|---|---|
| PrimaryActionButton | The one forward action on each entry screen | REF-U01 | [PrimaryActionButton.md](PrimaryActionButton.md) |
| CategoryTile | One selectable category (checkbox behavior) | REF-P01 | [CategoryTile.md](CategoryTile.md) |
| CategoryGrid | Category layout, multi-select set, Unknown exclusivity | REF-P01 | [CategoryGrid.md](CategoryGrid.md) |
| ExpenseProgressIndicator | Step position and back navigation | REF-D01 | [ExpenseProgressIndicator.md](ExpenseProgressIndicator.md) |
| AmountInput | Fast, accurate rupee entry | REF-G01, REF-G02 | [AmountInput.md](AmountInput.md) |
| SpendingSummaryCard | Headline spending total for the period | REF-G01 | [SpendingSummaryCard.md](SpendingSummaryCard.md) |
| SpendingTrendCard | Trend chart and time-range control | REF-G02 | [SpendingTrendCard.md](SpendingTrendCard.md) |

Every specification has the same twelve sections: purpose; product requirements; visual anatomy; properties; states; interaction behavior; accessibility; responsive behavior; tokens used; applicable rules; acceptance criteria; traceability.

**Notation.** In token tables, `a` → `b` means token *a* aliases token *b*. In chain examples, ⟶ means "is the source of". A property marked "— (behavioral)" has no token and traces directly to a behavioral rule.

## 2. Where the entry flow uses each component

| Step | Components |
|---|---|
| 1 — Amount | ExpenseProgressIndicator · AmountInput · PrimaryActionButton (`Continue`) |
| 2 — Categories | ExpenseProgressIndicator · CategoryGrid / CategoryTile · PrimaryActionButton (`Review`) |
| 3 — Review & save | ExpenseProgressIndicator · PrimaryActionButton (`Save expense`) |
| Save confirmation | PrimaryActionButton (`Add another`) |
| Dashboard | SpendingSummaryCard · SpendingTrendCard |

## 3. Behavioral rules without tokens

| Rule | Addressed in | How |
|---|---|---|
| **SG-04** Progressive Disclosure | SpendingSummaryCard §6.1–6.2; SpendingTrendCard §6.4 | Card shows total + ≤ 3 metrics only; detail and breakdown are one tap away; trend inspection never navigates. |
| **SG-15** Indian Number Formatting | AmountInput §6.2; SpendingSummaryCard §6.4; SpendingTrendCard §6.7 | Live en-IN grouping while typing; no abbreviations at entry; abbreviations on dashboard only when full value is shown on tap and read by screen readers. |
| **SG-25** Multi-Select Behavior | CategoryTile §4, §6–7; CategoryGrid §6.1, §7; PrimaryActionButton §5.4 | Tiles are checkboxes; 0…n selections; live summary; selections carry to Review; Review never disabled. |
| **SG-26** Unknown Is a First-Class Choice | CategoryTile §4 (`exclusive` variant); CategoryGrid §6.2 | Identical styling; always last; selecting Unknown clears others and vice versa; empty selection saves as Uncategorized; changes announced. |
| **SG-41** Screen Reader Semantics | §7 of all seven specs | Roles, names, states, live announcements, spoken amounts, chart text summary and list alternative. |

## 4. Cross-component traceability matrix

● = listed in the spec's "Applicable Style Guide rules" (§10). ○ = cited elsewhere in the spec (e.g. a supporting acceptance criterion or token rationale).

PAB = PrimaryActionButton · Tile = CategoryTile · Grid = CategoryGrid · Prog = ExpenseProgressIndicator · Amt = AmountInput · Sum = SpendingSummaryCard · Trend = SpendingTrendCard

| Rule | PAB | Tile | Grid | Prog | Amt | Sum | Trend |
|---|---|---|---|---|---|---|---|
| SG-01 Primary Action Visibility | ● |  |  | ● |  |  |  |
| SG-02 Secondary Actions Never Compete | ● |  | ● | ● |  |  |  |
| SG-03 Three-Level Information Hierarchy |  |  |  |  | ● | ● | ● |
| SG-04 Progressive Disclosure |  |  |  |  |  | ● | ● |
| SG-05 Light-First, Uncluttered Screens |  |  |  |  |  |  |  |
| SG-06 Neutral Light Surfaces with Identifiable Controls |  | ● |  |  | ● | ● | ○ |
| SG-07 Near-Black Primary Action | ● |  |  |  |  |  |  |
| SG-08 Blue Accent Reserved for Selection and Focus |  | ● |  | ● | ○ |  | ● |
| SG-09 Text Contrast Floor | ● | ● |  | ● | ● | ● | ● |
| SG-10 Status Is Never Color-Only |  |  |  |  | ● |  |  |
| SG-11 Spending Amounts Are Neutral |  |  |  |  | ● | ● | ● |
| SG-12 One Sans-Serif Family with Tabular Figures |  |  |  |  | ● |  | ● |
| SG-13 Type Scale | ● |  | ○ |  | ● | ● | ○ |
| SG-14 Financial Amount Typography |  |  |  |  | ● | ● |  |
| SG-15 Indian Number Formatting |  |  |  |  | ● | ● | ● |
| SG-16 Action-First Button Labels | ● |  |  |  |  |  |  |
| SG-17 Minimum Touch Targets | ● | ● | ● | ● | ○ | ○ | ● |
| SG-18 Primary Button Shape and Placement | ● |  |  |  | ● |  |  |
| SG-19 Button States | ● | ● |  | ○ |  | ○ |  |
| SG-20 Disabled Primary Explains Itself | ● | ○ | ● |  | ● |  |  |
| SG-21 Equal-Weight Category Tiles |  | ● | ● |  |  |  |  |
| SG-22 Icon Plus Label, Always |  | ● |  |  |  |  |  |
| SG-23 Tile Dimensions and Grid |  | ● | ● |  |  |  |  |
| SG-24 Unmistakable Selected State (Multi-Cue) |  | ● |  |  |  |  |  |
| SG-25 Multi-Select Behavior | ○ | ● | ● |  |  |  |  |
| SG-26 Unknown Is a First-Class Choice | ○ | ● | ● |  |  |  |  |
| SG-27 Category Label Rules |  | ● |  |  |  |  |  |
| SG-28 Always-Visible Step Indicator |  |  |  | ● |  |  |  |
| SG-29 Completed, Current and Upcoming States |  |  |  | ● |  |  |  |
| SG-30 Back Navigation Preserves Everything |  |  | ● | ● | ● |  |  |
| SG-31 Encouraging, Restrained Completion Feedback | ● |  |  | ○ |  |  |  |
| SG-32 Error Recovery Without Data Loss | ● |  | ● |  | ● | ○ |  |
| SG-33 Headline Spending Total |  |  |  |  |  | ● |  |
| SG-34 No Double Counting; Overlap Is Explained |  |  |  |  |  | ● | ● |
| SG-35 Simple, Single-Series Trend Chart |  |  |  |  |  |  | ● |
| SG-36 Clear Time-Range Control |  |  |  |  |  | ○ | ● |
| SG-37 Category Breakdown as a Labeled List |  |  |  |  |  |  |  |
| SG-38 4-Point Spacing Scale | ○ | ○ | ● |  | ○ | ○ | ○ |
| SG-39 Mobile-First Layout Frame | ● | ○ | ● | ○ | ● | ● | ● |
| SG-40 Consistent Alignment |  |  |  |  |  | ● | ○ |
| SG-41 Screen Reader Semantics | ● | ● | ● | ● | ● | ● | ● |
| SG-42 Non-Color Interaction States | ● | ● |  | ● | ● | ○ | ● |
| SG-43 Text Scaling | ● | ● | ● | ● | ● | ● | ● |
| SG-44 Reduced Motion | ● | ● |  | ● |  |  | ● |

**Not cited by any of the seven:** SG-05 (light-first screens) is a screen-level rule, and SG-37 (category breakdown list) belongs to the CategoryBreakdown component, which is outside this package.

### One complete chain per component

| Component | Reference ⟶ Rule ⟶ Token ⟶ Property |
|---|---|
| PrimaryActionButton | REF-U01 ⟶ SG-07 ⟶ `color.action.primary.background` ⟶ `component.primaryActionButton.default.background` (`#14161A`) |
| CategoryTile | REF-U01 ⟶ SG-24 ⟶ `color.selection.background` ⟶ `component.categoryTile.selected.background` (`#EEF3FF`) |
| CategoryGrid | REF-P01 ⟶ SG-23 ⟶ `space.3` ⟶ `component.categoryGrid.gap` (12 px) |
| ExpenseProgressIndicator | REF-D01 ⟶ SG-29 ⟶ `color.progress.current` ⟶ `component.progressIndicator.current` (`#1D4ED8`) |
| AmountInput | REF-G01 ⟶ SG-14 ⟶ `typography.amount.entry` ⟶ `component.amountInput.typography` (48 px / 600) |
| SpendingSummaryCard | REF-G01 ⟶ SG-33 ⟶ `typography.amount.headline` ⟶ `component.spendingSummaryCard.totalTypography` (36 px / 600) |
| SpendingTrendCard | REF-G02 ⟶ SG-36 ⟶ `color.selection.border` ⟶ `component.spendingTrendCard.timeRange.activeBorder` (`#1D4ED8`) |

## 5. Validation report

| Check | Result |
|---|---|
| Specifications produced | 7 of 7, same 12-section structure |
| Distinct token paths referenced | 160 — **all exist** in `tokens.json` |
| Alias statements (`a` → `b`) | All match the alias in `tokens.json` |
| Resolved values shown (hex, px, ms, numbers) | All match the resolved token values |
| Style Guide rule IDs cited | 42 of 44 — **0 unknown IDs** |
| Behavioral rules SG-04, SG-15, SG-25, SG-26, SG-41 | All addressed (see §3) |
| Component tokens for in-scope components | 86 of 86 used (primaryActionButton 15, categoryTile 29, categoryGrid 3, progressIndicator 8, amountInput 5, card 5, spendingSummaryCard 6, spendingTrendCard 12, iconButton 3) |
| Component tokens unused | 13, all for out-of-scope components: secondaryButton (3), textField (4), categoryBreakdown (6) |
| Proposed token values used | Marked *(proposal)* wherever shown |
| Style Guide / tokens modified | No |
| Re-run after review decisions D-1, D-2, C-1, D-7, D-11, D-13, G-9, G-10 | Pass — 0 errors across all seven specs and this README |

**Accessibility status.** Token-level contrast checks passed (`tokens.json` → `accessibilityStatus`). **Component-level accessibility is unverified** for all seven components until built and tested with VoiceOver, TalkBack, keyboard/switch access, 200 % text and reduced motion.

## 6. Token gaps

Shared semantic or foundation tokens are reused as the interim choice. `tokens.json` is unchanged in this PR. Status values: **Open** = awaiting a token decision; **Interim adopted** = an existing token is used now, gap kept; **Proposed default** = a value is documented but not tokenized.

| ID | Component | Gap | Interim choice | Status | Recommendation |
|---|---|---|---|---|---|
| G-1 | PrimaryActionButton | No spinner-size token | `size.icon.md` | Open | Add a component token aliasing `size.icon.md`; add PrimaryActionButton to its trace metadata |
| G-2 | PrimaryActionButton | No helper-text tokens | `typography.caption`, `color.text.secondary` | Open | Add component helper-text tokens |
| G-3 | CategoryTile | No focus-ring offset (button has one) | 2 px, specified in text | Open | Add a shared focus offset token |
| G-4 | SpendingTrendCard | No time-range label typography | `typography.body.default` + `font.weight.semibold` | Open | Add active/inactive label typography tokens |
| G-5 | AmountInput | No 0.75× currency-symbol size | ₹ same size, `color.text.secondary` | Open (no action needed unless a smaller ₹ is wanted) | Keep as is |
| G-6 | CategoryTile | No label/icon color token | `color.text.primary` | Open | Add tile foreground token |
| G-7 | CategoryTile | No check-badge inset | `space.1` | Open | Add badge offset token |
| G-8 | AmountInput | No field-boundary tokens | `color.border.control`, `color.focus.ring`, `borderWidth.thin`/`thick` | Open | Add amount-field boundary tokens |
| G-9 | SpendingTrendCard | No plot-height token | 50 % of card content width, clamped 144–200 px | **Proposed default — pending visual testing** | Confirm in visual testing, then tokenize |
| G-10 | SpendingTrendCard | No intermediate amount style | `typography.heading.2` + tabular figures (SG-12) | **Interim adopted (existing token); gap retained** | Add an amount style between headline (36 px) and inline (17 px) that carries tabular numerals |

## 7. Contradictions

| ID | Conflict | Status | Position in specs |
|---|---|---|---|
| C-1 | SG-23: "3 columns on 360–430 px" vs "4 columns when tiles ≥ 88 px" — four 88 px tiles fit from 420 px. | **Resolved in specs (approved)**; Style Guide clarification pending (§8) | 3 columns across the phone range (320–430 px), subject to the 96 px minimum tile height, ≥ 48 px touch area and the 2-column large-text fallback; 4 columns only above 430 px with tiles ≥ 88 px. |
| C-2 | SG-29 asks for a small ✓ on completed segments; approved segment height is 4 px. | **Resolved in specs (approved, D-2)**; Style Guide clarification pending (§8) | ✓ removed; lightness, height, position, caption and accessible state distinguish completed / current / upcoming. |

## 8. Decisions

| ID | Spec | Decision | Status | Recommendation / outcome |
|---|---|---|---|---|
| D-1 | PrimaryActionButton | Flexible bottom docking (safe areas, keyboard, orientation, viewport height) instead of an identical top edge. | **Approved** | Applied. SG-18 amendment recommended below. |
| D-2 | ExpenseProgressIndicator | Remove ✓ from compact segments. | **Approved** | Applied. SG-29 clarification recommended below. |
| D-3 | CategoryGrid | Trigger for the 2-column large-text layout. | Open | Switch when any label would exceed 2 lines at 3 columns. |
| D-4 | CategoryGrid | Undo after Unknown clears other selections. | Open | No undo in MVP; announcement + summary suffice. Revisit after testing. |
| D-5 | CategoryGrid | Include a Skip text button on Categories? | Open | Omit — Review with no selection already does this. |
| D-6 | CategoryTile | Disabled tile state has no MVP use. | Open | Keep specified for future use; do not use in MVP. |
| D-7 | AmountInput | Maximum transaction amount. | **Approved** | No arbitrary maximum. A technical numeric precision/storage limit is required and must be defined in the data/save-workflow spec. Business limits, if any, are configurable (`businessLimit`). |
| D-8 | AmountInput | INR only in MVP? | Open | Yes; other currencies need separate discovery. |
| D-9 | AmountInput | Long amounts shrink to 24 px then wrap (extends SG-43's headline rule to entry). | Open | Accept. |
| D-10 | SpendingSummaryCard | When to abbreviate the headline total (₹1.2Cr). | Open | Only when the full value cannot fit at 24 px. |
| D-11 | Dashboard | One shared reporting period across SpendingSummaryCard and SpendingTrendCard. | **Approved** | Applied: `period` owned by the dashboard; the trend card's time range changes it. |
| D-12 | SpendingTrendCard | Buckets: Week/Month daily, 3 months weekly, Year monthly. | Open | Accept. |
| D-13 | SpendingTrendCard | Previous-period comparison line. | **Approved — excluded from initial release** | Applied. Comparison tokens remain in `tokens.json` for a later release but are not rendered. |
| D-14 | SpendingTrendCard | Short pill labels (W/M/3M/Y) at 320 px. | Open | Accept, with full accessible names. |

**Carried over from the earlier review** (status: assumed in specs; not separately confirmed): label "Save expense" (SG-16 sentence case); five button labels (Continue, Review, Save expense, Done, Add another); loading only on Save expense; disabled only on the Amount step; ₹ in secondary color at full size; no separate CategoryBreakdown spec in this package.

### Recommended Style Guide amendments (for a separate PR — not made here)

| Rule | Current wording (summary) | Recommended amendment | Driven by |
|---|---|---|---|
| SG-18 | Acceptance: button top edge identical (± 0 px) across steps 1–3. | Replace with: button docked to the bottom of the available viewport with a consistent offset plus safe-area inset; docks above the keyboard; never scrolled off screen in portrait, landscape or short viewports. | D-1 |
| SG-23 | "3 columns on phones 360–430 px" and "4 columns when tiles ≥ 88 px". | State: 3 columns across 320–430 px; 4 columns only above 430 px when each tile is ≥ 88 px; 2 columns when labels would exceed 2 lines at large text. | C-1, D-3 |
| SG-29 | Completed segment: "filled near-black segment with a small ✓". | For the compact segmented indicator, completed = filled near-black without a ✓; completion conveyed by lightness, position, caption and accessible state. | C-2, D-2 |

## 9. Out of scope

- Application code.
- CategoryBreakdown, SecondaryButton, TextField, completion-feedback and save-workflow specifications (including idempotent saving, referenced by PrimaryActionButton §5.3).
- Changes to `STYLE_GUIDE.md` or `tokens.json`.
