# Design Reference Report — Step 1

**Version:** 0.2 | **Status:** Approved inspiration roles; screenshot review and detailed rules pending.

## Product-wide interaction principles

1. **Many valid choices → equal-weight visual tiles.** Avoid suggesting that one category is the default when several are equally valid.
2. **One clear next action → one dominant button.** Every guided expense-entry screen should clearly reveal what advances the flow.
3. **Progress → visible throughout.** Show completed, current and upcoming steps using more than color alone.
4. **Categories → visual marker plus readable name.** Use consistent icon/emoji-like cues; support one or multiple tags, including Unknown.
5. **Start light and reveal progressively.** Show only what the user needs at the current step.
6. **Mobile-first dashboard → easy scanning.** Present summary metrics, trends, then breakdowns; avoid investment-specific density.

## Approved reference-role matrix

| ID | App | Exact behavior to study | Where applied | Explicitly not copying |
|---|---|---|---|---|
| REF-P01 | PhonePe | Equal-weight choices, large recognizable icon-backed action options | Expense category and tag tiles; optional source selection | Super-app clutter, payments content, proprietary icons |
| REF-D01 | Duolingo | Current/completed/upcoming progression states; motivating feedback | Expense-entry progress indicator and save confirmation | Childish illustration, heavy gamification |
| REF-U01 | Uber | One dominant next-step CTA; focused linear decisions | Continue, Review, Save buttons on step screens | Maps, transport terminology |
| REF-G01 | Groww **mobile** | Financial summary hierarchy, readable mobile cards/charts | Expense dashboard, trends, category breakdowns | Web dashboard structure, trading-specific features |

## Visual reference sources and screenshot targets

### PhonePe
- [PhonePe design at scale](https://design.phonepe.com/stories/role-of-design-at-scale)
- [PhonePe redesign](https://design.phonepe.com/stories/behind-phonepe-redesign)
- **Capture:** one mobile screen with several equal-weight icon-backed actions, one selected/action state if available.
- **Derived candidate rule:** equivalent choices must use equivalent size, weight and interactive affordance.

### Duolingo
- [Guided home-screen design](https://blog.duolingo.com/new-duolingo-home-screen-design/)
- **Capture:** one mobile screen with clearly differentiated current, completed, and upcoming progress.
- **Derived candidate rule:** progress must be visible, understandable and not solely color-dependent.

### Uber
- [Official ride request flow](https://help.uber.com/pa-IN/riders/article/how-to-request-a-ride-?nodeId=67f41961-e0aa-4670-af32-58be02c7c492)
- **Capture:** one choice step with a visually dominant CTA, one confirmation screen.
- **Derived candidate rule:** each step screen has exactly one dominant forward action, consistently placed and labeled with a verb.

### Groww mobile
- [Groww](https://groww.in/)
- [Groww portfolio summary](https://groww.in/updates/portfolios-on-groww)
- [Groww portfolio analysis](https://groww.in/updates/portfolio-analysis-on-groww)
- **Capture:** actual **mobile app** summary, readable mobile chart, and mobile breakdown. Use web content only as background reading; it must not substitute for mobile screenshots.
- **Derived candidate rule:** the first viewport should prioritize total and essential metrics over dense charts or drilldowns.

## For Claude
Use these as **behavioral references**, not visual templates to clone. Before selecting colors, dimensions, fonts or states, derive numbered style-guide rules from observed evidence, then named tokens, then components. Explicitly distinguish **observed** patterns, **proposed** rules and **approved** rules.

### Traceability format required
`reference ID → observed behavior → style-guide rule ID → design token → component property`

**Pass condition:** For one implemented or specified component, trace its property through its token to its style-guide rule without gaps. The reference provides supporting evidence, not a substitute for a rule.

## Status
- Reference roles: approved in conversation.
- Source links and target screens: documented.
- Screenshots: **not committed**.
- Style guide/tokens/components: **not yet generated or approved**.
