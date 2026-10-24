<!-- Verbatim plan file written by the same session at ~/.claude/plans/you-are-in-plan-purring-frost.md (outside the repository). Not edited. -->

# Plan: Add Expense flow (Amount → Categories → Review & save → Confirmation)

**Context.** `main` has only a standalone Choose-categories page. The product goal is a 3–4 interaction capture: type amount, Continue, (tiles), Review, Save expense. This plan builds the missing pieces and wires the flow without touching the design system, category data or existing category components.

## 1. Goal and scope

**In**
- `PrimaryActionButton`, `ExpenseProgressIndicator` and `AmountInput` per their specs.
- Step screens: Amount, Categories (reuses `CategoryGrid` unchanged), Review, Saved confirmation.
- A flow container: step state, an in-memory draft (amount + `selectedIds`), back/forward without data loss, double-save protection, failed-save recovery.
- A save port (`ExpenseRepository`) with an in-memory implementation.

**Out**
- Add details: SG-04 keeps it out of the default path, no spec exists, and a dead button is worse than none. The indicator's `subStepLabel` is omitted.
- Skip button (D-5, omit). Done button (no destination until the dashboard exists, see Q2).
- Dashboard, backend, persistence/storage, analytics, editing saved expenses.
- Any edit to `STYLE_GUIDE.md`, `tokens.json`, component specs, `categories.json`, `src/styles/tokens.css`, `package-lock.json`.

## 2. Sources read
- `CLAUDE.md`; `PRODUCT_VISION.md` v1.2 (§4, §5, §8); `STYLE_GUIDE.md` v0.3 (§G, SG-01/02/07/10/11/14/15/16/17/18/19/20/25/26/28–32/39/41–45); `components/README.md` (D-1…D-21, G-1…G-10, §9 out of scope).
- Specs: AmountInput (§4–§11), ExpenseProgressIndicator, PrimaryActionButton, CategoryGrid, CategoryTile.
- Code: `App.tsx`, `main.tsx`, `AppShell.*`, `CategorySelectionPage.*`, `CategoryGrid.tsx/.css/.test.tsx`, `CategoryTile.tsx/.css`, `categories.ts`, `base.css`, `test/setup.ts`, `vite.config.ts`, `tsconfig.app.json`, `index.html` (already has `viewport-fit=cover`), `vercel.json`, token names in `tokens.css`.
- Not run (Plan Mode): the `npm run validate` baseline of 48 data / 21 UI tests is taken from CLAUDE.md and re-confirmed in step 0.

**Drift found (reported, not fixed)**
1. The Project description says "including an Unknown option". Vision v1.2, SG-26 and CLAUDE.md say there is no Unknown. Source docs win.
2. CategoryGrid §8 wants the summary directly above the docked button. The built grid renders the summary inside its own root, so it scrolls with the tiles.
3. CategoryGrid default heading is "What was it for?". The built page says "Choose categories" (asserted by existing tests).
4. No spec exists for the Review step, save confirmation or save workflow (README §9), yet SG-31/32 and PrimaryActionButton §5.3 depend on them.
5. SG-31 says "≈ 1.5 s, or until dismissed". Auto-dismiss has no destination without a dashboard.
6. Known: `src/data/README.md` text and spec headers citing Vision v1.1 / SG v0.2.

## 3. Affected files

**New**
| Path | Why |
|---|---|
| `src/components/amount/amountFormat.ts` (+`.test.ts`) | Pure, float-free parse/format/zero check/digit cap/spoken amount (D-7, SG-15, SG-41) |
| `src/components/amount/AmountInput.tsx/.module.css/.test.tsx` | Step 1 field |
| `src/components/progress/ExpenseProgressIndicator.tsx/.module.css/.test.tsx` | Segments, caption, back control |
| `src/components/action/PrimaryActionButton.tsx/.module.css/.test.tsx` | Button + helper text + bottom dock |
| `src/components/action/useKeyboardInset.ts` (+test) | `visualViewport` inset so the dock rides above the on-screen keyboard (SG-18) |
| `src/components/review/ExpenseSummary.tsx/.css/.test.tsx` | Review card: amount (2 decimals), removable tags or "Uncategorized", Edit buttons |
| `src/components/review/SaveConfirmation.tsx/.css/.test.tsx` | Success check, "Expense saved", amount and tags, "Add another" |
| `src/data/expenses.ts` (+test) | `Expense` type, `ExpenseRepository`, idempotent in-memory repository |
| `src/pages/AddExpensePage.tsx/.module.css/.test.tsx` | Flow container and integration tests |
| `src/pages/add-expense/{AmountStep,CategoriesStep,ReviewStep}.tsx` (+css) | Step bodies; `useStepHistory.ts` (browser back) |

