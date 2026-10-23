# ExpenseProgressIndicator — Component Specification

**Version:** 0.1 (draft) | **Date:** 24 October 2026
**Sources:** `docs/PRODUCT_VISION.md` v1.1 · `design-system/STYLE_GUIDE.md` v0.1 · `design-system/tokens.json` v0.1.0 · `references/REFERENCE_CATALOG.md` v0.6
**Primary references:** REF-D01 (Duolingo — completed, current and upcoming states), REF-U01 / REF-G02 (top-left back control)
**Status:** Implementation-ready specification. No code.

---

## 1. Purpose and role

ExpenseProgressIndicator sits at the top of every expense-entry step and tells the user where they are in the short journey: **Amount → Categories → Review**. It also hosts the back control. It is compact by design — a slim segmented bar and a caption — and deliberately avoids Duolingo's game path, mascot and reward mechanics.

## 2. Relevant product requirements

| Requirement | Source |
|---|---|
| Show where the user is in the journey; make the next step obvious. | Vision §4.6 |
| Guided, linear flow of about 3–4 steps. | Vision §4.2, §5 |
| Visual cues consistent; not color alone. | Vision §7 |
| Duolingo: visible progression without childish gamification. | Vision §7; Reference Catalog REF-D01 exclusions |

## 3. Visual anatomy

```
 ┌───────────────────────────────────────────────┐
 │ (1)←   ███████████  ▀▀▀▀▀▀▀▀▀▀▀  ▁▁▁▁▁▁▁▁▁▁▁   │
 │        (2) completed (3) current (4) upcoming │
 │        (5) Step 2 of 3 · Categories           │
 └───────────────────────────────────────────────┘
```

| # | Part | Description |
|---|---|---|
| 1 | Back control | 48 px circular icon button, left-aligned. Present on Steps 2 and 3 only. |
| 2 | Completed segment | Near-black, standard height; tappable to return to that step. |
| 3 | Current segment | Accent blue, taller than the others. |
| 4 | Upcoming segment | Light grey, standard height; not tappable. |
| 5 | Caption | "Step n of 3 · Name". Always visible. |

There are always **three** segments. The optional details step does not add a segment (SG-28); while on it, the indicator shows Review as current and the caption reads "Review · Add details".

## 4. Properties and accepted values

| Property | Type | Accepted values | Default | Notes |
|---|---|---|---|---|
| `steps` | ordered list | Exactly 3: `Amount`, `Categories`, `Review` | Fixed | Step names come from the Style Guide flow (§G). |
| `currentStep` | number | `1`, `2`, `3` | — (required) | Steps before it are completed; after it are upcoming. |
| `subStepLabel` | text | Optional, e.g. `Add details` | none | Appended to the caption on the optional details screen. |
| `onBack` | action | — | — | Required on Steps 2 and 3; hidden on Step 1 (no prior step). |
| `onStepSelect` | action | Completed step number | — | Fired when a completed segment is activated. |

## 5. States

### 5.1 Segment states (SG-29)

| State | Fill | Height | Interactive | Non-color cues | Tokens |
|---|---|---|---|---|---|
| **Completed** | Near-black | 4 px | Yes — returns to that step | Positioned before current; announced "completed"; very high lightness contrast vs upcoming (grayscale-distinct) | `component.progressIndicator.completed`, `component.progressIndicator.segmentHeight` |
| **Current** | Accent blue | **6 px** | No | Taller shape; step named in caption | `component.progressIndicator.current`, `component.progressIndicator.segmentHeightCurrent` |
| **Upcoming** | Light grey | 4 px | No | Positioned after current; announced "not started" | `component.progressIndicator.upcoming`, `component.progressIndicator.segmentHeight` |

All segments: `component.progressIndicator.radius` (rounded ends), separated by `component.progressIndicator.segmentGap`.

**No check mark (decision D-2, approved).** Completed segments carry no ✓: a check cannot be drawn legibly inside a 4 px segment. Completed, current and upcoming remain distinguishable through lightness (grayscale-distinct), height (current is taller), position relative to the current step, the caption, and each segment's accessible state. SG-29's wording still mentions a ✓; a clarification is recommended for a separate Style Guide PR (README §8).

### 5.2 Other states

| State | Behavior |
|---|---|
| **Focused** | A completed segment or back button receiving non-touch focus shows the standard focus ring (`color.focus.ring`, `borderWidth.thick`). |
| **Pressed** | Back button and completed segments show `color.surface.subtle` under the hit area within 100 ms. |
| **Disabled / loading / error** | Not applicable. While a save is in progress (Step 3 loading), back and segment navigation are temporarily inactive so the saved data and the screen cannot diverge. |

