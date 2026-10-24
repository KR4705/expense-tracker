<!-- Verbatim final response of the headless Plan Mode session (result field of session-usage run). Not edited. See session-log.md. -->

# Plan: Add Expense flow (Amount → Categories → Review & save → Confirmation)

I haven't edited anything in the repo. The only file written is the plan itself, at `/root/.claude/plans/you-are-in-plan-purring-frost.md`. I couldn't call ExitPlanMode in this session because it isn't in my toolset. Please treat this message as the plan awaiting your approval.

I haven't run `npm run validate`. The 48 data / 21 UI test baseline comes from CLAUDE.md, and step 0 re-confirms it.

## 1. Goal and scope

**In**
- Three components built to their specs: `PrimaryActionButton`, `ExpenseProgressIndicator` and `AmountInput`.
- Four screens: Amount, Categories (reuses `CategoryGrid` unchanged), Review, and Saved confirmation.
- A flow container holding step state and an in-memory draft (amount plus `selectedIds`).
- The draft survives back and forward navigation.
- Double-save protection, and recovery from a failed save without losing the draft.
- A save port (`ExpenseRepository`) with an in-memory implementation.

**Out**
- **Add details.** SG-04 keeps it out of the default path and no spec exists. A dead button is worse than none, so the indicator's `subStepLabel` is omitted too.
- **Skip button.** D-5 recommends omitting it.
- **Done button.** There is no destination until a dashboard exists (see Q2).
- Dashboard, backend, storage, analytics and editing saved expenses.
- Any edit to `STYLE_GUIDE.md`, `tokens.json`, component specs, `categories.json`, `tokens.css` or `package-lock.json`.

## 2. Sources read

- **Docs:**
  - `CLAUDE.md`.
  - `PRODUCT_VISION.md` v1.2 (§4, §5, §8).
  - `STYLE_GUIDE.md` v0.3 (§G, plus SG-01/02/07/10/11/14–20/25/26/28–32/39/41–45).
  - `components/README.md` (D-1…D-21, G-1…G-10, §9).
- **Specs:** AmountInput, ExpenseProgressIndicator, PrimaryActionButton, CategoryGrid, CategoryTile.
- **Code:**
  - `App.tsx`, `main.tsx`, `AppShell.*`, `CategorySelectionPage.*`.
  - `CategoryGrid` and `CategoryTile` (tsx, css, tests).
  - `categories.ts`, `base.css`, `test/setup.ts`, `vite.config.ts`, `tsconfig.app.json`.
  - `index.html` (already has `viewport-fit=cover`), `vercel.json`, and the token names in `tokens.css`.

**Drift found (reported, not fixed)**
1. The attached Project description says "including an Unknown option". Vision v1.2, SG-26 and CLAUDE.md say there is no Unknown. The source docs win.
2. CategoryGrid §8 wants the selection summary directly above the docked button. The built grid renders it inside its own root, so it scrolls with the tiles.
3. The spec's default heading is "What was it for?". The built page says "Choose categories", and existing tests assert that.
4. There is no spec for the Review step, the save confirmation or the save workflow (README §9). SG-31/32 and PrimaryActionButton §5.3 depend on all three.
5. SG-31 says "≈ 1.5 s, or until dismissed". Auto-dismiss has nowhere to go without a dashboard.
6. Already known: `src/data/README.md` text, and spec headers citing Vision v1.1 / Style Guide v0.2.

## 3. Affected files

**New**

| Path | Why |
|---|---|
| `src/components/amount/amountFormat.ts` (+test) | Float-free parse, format, zero check, digit cap and spoken amount (D-7, SG-15, SG-41) |
| `src/components/amount/AmountInput.{tsx,module.css,test.tsx}` | The Step 1 field |
| `src/components/progress/ExpenseProgressIndicator.*` | Segments, caption and back control |
| `src/components/action/PrimaryActionButton.*` | Button, helper text and bottom dock |
| `src/components/action/useKeyboardInset.ts` (+test) | Keeps the dock above the on-screen keyboard (SG-18) |
| `src/components/review/ExpenseSummary.*` | Review card: amount to 2 decimals, removable tags or "Uncategorized", Edit buttons |
| `src/components/review/SaveConfirmation.*` | Success check, "Expense saved", amount and tags, "Add another" |
| `src/data/expenses.ts` (+test) | `Expense` type, `ExpenseRepository`, idempotent in-memory repository |
| `src/pages/AddExpensePage.*` | Flow container and integration tests |
| `src/pages/add-expense/{AmountStep,CategoriesStep,ReviewStep}.tsx`, `useStepHistory.ts` | Step bodies and browser-back handling |