**Modified:** `src/App.tsx` only (render `AddExpensePage` in `AppShell`).

**Must stay untouched:** `CategoryGrid.*`, `CategoryTile.*`, `categoryIcons.ts`, `categories.ts/.json`, `category-icons.json`, `CategorySelectionPage.*` and its tests (kept as an unused page so existing tests pass unmodified), `AppShell.*` (dock uses `position: sticky` inside its flex column), `base.css`, `tokens.css`, `tokens.json`, `STYLE_GUIDE.md`, `design-system/components/*`, `scripts/*`, `tests/*.mjs`, `package*.json`, `vite.config.ts`, `index.html`.

## 4. Ordered implementation steps
Each step is verified with its colocated tests plus `npm run typecheck`.

0. **Branch and baseline.** Branch `feat/add-expense-flow`; run `npm run validate`. *Verify:* matches the 48 / 21 baseline. *Dep:* none.
1. **`amountFormat.ts`.** Canonical amount = digit string with an optional `.` and ≤ 2 decimals (never a float); `toPaise()` returns `bigint`. Grouping via `Intl.NumberFormat(locale)` on the integer part as `BigInt`. Includes the integer-digit cap (Q5) and an en-IN number-to-words function for the spoken amount. *Verify:* `1500000 → 15,00,000`; `007 → 7`; `. → 0.`; third decimal ignored; paste sanitising; zero/empty detection; en-US grouping. *Dep:* 0.
2. **`PrimaryActionButton`.** Props per spec §4. Uses `aria-disabled` (focusable but inert), helper text as a text node linked by `aria-describedby`, `aria-busy` while loading, a ref-guarded single activation. Renders its own bottom dock: sticky, `margin-top: auto`, offset `--layout-screen-bottom-action-offset` + `env(safe-area-inset-bottom)`, plus `useKeyboardInset`. *Verify:* 5 rapid clicks while loading → 1 call; the disabled reason is a visible text node; label and state matrix. *Dep:* 0.
3. **`ExpenseProgressIndicator`.** `<ol aria-label="Expense entry progress">`, 3 segments, `aria-current="step"`, completed = 48 px-hit button, upcoming inert, caption "Step n of 3 · Name", back button "Back to <previous step>" (absent on step 1, layout height unchanged). *Verify:* roles/names, `onStepSelect` only for completed, no 4th segment. *Dep:* 0.
4. **`AmountInput`.** Controlled `<input type="text" inputMode="decimal">` labelled by the heading plus hidden "Amount in rupees"; ₹ decorative; underline, focus and error per G-8 interim tokens; error icon + text linked via `aria-describedby`; caret kept after the same digit count when separators change; `onSubmit` on Enter; sizes shrink in steps to 24 px (D-9). *Verify:* typing, paste valid/invalid, caret via `setSelectionRange`, error clears, value kept. *Dep:* 1.
5. **Save model.** `Expense { id, amount, categoryIds, createdAt }`; `ExpenseRepository.save(expense): Promise<void>` idempotent on `id`; in-memory implementation. Empty `categoryIds` means Uncategorized (state, not a category). *Verify:* the same `id` saved twice stores one record. *Dep:* 1.
6. **Review and Saved components** (`ExpenseSummary`, `SaveConfirmation`). Tag removal buttons ≥ 48 px named "Remove Food"; zero tags shows "Uncategorized" as plain text; success uses a check icon + text; confirmation is `role="status"`. *Verify:* role-based queries, removal callback. *Dep:* 1, 2. **Blocked on the Review/Confirmation spec decision (§5).**
7. **Step bodies + `AddExpensePage`.** State: `step`, `amount`, `selectedIds`, `draftId` (`crypto.randomUUID()`, regenerated by Add another), `saveStatus`. Forward only via the primary button. Back and completed segments keep the draft. Save: loading, then success → Saved, or failure → stay on Review, button back to default, inline `role="alert"` message with icon + text ("Couldn't save. Your expense is still here — try again."), retry reuses `draftId`. Focus moves to the step heading on step 2+; Step 1 autofocuses the input. *Dep:* 2–6.
8. **`useStepHistory`** (needs approval, Q7). `history.pushState` entries with no URL change, so the browser/Android back gesture goes to the previous step instead of leaving the app (SG-30). Isolated in one hook so it can be dropped without touching the rest. *Dep:* 7.
9. **Wire `App.tsx`**, then integration tests (§7). *Dep:* 7–8.
10. **`npm run validate`**, manual checks (§7), then a PR to `main` that is **not merged by me**. *Dep:* 9.

