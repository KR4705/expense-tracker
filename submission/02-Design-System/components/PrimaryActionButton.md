# PrimaryActionButton — Component Specification

**Version:** 0.2 (draft) | **Date:** 24 October 2026
**Sources:** `docs/PRODUCT_VISION.md` v1.1 · `design-system/STYLE_GUIDE.md` v0.2 · `design-system/tokens.json` v0.1.0 · `references/REFERENCE_CATALOG.md` v0.6
**Primary reference:** REF-U01 (Uber — one unmistakable, strongly contrasted forward button)
**Status:** Implementation-ready specification. No code.

---

## 1. Purpose and role

PrimaryActionButton is the single forward action on a screen. It answers the question "what do I do next?" in the expense-entry flow and on the save-confirmation screen. Every expense-entry step has exactly one, always in the same place at the bottom of the screen.

| Screen | Label | Result |
|---|---|---|
| Step 1 — Amount | `Continue` | Go to Categories |
| Step 2 — Categories | `Review` | Go to Review & save |
| Step 3 — Review & save | `Save expense` | Save the expense (shows loading) |
| Optional details | `Done` | Return to Review & save |
| Save confirmation | `Add another` | Start a new entry |

Labels come from the Style Guide's proposed entry flow (§G) and SG-31. They follow SG-16 sentence case, so the label is **"Save expense"**, not "Save Expense".

## 2. Relevant product requirements

| Requirement | Source |
|---|---|
| Users understand the next action without instruction. | Vision §4.2, §9 |
| A prominent next action on every screen of a linear journey. | Vision §4.2, §7 |
| Large, clearly tappable buttons; no ambiguous links. | Vision §4.3 |
| Acknowledge selection and successful saving. | Vision §4.6 |
| Optional details never block a basic entry. | Vision §4.7 |
| A basic expense takes about 3–4 interactions. | Vision §4.2, §5 |

## 3. Visual anatomy

```
 ┌──────────────── screen gutter ────────────────┐
 │  (4) Helper text — only when disabled          │
 │ ┌────────────────────────────────────────────┐ │
 │ │ (1) Container — full width, near-black     │ │
 │ │          (2) Label  /  (3) Spinner + label │ │
 │ └────────────────────────────────────────────┘ │
 │  (5) Bottom offset to safe area / keyboard     │
 └────────────────────────────────────────────────┘
      (6) Focus ring drawn outside (1) with offset
```

| # | Part | Description |
|---|---|---|
| 1 | Container | Full-width filled rectangle with rounded corners; the only near-black filled control on the screen. |
| 2 | Label | One- to three-word, verb-first action text, centred. |
| 3 | Loading indicator | Spinner followed by the text "Saving…"; replaces the label while saving. |
| 4 | Helper text | One line above the button explaining why it is disabled. Present only in the disabled state. |
| 5 | Dock | Fixed to the bottom of the screen above the safe area; rides above the on-screen keyboard. |
| 6 | Focus ring | Visible only for keyboard, switch or other non-touch focus. |

## 4. Properties and accepted values

| Property | Type | Accepted values | Default | Notes |
|---|---|---|---|---|
| `label` | text | `Continue`, `Review`, `Save expense`, `Done`, `Add another` | — (required) | Must start with a verb, ≤ 3 words, sentence case (SG-16). New labels need design review. |
| `disabled` | boolean | `true`, `false` | `false` | Use only where SG-20 allows (see §5.4). |
| `disabledReason` | text | One short sentence, e.g. "Enter an amount to continue" | — | **Required when `disabled` is `true`.** Rendered as visible helper text (anatomy 4) that is a normal text element in reading order, so it is reachable even if the button cannot take focus (see §7). |
| `loading` | boolean | `true`, `false` | `false` | Used for actions that wait on saving, i.e. `Save expense`. |
| `loadingLabel` | text | Short present-participle phrase | `Saving…` | Shown beside the spinner and announced to screen readers. |
| `onActivate` | action | — | — (required) | Fires once per activation; ignored while `loading` or `disabled`. |

