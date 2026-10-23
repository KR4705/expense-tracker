# Expense Tracker — Product Vision Document

**Status:** Working product vision | **Version:** 1.1 | **Updated:** 23 October 2026

## 1. Vision
Make expense awareness effortless for people who spend freely but do not consistently organize their spending. Expense Tracker is a mobile-first, low-friction way to capture expenses and understand where money goes, without making budgeting or spending restrictions the product's primary purpose.

## 2. Problem
Many financially comfortable, high-spending people do not have a clear picture of their spending. Individual expenses occur across multiple contexts and can be hard to classify into one neat category. Conventional expense trackers often demand detailed entry, rigid categories, or budgeting discipline. That friction discourages frequent use and leads to incomplete records and poor visibility.

**Opportunity:** Make recording an expense so easy and visually clear that users actually do it, then convert those records into meaningful spending insights.

## 3. Target audience
**Primary segment:** Financially unorganized **high-net-worth individuals and high spenders** who want clarity and intelligence about their expenses, not a system that judges or restricts spending.

The defining need is **low-effort visibility despite complex or loosely organized spending habits**. Wealth or spending level does not imply financial organization. This is a product hypothesis, not a validated user-research finding.

## 4. Core product experience
1. **Capture first, organize later.** An expense must be easy to record without having to solve its classification immediately.
2. **Guided, progressive flow.** Expense entry should ordinarily take around **3–4 clear interactions/steps**, using a linear journey with a prominent next action on every screen.
3. **Unmistakable touch controls.** Prefer large, clearly tappable buttons and selection tiles; avoid ambiguous links or dense forms.
4. **Visual categorization.** Every category choice combines a recognizable icon/illustration or emoji-like visual with a readable label. Distinguish options by more than words or color alone.
5. **Flexible tags, not forced buckets.** An expense can have **zero, one, or multiple tags**, for example `Food` plus `Charity`. `Unknown` and `Miscellaneous` must be valid choices. An expense need not fit exactly one category.
6. **Progress and feedback.** Show where the user is in the journey, make the next step obvious, clearly acknowledge selection and successful saving.
7. **Low-friction defaults.** Optional details should not block a basic expense entry unless necessary for a reliable record.

## 5. Illustrative expense-entry journey
- **Step 1 — Amount:** Enter the expense amount in a focused screen with an obvious Continue button.
- **Step 2 — Categories/tags:** Choose one or more visual category tiles, or leave uncategorized / select Unknown.
- **Step 3 — Review and save:** Show a compact summary and a prominent Save Expense button.
- **Optional fourth step:** Additional details only when necessary; the flow should remain short.

This is a **proposed journey**, not a locked implementation specification. The user experience should be evaluated against the 3–4-interaction ambition.

## 6. Insights and dashboard
Provide a calm, readable dashboard showing total spending, useful trends, and breakdowns that help users understand spending patterns. **Do not double-count the same transaction in the total** merely because it has multiple tags. When showing totals by tag, clearly explain overlapping membership so aggregate category figures are not mistaken for distinct spend.

Dashboard inspiration: **Groww** — prioritize the hierarchy and readability of financial information, not investment-specific complexity.

## 7. Design inspiration and intent
- **PhonePe:** high-confidence, familiar icon-backed actions for mass-market clarity.
- **Duolingo:** visible progression, next-step emphasis, and encouraging feedback, without childish gamification.
- **Uber:** an obvious linear path from input to confirmation.
- **Groww:** simple, comprehensible financial summary and insights.

Start with a **light, uncluttered** screen and progressively reveal only the information needed for the current decision. The primary button or highlighted action should clearly show how to move forward. Visual cues must be consistently designed; do not rely only on color or assume an icon is universally understood.

## 8. MVP direction
The initial product should focus on:
- Fast manual expense capture and editing.
- Flexible visual multi-tag classification, including Unknown/Miscellaneous.
- A simple transaction history and clear summary dashboard.
- An experience that preserves information even when classification is deferred.

Potential account settings, administrative controls, integrations, automation, budgets, and more advanced analytics require separate discovery and prioritization; they are **not committed MVP scope** merely because they are possible.

## 9. Success criteria to validate
- Users can understand the next action without instruction.
- Most basic expense entries can be completed through the intended short flow.
- Users can save expenses when the category is unclear.
- Users understand that categories can overlap.
- The dashboard provides a trustworthy total without double-counting.

Quantitative usability targets and business KPIs remain to be defined through research and testing.

## 10. Product positioning
**Visibility and understanding over restriction.** The product should make expense tracking easy enough to become a habit for high spenders who would otherwise avoid financial administration.

---
**Naming note:** Expense Tracker is the working name. Khata360 is a possible future brand name, not yet approved.

**Source note:** Consolidated from the product-vision discussions in this project. The exact document uploaded to Claude Project Context was not directly accessible here, so this is a reconstructed version for review; confirm alignment before treating it as the definitive source of truth.