**Modified:** `src/App.tsx` only, to render `AddExpensePage` in `AppShell`.

**Must stay untouched**
- All of `CategoryGrid.*`, `CategoryTile.*` and `categoryIcons.ts`.
- `categories.ts`, `categories.json` and `category-icons.json`.
- `CategorySelectionPage.*` and its tests. It becomes an unused page, kept so existing tests pass unmodified.
- `AppShell.*`. The dock uses `position: sticky` inside its flex column.
- `base.css`, `tokens.css`, `tokens.json`, `STYLE_GUIDE.md` and `design-system/components/*`.
- `scripts/*`, `tests/*.mjs`, `package*.json`, `vite.config.ts` and `index.html`.

## 4. Ordered implementation steps

Each step is verified by its colocated tests plus `npm run typecheck`.

| # | Step | Verify | Depends on |
|---|---|---|---|
| 0 | Create branch `feat/add-expense-flow` and run `npm run validate`. | Matches the 48 / 21 baseline | none |
| 1 | **`amountFormat.ts`.** The amount is a canonical digit string with at most 2 decimals, never a float. `toPaise()` returns a `bigint`. Grouping uses `Intl.NumberFormat` on the integer part as a `BigInt`. It includes the digit cap (Q5) and an en-IN number-to-words function. | `1500000 → 15,00,000`; `007 → 7`; `. → 0.`; third decimal ignored; paste sanitising; zero detection; en-US grouping | 0 |
| 2 | **`PrimaryActionButton`.** Uses `aria-disabled` so it stays focusable but inert. Helper text is a real text node linked by `aria-describedby`. `aria-busy` shows while loading, and a ref guard allows one activation. It renders its own sticky bottom dock, offset by `--layout-screen-bottom-action-offset` plus the safe-area inset. | 5 rapid clicks while loading give 1 call; disabled reason is visible text; state matrix | 0 |
| 3 | **`ExpenseProgressIndicator`.** An `<ol>` with 3 segments and `aria-current="step"`. Completed segments are 48 px buttons and upcoming ones are inert. The caption reads "Step n of 3 · Name". The back button is named "Back to <previous step>" and is absent on step 1, with layout height unchanged. | Roles and names; `onStepSelect` fires only for completed steps; no 4th segment | 0 |
| 4 | **`AmountInput`.** A controlled `<input type="text" inputMode="decimal">`, labelled by the heading plus a hidden "Amount in rupees". The ₹ is decorative. The error has an icon and text, linked by `aria-describedby`. The caret is kept across separator changes. Enter submits. Font size shrinks in steps down to 24 px. | Typing, valid and invalid paste, caret, error clears, value kept | 1 |
| 5 | **Save model.** `Expense { id, amount, categoryIds, createdAt }`. `save()` is idempotent on `id`. An empty `categoryIds` means Uncategorized, which is a state and not a category. | Saving the same `id` twice stores one record | 1 |
| 6 | **`ExpenseSummary` and `SaveConfirmation`.** Tag remove buttons are at least 48 px and named "Remove Food". Zero tags shows plain "Uncategorized". Success uses a check icon plus text. | Role-based queries and removal callback | 1, 2; **blocked on the Review/Confirmation spec decision (§5)** |
| 7 | **Step bodies and `AddExpensePage`.** State holds `step`, `amount`, `selectedIds`, `draftId` (`crypto.randomUUID()`) and `saveStatus`. Forward movement is only through the primary button. On a failed save the flow stays on Review. The button returns to default and an inline `role="alert"` message appears. Retry reuses `draftId`. Focus goes to the step heading on steps 2 and 3, and Step 1 autofocuses the input. | Integration tests (§7) | 2–6 |
| 8 | **`useStepHistory`** (needs approval, Q7). `pushState` entries with no URL change, so the back gesture steps back instead of leaving the app. Isolated in one hook so it can be dropped. | Back and forward through steps keeps the draft | 7 |
| 9 | Wire `App.tsx` and finish the integration tests. | Tests pass | 7, 8 |
| 10 | `npm run validate`, the manual checks, then a PR to `main` that I won't merge. | Validate is green; manual checks reported individually | 9 |

