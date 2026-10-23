# Expense Tracker — Frontend Style Guide

**Version:** 0.1 (draft for review) | **Date:** 24 October 2026 | **Design-system stage:** Step 1 — Style Guide
**Scope:** Visual and interaction rules only. Design tokens, component specification files and application code are out of scope for this document and will be derived from it.

**Inputs used**

- `README.md`, `docs/PRODUCT_VISION.md` (v1.1), `references/REFERENCE_CATALOG.md` (v0.6), `references/SCREEN_REFERENCES.md` (v0.3)
- Five reference images from Project Context, all inspected directly: `REF-P01.png`, `REF-D01.png`, `REF-U01.png`, `REF-G01.jpg`, `REF-G02.png` (see [Appendix A](#appendix-a--reference-image-inspection-log))

**How to read the rules**

Each rule has a stable ID (`SG-nn`). IDs are never renumbered; retired rules are marked *Retired* rather than deleted. Each rule carries a **Basis** label:

| Basis | Meaning |
|---|---|
| **Observed** | The behavior is directly visible in a reference image and adapted here. |
| **Requirement** | The rule comes from the Product Vision, not from a reference image. |
| **Proposal** | A design decision made for this product. It is not a verified observation and should be validated in usability testing. |

Proposed values (colors, sizes, spacing) are style-guide recommendations. They are written so they can later be turned into tokens, but they are **not tokens**.

---

## A. Design Philosophy

### A.1 Visual personality

**Calm, clear, confident.** The product should feel like a well-organized notebook kept by a capable assistant: light, quiet surfaces; one obvious thing to do; numbers that are easy to read at a glance. It should be mature and polished without being luxurious, dark or ornamental, and approachable without being playful or childish.

| We are | We are not |
|---|---|
| Light, airy, uncluttered | Dark, "premium", gold-accented |
| Direct and guided | Dense, menu-heavy, form-like |
| Encouraging | Gamified (no streaks, points, gems, hearts) |
| Neutral about spending | Judgmental (spending is not shown as "bad") |
| Financially legible | Investment-styled (no returns, gains, XIRR language) |

### A.2 Five governing principles

| # | Principle | Primary rules | Reference |
|---|---|---|---|
| P1 | **Many choices → equal-weight visual tiles** | SG-21 – SG-27 | REF-P01 |
| P2 | **One next action → one dominant button** | SG-01, SG-02, SG-18 | REF-U01 |
| P3 | **Multiple steps → always-visible progression** | SG-28 – SG-31 | REF-D01 |
| P4 | **Categories → icon + label + unmistakable selection state** | SG-22, SG-24 | REF-P01, REF-U01, REF-D01 |
| P5 | **Financial information → simple summary before detailed analysis** | SG-03, SG-04, SG-33 – SG-37 | REF-G01, REF-G02 |

### A.3 Desired experience

A user opens the app, sees a large amount field and a single button, and records an expense in three steps — **Amount → Categories → Review & Save** — without ever wondering what to press next. If they cannot decide on a category, they pick **Unknown** or skip it and still save. Afterwards, the dashboard tells them one number first (what they spent), then how it trended, then — only if they ask — where it went.

### SG-05 — Light-First, Uncluttered Screens

- **Rule:** Every screen starts on a light background and shows only what the current decision needs. Additional information appears on demand (SG-04).
- **Rationale:** The vision asks for a "light, uncluttered" start. All five reference images use light content surfaces.
- **Reference:** REF-G01, REF-G02, REF-U01, REF-D01 (observed: white content surfaces in all four); Product Vision §7.
- **Components:** All screens.
- **Acceptance:** No expense-entry screen shows more than one primary action, one progress indicator and the content of one step. No dark-mode-by-default.
- **Basis:** Observed + Requirement.

---

## B. Visual Hierarchy

Three levels of emphasis are used everywhere. Each level is distinguished by **at least two** of size, weight and color, never by color alone.

| Level | What it is | Typical treatment |
|---|---|---|
| **Primary** | The one number or one action the screen exists for: the amount being entered, the total spent, the Continue / Save button. | Largest size on screen, heaviest weight, highest contrast (near-black). |
| **Secondary** | Information that explains the primary item: step title, supporting metrics, category names, chart. | Medium size, regular–medium weight, primary or secondary text color. |
| **Supporting** | Context and metadata: helper text, dates, "Step 2 of 3", footnotes, the overlap explanation. | Small size, regular weight, secondary/tertiary text color. |

### SG-01 — Primary Action Visibility

- **Rule:** Each expense-entry screen has exactly one visually dominant primary action.
- **Rationale:** Users must always know the next step (Vision §4.2, §9). The Uber reference resolves a multi-option screen with one unmistakable button.
- **Reference:** REF-U01 (observed: a single full-width black button "Confirmar Comfort" below the ride options; no other control on screen has comparable size or contrast).
- **Components:** PrimaryActionButton; all entry steps.
- **Acceptance:** On every entry screen, exactly one control uses the primary button style. In a 5-second first-impression test, ≥ 80 % of participants identify the same next action *(proposal; target to be confirmed in research)*.
- **Basis:** Observed.

### SG-02 — Secondary Actions Never Compete

- **Rule:** Secondary actions (Back, Skip, Add details, Edit) use outlined, text or icon-button styles with visibly less weight than the primary action. They are never filled with the primary color.
- **Rationale:** Competing emphasis reintroduces the "which do I press?" problem.
- **Reference:** REF-U01 (observed: back control is a small circular white icon button top-left; the payment row is plain text with a chevron — both clearly subordinate to the black button).
- **Components:** PrimaryActionButton (and future secondary button), ExpenseProgressIndicator back control.
- **Acceptance:** A secondary action never exceeds the primary button's width or uses a filled dark background; it is placed away from, or visually below the weight of, the primary.
- **Basis:** Observed.

### SG-03 — Three-Level Information Hierarchy

- **Rule:** Every screen and card has a single primary element, a secondary layer, and a supporting layer, distinguished by at least two of size, weight and color.
- **Rationale:** Groww makes a dense financial card readable by giving one figure clear dominance and setting supporting rows in smaller, lighter type.
- **Reference:** REF-G01 (observed: "₹10,00,000" large and bold; label "LONG TERM (5)" small, uppercase, letter-spaced, grey; three label/value rows in smaller type below a divider).
- **Components:** SpendingSummaryCard, AmountInput, SpendingTrendCard.
- **Acceptance:** The primary value is at least 1.75× the size of body text on the same card; supporting text never uses the primary text color at the primary weight.
- **Basis:** Observed (ratio is a proposal).

### SG-04 — Progressive Disclosure

- **Rule:** Show the summary first; reveal detail through an explicit action (expand, tap through, bottom sheet). Optional expense details never appear in the default entry path.
- **Rationale:** Vision §4.7 and §7; keeps the entry flow at 3–4 interactions.
- **Reference:** REF-G01 (observed: portfolio choice is moved into a "Select portfolio" bottom sheet rather than shown inline); REF-G02 (observed: analysis is a separate "Portfolio analysis" screen with a back arrow).
- **Components:** SpendingSummaryCard, SpendingTrendCard, category breakdown, optional-details step.
- **Acceptance:** The default path to save an expense requires no more than 4 screens/interactions excluding typing the amount; detailed breakdowns are reachable in one tap from the summary.
- **Basis:** Observed + Requirement.

---

## C. Color System

All values below are **proposed** and were checked for WCAG 2.2 contrast (ratios computed, rounded to two decimals). Brand colors from the reference apps (PhonePe purple, Duolingo green, Groww's palette) are deliberately **not** reused.

### C.1 Backgrounds and surfaces

| Role | Proposed value | Use |
|---|---|---|
| App background | `#F7F8FA` | Screen background behind cards. |
| Surface | `#FFFFFF` | Cards, tiles, sheets, input areas. |
| Surface — subtle | `#F1F3F6` | Pressed tile/row background, inactive chip fill. |
| Divider | `#E5E7EB` | Hairline dividers inside cards (decorative only). |
| Control boundary | `#8A919C` | Borders that identify an interactive control (unselected tiles, inputs). 3.18:1 on white. |

White surfaces on `#F7F8FA` are only 1.06:1, so **surfaces must not rely on the background difference alone** to be identified as controls — interactive surfaces need a control boundary or other cue (SG-06).

### SG-06 — Neutral Light Surfaces with Identifiable Controls

- **Rule:** Use a light neutral background and white surfaces. Any surface that is interactive must have a visual boundary of ≥ 3:1 against its surroundings, or another non-color cue (icon, chevron, label).
- **Rationale:** Keeps the calm light look while meeting WCAG 1.4.11 (non-text contrast).
- **Reference:** REF-G01 (observed: white cards with light outlines on light grey); REF-P01 (observed: white cards on light background).
- **Components:** CategoryTile, AmountInput, SpendingSummaryCard, SpendingTrendCard.
- **Acceptance:** Every unselected interactive tile/input boundary measures ≥ 3:1 against the adjacent color.
- **Basis:** Observed + Proposal (values).

### C.2 Primary action color

| Role | Proposed value | Contrast |
|---|---|---|
| Primary action fill | `#14161A` (near-black) | White label: **18.11:1** |
| Primary action — pressed | `#2A2E35` | White label: 13.63:1 |

### SG-07 — Near-Black Primary Action

- **Rule:** The primary action button is filled near-black with a white label. No other element uses a filled near-black background of comparable size.
- **Rationale:** Maximum contrast and a neutral, mature tone; avoids color-meaning confusion (green = success, red = error). Reserving the fill for one control makes it unmistakable.
- **Reference:** REF-U01 (observed: black filled button with white text as the sole confirmation action).
- **Components:** PrimaryActionButton.
- **Acceptance:** Label contrast ≥ 7:1 (AAA); the fill is used by at most one control per screen.
- **Basis:** Observed (exact value is a proposal).

### C.3 Secondary / accent color

| Role | Proposed value | Contrast |
|---|---|---|
| Accent (selection, links, focus, chart line) | `#1D4ED8` (blue) | On white: **6.70:1** |
| Selection tint (selected tile/row fill) | `#EEF3FF` | Near-black text on it: 16.30:1; accent on it: 6.03:1 |
| Focus ring | `#1D4ED8`, 2 px, 2 px offset | 6.70:1 on white |

### SG-08 — Blue Accent Reserved for Selection and Focus

- **Rule:** The accent blue means "selected / focused / interactive information". It is used for selected-tile borders and checkmarks, the focus ring, the current progress step, the chart's primary series and the active time-range. It is not used for the primary CTA fill.
- **Rationale:** Separates "what I chose" (blue) from "what I do next" (black), so selection and action never compete.
- **Reference:** REF-U01 (observed: the selected ride row is filled with a light blue tint while the action button stays black).
- **Components:** CategoryTile, ExpenseProgressIndicator, SpendingTrendCard, time-range control.
- **Acceptance:** Accent on white ≥ 4.5:1; no element uses accent fill as the primary CTA.
- **Basis:** Observed (values proposed).

### C.4 Text hierarchy

| Role | Proposed value | On `#FFFFFF` | On `#F7F8FA` | Allowed use |
|---|---|---|---|---|
| Text — primary | `#14161A` | 18.11:1 | 17.04:1 | Headings, amounts, labels |
| Text — secondary | `#4B5563` | 7.56:1 | 7.11:1 | Supporting metrics, descriptions |
| Text — tertiary | `#6B7280` | 4.83:1 | 4.55:1 | Metadata, helper text, step counters |
| Text — on primary | `#FFFFFF` | — | — | Labels on the primary button |
| Disabled text | `#6B7280` on `#E5E7EB` (≈ 3.8:1) | — | — | Disabled controls only (exempt from WCAG minimum, kept legible deliberately) |

`#8A919C` (2.99–3.18:1) and lighter greys **must never be used for text**.

### SG-09 — Text Contrast Floor

- **Rule:** All meaningful text meets ≥ 4.5:1 against its background; large text (≥ 24 px regular or ≥ 18.66 px bold) meets ≥ 3:1. Primary and secondary text target ≥ 7:1.
- **Rationale:** WCAG 2.2 AA (1.4.3); many users read on phones outdoors.
- **Reference:** — (accessibility standard).
- **Components:** All.
- **Acceptance:** Automated contrast check passes for every text/background pair in the design files.
- **Basis:** Requirement (accessibility).

### C.5 Selection states

| State | Fill | Border | Additional cue |
|---|---|---|---|
| Unselected | `#FFFFFF` | 1 px `#8A919C` | — |
| Pressed (momentary) | `#F1F3F6` | unchanged | — |
| Selected | `#EEF3FF` | 2 px `#1D4ED8` | Check badge (filled accent circle with white ✓), label weight increases |
| Focused (keyboard / switch) | unchanged | + 2 px focus ring | — |
| Disabled | `#F1F3F6` | 1 px `#E5E7EB` | Reduced icon opacity; label in tertiary text |

### C.6 Status colors

| Status | Foreground | Soft background | Contrast (fg on white / on soft bg) | Mandatory pairing |
|---|---|---|---|---|
| Success | `#15803D` | `#F0FDF4` | 5.02:1 / 4.79:1 | ✓ icon + text ("Expense saved") |
| Warning | `#B45309` | `#FFFBEB` | 5.02:1 / 4.84:1 | ⚠ icon + text |
| Error | `#B91C1C` | `#FEF2F2` | 6.47:1 / 5.91:1 | ⓘ/✕ icon + text explaining the fix |

### SG-10 — Status Is Never Color-Only

- **Rule:** Success, warning and error states always combine color with an icon and a text message.
- **Rationale:** WCAG 1.4.1; color-vision deficiency is common.
- **Reference:** REF-D01 (observed: completed/current/locked states use check, star and lock icons, not just gold/green/grey); REF-G01 (observed: returns use "+"/"−" signs alongside green/red).
- **Components:** AmountInput (validation), completion feedback, any inline message.
- **Acceptance:** With a grayscale filter applied, every status remains identifiable.
- **Basis:** Observed + Requirement.

### SG-11 — Spending Amounts Are Neutral

- **Rule:** Expense amounts and totals are shown in primary text color, never in red or green. Red is reserved for errors; green for successful actions. Trend changes, if shown, use neutral text with an arrow and sign.
- **Rationale:** The product positions itself on "visibility over restriction" (Vision §10). Coloring spending red would read as judgment; coloring it green could read as encouragement to spend. Groww's red/green convention describes gains and losses, which do not apply here.
- **Reference:** REF-G01, REF-G02 (observed red/green gain/loss coloring — **deliberately not adopted**).
- **Components:** SpendingSummaryCard, SpendingTrendCard, category breakdown, AmountInput.
- **Acceptance:** No amount representing spending uses the success or error color.
- **Basis:** Proposal.

---

## D. Typography

### SG-12 — One Sans-Serif Family with Tabular Figures

- **Rule:** Use a single humanist/neo-grotesque sans-serif family across the product. **Proposed primary:** Inter (open licence, wide weight range, tabular-figure support, includes the ₹ glyph). **Fallback:** the platform system font (SF Pro on iOS, Roboto on Android). All amounts use tabular (fixed-width) numerals.
- **Rationale:** One family keeps the interface calm; tabular figures stop amounts from shifting width while typing and keep columns aligned.
- **Reference:** REF-G01 (observed: right-aligned amounts in list rows line up vertically).
- **Components:** All; especially AmountInput, SpendingSummaryCard.
- **Acceptance:** The ₹ symbol renders in the chosen font on target devices; digit widths are equal in amount displays.
- **Basis:** Proposal (font choice must be checked against licensing and rendering on target devices).

### SG-13 — Type Scale

- **Rule:** Use this proposed scale (sizes in px at default text size; line-height in parentheses). Sizes must scale with the user's system text-size setting (SG-43).

| Style | Size (line-height) | Weight | Use |
|---|---|---|---|
| Amount — entry | 48 (56) | 600 | Amount being typed in AmountInput |
| Amount — headline | 36 (44) | 600 | Total spent on dashboard |
| Heading 1 | 24 (32) | 600 | Step question / screen title ("How much did you spend?") |
| Heading 2 | 20 (28) | 600 | Card titles, section titles |
| Body — large | 17 (24) | 400 | Primary body copy, list item names |
| Body | 15 (22) | 400 | Secondary text, supporting metrics |
| Label — button | 17 (24) | 600 | Button labels |
| Label — tile | 15 (20) | 500; 600 when selected | Category tile labels |
| Caption | 13 (18) | 400 | Metadata, step counter, footnotes |
| Overline | 12 (16) | 600, +0.08 em tracking, uppercase | Card eyebrow labels ("THIS MONTH") |

- **Rationale:** A small number of clearly separated steps keeps hierarchy obvious (SG-03). Body text never goes below 15 px; captions never below 13 px.
- **Reference:** REF-G01 (observed: small uppercase letter-spaced eyebrow label above a large amount).
- **Components:** All.
- **Acceptance:** No text style smaller than 12 px; no more than 4 distinct text styles on one card.
- **Basis:** Observed (overline pattern) + Proposal (scale).

### SG-14 — Financial Amount Typography

- **Rule:** The key amount uses the largest style on the screen, weight 600, primary text color, tabular figures. The currency symbol is set at the same size or slightly smaller (≈ 0.75×) and never in a lighter color than secondary text. Paise/decimals are omitted from headline totals and shown only where precision matters (individual transactions, review screen).
- **Rationale:** The amount is the most important information (SG-03); dropping decimals on summaries reduces visual noise.
- **Reference:** REF-G01 (observed: "₹10,00,000" with no decimals as headline; list rows show "₹8,200.00" with decimals); REF-G02 (observed: large "₹11,32,585.50" headline beside a secondary invested value).
- **Components:** AmountInput, SpendingSummaryCard, SpendingTrendCard.
- **Acceptance:** Headline totals have no decimal part; transaction-level amounts show two decimals.
- **Basis:** Observed + Proposal.

### SG-15 — Indian Number Formatting

- **Rule:** Format amounts with the ₹ symbol and Indian digit grouping (₹1,00,000, not ₹100,000) when the locale is en-IN; follow the device locale otherwise. Large dashboard values may use readable abbreviations (₹1.2L, ₹3.4Cr) only when the full value is available on tap and to screen readers.
- **Rationale:** The users are in India; Indian grouping is what they read fluently.
- **Reference:** REF-G01, REF-G02 (observed: "₹10,00,000", "₹9,85,240.30").
- **Components:** AmountInput, SpendingSummaryCard, SpendingTrendCard.
- **Acceptance:** A value of 1500000 renders as "₹15,00,000" in en-IN.
- **Basis:** Observed + Proposal (locale behavior and abbreviation rule).

### SG-16 — Action-First Button Labels

- **Rule:** Button labels are 1–3 words, sentence case, verb-first, and describe the outcome: "Continue", "Review", "Save expense", "Add details". Never "OK", "Submit" or "Next →" alone where a specific verb is possible.
- **Rationale:** Clear labels tell users what will happen (Vision §4.6).
- **Reference:** REF-U01 (observed: label names the action and its object, "Confirmar Comfort").
- **Components:** PrimaryActionButton, secondary buttons.
- **Acceptance:** All primary labels ≤ 3 words and start with a verb.
- **Basis:** Observed.

### Readability guidelines

- Left-align text; centre only the amount on the entry screen and short completion messages.
- Keep lines of body text at or below ~60 characters.
- Do not set paragraphs in all caps; overline style is limited to 1–3 word labels.
- Avoid investment or accounting jargon ("returns", "XIRR", "ledger", "debit"). Use plain words: "Spent", "This month", "Most often".

---

## E. Buttons and Interaction Controls

### SG-17 — Minimum Touch Targets

- **Rule:** Every interactive element has a touch target of at least **48 × 48 px**; adjacent targets are separated by at least 8 px. Primary buttons are taller (SG-18).
- **Rationale:** Exceeds WCAG 2.5.8 (24 px) and meets common platform guidance (Android 48 dp; iOS 44 pt).
- **Reference:** REF-P01 (observed: large icon tiles with generous spacing).
- **Components:** All interactive components.
- **Acceptance:** Measured hit area ≥ 48 × 48 px for every control, including icon-only back buttons.
- **Basis:** Requirement + Proposal (48 px value).

### SG-18 — Primary Button Shape and Placement

- **Rule:** The primary button is full-width within the screen gutters, **56 px** tall, corner radius 12 px, and fixed to the bottom of the screen above the safe area (with 16 px bottom spacing). It stays in the same position on every entry step and remains visible when the keyboard is open (it rides above the keyboard).
- **Rationale:** Consistent placement builds muscle memory; bottom placement is in thumb reach on large phones.
- **Reference:** REF-U01 (observed: full-width button at the bottom of the screen, below options and payment row).
- **Components:** PrimaryActionButton.
- **Acceptance:** Button top edge position is identical (± 0 px) across steps 1–3 on the same device; never scrolled off-screen.
- **Basis:** Observed (placement) + Proposal (dimensions, radius).

### Secondary button appearance (proposal)

| Type | Appearance | Use |
|---|---|---|
| Secondary | White fill, 1 px `#8A919C` border, primary-text label, 48 px tall | "Add details", "Edit" |
| Text button | No fill or border, accent-blue label, 48 px hit area | "Skip", "See all" |
| Icon button | 48 px circle, white fill, subtle outline, 24 px icon, accessible name required | Back, close, info |

### SG-19 — Button States

- **Rule:** Buttons implement these states, each distinguishable without color alone:

| State | Primary button treatment |
|---|---|
| Default | `#14161A` fill, white label |
| Pressed | `#2A2E35` fill and a slight scale (0.98) — immediate response within 100 ms |
| Focused | 2 px accent focus ring with 2 px offset |
| Loading | Label replaced by a spinner plus "Saving…" text; button keeps its size; repeated taps ignored |
| Disabled | `#E5E7EB` fill, `#6B7280` label; see SG-20 |
| Active (toggle / chip) | Applies to selectable controls, not CTA: selected styling per §C.5 |

- **Rationale:** Feedback confirms the tap registered (Vision §4.6); loading prevents duplicate expenses.
- **Reference:** REF-U01 (observed: default state only — other states are proposals).
- **Components:** PrimaryActionButton, secondary buttons.
- **Acceptance:** Double-tapping "Save expense" creates one record; each state is distinguishable in grayscale.
- **Basis:** Proposal.

### SG-20 — Disabled Primary Explains Itself

- **Rule:** Avoid disabling the primary button. When it must be disabled (e.g. amount is empty), show a one-line helper above it stating what is needed ("Enter an amount to continue"). Category selection never disables Continue, because categories are optional.
- **Rationale:** A silent disabled button breaks "always know the next action"; categories are optional by requirement (Vision §4.1, §4.5).
- **Reference:** — (Product Vision).
- **Components:** PrimaryActionButton, AmountInput, CategoryGrid.
- **Acceptance:** Every disabled-primary state has visible helper text; Continue on the category step is enabled with zero selections.
- **Basis:** Requirement + Proposal.

---

## F. Category and Tag Selection

### SG-21 — Equal-Weight Category Tiles

- **Rule:** All category tiles in a grid share identical size, shape, border, icon size and label style. No category is visually promoted over another in its default state.
- **Rationale:** Categories are peers; unequal styling implies a recommendation the product does not make.
- **Reference:** REF-P01 (observed: "Transfer Money" row of four identically sized icon tiles with labels; "Recharge & Pay Bills" grid of uniform icon + label items); REF-G01 (observed: "Select portfolio" sheet uses a 2 × 2 grid of identical white cards, each with a circular icon and a label).
- **Components:** CategoryTile, CategoryGrid.
- **Acceptance:** In the unselected state, all tiles in a grid have identical dimensions and styling.
- **Basis:** Observed.

### SG-22 — Icon Plus Label, Always

- **Rule:** Every tile shows an icon **and** a visible text label. Icons are never used alone; labels are never truncated to an unreadable fragment.
- **Rationale:** Icons aid recognition but are not universally understood (Vision §7).
- **Reference:** REF-P01 (observed: every action icon has a text label beneath it).
- **Components:** CategoryTile.
- **Acceptance:** Zero icon-only category controls.
- **Basis:** Observed + Requirement.

### Icon placement and style (proposal)

- Icon centred above the label, 28 px glyph inside a 48 px soft circular backplate (`#F1F3F6` unselected; white when selected so it stays visible on the tint).
- One consistent outline style, ~2 px stroke, rounded joins, drawn on a 24 px grid. A single icon set licensed for the product — **no PhonePe, Duolingo, Uber or Groww icons.**
- Optional emoji-style illustrations (Vision §4.4) are acceptable only if every category in the grid uses the same style; mixing emoji and line icons is not allowed.
- Category identity is carried by the icon shape and label, **not by a unique color per category.**

*Observed basis:* REF-P01 shows icons in a consistent filled-squircle style with labels below; REF-G01's sheet shows icons in soft circular backplates. Stroke, size and backplate values above are proposals.

### SG-23 — Tile Dimensions and Grid

- **Rule:** Default grid of **3 columns** on phones 360–430 px wide; tiles are square-ish, **minimum 96 px tall**, width filling the column, corner radius 12 px, 12 px gap between tiles, 16 px screen gutter. Move to 4 columns only when each tile can still be ≥ 88 px wide.
- **Rationale:** At 360 px width, three columns give ~101 px tiles — room for a 48 px icon plate and a two-line label at 15 px. PhonePe's four-across rows produce tiles too narrow for multi-word labels at accessible text sizes.
- **Reference:** REF-P01 (observed: four-across rows — adapted, not copied).
- **Components:** CategoryTile, CategoryGrid.
- **Acceptance:** At 360 px width with default text size, every label fits in ≤ 2 lines and every tile is ≥ 96 × 96 px.
- **Basis:** Proposal.

### SG-24 — Unmistakable Selected State (Multi-Cue)

- **Rule:** A selected tile changes in at least **three** ways: (1) tint fill `#EEF3FF`, (2) 2 px accent border, (3) a check badge in the top-right corner; the label also moves to weight 600. Selection change animates in ≤ 150 ms.
- **Rationale:** Selection must be obvious at a glance and without relying on color.
- **Reference:** REF-U01 (observed: selected row is shown by a full-width light blue fill); REF-D01 (observed: completed items carry a check icon in addition to their gold color).
- **Components:** CategoryTile.
- **Acceptance:** Selected vs unselected is identifiable in grayscale and with the tint removed (border + check alone suffice).
- **Basis:** Observed (tint, check) + Proposal (combination, values).

### SG-25 — Multi-Select Behavior

- **Rule:** Tapping a tile toggles it on/off; any number of tiles (0…n) may be selected. Tiles behave as checkboxes, not radio buttons. A live summary line above the primary button shows the current selection ("2 selected: Food, Charity"), and the selected tags carry forward to the Review step where they can be removed.
- **Rationale:** An expense can belong to several tags (Vision §4.5); users need confirmation of what they chose without scrolling back.
- **Reference:** — (Product Vision; REF-P01 shows single-action tiles, so multi-select is an adaptation).
- **Components:** CategoryGrid, CategoryTile, Review step.
- **Acceptance:** Selecting two tiles keeps both selected; screen readers announce each tile as a checkbox with "selected/not selected" state; the summary count matches the selection.
- **Basis:** Requirement + Proposal (summary line).

### SG-26 — Unknown Is a First-Class Choice

- **Rule:** An **Unknown** tile is always present, always in the same position (last tile in the grid), and styled exactly like other tiles (SG-21) — never greyed out, smaller or hidden behind "More". Its icon is a neutral question mark. Selecting Unknown **clears other selections**, and selecting another category clears Unknown (they are mutually exclusive). **Miscellaneous** is a normal category and combines freely with others. Saving with zero selections is also allowed and is recorded as "Uncategorized".
- **Rationale:** Vision §4.1 and §4.5 require that users can save without resolving the category. Unknown alongside Food would be contradictory, hence exclusivity.
- **Reference:** — (Product Vision).
- **Components:** CategoryTile, CategoryGrid.
- **Acceptance:** Unknown is visible without scrolling on a 360 × 640 screen *or* the grid is ordered so it is reachable within one scroll; selecting Unknown leaves exactly one selection; an expense with no category saves successfully.
- **Basis:** Requirement + Proposal (exclusivity, placement). *Exclusivity should be confirmed with the product owner.*

### SG-27 — Category Label Rules

- **Rule:** Labels are 1–2 short words, sentence case, nouns ("Food", "Travel", "Gifts"), maximum two lines, centred under the icon. Do not shrink text to fit; wrap instead. Never truncate with an ellipsis.
- **Rationale:** Readability at a glance; consistent rhythm across the grid.
- **Reference:** REF-P01 (observed: short labels wrapping to two lines, e.g. "To Bank/ UPI ID", "Check Bank Balance").
- **Components:** CategoryTile.
- **Acceptance:** No label exceeds two lines at default text size; no ellipses.
- **Basis:** Observed + Proposal.

---

## G. Progressive Navigation

### Proposed entry flow

| Step | Screen | Primary action | Optional secondary |
|---|---|---|---|
| 1 | Amount | Continue | — |
| 2 | Categories | Review | Skip (text button) |
| 3 | Review & save | Save expense | Add details, Edit |
| (opt.) | Details (note, date, payment) | Done | — |

Basic path: type amount → Continue → tap tile(s) → Review → Save expense = **3 screens, 3 button taps plus tile taps**, within the vision's 3–4-interaction ambition.

### SG-28 — Always-Visible Step Indicator

- **Rule:** Every entry step shows a compact progress indicator at the top: one segment per required step (3), plus a text label "Step 2 of 3 · Categories". The optional details step does not add a segment.
- **Rationale:** Users must always know where they are (Vision §4.6).
- **Reference:** REF-D01 (observed: a visible path of levels where position in the sequence is always apparent).
- **Components:** ExpenseProgressIndicator.
- **Acceptance:** Indicator visible on all three steps without scrolling; text label present for every step.
- **Basis:** Observed (adapted to a compact form) + Proposal.

### SG-29 — Completed, Current and Upcoming States

- **Rule:** Each segment shows its state through shape/icon and color together:

| State | Treatment |
|---|---|
| Completed | Filled near-black segment with a small ✓; tappable to return to that step |
| Current | Filled accent-blue segment, slightly taller/bolder; step name shown |
| Upcoming | Outlined/light grey segment; not tappable |

- **Rationale:** Distinct, non-color-only states make progress legible.
- **Reference:** REF-D01 (observed and annotated in the image: completed levels gilded with a check; current level in unit color with a star, a progress ring and a "START" tooltip; locked levels greyed out with a lock icon).
- **Components:** ExpenseProgressIndicator.
- **Acceptance:** Each of the three states is distinguishable in grayscale; screen reader announces "Step 2 of 3, Categories, current".
- **Basis:** Observed (adapted; Duolingo's illustrative path, mascot and tooltip are excluded).

### SG-30 — Back Navigation Preserves Everything

- **Rule:** A back control (48 px icon button, top-left) is present on steps 2 and 3, and the platform back gesture works identically. Going back never clears entered data; returning forward restores it.
- **Rationale:** Users must be able to correct mistakes without penalty.
- **Reference:** REF-U01 (observed: circular back-arrow button at the top-left over the map); REF-G02 (observed: back arrow beside the screen title).
- **Components:** ExpenseProgressIndicator (or screen header), all entry steps.
- **Acceptance:** Amount and selections survive back → forward navigation and app backgrounding.
- **Basis:** Observed (control) + Requirement (data preservation).

### SG-31 — Encouraging, Restrained Completion Feedback

- **Rule:** On save, show a brief confirmation (≈ 1.5 s, or until dismissed): a success check, "Expense saved", the amount and tags, and two clear follow-ups ("Add another" as primary, "Done" as secondary). Use a short, subtle motion (check draw-in) that respects reduced-motion settings. No points, streaks, confetti storms or mascots.
- **Rationale:** Acknowledges success (Vision §4.6) and keeps the habit loop light without childish gamification.
- **Reference:** REF-D01 (observed: encouraging, celebratory visual language — tone adopted, game mechanics such as gems, hearts and streak counters in the header **explicitly excluded**).
- **Components:** Completion feedback, PrimaryActionButton.
- **Acceptance:** Confirmation states what was saved; no reward or score elements; announced to screen readers.
- **Basis:** Observed (tone) + Proposal.

### SG-32 — Error Recovery Without Data Loss

- **Rule:** Validation errors appear inline next to the field, in plain language, with icon + text, and say how to fix the problem ("Enter an amount greater than ₹0"). If saving fails (e.g. offline), keep the expense locally, show a non-blocking message, and retry; never return the user to an empty form.
- **Rationale:** Vision §8 requires that information is preserved even when classification is deferred; losing an entry would destroy trust.
- **Reference:** — (Product Vision).
- **Components:** AmountInput, Review step, completion feedback.
- **Acceptance:** Simulated save failure leaves amount and tags intact and recoverable; every error message includes a fix.
- **Basis:** Requirement + Proposal.

---

## H. Dashboard Design

Dashboard reading order, top to bottom: **Headline total → Trend → Breakdown → Recent transactions.**

### SG-33 — Headline Spending Total

- **Rule:** The dashboard opens with one SpendingSummaryCard: overline period label ("THIS MONTH"), the total spent in Amount-headline style, and at most two or three supporting metrics in a secondary row (e.g. number of expenses, uncategorized count, change vs. last period in neutral text with an arrow).
- **Rationale:** One number answers "how much did I spend?" before anything else.
- **Reference:** REF-G01 (observed: card with eyebrow label, large amount, then three label/value rows beneath a divider).
- **Components:** SpendingSummaryCard.
- **Acceptance:** Total is the largest text on the dashboard; no more than 3 supporting metrics on the card.
- **Basis:** Observed.

### SG-34 — No Double Counting; Overlap Is Explained

- **Rule:** The overall total counts each expense once, regardless of how many tags it has. Any per-tag breakdown carries a visible note ("Expenses with several tags appear in each — tag totals add up to more than your total") and an info button with a fuller explanation. Tag-level percentages are expressed as "share of expenses that include this tag", never as slices of a whole.
- **Rationale:** Required by Vision §6 and §9; a breakdown that sums above the total must not look like an error.
- **Reference:** — (Product Vision). REF-G02's sector list sums to the portfolio total — that pattern is **not valid** for overlapping tags.
- **Components:** SpendingSummaryCard, category breakdown, SpendingTrendCard.
- **Acceptance:** Test data with a two-tag expense shows the total once; the overlap note is visible whenever any shown expense has more than one tag.
- **Basis:** Requirement + Proposal (wording, presentation).

### SG-35 — Simple, Single-Series Trend Chart

- **Rule:** The trend chart is a single accent-blue line (or simple columns for weekly/daily views) on a white card, with minimal or no gridlines, no 3D, no dual axes, and the period total shown as a number above the chart. A comparison series (e.g. previous period) is optional, dashed, in neutral grey, and labeled in text. Tapping/dragging shows the value for a point.
- **Rationale:** Readable at a glance; the number above means the chart supports, not replaces, the figure.
- **Reference:** REF-G02 (observed: one solid line for "Current" and one dotted grey line for "Invested", headline values above the chart, no visible gridlines).
- **Components:** SpendingTrendCard.
- **Acceptance:** At most 2 series; comparison series identifiable by line style and legend text, not color alone.
- **Basis:** Observed (adapted) + Proposal.

### SG-36 — Clear Time-Range Control

- **Rule:** A single row of pill-shaped options directly below the chart. Proposed options: **Week, Month, 3 Months, Year** (spelled out or with standard abbreviations "W, M, 3M, Y" only if every option has an accessible full name). The active option is outlined/filled and bold; each option has a ≥ 48 px hit area. Default: Month.
- **Rationale:** Time filtering must be obvious; fewer, everyday ranges suit expense review better than market ranges.
- **Reference:** REF-G02 (observed: row "1W 1M 3M 6M 1Y 5Y All" beneath the chart, with the active "All" shown in an outlined pill).
- **Components:** SpendingTrendCard (time-range control).
- **Acceptance:** Exactly one range active; active state identifiable without color; changing range updates both the number and the chart.
- **Basis:** Observed (pattern) + Proposal (option set).

### SG-37 — Category Breakdown as a Labeled List

- **Rule:** The breakdown is a list sorted by amount: tag icon + name, amount (right-aligned, tabular), count of expenses, and a thin horizontal bar showing relative size in a single hue. Show the top 5 tags and "See all tags" for the rest. Pie/donut charts are not used for tags because overlapping tags cannot form a meaningful whole (SG-34). Uncategorized/Unknown appears as its own row.
- **Rationale:** A list is readable, accessible and honest about overlap.
- **Reference:** REF-G02 (observed: sector list with a leading color bar, name, count and percentage sub-line, right-aligned amount — list pattern adopted; donut **not** adopted for tags).
- **Components:** Category breakdown (part of dashboard), SpendingSummaryCard drill-down.
- **Acceptance:** Each row readable without the bar; bars use one hue; no pie/donut for overlapping tags.
- **Basis:** Observed (list) + Requirement + Proposal.

### Progressive disclosure on the dashboard

Summary card → (tap) period detail; trend card → (tap/drag) point value; breakdown row → (tap) filtered transaction list for that tag. Each level is one tap deep; back always returns to the same scroll position (SG-04).

---

## I. Layout and Spacing

### SG-38 — 4-Point Spacing Scale

- **Rule:** All spacing uses multiples of 4 px from this proposed scale: **4, 8, 12, 16, 24, 32, 40, 48**. Typical use: 4–8 inside compact elements; 12 between tiles; 16 card padding and screen gutters; 24 between sections; 32–48 around the amount on the entry screen.
- **Rationale:** A small, predictable scale produces consistent rhythm and maps directly to future tokens.
- **Reference:** — (design-system convention).
- **Components:** All.
- **Acceptance:** No spacing value outside the scale in design files.
- **Basis:** Proposal.

### SG-39 — Mobile-First Layout Frame

- **Rule:** Design at 360 × 640 first, then verify at 390–430 px. 16 px side gutters; single-column content; primary button pinned to bottom (SG-18); content scrolls beneath a fixed header with the progress indicator. On wider screens (tablet/web), content is centred with a maximum width of 480 px rather than stretched.
- **Rationale:** The product is mobile-first; capping width preserves the guided, single-column experience on larger screens.
- **Reference:** All references are phone layouts.
- **Components:** All screens.
- **Acceptance:** No horizontal scroll at 320 px width; layout readable at 200 % text size.
- **Basis:** Proposal.

### SG-40 — Consistent Alignment

- **Rule:** Text and controls align to the left gutter; amounts in lists and cards align right; the entry amount is centred. Card internal padding is 16 px on all sides. Icons align to the text baseline/center line of their label.
- **Rationale:** Right-aligned amounts are easy to scan and compare.
- **Reference:** REF-G01 (observed: labels left, values right in holdings card and list rows).
- **Components:** SpendingSummaryCard, category breakdown, Review step.
- **Acceptance:** All amounts in a list share a right edge.
- **Basis:** Observed + Proposal.

---

## J. Accessibility

Target: **WCAG 2.2 AA** throughout, AAA for primary text and the primary button where practical.

| Area | Requirement | Rules |
|---|---|---|
| Color contrast | Text ≥ 4.5:1 (large ≥ 3:1); control boundaries and meaningful graphics ≥ 3:1 | SG-06, SG-09 |
| Touch targets | ≥ 48 × 48 px, ≥ 8 px apart | SG-17 |
| Readable labels | Visible text label on every control; plain language; no truncation of category labels | SG-16, SG-22, SG-27 |
| Non-color states | Selection, progress and status use icon/shape/text in addition to color | SG-10, SG-24, SG-29, SG-42 |
| Screen readers | Correct roles, names and states | SG-41 |
| Text scaling | Supports system text size up to 200 % | SG-43 |
| Motion | Respects reduced-motion | SG-44 |

### SG-41 — Screen Reader Semantics

- **Rule:** Primary button = button with its full label. Category tiles = checkboxes ("Food, checkbox, selected"). Unknown announces its exclusive behavior ("Unknown, clears other categories"). Progress indicator announces "Step n of 3, name". Amounts are read in full ("fifteen lakh rupees"), never as abbreviations. Charts have a text summary ("Spending rose from ₹42,000 in August to ₹51,000 in September"). Save confirmation and errors are announced as live regions.
- **Rationale:** The guided flow must work identically with VoiceOver/TalkBack.
- **Reference:** — (accessibility standard).
- **Components:** All.
- **Acceptance:** A full expense entry and dashboard read-out can be completed with VoiceOver and TalkBack only.
- **Basis:** Requirement + Proposal.

### SG-42 — Non-Color Interaction States

- **Rule:** Every state that conveys meaning (selected, current, completed, disabled, error, success, active range) has at least one non-color cue: icon, border weight, shape, text weight or text.
- **Rationale:** Consolidates SG-10, SG-24, SG-29 and SG-36 into one testable rule (WCAG 1.4.1).
- **Reference:** REF-D01 (observed: check, star and lock icons alongside color); REF-G02 (observed: active time range shown with an outline, not only color).
- **Components:** CategoryTile, ExpenseProgressIndicator, PrimaryActionButton, SpendingTrendCard.
- **Acceptance:** Grayscale screenshot review shows every state distinguishable.
- **Basis:** Observed + Requirement.

### SG-43 — Text Scaling

- **Rule:** Layouts support system text size up to 200 % without loss of content: tiles grow taller, labels wrap, the grid may drop to 2 columns, the headline amount may shrink to fit one line but never below Heading 1 size.
- **Rationale:** WCAG 1.4.4; some users will be older or reading in poor conditions.
- **Reference:** — (accessibility standard).
- **Components:** CategoryGrid, AmountInput, SpendingSummaryCard, PrimaryActionButton.
- **Acceptance:** At 200 % text, no clipped text and the primary button label remains fully visible.
- **Basis:** Requirement + Proposal (grid behavior).

### SG-44 — Reduced Motion

- **Rule:** All animations are ≤ 300 ms and purely supportive. When the OS reduced-motion setting is on, replace movement with instant state changes or opacity fades.
- **Rationale:** WCAG 2.3.3; motion should never be needed to understand state.
- **Reference:** — (accessibility standard).
- **Components:** CategoryTile, completion feedback, ExpenseProgressIndicator.
- **Acceptance:** With reduced motion enabled, no element translates or scales.
- **Basis:** Requirement + Proposal.

---

## K. Component Design Principles

Intended appearance and behavior only. Detailed component specifications will follow in a separate document.

### PrimaryActionButton
Full-width, 56 px tall, near-black fill, white 17 px semibold label, 12 px radius, pinned to the bottom above the safe area and keyboard; one per entry screen. States: default, pressed, focused, loading ("Saving…"), disabled (with helper text). Label is a specific verb: Continue, Review, Save expense.
**Rules:** SG-01, SG-02, SG-07, SG-16, SG-17, SG-18, SG-19, SG-20.

### CategoryTile
A ≥ 96 px square-ish white card with a control-boundary border, a 28 px outline icon centred in a 48 px soft circle, and a 1–2 word label below. Toggles on tap; selected = blue tint + 2 px blue border + corner check + bolder label. Behaves as a checkbox for assistive technology. The Unknown variant looks identical but is mutually exclusive.
**Rules:** SG-06, SG-08, SG-21, SG-22, SG-24, SG-26, SG-27, SG-41, SG-42.

### CategoryGrid
Three equal columns with 12 px gaps inside 16 px gutters; Unknown always last; supports 0…n selections; shows a live selection summary ("2 selected: Food, Charity") above the primary button. Never disables Continue. Reflows to two columns at large text sizes.
**Rules:** SG-21, SG-23, SG-25, SG-26, SG-43.

### ExpenseProgressIndicator
A slim three-segment bar at the top of each entry screen with a caption "Step n of 3 · Name". Completed segments near-black with ✓ and tappable; current segment accent blue and emphasized; upcoming segments light outline. Includes or sits beside the back control.
**Rules:** SG-28, SG-29, SG-30, SG-42.

### AmountInput
The focus of step 1: a centred 48 px semibold amount with ₹ prefix, tabular digits and live Indian-grouping formatting, using the numeric keypad opened automatically. Heading above asks a plain question ("How much did you spend?"). Validates inline (> 0) with icon + message; keeps its value through navigation and failures.
**Rules:** SG-03, SG-12, SG-13, SG-14, SG-15, SG-20, SG-32.

### SpendingSummaryCard
White card at the top of the dashboard: overline period label, headline total (no decimals, primary text color, never red/green), then up to three supporting metrics in a smaller secondary row. Tap opens detail. Total counts each expense once.
**Rules:** SG-03, SG-04, SG-11, SG-14, SG-15, SG-33, SG-34, SG-40.

### SpendingTrendCard
White card with the period total above a single-series line or column chart in accent blue, optional dashed grey comparison series, minimal gridlines, a pill-style time-range row below (Week / Month / 3 Months / Year), and a text summary for screen readers. Point values revealed on touch.
**Rules:** SG-04, SG-08, SG-11, SG-35, SG-36, SG-41, SG-42.

---

## L. Traceability Table

| Style Guide Rule ID | Supporting Reference | Future Component | Intended Visual Property |
|---|---|---|---|
| SG-01 Primary Action Visibility | REF-U01 | PrimaryActionButton | One dominant filled button per entry screen |
| SG-02 Secondary Actions Never Compete | REF-U01 | PrimaryActionButton, secondary buttons | Lower-weight style (outline/text/icon) for secondary actions |
| SG-03 Three-Level Hierarchy | REF-G01 | SpendingSummaryCard, AmountInput, SpendingTrendCard | Size/weight/color ratio between primary, secondary, supporting text |
| SG-04 Progressive Disclosure | REF-G01, REF-G02; Vision §4.7 | SpendingSummaryCard, SpendingTrendCard | Detail behind one tap / sheet / separate screen |
| SG-05 Light-First Screens | REF-G01, REF-G02, REF-U01, REF-D01; Vision §7 | All screens | Light background, minimal elements per screen |
| SG-06 Identifiable Controls | REF-G01, REF-P01 | CategoryTile, AmountInput, cards | Background/surface colors; ≥ 3:1 control boundary |
| SG-07 Near-Black Primary Action | REF-U01 | PrimaryActionButton | Fill color, label color, contrast ≥ 7:1 |
| SG-08 Accent for Selection & Focus | REF-U01 | CategoryTile, ExpenseProgressIndicator, SpendingTrendCard | Accent color, selection tint, focus ring |
| SG-09 Text Contrast Floor | WCAG 2.2 | All | Text color hierarchy and contrast minimums |
| SG-10 Status Never Color-Only | REF-D01, REF-G01 | AmountInput, completion feedback | Status colors paired with icon + text |
| SG-11 Spending Is Neutral | REF-G01/G02 (convention rejected); Vision §10 | SpendingSummaryCard, SpendingTrendCard | Amount text color = primary text |
| SG-12 One Family, Tabular Figures | REF-G01 | All, esp. AmountInput | Font family, numeral style |
| SG-13 Type Scale | REF-G01 | All | Font sizes, line heights, weights, overline tracking |
| SG-14 Financial Amount Typography | REF-G01, REF-G02 | AmountInput, SpendingSummaryCard, SpendingTrendCard | Amount size/weight; decimal display rule |
| SG-15 Indian Number Formatting | REF-G01, REF-G02 | AmountInput, SpendingSummaryCard, SpendingTrendCard | Currency symbol, digit grouping |
| SG-16 Action-First Labels | REF-U01 | PrimaryActionButton | Label text pattern and length |
| SG-17 Minimum Touch Targets | REF-P01; WCAG 2.5.8 | All interactive | Minimum hit area and spacing |
| SG-18 Primary Button Shape & Placement | REF-U01 | PrimaryActionButton | Height, width, corner radius, bottom position |
| SG-19 Button States | REF-U01 (default only) | PrimaryActionButton, secondary buttons | Pressed/focus/loading/disabled fills and indicators |
| SG-20 Disabled Primary Explains Itself | Vision §4.1, §4.5 | PrimaryActionButton, AmountInput, CategoryGrid | Helper text adjacent to disabled button |
| SG-21 Equal-Weight Tiles | REF-P01, REF-G01 | CategoryTile, CategoryGrid | Uniform tile size, border, icon size, label style |
| SG-22 Icon + Label Always | REF-P01; Vision §7 | CategoryTile | Icon and visible label pairing |
| SG-23 Tile Dimensions & Grid | REF-P01 (adapted) | CategoryTile, CategoryGrid | Column count, min tile size, gap, radius |
| SG-24 Multi-Cue Selected State | REF-U01, REF-D01 | CategoryTile | Tint fill, border width/color, check badge, label weight |
| SG-25 Multi-Select Behavior | Vision §4.5 | CategoryGrid, CategoryTile | Toggle behavior; selection summary line |
| SG-26 Unknown Is First-Class | Vision §4.1, §4.5 | CategoryTile, CategoryGrid | Same styling as peers; fixed last position; exclusivity |
| SG-27 Category Label Rules | REF-P01 | CategoryTile | Max 2 lines, centred, no ellipsis |
| SG-28 Always-Visible Step Indicator | REF-D01 | ExpenseProgressIndicator | Segment count, "Step n of 3" caption, position |
| SG-29 Completed/Current/Upcoming | REF-D01 | ExpenseProgressIndicator | Per-state fill, icon, emphasis |
| SG-30 Back Preserves Data | REF-U01, REF-G02 | ExpenseProgressIndicator / header | Back icon button size and position |
| SG-31 Restrained Completion Feedback | REF-D01 (tone only) | Completion feedback | Success check, message, motion duration |
| SG-32 Error Recovery | Vision §8 | AmountInput, Review step | Inline error style (icon + text); persisted state |
| SG-33 Headline Spending Total | REF-G01 | SpendingSummaryCard | Overline label, headline amount, ≤ 3 supporting metrics |
| SG-34 No Double Counting | Vision §6, §9 | SpendingSummaryCard, breakdown | Overlap note and info control |
| SG-35 Simple Trend Chart | REF-G02 | SpendingTrendCard | Single accent line; dashed grey comparison; minimal grid |
| SG-36 Time-Range Control | REF-G02 | SpendingTrendCard | Pill row, active outline/fill, hit area |
| SG-37 Breakdown as Labeled List | REF-G02 (list adopted, donut rejected) | Category breakdown | Row layout, single-hue bar, right-aligned amount |
| SG-38 4-Point Spacing Scale | — | All | Spacing values |
| SG-39 Mobile-First Frame | All references (phone) | All screens | Gutters, max content width |
| SG-40 Consistent Alignment | REF-G01 | SpendingSummaryCard, breakdown, Review | Text left / amounts right; card padding |
| SG-41 Screen Reader Semantics | WCAG 2.2 | All | Roles, names, states, chart text summary |
| SG-42 Non-Color States | REF-D01, REF-G02 | CategoryTile, ExpenseProgressIndicator, SpendingTrendCard | Non-color cue per state |
| SG-43 Text Scaling | WCAG 1.4.4 | CategoryGrid, AmountInput, SpendingSummaryCard | Reflow and wrapping behavior |
| SG-44 Reduced Motion | WCAG 2.3.3 | CategoryTile, completion feedback | Animation duration and reduced-motion fallback |

### Candidate chain for the assignment (to be completed in later steps)

`REF-U01` (observed: single full-width black confirmation button) → **SG-07 Near-Black Primary Action** / **SG-18 Primary Button Shape & Placement** → *(token to be defined in Step 2: primary action fill, primary button height)* → *(component property to be defined in Step 3: PrimaryActionButton background and height)*.

---

## Appendix A — Reference Image Inspection Log

All five Project Context images were opened and inspected for this guide. Observations below are limited to what is visible; nothing here claims to represent the apps' current live interfaces.

| ID | File | What is visibly present | What we take | What we exclude |
|---|---|---|---|---|
| REF-P01 | `REF-P01.png` | PhonePe home: purple header; "Transfer Money" row of four equal purple squircle icons with two-line labels; a row of three blue filled shortcut tiles; "Recharge & Pay Bills" grid of outline icons with labels and a "See All" tile; bottom navigation. | Equal-weight icon + label tiles; label wrapping; uniform grid. | Purple branding, proprietary icons, super-app density, sponsored content. |
| REF-D01 | `REF-D01.png` | Annotated Duolingo path: completed levels gold with checks; current level green with star, progress ring and "START" tooltip; upcoming/locked levels grey with lock icons; unit header; streak, gem and heart counters in the top bar. | Three distinguishable progress states using icon + color; encouraging tone. | Winding path, mascot, gems/hearts/streaks, bright game palette. |
| REF-U01 | `REF-U01.png` | Uber ride selection (Spanish): map with route; circular back button; three ride options (image, name, time, price) with the selected "Comfort" row tinted light blue; payment row; full-width black "Confirmar Comfort" button at bottom. | One dominant black CTA at bottom; tinted selected row; subordinate back and payment controls. | Map, transport flow, Spanish copy. |
| REF-G01 | `REF-G01.jpg` | Two Groww phones. Left (dimmed) has a "Select portfolio" bottom sheet with a 2 × 2 grid of white cards, each with a circular icon and label ("All holdings", "Long term", "Value investing", "Add new portfolio"). Right: "Stocks" screen with underlined tabs; a card with "LONG TERM (5)" overline, "₹10,00,000" headline, rows for 1D returns (red), Total returns (green), Invested; a holdings list with sparklines and right-aligned amounts; bottom navigation. | Headline-amount hierarchy, overline label, label-left/value-right rows, Indian grouping, bottom-sheet disclosure, uniform tile grid. | Market index chips, returns terminology, red/green gain/loss coloring. |
| REF-G02 | `REF-G02.png` (replacement file) | Two Groww phones. Left: donut chart above a "Sectors" list, each row with a colored leading bar, sector name, stock count and percentage, right-aligned amount and green change. Right: "Portfolio analysis" with back arrow, "Current" and "Invested" headline values, solid line vs dotted grey line chart, time-range pills "1W 1M 3M 6M 1Y 5Y All" with "All" outlined, and an "XIRR" insight card with an info icon. | Values above chart, single-plus-comparison line style, time-range pill row, labeled breakdown list, info affordance for explanations. | Donut for overlapping tags, XIRR / NIFTY comparisons, sector/investment language. |

**Verification notes**

- REF-G01 file is confirmed as `REF-G01.jpg` (JPEG) in Project Context.
- REF-G02's replacement file is `REF-G02.png`. It **does** contain the elements listed as "pending visual verification" in `SCREEN_REFERENCES.md` (chart below prominent values, visible time-range choices, supporting insight card). That file can be updated accordingly.
- These are marketing or illustrative images, not live sessions; they remain inspiration, not evidence of current app UI.

## Appendix B — Open Questions for Review

1. **Unknown exclusivity (SG-26):** confirm Unknown should clear other selections, and that "no selection" saves as Uncategorized.
2. **Category set:** the initial list of categories and their icons is not yet defined.
3. **Font licence and rendering (SG-12):** confirm Inter (or system font) for production.
4. **Time ranges (SG-36):** confirm Week / Month / 3 Months / Year as the initial set.
5. **Usability targets (SG-01):** the 80 % first-impression target is a placeholder pending research.