**Delivery in two PRs (recommended, because merges to `main` deploy to production):**
- **PR-A (steps 0–5):** the three specified components plus the amount utilities and the save model, unwired, so nothing user-visible ships.
- **PR-B (steps 6–10):** flow, Review, confirmation and the App swap, after Q1 and the Review/Confirmation spec are settled.

## 5. Dependencies, decisions and gaps

**npm packages: none.** `lucide-react` is already present (`Check` is already imported directly in `CategoryTile`; I would add `ArrowLeft`, `X`, `CircleAlert`, `Loader`). `BigInt`, `Intl` and `crypto.randomUUID` are platform features (target ES2022). No router, state library or storage is added.

| ID | Status | Recommendation |
|---|---|---|
| D-1, D-2 | Approved | Apply: flexible bottom docking; no ✓ on segments |
| D-3 | Open | Keep the existing measured fallback in `CategoryGrid` (no change) |
| D-5 | Open | Omit Skip; Review with no tags already skips |
| D-7 | Approved; technical limit undefined | Cap at **12 integer digits** (≤ ₹999,999,999,999.99), exact `bigint` paise for sums. Needs sign-off and a home in a save-workflow spec |
| D-8 | Open | INR only |
| D-9 | Open | Accept shrink to 24 px, but see risk Q9 (an `<input>` cannot wrap) |
| D-15–D-21 | Approved | Consumed via `getCategories()` / `OTHER_CATEGORY_ID` |
| D-10–D-14 | Dashboard only | N/A |

| Gap | Interim (as the specs state) |
|---|---|
| G-1 spinner | `size.icon.md` |
| G-2 helper text | `typography.caption` + `color.text.secondary` |
| G-3 focus offset | 2 px, comment cites the gap |
| G-5 ₹ size | Same size, `color.text.secondary` |
| G-8 amount field | `color.border.control`, `color.focus.ring`, `borderWidth.thin/thick` |
| G-4, G-9, G-10 | Dashboard only, N/A |

**New gaps to report (not invented as G-numbers; proposed in a separate docs PR):**
- N-1 Review summary card and tag chip/remove control. Interim: `component.card.*`, `size.touchTarget.min`, `color.selection.*`.
- N-2 Text button ("Edit"). Interim: `color.text.accent`, 48 px target.
- N-3 Save confirmation layout. Interim: `color.status.success.*`, `motion.duration.confirmation`.

**Recommendation:** a separate `docs/` PR (outside this one) adds Review, SaveConfirmation and save-workflow specs (idempotency, error handling, the D-7 limit). Code for steps 6–9 follows approval, using the interim tokens above.

## 6. Acceptance criteria
- **AmountInput §11:** 1 autofocus (device-checked), 2 `15,00,000` live, 3 tabular digits (SG-12), 4 ₹ distinct, 5 third decimal ignored and empty/0 disables Continue with reason (SG-20), 6 invalid paste error with fix (SG-10/32), 7 back restores amount (SG-30), 8 spoken amount (SG-41), 9 visible with keypad on 320 × 568 (SG-18, device-checked), 10 never red/green (SG-11).
- **ExpenseProgressIndicator §11:** 1–8 all (6 holds by construction).
- **PrimaryActionButton §11:** 1 exactly one per screen (SG-01/07); 2–3 docked, 56 px; 5–6 states and single activation (SG-19); 7 reason text; 8 enabled on Categories with zero tags; 9 labels Continue / Review / Save expense / Add another (SG-16); 11–12 text scaling and reduced motion; 13 failed save returns to default with data intact (SG-32).
- **CategoryGrid §11:** 1–3 and 6–10 via existing tests (unchanged). **4** (zero tags → Uncategorized end-to-end) and **8** (back/forward) are new flow tests; **5** (Other visible on 360 × 640) is manual.
- **Flow:** Amount → Continue → Review → Save expense is 3 button taps plus typing (Vision §5, SG-04 ≤ 4 screens); amounts shown with 2 decimals on Review (SG-14); Other is never exclusive (SG-26); confirmation states what was saved, announced, with no reward elements (SG-31).

