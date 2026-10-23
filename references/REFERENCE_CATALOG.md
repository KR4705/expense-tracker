# Design Reference Catalog

**Version:** 0.3 | **Stage:** Design discovery | **Updated:** 23 October 2026

## Purpose

Four consumer mobile experiences inform distinct parts of the Expense Tracker interface. The intention is to understand useful interaction patterns, not reproduce their branding, layouts or proprietary graphics. The reference roles below reflect the selected product direction; individual screenshots have not yet been approved.

## Reference matrix

| ID | Reference | Design observation to investigate | Application to Expense Tracker | Excluded patterns |
|---|---|---|---|---|
| REF-P01 | PhonePe | Equal-weight icon-backed choices that remain distinguishable at a glance | Multiple categories or tags and other peer selections | Dense super-app menus and payment-specific visuals |
| REF-D01 | Duolingo | Visually legible completed, current and upcoming stages | Expense-entry progress and save acknowledgement | Childish gamification, rewards or streaks |
| REF-U01 | Uber | A prominent, predictable primary button on each task screen | Continue, Review and Save actions | Maps and transport-specific navigation |
| REF-G01 | Groww **mobile** | Concise summary hierarchy, mobile cards, readable charts | Spending overview, category breakdown and trends | Desktop dashboard structure or trading information density |

## Proposed cross-product interaction principles

These are **design intentions to validate**, not fixed component specifications or numerical tokens.

1. **Many choices, equal weight.** Peer category choices use consistent size, hierarchy and affordance, rather than an arbitrary featured choice.
2. **One next step, clearly emphasized.** Each guided step has one visually dominant forward action.
3. **Visible progression.** Current, completed and upcoming stages are differentiated with iconography/text/shape in addition to color.
4. **Every category has a visual marker and label.** Multiple tags may be selected; Unknown is available when classification is unclear.
5. **Progressive disclosure.** Each screen presents the minimum information required for the current decision.
6. **Mobile-first financial summaries.** A compact top-level total precedes optional charts and detailed breakdowns. Multitag totals need careful treatment to avoid double-counting.

## Source material and screenshot selection

### REF-P01 — PhonePe: parallel choices

**Primary reading:** [PhonePe redesign](https://design.phonepe.com/stories/behind-phonepe-redesign); [Design at scale](https://design.phonepe.com/stories/role-of-design-at-scale).

**Screenshot needed:** A PhonePe mobile view containing several parallel icon-backed actions, plus a selection state if available.

**Relevant characteristic:** Independent options appear comparable in importance, with labels and recognizable visuals.

### REF-D01 — Duolingo: guided progress

**Primary reading:** [Duolingo home-screen redesign](https://blog.duolingo.com/new-duolingo-home-screen-design/).

**Screenshot needed:** A mobile learning path that makes current and completed stages distinguishable.

**Relevant characteristic:** The next activity and position within a journey are apparent.

### REF-U01 — Uber: dominant action

**Primary reading:** [Uber ride-request process](https://help.uber.com/pa-IN/riders/article/how-to-request-a-ride-?nodeId=67f41961-e0aa-4670-af32-58be02c7c492).

**Screenshot needed:** A mobile selection screen with its forward action, ideally accompanied by the confirmation state.

**Relevant characteristic:** A single action appears to advance the current step.

### REF-G01 — Groww mobile: financial overview

**Primary reading:** [Groww](https://groww.in/); [Portfolio overview](https://groww.in/updates/portfolios-on-groww); [Portfolio analysis](https://groww.in/updates/portfolio-analysis-on-groww).

**Screenshot needed:** Actual mobile application screens showing summary metrics, a chart and a breakdown. The webpages above provide background context, not substitutes for mobile screenshots.

**Relevant characteristic:** Financial information is introduced at a digestible level, followed by details.

## Image records

The following are **not yet collected**: PhonePe mobile examples, Duolingo path, Uber action and confirmation, and Groww mobile dashboard. Their respective directories are reserved for approved reference assets.

When a screenshot is selected, its record should capture:

| Field | Description |
|---|---|
| Reference ID | One of the IDs above |
| File | Relative image path, if committed |
| Source | Original page or app |
| Capture date | When the reference was collected |
| Observed detail | What is actually visible |
| Design implication | How it informs Expense Tracker |
| Status | Candidate, reviewed, approved or rejected |

Third-party assets should not be committed to the public repository without appropriate rights or permission.

## Design-system evidence

Once observations have been reviewed, design-system documentation will establish an auditable chain:

**Reference → observed pattern → numbered style-guide rule → named design token → component property**

The Step 1 acceptance criterion requires at least one component property to trace back to a specific rule via its token without a missing link. No such completed chain is claimed yet.
