# CategoryTile — Component Specification

**Version:** 0.2 (draft) | **Date:** 24 October 2026
**Sources:** `docs/PRODUCT_VISION.md` v1.2 · `design-system/STYLE_GUIDE.md` v0.3 · `design-system/tokens.json` v0.1.0 · `references/REFERENCE_CATALOG.md` v0.7 · `src/data/categories.json` v1.0.0
**Primary references:** REF-P01 (PhonePe — equal-weight icon + label choices), REF-U01 (tinted selected row), REF-D01 (check icon as a non-color state cue)
**Related:** [CategoryGrid](CategoryGrid.md) owns layout, multi-select bookkeeping, Other placement and inactive categories across tiles.
**Status:** Implementation-ready specification. No code.
**Change log:** 0.2 — approved category behavior (decisions D-15 – D-21): the Unknown variant and `exclusive` property are removed; Other is a standard tile; the disabled state is used for inactive categories (SG-45, resolves D-6). Token values unchanged.

---

## 1. Purpose and role

CategoryTile is one selectable category on the Categories step (Step 2) of expense entry. Each tile shows an icon and a label and toggles on or off when tapped. Tiles are peers: none is promoted over another. **Other** is a standard tile like every other category. Inactive categories appear in the disabled state and cannot be selected.

The tile behaves as a **checkbox**, not a radio button, because an expense may carry zero, one or several tags.

## 2. Relevant product requirements

| Requirement | Source |
|---|---|
| Each category combines a recognizable icon with a readable label; not color or words alone. | Vision §4.4 |
| An expense can have zero, one or multiple tags (e.g. Food + Charity). | Vision §4.5 |
| Other is a valid choice and combines with other tags; zero tags saves as Uncategorized. | Vision §4.5; D-15, D-19 |
| Inactive categories are visible but cannot be selected. | D-18 |
| Capture first, organize later; classification never blocks saving. | Vision §4.1, §4.7 |
| Large, clearly tappable selection tiles; selection clearly acknowledged. | Vision §4.3, §4.6 |

## 3. Visual anatomy

```
 ┌───────────────────────────┐
 │                       (5) │  ← check badge (selected only), top-right
 │          ╭─────╮          │
 │          │ (3) │ ← icon (2) on circular plate (3)
 │          ╰─────╯          │
 │       (4) Label line 1    │
 │           label line 2    │
 └───────────────────────────┘
 (1) container with border    (6) focus ring outside (1)
```

| # | Part | Description |
|---|---|---|
| 1 | Container | Rounded rectangle, ≥ 96 px tall, width fills its grid column. |
| 2 | Icon | 28 px outline glyph, ~2 px stroke, one consistent icon set. No third-party brand icons. |
| 3 | Icon plate | 48 px circle behind the icon. Subtle grey when unselected, white when selected. |
| 4 | Label | 1–2 words, sentence case, centred, wraps to at most 2 lines. Never truncated. |
| 5 | Check badge | 20 px filled accent circle with white check, top-right corner. Selected state only. |
| 6 | Focus ring | Non-touch focus only. |

## 4. Properties and accepted values

| Property | Type | Accepted values | Default | Notes |
|---|---|---|---|---|
| `categoryId` | identifier | Stable ID from the category list | — (required) | Used for selection state; never the label. |
| `label` | text | 1–2 word noun, sentence case (e.g. `Food`, `Travel`, `Other`) | — (required) | ≤ 2 lines at default text size (SG-27). |
| `icon` | icon reference | One glyph from the product icon set | — (required) | Must be present; icon-only or label-only tiles are not allowed (SG-22). |
| `selected` | boolean | `true`, `false` | `false` | Controlled by CategoryGrid. |
| `disabled` | boolean | `true`, `false` | `false` | `true` for an **inactive** category (`active: false` in the category data): shown in place, not selectable (SG-45, D-18; resolves D-6). |
| `onToggle` | action | — | — (required) | Fires with the new selected value. |

**Variants:** One standard tile. **Other** uses the label `Other`, the neutral "more" icon (`circle-ellipsis`) and **exactly the same tokens** as every other tile (SG-21, SG-26). There is no exclusive variant.

## 5. States

Selected must be identifiable in grayscale and even with the tint removed (SG-24, SG-42).