## 7. Testing approach

**New (Vitest, colocated, role-based queries, `userEvent`):**
- `amountFormat`: table-driven cases listed in step 1.
- `PrimaryActionButton`: state matrix, `aria-disabled` and described-by, double-click guard, label whitelist via types.
- `ExpenseProgressIndicator`: roles, back naming, jump to a completed step only.
- `AmountInput`: typing, paste, caret, error.
- `expenses.ts`: idempotent save.
- `AddExpensePage` integration:
  - happy path with tags (Food + Other kept together);
  - happy path with zero tags (saved with empty `categoryIds`, "Uncategorized" shown);
  - back from Categories and Review restores the amount and selection;
  - removing a tag on Review is reflected on return to Categories;
  - failed save keeps the draft and retry produces one record (repository stub rejects once);
  - double-tapping Save produces one record;
  - "Add another" resets the draft with a new id;
  - exactly one primary button per step.

**Must pass unchanged:** `tests/*.mjs` (48), `CategoryGrid.test.tsx`, `CategorySelectionPage.data.test.tsx`, and the rest of the 21 UI tests. No existing test is edited.

**Limits of jsdom (not claimed as verified by tests):** layout, docking, keyboard inset, caret feel, contrast, 200 % text, reduced motion, screen-reader speech.

**Manual checks, reported individually as done or not done:**
- 320 × 568 and 360 × 640, portrait and landscape.
- Real iOS Safari and Android Chrome keyboard docking.
- Keyboard-only: tab order, Enter on the amount, Space on tiles.
- VoiceOver and TalkBack full entry, including amount reading and step announcements.
- 200 % text: grid drops to 2 columns, button label visible.
- Reduced-motion emulation; grayscale pass for SG-42 states.

## 8. Risks and open questions for the product owner
1. **Persistence.** With no storage, "Expense saved" is true only until reload, and merges to `main` go to production. Options: (a) ship PR-A only, keep PR-B on a preview until a persistence plan lands (recommended); (b) accept in-memory with explicit sign-off. SG-30's "survives backgrounding" also needs storage for a reload.
2. **Done / auto-dismiss.** Recommend no Done button and no auto-dismiss until a dashboard exists; confirmation stays until "Add another". This deviates from SG-31's two follow-ups.
3. **Skip (D-5)** omitted. Agree?
4. **Copy** (proposals): "How much did you spend?", "What was it for?" (spec) vs the existing "Choose categories", "Review your expense", "Expense saved". The flow's Categories step uses the spec wording and leaves the old page alone.
5. **Digit cap** of 12 (D-7) and the `bigint`-paise representation: approve?
6. **Locale.** The spec says device locale; Indian users on an en-US device would see ₹1,500,000. Fix to en-IN for the MVP?
7. **Browser-back handling** via history entries (no URL routes) needs approval; without it, the back gesture leaves the app and loses the draft (SG-30).
8. **Date.** `createdAt` is set at save; users cannot backdate until the Add-details step exists.
9. **Long amounts at 200 % text.** An `<input>` cannot wrap (D-9). Fallback: horizontal scroll inside the field. A wrapping `contenteditable`/textarea is riskier. Preference?
10. **iOS** may not open the keypad on mount without a user gesture (spec criterion 1); expect a manual-check caveat.
11. **Orphaned `CategorySelectionPage`** is kept only for its tests. Delete later in a separate plan?
12. **Summary position** (drift 2): the grid summary scrolls with the tiles instead of sitting above the dock. Left as is; changing `CategoryGrid` needs its own plan.