Pressed and focused are interaction states, not properties.

## 5. States

All states must be distinguishable without color alone (SG-42).

| State | Container | Label | Other cues | Tokens |
|---|---|---|---|---|
| **Default** | Near-black fill | White, semibold | — | `component.primaryActionButton.default.background`, `component.primaryActionButton.default.foreground` |
| **Pressed** | Lighter near-black fill, scaled to 0.98 | Unchanged | Visible within 100 ms of touch | `component.primaryActionButton.pressed.background`, `component.primaryActionButton.pressed.scale`, `motion.duration.pressFeedback` |
| **Focused** | Unchanged | Unchanged | 2 px blue ring with 2 px offset | `component.primaryActionButton.focused.ringColor`, `component.primaryActionButton.focused.ringWidth`, `component.primaryActionButton.focused.ringOffset` |
| **Loading** | Default fill; size unchanged | Replaced by spinner + "Saving…" | Further activations ignored | `component.primaryActionButton.loading.background`, `component.primaryActionButton.loading.indicator` |
| **Disabled** | Light grey fill | Grey | Helper text above the button | `component.primaryActionButton.disabled.background`, `component.primaryActionButton.disabled.foreground` |

### 5.1 Default
Shown whenever the action is available. Only one control on the screen may use this appearance (SG-01, SG-07).

### 5.2 Pressed
Fill changes and the button scales slightly on touch-down, giving immediate feedback (SG-19). With reduced motion enabled, the scale change is omitted and only the fill changes (SG-44).

### 5.3 Loading
Applies to `Save expense`. The label is replaced by a spinner and "Saving…"; the button keeps its exact size so the layout does not shift. Repeated taps during loading are ignored (SG-19). This is a **UI safeguard only**: it stops accidental double taps on this device, but it cannot prevent duplicates caused by retries, lost network responses or app restarts. Duplicate-expense prevention also requires the expense-saving workflow to handle saves idempotently (for example, each draft carries one identifier and a repeated save with the same identifier does not create a second expense). That workflow requirement is outside this component and must be covered by the save-flow specification. If saving fails, the button returns to default and the error is shown inline without losing entered data (SG-32).

### 5.4 Disabled
Avoid wherever possible (SG-20). Allowed only on **Step 1 — Amount** while the amount is empty or zero. The helper text above the button says what is needed. **Never disabled on Step 2 — Categories**, because categories are optional (SG-20, SG-25, SG-26).

### 5.5 Focused
A focus ring appears when the button receives non-touch focus. Focus may combine with pressed or loading.

### 5.6 Error
The button has no error appearance of its own. Errors belong to the field or screen that caused them (SG-32); the button stays in its default state so the user can retry.

## 6. Interaction behavior and feedback

1. **One per screen.** A screen renders exactly one PrimaryActionButton. Secondary actions (Back, Skip, Add details, Edit) use secondary, text or icon-button styles and never the primary fill (SG-01, SG-02).
2. **Consistent bottom docking.** On every entry step the button is docked to the bottom of the available viewport, separated from the bottom edge by `layout.screen.bottomActionOffset` plus the device safe-area inset (home indicator, gesture bar, display cut-outs). It never scrolls out of view; screen content scrolls above it. The available viewport changes with the keyboard, orientation and window size, so the button's absolute position may differ between situations, but its **relationship to the bottom edge** is always the same (SG-18).
   - **Keyboard open:** the button docks to the top of the keyboard instead of the screen bottom.
   - **Landscape or short viewports:** the button stays docked; the content region scrolls. If the remaining content height becomes too small to show the step's main content (e.g. the amount) alongside the keyboard, the content scrolls so the focused field stays visible above the button.
   - **Large text:** the button may grow taller; it remains docked and content scrolls.
3. **Activation.** Tap, Enter/Space on a keyboard, or the screen-reader activate gesture all trigger `onActivate` once.
4. **Feedback timing.** Pressed state appears within 100 ms (SG-19). Navigation actions (`Continue`, `Review`, `Done`) move to the next screen without a loading state. `Save expense` shows loading until the save completes, then the save confirmation appears (SG-31).
5. **Secondary placement.** A secondary action placed near the button sits above it or in the header, with at least the minimum control gap between them (SG-02, SG-17).