**Recommended delivery in two PRs.** Merges to `main` deploy to production, so nothing half-built should reach it.
- **PR-A (steps 0–5):** the three specified components, the amount utilities and the save model. They are unwired, so nothing user-visible ships.
- **PR-B (steps 6–10):** the flow, Review, confirmation and the App swap. This goes after Q1 and the Review/Confirmation spec are settled.

## 5. Dependencies, decisions and gaps

**npm packages: none.**
- `lucide-react` is already installed. I'd add `ArrowLeft`, `X`, `CircleAlert` and `Loader`, following the precedent of `CategoryTile` importing `Check`.
- `BigInt`, `Intl` and `crypto.randomUUID` are platform features, and the TypeScript target is ES2022.
- No router, state library or storage is added.

| Decision | Status | Recommendation |
|---|---|---|
| D-1, D-2 | Approved | Apply: flexible bottom docking, no ✓ on segments |
| D-3 | Open | Keep the existing measured 2-column fallback in `CategoryGrid` |
| D-5 | Open | Omit Skip; Review with no tags already skips |
| D-7 | Approved, but the technical limit is undefined | Cap at **12 integer digits** (≤ ₹999,999,999,999.99), exact `bigint` paise for sums. Needs sign-off and a home in a save-workflow spec |
| D-8 | Open | INR only |
| D-9 | Open | Accept shrink to 24 px, with the caveat in Q9 |
| D-15 – D-21 | Approved | Consumed through `getCategories()` and `OTHER_CATEGORY_ID` |
| D-10 – D-14 | Dashboard only | Not applicable |

| Gap | Interim choice (as the specs state) |
|---|---|
| G-1 spinner | `size.icon.md` |
| G-2 helper text | `typography.caption` + `color.text.secondary` |
| G-3 focus offset | 2 px, with a comment citing the gap |
| G-5 ₹ size | Same size, `color.text.secondary` |
| G-8 amount field | `color.border.control`, `color.focus.ring`, `borderWidth.thin` / `thick` |
| G-4, G-9, G-10 | Dashboard only, not applicable |

**New gaps to report in a separate docs PR.** I'm labelling them N-1 to N-3 so I don't invent G-numbers.
- **N-1:** Review summary card and tag chip with a remove control. Interim: `component.card.*`, `size.touchTarget.min`, `color.selection.*`.
- **N-2:** Text button ("Edit"). Interim: `color.text.accent` with a 48 px target.
- **N-3:** Save confirmation layout. Interim: `color.status.success.*` and `motion.duration.confirmation`.

I also recommend a separate `docs/` PR for Review, SaveConfirmation and save-workflow specs. That PR would cover idempotency, error handling and the D-7 limit. Steps 6–9 would follow its approval.

## 6. Acceptance criteria

- **AmountInput §11**
  - 1: autofocus (device-checked).
  - 2: live `15,00,000` (SG-15).
  - 3: tabular digits (SG-12).
  - 4: ₹ visually distinct.
  - 5: third decimal ignored, and empty/0 disables Continue with its reason (SG-20).
  - 6: invalid paste shows an error with a fix (SG-10, SG-32).
  - 7: back restores the amount (SG-30).
  - 8: spoken amount (SG-41).
  - 9: amount and button both visible with the keypad open at 320 × 568 (SG-18, device-checked).
  - 10: never red or green (SG-11).
- **ExpenseProgressIndicator §11:** items 1–8 all apply. Item 6 (no 4th segment) holds by construction.
- **PrimaryActionButton §11**
  - 1: exactly one per screen (SG-01, SG-07).
  - 2–3: docked at 56 px (SG-18).
  - 5–6: states and a single activation (SG-19).
  - 7: the disabled reason is visible and described.
  - 8: enabled on Categories with zero tags.
  - 9: labels are Continue, Review, Save expense and Add another (SG-16).
  - 11–12: text scaling and reduced motion.
  - 13: a failed save returns to default with data intact (SG-32).
- **CategoryGrid §11**
  - Items 1–3 and 6–10 are covered by the existing tests, which stay unchanged.
  - Items 4 (zero tags → Uncategorized) and 8 (back/forward) become new end-to-end flow tests.
  - Item 5 (Other visible on 360 × 640) is a manual check.