| State | Container fill | Border | Icon plate | Label | Extra cue | Tokens |
|---|---|---|---|---|---|---|
| **Unselected (default)** | White | 1 px control grey | Subtle grey | 15 px, 500 | — | `component.categoryTile.default.background`, `component.categoryTile.default.border`, `component.categoryTile.default.borderWidth`, `component.categoryTile.default.iconPlate`, `component.categoryTile.default.typography` |
| **Pressed** (momentary) | Subtle grey | Unchanged | Unchanged | Unchanged | Within 100 ms | `component.categoryTile.pressed.background`, `motion.duration.pressFeedback` |
| **Selected** | Blue tint | 2 px accent | White | 15 px, **600** | Check badge | `component.categoryTile.selected.background`, `component.categoryTile.selected.border`, `component.categoryTile.selected.borderWidth`, `component.categoryTile.selected.iconPlate`, `component.categoryTile.selected.typography`, `component.categoryTile.selected.indicator`, `component.categoryTile.selected.onIndicator` |
| **Focused** | Unchanged | Unchanged | Unchanged | Unchanged | 2 px focus ring outside the border | `component.categoryTile.focused.ringColor`, `component.categoryTile.focused.ringWidth` |
| **Disabled** | Subtle grey | 1 px divider grey | Unchanged | Tertiary grey | Icon at 40 % opacity | `component.categoryTile.disabled.background`, `component.categoryTile.disabled.border`, `component.categoryTile.disabled.foreground`, `component.categoryTile.disabled.iconOpacity` |

States combine: selected + focused, selected + pressed. Loading and error states do not apply to a tile.

**Four selection cues (SG-24):** (1) tint fill, (2) 2 px accent border, (3) check badge, (4) label weight 500 → 600. Any two of these alone must still make selection obvious.

## 6. Interaction behavior and feedback

1. **Toggle.** Tap / Space / screen-reader activate toggles `selected`. A second tap deselects. There is no long-press or swipe behavior.
2. **Feedback.** Pressed fill appears within 100 ms; the change to selected or unselected animates over 150 ms (SG-19, SG-24). With reduced motion, the change is instant (SG-44).
3. **Other (SG-26).** Other toggles like any other tile. Selecting it never clears other tiles, and selecting other tiles never clears it. Deselecting every tile leaves zero selections, which is valid and is saved as Uncategorized.
4. **Disabled (inactive) tiles (SG-45).** Tap, Space and screen-reader activation do nothing and no pressed state appears; the tile keeps its position.
5. **No limit on selections (SG-25).** Any number of tiles may be selected together.
6. **No blocking.** Tile state never disables the primary button (SG-20).

## 7. Accessibility requirements

| Requirement | Detail | Rule |
|---|---|---|
| Role and state | Exposed as a **checkbox** with checked/unchecked state, e.g. "Food, checkbox, not checked". Never a radio button. | SG-25, SG-41 |
| Accessible name | The visible label. The icon is decorative (hidden from assistive technology). | SG-22, SG-41 |
| Disabled (inactive) | Exposed as a disabled checkbox that stays in reading order, e.g. "Charity, checkbox, not checked, unavailable"; it cannot be toggled. | SG-41, SG-45 |
| Contrast | Unselected boundary 3.18:1 on white; selected border 6.03:1 on tint; label 18.11:1 on white and 16.30:1 on tint; check mark 6.70:1 on badge. | SG-06, SG-09, SG-24 |
| Touch target | ≥ 96 × ~96 px, far above 48 px; tiles separated by 12 px. | SG-17, SG-23 |
| Non-color cues | Border width, check badge, label weight — selection survives grayscale and color removal. | SG-24, SG-42 |
| Text scaling | Tile grows taller; label wraps; never shrinks text or truncates. | SG-27, SG-43 |
| Reduced motion | No animated transition; instant state change. | SG-44 |

**Verification status:** token-level contrast passed. Component-level accessibility is **unverified** until tested with VoiceOver, TalkBack, keyboard and 200 % text.

## 8. Responsive behavior

| Context | Behavior | Rule / token |
|---|---|---|
| Phone 360–430 px | Fills one of three grid columns; ~101 px wide at 360 px. | SG-23, `component.categoryGrid.columns` |
| Large screens | Width set by CategoryGrid column count (see CategoryGrid §8). | SG-23, SG-39 |
| Large text | Height grows beyond 96 px minimum; label wraps to 2 lines; grid may drop to 2 columns. | SG-43, `component.categoryTile.minHeight` |
| Label longer than 2 lines at default size | Not allowed — rename the category. | SG-27, `component.categoryTile.label.maxLines` |

## 9. Design tokens used