## 7. Accessibility requirements

| Requirement | Detail | Rule |
|---|---|---|
| Role and name | Exposed as a button; accessible name equals the visible label. | SG-41 |
| Disabled state | Announced as dimmed/unavailable. The reason must be perceivable even where a disabled button cannot receive focus: (a) the helper text is a visible text element placed immediately before the button in reading order, so swipe or arrow navigation reaches it; (b) it is also linked to the button as its accessible description; (c) where the platform allows, prefer a focusable-but-unavailable button (announced as "dimmed"/"unavailable" and ignoring activation) over one removed from the focus order; (d) when the reason text appears or changes, it is announced once via a polite live region. | SG-20, SG-41 |
| Loading state | Announced as busy; "Saving…" read once. Success or failure announced via a live region on the next screen or inline. | SG-41 |
| Contrast | Label on default fill 18.11:1; on pressed fill 13.63:1 (target ≥ 7:1). Focus ring 6.70:1 on white. | SG-07, SG-09, SG-19 |
| Touch target | Height ≥ 56 px; full width; well above the 48 px minimum. | SG-17, SG-18 |
| Non-color cues | Pressed: scale. Focused: ring. Loading: spinner + text. Disabled: helper text. | SG-42 |
| Text scaling | At 200 % system text, the button grows in height (minimum, not fixed, height) and the label wraps rather than clips. | SG-43 |
| Reduced motion | Pressed scale and spinner rotation are replaced by static changes; spinner may be replaced by a static icon plus text. | SG-44 |

**Verification status:** token-level contrast has passed (see `tokens.json` → `accessibilityStatus`). Component-level accessibility remains **unverified** until the built component is tested with VoiceOver, TalkBack, keyboard and 200 % text.

## 8. Responsive behavior

| Context | Behavior | Rule / token |
|---|---|---|
| Phone 320–430 px | Full width between the 16 px screen gutters. | SG-18, `layout.screen.gutter` |
| Tablet / web (> 480 px content) | Button spans the centred 480 px content column, not the full window. | SG-39, `layout.screen.maxContentWidth` |
| Safe areas | Bottom offset is added to the device safe-area inset; the button never sits under a home indicator, gesture bar or cut-out. | SG-18, `layout.screen.bottomActionOffset` |
| Keyboard open | Docked to the top of the keyboard with the standard offset. | SG-18, `layout.screen.bottomActionOffset` |
| Large text (200 %) | Height grows from the 56 px minimum; label wraps to two lines if needed; still docked. | SG-43, `component.primaryActionButton.minHeight` |
| Landscape / short viewport | Remains docked at the bottom of the available viewport; content above scrolls and keeps the focused field visible. | SG-18 |

## 9. Design tokens used

| Token path | Resolved value |
|---|---|
| `component.primaryActionButton.minHeight` | 56 px |
| `component.primaryActionButton.radius` → `radius.md` | 12 px |
| `component.primaryActionButton.paddingInline` → `space.4` | 16 px *(proposal)* |
| `component.primaryActionButton.typography` → `typography.label.button` | Inter 17 px / 24 px, 600 |
| `component.primaryActionButton.default.background` → `color.action.primary.background` | `#14161A` |
| `component.primaryActionButton.default.foreground` → `color.action.primary.foreground` | `#FFFFFF` |
| `component.primaryActionButton.pressed.background` → `color.action.primary.backgroundPressed` | `#2A2E35` |
| `component.primaryActionButton.pressed.scale` → `motion.pressScale` | 0.98 |
| `component.primaryActionButton.focused.ringColor` → `color.focus.ring` | `#1D4ED8` |
| `component.primaryActionButton.focused.ringWidth` → `borderWidth.thick` | 2 px |
| `component.primaryActionButton.focused.ringOffset` | 2 px |
| `component.primaryActionButton.loading.background` → `color.action.primary.background` | `#14161A` |
| `component.primaryActionButton.loading.indicator` → `color.text.onPrimary` | `#FFFFFF` |
| `component.primaryActionButton.disabled.background` → `color.action.primary.backgroundDisabled` | `#E5E7EB` |
| `component.primaryActionButton.disabled.foreground` → `color.action.primary.foregroundDisabled` | `#6B7280` |
| `motion.duration.pressFeedback` | 100 ms |
| `layout.screen.gutter` → `space.4` | 16 px |
| `layout.screen.bottomActionOffset` → `space.4` | 16 px |
| `layout.screen.maxContentWidth` | 480 px |
| `layout.control.minGap` → `space.2` | 8 px |
| `typography.caption` | Inter 13 px / 18 px, 400 (helper text) |
| `color.text.secondary` | `#4B5563` (helper text) |
| `size.icon.md` | 24 px (loading spinner — see §12) |

