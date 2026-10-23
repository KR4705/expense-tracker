# Design Reference Catalog — Selected Screens

**Version:** 0.4 | **Stage:** Specific visual references gathered | **Date:** 23 October 2026

## Purpose

These references represent four deliberately distinct UI behaviors selected for the Expense Tracker. The images remain hosted by their original publishers or sources; they are linked here for design research rather than copied into this public repository. Exact screenshot designs and app versions may differ from current production apps.

## REF-P01 — PhonePe: equal-weight action options

**Selected screen:** PhonePe home screen, **Transfer Money** section, with four purple icon actions: To Mobile Number, To Bank/UPI ID, To Self Account, and Check Bank Balance.

**Image:** [View specific screenshot](https://candid.technology/wp-content/uploads/2022/06/RequestMoney_Phonepe_1.jpg)

**Source page:** https://candid.technology/how-to-request-money-on-phonepe/

**Official design commentary:** https://design.phonepe.com/stories/behind-phonepe-redesign

**Observed component:** Peer choices in a horizontal group, each with an icon and short label, visually comparable in importance.

**Translation:** A grid of peer `CategoryTile` selections with icons plus text; support selecting multiple tiles. All choices should look tappable even when unselected.

**Not copied:** App homepage density, payment terminology or PhonePe's proprietary icon artwork.

**Evidence caveat:** Screenshot was published in 2022 and should not be presented as PhonePe's current UI.

## REF-D01 — Duolingo: completed/current/upcoming steps

**Selected screen:** Duolingo's learning path with **gold completed levels**, a green current START level, and gray future locked levels.

**Image:** [View annotated screenshot](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/04/data-src-image-b596a57f-59a3-4500-8962-c4544ac42ba0.png)

**Official design commentary:** https://blog.duolingo.com/new-duolingo-home-screen-design/

**Observed component:** Progression states communicate both the next action and previously completed work.

**Translation:** Compact `ExpenseProgress` with explicit completed/current/upcoming states, a clear textual step label, and positive completion feedback.

**Not copied:** Game path geometry, mascot art, points, streak mechanics.

**Evidence caveat:** Refer to the official article for historical redesign context; the image is illustrative rather than a guaranteed current production screen.

## REF-U01 — Uber: unmistakable forward CTA

**Selected screen:** Historical Uber booking sequence showing large black **CONFIRM RIDER** and **REQUEST UBERPOOL** buttons under choice screens.

**Image:** [View booking screenshot](https://i0.wp.com/cdnssl.ubergizmo.com/wp-content/uploads/2017/07/uber_ride_book.jpg?resize=1280%2C750&ssl=1)

**Source page:** https://www.ubergizmo.com/how-to/use-uber-app/

**Observed component:** A dark full-width bottom action visually dominates the screen, with verb-based text communicating the next action.

**Translation:** `PrimaryActionButton` on each expense-capture step; consistent placement and strong contrast.

**Not copied:** Ride selection, maps, transport labels.

**Evidence caveat:** 2017 screenshot. Used strictly as interaction inspiration, not representation of Uber's current look.

## REF-G01 — Groww Mobile: financial summary hierarchy

**Selected screen:** Groww mobile **Holdings** overview showing market index strip, a prominent long-term holdings total, investment/return rows, and holdings list.

**Image:** [View specific holdings screenshot](https://cms-resources.groww.in/uploads/258_1x_shots_so_11zon_9c3653f135.jpg)

**Official source:** https://groww.in/updates/portfolios-on-groww

**Observed component:** Clear hierarchy from top summary to detailed rows, with sparing chart microvisuals.

**Translation:** `SpendingOverview` with total expenses, selected timeframe, concise summary and drilldown.

**Not copied:** Equity terminology, market ticks or trading navigation.

## REF-G02 — Groww Mobile: readable trend chart

**Selected screen:** Groww mobile **Portfolio analysis** showing top numerical comparison, uncluttered trend graph, range selectors and a lower analysis card.

**Image:** [View specific analysis screenshot](https://cms-resources.groww.in/uploads/Portfolio_Analysis_on_Groww_450d129a2a.png)

**Official source:** https://groww.in/updates/portfolio-analysis-on-groww

**Observed component:** Primary numbers above a spacious chart; supporting insights appear below.

**Translation:** `SpendingTrendCard` with total spending and a clean, readable trend by week/month/year. Multi-tag transactions must not inflate overall totals.

**Not copied:** XIRR, benchmarks, investment percentages or trading language.

## Proposed cross-product principles

| Principle | Evidence | Component candidate |
|---|---|---|
| Equal-weight peer choices | REF-P01 | CategoryTile |
| Always-visible progress | REF-D01 | ExpenseProgress |
| One visually dominant next action | REF-U01 | PrimaryActionButton |
| Mobile-first financial hierarchy | REF-G01 | SpendingOverview |
| Digestible trend visualization | REF-G02 | SpendingTrendCard |

These are reference-based **design proposals**, not yet finalized style-guide rules, token definitions or implementation specs.

## Assignment traceability

The subsequent design system must establish:

`reference → observation → numbered style-guide rule → named token → component property`

Step 1 passes when a chosen component property can be traced back to a numbered style-guide rule through an explicit token. Reference gathering alone is not sufficient.

## Asset and documentation status

- Five selected screen examples are linked to exact images and source pages.
- Images are **externally hosted**, not stored as screenshot binaries in this public repository.
- Original third-party screenshots should not be redistributed as local assets without appropriate rights.
- This document is a design research artifact, not a prompt to an AI agent.
