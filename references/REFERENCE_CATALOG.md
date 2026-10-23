# Design Reference Catalog

**Version:** 0.6 | **Updated:** 24 October 2026  
**Status:** Reference roles approved; individual screenshots remain candidate evidence.

## Purpose

This catalog records the design behaviors selected for Expense Tracker and their intended application. The exact image URLs, screen versions, attribution and caveats are maintained only in [Screen References](SCREEN_REFERENCES.md), the authoritative asset index. This separation prevents competing descriptions of the same reference ID.

## Approved reference roles

| Reference ID | Product | Design behavior | Intended application | Explicit exclusions |
|---|---|---|---|---|
| REF-P01 | PhonePe | Equal-weight peer actions with icons and readable labels | Multi-select CategoryTile and CategoryGrid | Super-app density, branded icons |
| REF-D01 | Duolingo | Current, completed, and upcoming progress states | ExpenseProgressIndicator and completion feedback | Long game path, points, streaks |
| REF-U01 | Uber | One unmistakable, strongly contrasted forward button | PrimaryActionButton for Continue / Review / Save | Transport-specific flows and maps |
| REF-G01 | Groww mobile | Prominent headline amount and readable summary hierarchy | SpendingOverview / SpendingSummaryCard | Market and investment terminology |
| REF-G02 | Groww mobile | Uncluttered chart, time-range controls, supporting analysis | SpendingTrendCard | Advanced investing analytics |

REF-G01 and REF-G02 are **two screens within one Groww mobile design direction**, not competing app inspirations.

## Product-wide design intentions

1. When choices are peers, give them comparable visual weight and clear icon-plus-text affordances.
2. When moving forward, show one dominant, consistently positioned next-step button.
3. Display completed, current and upcoming steps with more than color alone.
4. Treat categorization as a visual and potentially multi-select interaction; Unknown remains a valid option.
5. Start with a light, uncluttered screen and progressively reveal what matters.
6. Organize the mobile dashboard from headline spending metric to trends and optional breakdowns. Multiple tags must not inflate overall spending totals.

These are design intentions, **not finalized numbered style-guide rules or numeric tokens**.

## Design-system traceability

The subsequent design documentation should support:

`reference ID → observation → numbered style-guide rule → token → component property`

A pass requires at least one complete component-to-rule chain. Screenshots provide inspiration and evidence but do not themselves define component values.

## Reference status

- Design roles: approved.
- Exact screen/URL mapping and attachment reconciliation: [Screen References](SCREEN_REFERENCES.md).
- Screenshot images stored in repository: none. Project Context contains uploaded images; REF-G01 has been confirmed by the user to be JPEG, and REF-G02 has been replaced in Project Context. The new REF-G02 file identity and visual content still require verification.
- Design tokens and component specifications: not yet authored.
- Use of copyrighted screenshots: limited to linked research sources unless reuse permissions are established.