## 10. Applicable Style Guide rules

| Rule | How it applies |
|---|---|
| SG-01 Primary Action Visibility | Exactly one per entry screen. |
| SG-02 Secondary Actions Never Compete | Secondary actions never use this style. |
| SG-07 Near-Black Primary Action | Fill and label colors. |
| SG-09 Text Contrast Floor | Label and helper text contrast. |
| SG-13 Type Scale | Label typography. |
| SG-16 Action-First Button Labels | Accepted `label` values. |
| SG-17 Minimum Touch Targets | Height and spacing to neighbours. |
| SG-18 Primary Button Shape and Placement | Height, radius, width, docking. |
| SG-19 Button States | Pressed, focused, loading, disabled. |
| SG-20 Disabled Primary Explains Itself | `disabledReason`; never disabled on Categories. |
| SG-31 Encouraging, Restrained Completion Feedback | `Add another` on the confirmation screen. |
| SG-32 Error Recovery Without Data Loss | Return to default after a failed save. |
| SG-39 Mobile-First Layout Frame | Width cap on large screens. |
| SG-41 Screen Reader Semantics | Role, name, busy and disabled announcements. |
| SG-42 Non-Color Interaction States | Non-color cue per state. |
| SG-43 Text Scaling | Minimum height; label wrap. |
| SG-44 Reduced Motion | No scale or spin when reduced motion is on. |

## 11. Acceptance criteria

1. Every expense-entry screen renders exactly one PrimaryActionButton, and no other control uses `color.action.primary.background` as a fill. *(SG-01, SG-07)*
2. On Steps 1, 2 and 3, the button is docked to the bottom of the available viewport with the same offset (`layout.screen.bottomActionOffset` + safe-area inset), and is never scrolled off screen or hidden — verified in portrait and landscape, with the keyboard open and closed, on a device with a home indicator/gesture bar, and on a short viewport (e.g. 320 × 568). *(SG-18)* — Flexible bottom docking approved (D-1); SG-18's acceptance criterion was amended to match in Style Guide v0.2.
3. Height is ≥ 56 px at default text size; width equals the content column minus gutters. *(SG-18)*
4. Label contrast ≥ 7:1 in default and pressed states. *(SG-07, SG-19)*
5. Pressed state is visible within 100 ms of touch-down. *(SG-19)*
6. Rapidly tapping `Save expense` several times while loading triggers `onActivate` once (UI safeguard). End-to-end duplicate prevention (one expense even after retry or lost response) is verified against the save workflow's idempotency requirement, not this component. *(SG-19)*
7. Whenever the button is disabled, helper text explaining why is visible, is reachable by swipe/arrow navigation as its own text element, is exposed as the button's description, and is announced once when it appears. *(SG-20, SG-41)*
8. On the Categories step, the button is enabled with zero selected categories. *(SG-20, SG-25)*
9. Every label is one of the accepted values, verb-first, ≤ 3 words. *(SG-16)*
10. Each state is distinguishable in a grayscale screenshot. *(SG-42)*
11. At 200 % system text, the label is fully visible and the button is still docked. *(SG-43)*
12. With reduced motion on, the button does not scale or animate. *(SG-44)*
13. A failed save returns the button to default with the amount and categories intact. *(SG-32)*

