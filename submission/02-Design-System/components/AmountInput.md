# AmountInput — Component Specification

**Version:** 0.1 (draft) | **Date:** 24 October 2026
**Sources:** `docs/PRODUCT_VISION.md` v1.1 · `design-system/STYLE_GUIDE.md` v0.2 · `design-system/tokens.json` v0.1.0 · `references/REFERENCE_CATALOG.md` v0.6
**Primary references:** REF-G01 / REF-G02 (Groww — dominant amount, Indian digit grouping, tabular alignment)
**Status:** Implementation-ready specification. No code.

---

## 1. Purpose and role

AmountInput is the focus of **Step 1 — Amount**, the first and most frequent interaction in the product. It must make entering a rupee amount fast and accurate: the keypad is ready immediately, the number is large and easy to check, the currency is clearly separate from the digits, and Indian digit grouping appears as the user types.

## 2. Relevant product requirements

| Requirement | Source |
|---|---|
| Step 1: enter the amount on a focused screen with an obvious Continue button. | Vision §5 |
| Capture first; a basic expense must not be blocked by optional details. | Vision §4.1, §4.7 |
| Light, uncluttered screen; reveal only what the current decision needs. | Vision §7 |
| Preserve information; do not lose a partially entered expense. | Vision §8 |

## 3. Visual anatomy

```
 Step 1 of 3 · Amount  (ExpenseProgressIndicator — not part of this component)

 (1) How much did you spend?

          (2) ₹ (3) 1,25,000.50
          ───────────────────── (4)
 (5) ⓘ Enter an amount greater than ₹0     ← error only

 [ Continue ]  (PrimaryActionButton, docked above keyboard)
 [ numeric keypad ]
```

| # | Part | Description |
|---|---|---|
| 1 | Question heading | Plain question; also the field's label. |
| 2 | Currency symbol | ₹, same size as the amount, in secondary text color — visibly part of the field but distinct from the digits. |
| 3 | Amount | Large, semibold, tabular digits, formatted live with Indian grouping. Centred. |
| 4 | Field boundary | Underline beneath the amount identifying the editable area; thicker accent underline when focused. |
| 5 | Error message | Icon + text below the field, only when validation fails. |

Placeholder when empty: a light "0" in tertiary color, which disappears on first digit.

## 4. Properties and accepted values

| Property | Type | Accepted values | Default | Notes |
|---|---|---|---|---|
| `value` | decimal amount | ≥ 0, up to 2 decimal places | empty | Stored as an exact amount (never a binary float); controlled. |
| `currency` | currency code | `INR` | `INR` | MVP is rupees only — see open decision D-8. |
| `locale` | locale | Device locale | Device | `en-IN` grouping: ₹1,00,000. Other locales follow the device's grouping (SG-15). |
| `label` | text | Plain question | `How much did you spend?` | Visible heading and accessible label. |
| `autoFocus` | boolean | `true`, `false` | `true` | Keypad opens when the step appears. |
| `businessLimit` | decimal amount or none | Positive amount, configured outside the component | none | **No arbitrary maximum** (D-7). Optional, configurable business limit; when unset (default), no business limit applies. |
| `errorMessage` | text | One sentence with a fix | none | Set by validation; shown with an icon. |
| `onChange` | action | — | — (required) | Emits the normalized decimal value. |
| `onSubmit` | action | — | — | Keyboard "done/next" key behaves like Continue when the value is valid. |

## 5. States

| State | Appearance | Tokens |
|---|---|---|
| **Empty (default)** | Placeholder "0" in tertiary color; underline in control grey. Continue disabled with reason "Enter an amount to continue" (owned by PrimaryActionButton). | `color.text.tertiary`, `color.border.control`, `borderWidth.thin` |
| **Focused (typing)** | Underline becomes 2 px accent; caret visible. | `color.focus.ring`, `borderWidth.thick` |
| **Filled** | Amount in primary text color with live grouping; ₹ in secondary color. | `component.amountInput.foreground`, `color.text.secondary` |
| **Error** | Error icon + message below the field in error color; underline in error color; value is kept. | `component.amountInput.errorForeground` |
| **Disabled** | Not used — the amount is never disabled during entry. | — |
| **Loading** | Not applicable to this component. | — |

## 6. Interaction behavior and feedback

### 6.1 Rapid entry
1. On entering Step 1, the field is focused and the **decimal numeric keypad** opens immediately (one less tap).
2. Only digits and one decimal separator are accepted; a third decimal digit is ignored rather than shown as an error.
3. Leading zeros are removed ("007" → "7"); typing "." first shows "0.".
4. Paste is accepted after removing ₹, spaces and grouping separators; anything else non-numeric is rejected with the error message.
5. The keypad's done/next key and Continue do the same thing.

