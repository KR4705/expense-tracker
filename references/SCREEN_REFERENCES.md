# Curated Mobile Screen References

**Review date:** 23 October 2026  
**Status:** Specific candidate screens found; product patterns approved, individual assets remain reference material.  
**Scope:** Mobile screens only. The images remain on third-party websites and are not copied into this repository.

## P01 — PhonePe: equal-weight category/action choices

- **Target screen:** PhonePe home screen, top *Transfer Money* row.
- **Image:** [View exact screenshot](https://miro.medium.com/v2/resize%3Afit%3A600/0%2AM_Bz-IDzLrYaDV3U.png)
- **Source:** [PhonePe UX case study](https://medium.com/@ginnidhyani934/phone-pe-ux-mini-case-study-ff50ca670545) (third-party, not official).
- **Inspect:** Four purple actions: To Mobile Number, To Bank/UPI ID, To Self Account, Check Bank Balance. Each icon + label occupies comparable visual space.
- **Translate:** Category grid with equal-size, icon-backed tappable tiles, including Food, Shopping, Transport, Charity and Unknown. Allow multiple selection where applicable.
- **Do not copy:** Brand purple, exact artwork, super-app density.
- **Evidence limitation:** Third-party screenshot may show an older UI; validate intended pattern instead of treating it as the current app.

## D01 — Duolingo: completed/current/upcoming progression

- **Target screen:** Learning path with completed gold levels, a green START/current level and grey locked levels.
- **Image:** [View exact screenshot](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/04/data-src-image-b596a57f-59a3-4500-8962-c4544ac42ba0.png)
- **Source:** [Duolingo — frontend prediction in mobile apps](https://blog.duolingo.com/frontend-prediction/); [guided path rationale](https://blog.duolingo.com/new-duolingo-home-screen-design/).
- **Inspect:** Completed gold state, highly visible current START, muted future steps.
- **Translate:** Compact expense-entry stepper: Amount ✓ → Categories (current) → Save (upcoming). Show current, completed and pending states with accessible text and shape cues.
- **Do not copy:** Long winding path, gaming rewards, character artwork.
- **Evidence limitation:** Illustrates a particular design version, not necessarily today's interface.

## U01 — Uber: dominant next-step action

- **Target screen:** Uber Comfort ride selection, highlighted ride option and black Confirmar Comfort button.
- **Image:** [View exact screenshot](https://tb-static.uber.com/prod/udam-assets/d6d32aa3-e08a-5bdb-81fb-52f106f94853.png)
- **Source:** [Uber official Comfort article](https://www.uber.com/es/es-es/blog/comfort/).
- **Inspect:** Ride option visibly selected; one solid full-width black confirmation action below the choices.
- **Translate:** Categories may be many, but one bottom-area Continue/Save button should clearly indicate forward movement.
- **Do not copy:** Ride terminology, map layout or exact brand styling.
- **Evidence limitation:** Spanish-language, historic screenshot; interaction pattern is the reason for selection.

## G01 — Groww: mobile financial overview

- **Target screen:** Official portfolio analysis mobile illustration with current/invested values and trend chart.
- **Image:** [View exact screenshot](https://cms-resources.groww.in/uploads/Portfolio_Analysis_on_Groww_450d129a2a.png)
- **Source:** [Groww portfolio analysis](https://groww.in/updates/portfolio-analysis-on-groww).
- **Inspect:** Large current portfolio value, secondary comparison metric, chart and timeframe choices, further insight card.
- **Translate:** Total spent prominent → time trend → category/tag insights → detailed history.
- **Do not copy:** Returns, XIRR, investment jargon, or exact design assets.
- **Evidence limitation:** Official marketing visual of mobile interface rather than a capture from a signed-in user session.

## G02 — Groww: alternative dark portfolio overview (optional)

- **Target screen:** Three mobile dark-mode portfolio mockups from a designer case study.
- **Image:** [View exact image](https://framerusercontent.com/assets/Po5yQnyCeaWphrf744mWwdYEg.png)
- **Source:** [Portfolio page design case study](https://adityakolte.com/project/groww).
- **Inspect:** Summary card, simple allocation bar, prominent numeric total and filters.
- **Translate:** Optional dashboard hierarchy and category allocations.
- **Caution:** Designer's case-study visual; not established here as Groww's current production interface.

## Recommended primary reference pack

**Use P01, D01, U01 and G01 as the four primary examples.** G02 is a supplementary dashboard option.

| Rule candidate | Screen evidence | Component to specify |
|---|---|---|
| Peer choices receive equal visual weight | P01 | CategoryTile / CategoryGrid |
| Step states are differentiated visibly | D01 | ExpenseProgressIndicator |
| Exactly one dominant next-step action | U01 | PrimaryActionButton |
| Financial summaries prioritize the headline metric | G01 | SpendingSummaryCard |

These rules are **candidates**. They are not approved style-guide rules and have no assigned design-token values yet.

### Asset policy

Screenshots are linked from their original sources. No image files have been mirrored into GitHub. Downloading or distributing branded assets for a public repository may require permission. The final application should use original iconography.
