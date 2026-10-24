You are in Plan Mode. Do not edit, create or delete files, install packages, run git commands that change state, or start servers. Read and plan only.

Feature to plan: the **Add Expense flow** for this repository.

Follow CLAUDE.md §7 ("Plan before implementing") and its guardrails. Before planning, read CLAUDE.md, docs/PRODUCT_VISION.md, design-system/STYLE_GUIDE.md (§G Progressive Navigation and the SG rules it cites), design-system/components/README.md (decisions D-1 … D-21 and gaps G-1 … G-10), and the component specs for AmountInput, ExpenseProgressIndicator, PrimaryActionButton, CategoryGrid and CategoryTile. Inspect the existing implementation in src/ (App.tsx, app/AppShell, pages/CategorySelectionPage, components/category/*, data/categories.ts) and the test setup.

Scope of the flow: Step 1 Amount → Step 2 Categories (reuse the existing CategoryGrid) → Step 3 Review & save → save confirmation. Out of scope unless you argue otherwise: the optional "Add details" step, the dashboard, a backend, and any change to STYLE_GUIDE.md, tokens.json or categories.json.

Produce a plan only, with these sections:
1. Goal and scope (in / out)
2. Sources read (files, spec sections, SG IDs, decision IDs)
3. Affected files — every new or modified path and the reason; state which existing files must stay untouched
4. Ordered implementation steps, each small and independently verifiable, with its dependencies
5. Dependencies — npm packages (justify any addition or say none), open decisions (D-n) and token gaps (G-n) that block or shape the work, and the decision you recommend for each
6. Acceptance criteria, traceable to spec §11 items and SG rule IDs
7. Testing approach — new unit/integration tests, existing tests that must still pass unchanged, and manual checks (320 × 568 and 360 × 640 viewports, keyboard, screen reader, 200 % text, reduced motion)
8. Risks and open questions for the product owner

Be specific to this codebase's conventions (named exports, CSS Modules using token variables only, controlled components keyed by category ID, colocated *.test.tsx with role-based queries). Keep the plan concise enough to review in one sitting.