| Token path | Resolved value |
|---|---|
| `component.categoryTile.minHeight` | 96 px |
| `component.categoryTile.radius` → `radius.md` | 12 px |
| `component.categoryTile.padding` → `space.3` | 12 px *(proposal)* |
| `component.categoryTile.contentGap` → `space.2` | 8 px *(proposal)* |
| `component.categoryTile.iconSize` → `size.icon.lg` | 28 px |
| `component.categoryTile.iconPlateSize` | 48 px |
| `component.categoryTile.checkBadgeSize` | 20 px *(proposal)* |
| `component.categoryTile.label.maxLines` | 2 |
| `size.icon.strokeWidth` | 2 px |
| `component.categoryTile.default.background` → `color.surface.default` | `#FFFFFF` |
| `component.categoryTile.default.border` → `color.border.control` | `#8A919C` |
| `component.categoryTile.default.borderWidth` → `borderWidth.thin` | 1 px |
| `component.categoryTile.default.iconPlate` → `color.surface.subtle` | `#F1F3F6` |
| `component.categoryTile.default.typography` → `typography.label.tile` | Inter 15 px / 20 px, 500 |
| `component.categoryTile.pressed.background` → `color.surface.subtle` | `#F1F3F6` |
| `component.categoryTile.selected.background` → `color.selection.background` | `#EEF3FF` |
| `component.categoryTile.selected.border` → `color.selection.border` | `#1D4ED8` |
| `component.categoryTile.selected.borderWidth` → `borderWidth.thick` | 2 px |
| `component.categoryTile.selected.indicator` → `color.selection.indicator` | `#1D4ED8` |
| `component.categoryTile.selected.onIndicator` → `color.selection.onIndicator` | `#FFFFFF` |
| `component.categoryTile.selected.iconPlate` → `color.surface.default` | `#FFFFFF` |
| `component.categoryTile.selected.typography` → `typography.label.tileSelected` | Inter 15 px / 20 px, 600 |
| `component.categoryTile.selected.transition` → `motion.duration.selection` | 150 ms |
| `component.categoryTile.focused.ringColor` → `color.focus.ring` | `#1D4ED8` |
| `component.categoryTile.focused.ringWidth` → `borderWidth.thick` | 2 px |
| `component.categoryTile.disabled.background` → `color.surface.subtle` | `#F1F3F6` |
| `component.categoryTile.disabled.border` → `color.border.divider` | `#E5E7EB` |
| `component.categoryTile.disabled.foreground` → `color.text.tertiary` | `#6B7280` |
| `component.categoryTile.disabled.iconOpacity` → `opacity.disabledIcon` | 0.4 *(proposal)* |
| `motion.duration.pressFeedback` | 100 ms |
| `color.text.primary` | `#14161A` (label and icon color — see G-6) |
| `space.1` | 4 px (check-badge inset — see G-7) |

## 10. Applicable Style Guide rules

| Rule | How it applies |
|---|---|
| SG-06 Neutral Light Surfaces with Identifiable Controls | ≥ 3:1 boundary on unselected tiles. |
| SG-08 Blue Accent Reserved for Selection and Focus | Selected border, badge, focus ring. |
| SG-09 Text Contrast Floor | Label contrast in all states. |
| SG-17 Minimum Touch Targets | Tile far exceeds 48 px. |
| SG-19 Button States | Pressed feedback timing; focus ring. |
| SG-21 Equal-Weight Category Tiles | Identical size and styling for every tile, including Other. |
| SG-22 Icon Plus Label, Always | Required `icon` and `label`. |
| SG-23 Tile Dimensions and Grid | Minimum size, radius. |
| SG-24 Unmistakable Selected State | Four selection cues; 150 ms transition. |
| SG-25 Multi-Select Behavior | Checkbox semantics; no selection limit. |
| SG-26 Other and Uncategorized Are First-Class Choices | Other is a standard tile with identical styling; no exclusivity. |
| SG-27 Category Label Rules | 1–2 words, ≤ 2 lines, no ellipsis. |
| SG-41 Screen Reader Semantics | Checkbox role, name, disabled state. |
| SG-42 Non-Color Interaction States | Selection identifiable without color. |
| SG-43 Text Scaling | Grow, wrap, never truncate. |
| SG-44 Reduced Motion | Instant state change. |
| SG-45 Inactive Categories Are Visible but Disabled | `disabled` for inactive categories; position unchanged; not selectable. |

## 11. Acceptance criteria

1. Every tile has both a visible icon and a visible text label. *(SG-22)*
2. In the unselected state, all tiles in a grid — including Other — have identical dimensions, border, icon size and label style. *(SG-21, SG-26)*
3. Each tile is ≥ 96 px tall at default text size. *(SG-23)*
4. Tapping an unselected tile selects it; tapping it again deselects it. Two standard tiles can be selected at once. *(SG-25)*
5. Selected tiles show tint, 2 px accent border, check badge and semibold label; selection remains identifiable in grayscale and with the tint removed. *(SG-24, SG-42)*
6. Pressed state appears within 100 ms; selection transition is 150 ms, or instant with reduced motion. *(SG-19, SG-24, SG-44)*
7. Screen readers announce each tile as a checkbox with its checked state; disabled tiles are announced as unavailable. *(SG-25, SG-41, SG-45)*
8. No label exceeds 2 lines at default text size and no label shows an ellipsis. *(SG-27)*
9. At 200 % text, labels remain fully visible and tiles grow rather than clip. *(SG-43)*
10. Unselected border contrast ≥ 3:1 against the tile surface and screen background. *(SG-06)*
11. A disabled (inactive) tile stays visible in its position and cannot be selected by tap, keyboard or screen reader. *(SG-45)*