### 6.2 Formatting (SG-14, SG-15)
- Grouping is applied **live**, as the user types, using Indian grouping for `en-IN`: 1500000 → **15,00,000**.
- The caret stays after the digit the user just typed when separators are inserted.
- Decimals are shown exactly as typed, up to two places, so the user can verify what they entered. (SG-14's no-decimals rule applies to headline totals, not to entry.)
- No abbreviations (L, Cr) in this field — the full amount is always shown.

### 6.3 Validation (SG-20, SG-32)
| Condition | Feedback |
|---|---|
| Empty or 0 | No error message; Continue disabled with reason "Enter an amount to continue". |
| Above a configured `businessLimit` (only if one is set) | Error with the configured wording and a fix; value kept. |
| At the technical precision limit | Further integer digits are not accepted (no error state); a polite announcement says "Maximum length reached". |
| Invalid paste | Error: "Only numbers can be pasted here." |

Errors appear inline, are cleared as soon as the value becomes valid, and never clear the typed value.

### 6.3a Amount limits (decision D-7, approved)
- **No arbitrary maximum transaction amount** is imposed by the product. High spenders must be able to record large expenses.
- **Technical limit required.** The amount must be stored as an exact decimal with 2 fractional digits. The maximum number of integer digits is set by the storage and calculation precision chosen by engineering (and must keep period totals exact, since totals sum many expenses). That limit is **not yet defined** and must be documented in the data/save-workflow specification; AmountInput enforces it by refusing further digits.
- **Business limits are configurable.** If the business later wants a limit (for example, a soft confirmation above a threshold), it is supplied as `businessLimit`; it is not hard-coded in this component.

### 6.4 Preservation (SG-30, SG-32)
The value survives back/forward navigation, app backgrounding and failed saves. Returning to Step 1 shows the existing value with the caret at the end.

### 6.5 Long amounts (SG-43)
If the formatted amount is too wide for one line, the font size shrinks step by step down to `font.size.2xl` (24 px). Below that, the amount wraps rather than shrinking further. See open decision D-9.

## 7. Accessibility requirements

| Requirement | Detail | Rule |
|---|---|---|
| Label | Accessible name "How much did you spend? Amount in rupees". | SG-41 |
| Value reading | Read as a full spoken amount, e.g. "one lakh twenty-five thousand rupees and fifty paise" — never the separators or "₹" glyph name. | SG-15, SG-41 |
| Currency symbol | ₹ is decorative to assistive technology (meaning carried by the label). | SG-41 |
| Errors | Linked to the field as its error description and announced via an assertive live region once when shown. | SG-10, SG-32, SG-41 |
| Status not color-only | Error has icon + text; focus has a thicker underline. | SG-10, SG-42 |
| Contrast | Amount 18.11:1; ₹ 7.56:1; placeholder 4.83:1; underline 3.18:1; error text 6.47:1 on white. | SG-06, SG-09, SG-10 |
| Text scaling | Amount and heading scale with system text; long values follow §6.5. | SG-43 |
| Keyboard / switch | Field reachable and editable without touch; done key submits. | SG-41 |

**Verification status:** component-level accessibility is **unverified**, including how VoiceOver and TalkBack read Indian-grouped amounts.

## 8. Responsive behavior

| Context | Behavior | Rule / token |
|---|---|---|
| Phone portrait | Amount centred with generous space above and below; keypad open; Continue docked above keypad. | SG-18, `component.amountInput.paddingBlock` |
| Short viewport / landscape with keypad | Vertical padding may reduce to `space.4`; the amount always stays visible above the docked button (content scrolls if needed). | SG-18, SG-39 |
| Tablet / web | Field within the 480 px content column; physical keyboard digits accepted. | SG-39, `layout.screen.maxContentWidth` |
| Large text | Field grows from its 80 px minimum height; long values shrink to 24 px then wrap. | SG-43, `component.amountInput.minHeight` |

## 9. Design tokens used

| Token path | Resolved value |
|---|---|
| `component.amountInput.typography` → `typography.amount.entry` | Inter 48 px / 56 px, 600, tabular numerals |
| `component.amountInput.foreground` → `color.amount.foreground` | `#14161A` |
| `component.amountInput.paddingBlock` → `space.10` | 40 px *(proposal)* |
| `component.amountInput.minHeight` | 80 px *(proposal)* |
| `component.amountInput.errorForeground` → `color.status.error.foreground` | `#B91C1C` |
| `color.text.secondary` | `#4B5563` (₹ symbol) |
| `color.text.tertiary` | `#6B7280` (placeholder) |
| `color.border.control` | `#8A919C` (underline) |
| `borderWidth.thin` | 1 px (underline) |
| `color.focus.ring` | `#1D4ED8` (focused underline) |
| `borderWidth.thick` | 2 px (focused underline) |
| `typography.heading.1` | Inter 24 px / 32 px, 600 (question) |
| `typography.body.default` | Inter 15 px / 22 px, 400 (error message) |
| `size.icon.md` | 24 px (error icon) |
| `font.size.2xl` | 24 px (minimum amount size when shrinking) |
| `space.4` | 16 px (reduced padding on short viewports) |
| `layout.screen.gutter` → `space.4` | 16 px |
| `layout.screen.maxContentWidth` | 480 px |

## 10. Applicable Style Guide rules

| Rule | How it applies |
|---|---|
| SG-03 Three-Level Information Hierarchy | Amount is the primary element. |
| SG-06 Neutral Light Surfaces with Identifiable Controls | Underline ≥ 3:1 identifies the field. |
| SG-09 Text Contrast Floor | Amount, ₹, placeholder, error contrast. |
| SG-10 Status Is Never Color-Only | Error icon + text. |
| SG-11 Spending Amounts Are Neutral | Amount in primary text color. |
| SG-12 One Sans-Serif Family with Tabular Figures | Fixed-width digits while typing. |
| SG-13 Type Scale | Entry amount and heading styles. |
| SG-14 Financial Amount Typography | Largest style; ₹ treatment; decimals at entry. |
| SG-15 Indian Number Formatting | Live en-IN grouping; no abbreviations here. |
| SG-18 Primary Button Shape and Placement | Field stays visible above the docked button. |
| SG-20 Disabled Primary Explains Itself | Empty/zero → reason on Continue. |
| SG-30 Back Navigation Preserves Everything | Value preserved. |
| SG-32 Error Recovery Without Data Loss | Inline errors with a fix; value kept. |
| SG-39 Mobile-First Layout Frame | Width cap. |
| SG-41 Screen Reader Semantics | Label, spoken amount, error announcement. |
| SG-42 Non-Color Interaction States | Focus underline weight; error icon. |
| SG-43 Text Scaling | Shrink-then-wrap for long values. |

## 11. Acceptance criteria

1. On entering Step 1, the field is focused and the decimal keypad is open without an extra tap.
2. Typing 1500000 with locale en-IN displays "₹15,00,000" live, with the caret after the last digit. *(SG-15)*
3. Digits have equal widths; the amount does not jitter horizontally while typing. *(SG-12)*
4. ₹ is visually distinct from the digits (secondary color) yet the same size. *(SG-14)*
5. A third decimal digit is not accepted; empty or 0 disables Continue with the reason shown. *(SG-20)*
6. An invalid paste shows an icon + text error naming the fix, and the previous value is kept. *(SG-10, SG-32)*
7. Going back from Categories restores the amount exactly. *(SG-30)*
8. Screen readers read the label and the amount as spoken rupees and paise. *(SG-15, SG-41)*
9. The amount and the docked Continue button are both visible with the keypad open on a 320 × 568 viewport. *(SG-18)*
10. The amount is never shown in success or error color. *(SG-11)*

## 12. Traceability

| Component property | Design token | Style Guide rule | Reference |
|---|---|---|---|
| Amount typography | `component.amountInput.typography` | SG-12, SG-13, SG-14 | REF-G01, REF-G02 |
| Amount color | `component.amountInput.foreground` | SG-11 | — |
| Vertical padding | `component.amountInput.paddingBlock` | SG-38 *(proposal value)* | — |
| Field min height | `component.amountInput.minHeight` | SG-13, SG-17 *(proposal value)* | — |
| Error color | `component.amountInput.errorForeground` | SG-10, SG-32 | — |
| Currency symbol color | `color.text.secondary` *(shared semantic)* | SG-14 | REF-G01 |
| Placeholder color | `color.text.tertiary` | SG-09 | — |
| Field boundary | `color.border.control`, `borderWidth.thin` | SG-06 | — |
| Focused boundary | `color.focus.ring`, `borderWidth.thick` | SG-08, SG-42 | — |
| Question heading | `typography.heading.1` | SG-13 | — |
| Error message text | `typography.body.default` | SG-10 | — |
| Error icon | `size.icon.md` | SG-10 | — |
| Minimum shrink size | `font.size.2xl` | SG-43 | — |
| Live Indian grouping | — (behavioral) | SG-15 | REF-G01, REF-G02 |
| No arbitrary maximum; technical precision limit; configurable business limit | — (behavioral; product decision D-7) | SG-32 | — |
| Spoken amount | — (behavioral) | SG-41 | — |
| Value preservation | — (behavioral) | SG-30, SG-32 | — |
| Disabled Continue with reason | — (behavioral; owned by PrimaryActionButton) | SG-20 | — |

**Complete chain example:**
REF-G01 (large "₹10,00,000" headline in a heavy weight) ⟶ **SG-14** Financial Amount Typography ⟶ `font.size.5xl` + `font.weight.semibold` ⟶ `typography.amount.entry` ⟶ `component.amountInput.typography` ⟶ amount displayed at 48 px semibold.

*(⟶ reads "is the source of". In the token tables above, → means "aliases".)*

### Known gaps (reported, not resolved)

- **G-5 — Currency symbol size.** SG-14 allows the ₹ to be ≈ 0.75× the amount size, but no token exists for that. Avoided by decision 5 from the earlier review (₹ at the same size in `color.text.secondary`).
- **G-8 — Amount field boundary.** No component token for the underline; shared semantic `color.border.control`, `color.focus.ring` and foundation `borderWidth.thin` / `borderWidth.thick` are used.