## 6. Interaction behavior and feedback

1. **Always visible.** Pinned at the top of each entry step; content scrolls beneath it (SG-28, SG-39).
2. **Back (SG-30).** The back button and the platform back gesture both go to the previous step. Entered amount and selections are kept.
3. **Jump to a completed step.** Activating a completed segment goes to that step with data intact. Forward jumps to upcoming steps are not allowed — users move forward only with the PrimaryActionButton (SG-01).
4. **Advancing.** When the user presses the primary button, the next segment becomes current. The change animates within `motion.duration.max` or is instant with reduced motion (SG-44).
5. **No gamification.** No points, streaks, mascots or celebratory effects in the indicator. Completion feedback belongs to the save confirmation (SG-31).

## 7. Accessibility requirements

| Requirement | Detail | Rule |
|---|---|---|
| Progress semantics | Container exposed as a progress/list element with label "Expense entry progress". Caption read as "Step 2 of 3, Categories". | SG-28, SG-41 |
| Segment state | Each segment exposes its name and state: "Amount, completed, button" / "Categories, current" / "Review, not started". | SG-29, SG-41 |
| Back control | Button named "Back to Amount" (names the destination). | SG-30, SG-41 |
| Hit areas | Back button 48 × 48 px. Completed segments have a 48 px-tall hit area spanning their full width even though the visible bar is 4 px. | SG-17 |
| Contrast | Current segment 6.70:1 on white; completed 18.11:1; caption 4.83:1 (tertiary text). Upcoming segment is decorative (state also given by caption and accessible name). | SG-09, SG-29 |
| Non-color cues | Current: taller + named in caption. Completed vs upcoming: position relative to current + caption + accessible state; distinguishable in grayscale by lightness. No ✓ (D-2). | SG-42 |
| Reduced motion | No animated segment transition. | SG-44 |
| Step change | Moving to a new step announces the new caption once. | SG-41 |

**Verification status:** component-level accessibility is **unverified**.

## 8. Responsive behavior

| Context | Behavior | Rule / token |
|---|---|---|
| Phone | Segments share the width remaining after the back button; equal widths. | SG-28, `layout.screen.gutter` |
| Step 1 (no back) | Segments use the full content width; layout height unchanged so the screen does not jump between steps. | SG-28 |
| Tablet / web | Spans the 480 px content column. | SG-39, `layout.screen.maxContentWidth` |
| Large text | Caption wraps to a second line if needed; segment heights unchanged. | SG-43 |
| Landscape / short viewport | Remains pinned; does not collapse. | SG-28 |

## 9. Design tokens used

| Token path | Resolved value |
|---|---|
| `component.progressIndicator.segmentHeight` → `space.1` | 4 px *(proposal)* |
| `component.progressIndicator.segmentHeightCurrent` | 6 px *(proposal)* |
| `component.progressIndicator.segmentGap` → `space.1` | 4 px *(proposal)* |
| `component.progressIndicator.radius` → `radius.full` | 9999 px *(proposal)* |
| `component.progressIndicator.typography` → `typography.caption` | Inter 13 px / 18 px, 400 |
| `component.progressIndicator.completed` → `color.progress.completed` | `#14161A` |
| `component.progressIndicator.current` → `color.progress.current` | `#1D4ED8` |
| `component.progressIndicator.upcoming` → `color.progress.upcoming` | `#E5E7EB` *(proposal)* |
| `color.text.tertiary` | `#6B7280` (caption color) |
| `component.iconButton.size` → `size.touchTarget.min` | 48 px |
| `component.iconButton.iconSize` → `size.icon.md` | 24 px |
| `component.iconButton.radius` → `radius.full` | 9999 px |
| `color.action.secondary.background` → `color.surface.default` | `#FFFFFF` |
| `color.action.secondary.border` → `color.border.control` | `#8A919C` |
| `color.action.secondary.foreground` → `color.text.primary` | `#14161A` |
| `size.touchTarget.min` | 48 px (completed-segment hit area) |
| `color.focus.ring` | `#1D4ED8` |
| `borderWidth.thick` | 2 px (focus ring) |
| `color.surface.subtle` | `#F1F3F6` (pressed feedback) |
| `motion.duration.pressFeedback` | 100 ms |
| `motion.duration.max` | 300 ms |
| `layout.screen.gutter` → `space.4` | 16 px |
| `layout.screen.maxContentWidth` | 480 px |

## 10. Applicable Style Guide rules