## 12. Traceability

| Component property | Design token | Style Guide rule | Reference |
|---|---|---|---|
| Container min height | `component.categoryTile.minHeight` | SG-23 | REF-P01 (adapted) |
| Corner radius | `component.categoryTile.radius` | SG-23 | — |
| Inner padding | `component.categoryTile.padding` | SG-38 *(proposal value)* | — |
| Icon-to-label gap | `component.categoryTile.contentGap` | SG-38 *(proposal value)* | — |
| Icon size | `component.categoryTile.iconSize` | SG-21, SG-22 | REF-P01 |
| Icon stroke | `size.icon.strokeWidth` | SG-21 | — |
| Icon plate size | `component.categoryTile.iconPlateSize` | SG-21, SG-22 | REF-G01 (sheet icons) |
| Label max lines | `component.categoryTile.label.maxLines` | SG-27 | REF-P01 |
| Unselected fill | `component.categoryTile.default.background` | SG-06, SG-21 | REF-P01 |
| Unselected border color | `component.categoryTile.default.border` | SG-06, SG-21 | — |
| Unselected border width | `component.categoryTile.default.borderWidth` | SG-21 | — |
| Unselected icon plate | `component.categoryTile.default.iconPlate` | SG-22 | REF-G01 |
| Unselected label style | `component.categoryTile.default.typography` | SG-27 | REF-P01 |
| Pressed fill | `component.categoryTile.pressed.background` | SG-24 | — |
| Pressed response time | `motion.duration.pressFeedback` | SG-19 | — |
| Selected fill | `component.categoryTile.selected.background` | SG-24 | REF-U01 |
| Selected border color | `component.categoryTile.selected.border` | SG-24 | — |
| Selected border width | `component.categoryTile.selected.borderWidth` | SG-24 | — |
| Check badge fill | `component.categoryTile.selected.indicator` | SG-24 | REF-D01 |
| Check mark color | `component.categoryTile.selected.onIndicator` | SG-24 | REF-D01 |
| Check badge size | `component.categoryTile.checkBadgeSize` | SG-24 *(proposal value)* | — |
| Selected icon plate | `component.categoryTile.selected.iconPlate` | SG-24 | — |
| Selected label style | `component.categoryTile.selected.typography` | SG-24 | — |
| Selection transition | `component.categoryTile.selected.transition` | SG-24 | — |
| Focus ring color | `component.categoryTile.focused.ringColor` | SG-19, SG-42 | — |
| Focus ring width | `component.categoryTile.focused.ringWidth` | SG-19 | — |
| Focus ring offset | — *(gap G-3)* | SG-19 | — |
| Disabled fill | `component.categoryTile.disabled.background` | SG-24, SG-42 | — |
| Disabled border | `component.categoryTile.disabled.border` | SG-24, SG-42 | — |
| Disabled label | `component.categoryTile.disabled.foreground` | SG-24, SG-42 | — |
| Disabled icon opacity | `component.categoryTile.disabled.iconOpacity` | SG-24, SG-42 | — |
| Label / icon color | `color.text.primary` *(shared semantic; gap G-6)* | SG-09 | — |
| Check-badge inset | `space.1` *(shared foundation; gap G-7)* | SG-38 | — |
| Checkbox role (multi-select) | — (behavioral) | SG-25, SG-41 | — |
| Disabled for inactive categories | `component.categoryTile.disabled.*` | SG-45 | — |
| Icon + label required | — (behavioral) | SG-22 | REF-P01 |

**Complete chain example:**
REF-U01 (selected ride row shown by a light blue fill) ⟶ **SG-24** Unmistakable Selected State ⟶ `color.palette.blue.50` ⟶ `color.selection.background` ⟶ `component.categoryTile.selected.background` ⟶ CategoryTile selected fill `#EEF3FF`.

*(⟶ reads "is the source of". In the token tables above, → means "aliases".)*

### Known gaps (reported, not resolved)

- **G-3 — Focus ring offset.** PrimaryActionButton has `component.primaryActionButton.focused.ringOffset` (2 px), but CategoryTile has no offset token. Specify a 2 px offset for consistency; proposed change: a shared focus offset token, or *component.categoryTile.focused.ringOffset* (does not exist yet).
- **G-6 — Label and icon color.** Typography tokens carry no color, and no component token names the tile's label/icon color. Shared semantic `color.text.primary` is used.
- **G-7 — Check-badge position.** No token for the badge's inset from the corner. Shared foundation `space.1` (4 px) is used.

`tokens.json` is not modified for these gaps.