- **Flow**
  - Amount → Continue → Review → Save expense is 3 button taps plus typing, within Vision §5 and SG-04's 4 screens.
  - Review shows 2 decimals (SG-14).
  - Other is never exclusive (SG-26).
  - The confirmation states what was saved, is announced to screen readers, and has no reward elements (SG-31).

## 7. Testing approach

**New tests** (Vitest, colocated, role-based queries, `userEvent`)
- `amountFormat`: table-driven cases from step 1.
- `PrimaryActionButton`: state matrix, `aria-disabled` plus description, double-click guard.
- `ExpenseProgressIndicator`: roles, back naming, jumps to completed steps only.
- `AmountInput`: typing, paste, caret, error.
- `expenses.ts`: idempotent save.
- `AddExpensePage` integration:
  - Happy path with Food + Other kept together.
  - Happy path with zero tags: saved with empty `categoryIds`, and "Uncategorized" shown.
  - Back from Categories and from Review restores the amount and selection.
  - Removing a tag on Review is reflected when returning to Categories.
  - A failed save keeps the draft, and retry produces one record.
  - A double-tapped Save produces one record.
  - "Add another" resets the draft with a new `id`.
  - Exactly one primary button on each step.

**Must pass unchanged:** all 48 `tests/*.mjs` data tests, `CategoryGrid.test.tsx`, `CategorySelectionPage.data.test.tsx`, and the rest of the 21 UI tests. No existing test is edited.

**What jsdom can't verify.** Layout, docking, keyboard inset, caret feel, contrast, 200 % text, reduced motion and screen-reader speech. I won't claim any of these as verified by the unit tests.

**Manual checks** (each reported as done or not done)
- 320 × 568 and 360 × 640, portrait and landscape.
- Keyboard docking on real iOS Safari and Android Chrome.
- Keyboard-only use: tab order, Enter on the amount, Space on tiles.
- VoiceOver and TalkBack through a full entry, including amount reading and step announcements.
- 200 % text: the grid drops to 2 columns and the button label stays visible.
- Reduced-motion emulation.
- A grayscale pass for the SG-42 states.

## 8. Risks and open questions for the product owner

1. **Persistence.** With no storage, "Expense saved" is true only until reload, and merges to `main` go to production.
   - Recommended: ship PR-A only, and keep PR-B on a preview until a persistence plan lands.
   - Alternative: accept in-memory saving with explicit sign-off.
   - SG-30's "survives backgrounding" also needs storage once the page reloads.
2. **Done and auto-dismiss.** I recommend no Done button and no auto-dismiss until a dashboard exists. The confirmation would stay until "Add another". This deviates from SG-31's two follow-ups.
3. **Skip (D-5).** I propose omitting it. Do you agree?
4. **Copy.** These are proposals:
   - "How much did you spend?" and "What was it for?" come from the specs.
   - "Review your expense" and "Expense saved" are my wording.
   - The Categories step would use the spec heading, and the old "Choose categories" page stays as is.
5. **Digit cap.** Do you approve 12 integer digits (D-7) and `bigint` paise as the representation?
6. **Locale.** The spec says device locale. An Indian user on an en-US device would see ₹1,500,000. Should the MVP fix en-IN instead?
7. **Browser-back handling.** It uses history entries with no URL routes, which CLAUDE.md says needs approval. Without it, the back gesture leaves the app and loses the draft (SG-30).
8. **Date.** `createdAt` is set at save. Users can't backdate until the Add-details step exists.
9. **Long amounts at 200 % text.** An `<input>` can't wrap (D-9). My fallback is horizontal scroll inside the field. A wrapping textarea is riskier. Which do you prefer?
10. **iOS autofocus.** iOS may not open the keypad on mount without a user gesture, so spec criterion 1 will carry a manual-check caveat.
11. **Orphaned `CategorySelectionPage`.** It's kept only for its tests. Delete it later in a separate plan?
12. **Summary position (drift 2).** The grid's summary scrolls with the tiles instead of sitting above the dock. I'd leave it, because changing `CategoryGrid` needs its own plan.

Approve, redirect, or answer Q1, Q5 and Q7 first (they gate the most work). Then I'll start with PR-A.