| Rule | How it applies |
|---|---|
| SG-01 Primary Action Visibility | Forward movement only via the primary button. |
| SG-02 Secondary Actions Never Compete | Back is a subordinate icon button. |
| SG-08 Blue Accent Reserved for Selection and Focus | Current segment and focus ring. |
| SG-09 Text Contrast Floor | Caption contrast. |
| SG-17 Minimum Touch Targets | 48 px back button and segment hit areas. |
| SG-28 Always-Visible Step Indicator | Three segments, caption, pinned. |
| SG-29 Completed, Current and Upcoming States | Segment state treatments. |
| SG-30 Back Navigation Preserves Everything | Back and segment jumps keep data. |
| SG-41 Screen Reader Semantics | Progress and segment announcements. |
| SG-42 Non-Color Interaction States | Height, position and caption cues. |
| SG-43 Text Scaling | Caption wraps. |
| SG-44 Reduced Motion | No animated transitions. |

## 11. Acceptance criteria

1. The indicator, with "Step n of 3 · Name", is visible without scrolling on every entry step. *(SG-28)*
2. Completed, current and upcoming segments are distinguishable in a grayscale screenshot; current is taller than the others. *(SG-29, SG-42)*
3. Screen readers announce "Step n of 3, Name" on arrival and each segment's state on focus. *(SG-41)*
4. Back is present on Steps 2 and 3, is 48 × 48 px, and returns to the previous step with all data intact. *(SG-17, SG-30)*
5. Activating a completed segment returns to that step with data intact; upcoming segments cannot be activated. *(SG-29, SG-30)*
6. The optional details step does not add a fourth segment. *(SG-28)*
7. With reduced motion, segment changes are instant. *(SG-44)*
8. No points, streaks, mascots or reward graphics appear. *(SG-31; REF-D01 exclusions)*

## 12. Traceability

| Component property | Design token | Style Guide rule | Reference |
|---|---|---|---|
| Segment height | `component.progressIndicator.segmentHeight` | SG-28 *(proposal value)* | REF-D01 (adapted) |
| Current segment height | `component.progressIndicator.segmentHeightCurrent` | SG-29 *(proposal value)* | REF-D01 |
| Segment gap | `component.progressIndicator.segmentGap` | SG-28 *(proposal value)* | — |
| Segment ends | `component.progressIndicator.radius` | SG-28 *(proposal value)* | — |
| Caption style | `component.progressIndicator.typography` | SG-28 | — |
| Caption color | `color.text.tertiary` | SG-09 | — |
| Completed color | `component.progressIndicator.completed` | SG-29 | REF-D01 |
| Current color | `component.progressIndicator.current` | SG-08, SG-29 | REF-D01 |
| Upcoming color | `component.progressIndicator.upcoming` | SG-29 *(proposal value)* | REF-D01 |
| Back button size | `component.iconButton.size` | SG-17, SG-30 | REF-U01, REF-G02 |
| Back icon size | `component.iconButton.iconSize` | SG-17 | — |
| Back button shape | `component.iconButton.radius` | SG-30 | REF-U01 |
| Back button colors | `color.action.secondary.background`, `color.action.secondary.border`, `color.action.secondary.foreground` | SG-02 | REF-U01 |
| Segment hit area | `size.touchTarget.min` | SG-17 | — |
| Focus ring | `color.focus.ring`, `borderWidth.thick` | SG-08, SG-19 | — |
| Transition limit | `motion.duration.max` | SG-44 | — |
| Three fixed steps; details not counted | — (behavioral) | SG-28 | — |
| Data preserved on back/jump | — (behavioral) | SG-30 | — |
| Accessible progress and state | — (behavioral) | SG-41 | — |

**Complete chain example:**
REF-D01 (current level shown in the unit color, distinct from completed and locked levels) ⟶ **SG-29** Completed, Current and Upcoming States ⟶ `color.palette.blue.700` ⟶ `color.progress.current` ⟶ `component.progressIndicator.current` ⟶ current segment `#1D4ED8`.

*(⟶ reads "is the source of". In the token tables above, → means "aliases".)*

### Contradiction resolved in this spec (Style Guide clarification pending)

- **C-2 — Check mark on a 4 px segment.** SG-29 specifies "filled near-black segment with a small ✓", but the approved segment height token is 4 px (`component.progressIndicator.segmentHeight`), too small to hold a legible check. **Decision D-2 (approved): the ✓ is removed from compact segments**; SG-42 is met through lightness, height, position, caption and accessible state. Recommended SG-29 clarification: README §8.