## 12. Traceability

**Chain format:** Reference → Style Guide rule → Design token → Component property

| Component property | Design token | Style Guide rule | Reference |
|---|---|---|---|
| Container min height | `component.primaryActionButton.minHeight` | SG-18, SG-43 | REF-U01 |
| Container corner radius | `component.primaryActionButton.radius` | SG-18 | REF-U01 |
| Container width | — (behavioral: full width within gutters) | SG-18 | REF-U01 |
| Horizontal padding | `component.primaryActionButton.paddingInline` | SG-38 *(proposal value)* | — |
| Label typography | `component.primaryActionButton.typography` | SG-13, SG-16 | REF-U01 |
| Default fill | `component.primaryActionButton.default.background` | SG-01, SG-07 | REF-U01 |
| Default label color | `component.primaryActionButton.default.foreground` | SG-07 | REF-U01 |
| Pressed fill | `component.primaryActionButton.pressed.background` | SG-19 | — |
| Pressed scale | `component.primaryActionButton.pressed.scale` | SG-19 | — |
| Pressed response time | `motion.duration.pressFeedback` | SG-19 | — |
| Focus ring color | `component.primaryActionButton.focused.ringColor` | SG-19 | — |
| Focus ring width | `component.primaryActionButton.focused.ringWidth` | SG-19 | — |
| Focus ring offset | `component.primaryActionButton.focused.ringOffset` | SG-19 | — |
| Loading fill | `component.primaryActionButton.loading.background` | SG-19 | — |
| Loading spinner color | `component.primaryActionButton.loading.indicator` | SG-19 | — |
| Loading spinner size | `size.icon.md` *(reused; see gap G-1)* | SG-19 | — |
| Disabled fill | `component.primaryActionButton.disabled.background` | SG-19, SG-20 | — |
| Disabled label color | `component.primaryActionButton.disabled.foreground` | SG-19, SG-20 | — |
| Helper text style | `typography.caption`, `color.text.secondary` | SG-20, SG-09 | — |
| Bottom offset (added to safe-area inset) | `layout.screen.bottomActionOffset` | SG-18 | REF-U01 |
| Docking to viewport / keyboard | — (behavioral) | SG-18 | REF-U01 |
| Duplicate-save safeguard (UI only) | — (behavioral; idempotent save is a workflow requirement) | SG-19 | — |
| Side inset | `layout.screen.gutter` | SG-39 | — |
| Max width on large screens | `layout.screen.maxContentWidth` | SG-39 | — |
| Gap to adjacent secondary action | `layout.control.minGap` | SG-17 | — |
| One per screen | — (behavioral) | SG-01, SG-02 | REF-U01 |
| Label wording | — (behavioral) | SG-16 | REF-U01 |
| Disabled only with reason | — (behavioral) | SG-20 | — |
| Screen-reader semantics | — (behavioral) | SG-41 | — |
| Reduced-motion fallback | — (behavioral) | SG-44 | — |

**Complete chain example:**
REF-U01 (single full-width black confirmation button) ⟶ **SG-07** Near-Black Primary Action ⟶ `color.palette.neutral.950` ⟶ `color.action.primary.background` ⟶ `component.primaryActionButton.default.background` ⟶ PrimaryActionButton default fill `#14161A`.

*(⟶ reads "is the source of". In the token tables above, → means "aliases".)*

### Known gaps (reported, not resolved)

- **G-1 — Spinner size.** No dedicated token. `size.icon.md` (24 px) is reused; its trace metadata currently lists only IconButton. Proposed change, if wanted: add a new token *component.primaryActionButton.loading.indicatorSize* (does not exist yet) aliasing `size.icon.md`.
- **G-2 — Helper text style.** SG-20 requires helper text but no component token exists. Shared semantic tokens `typography.caption` and `color.text.secondary` are used directly.

`tokens.json` is not modified for either gap.
