# Airtribe Step 5 — Category Ambiguity Skill: Evidence

**Date:** 24 October 2026 | **Branch:** `feat/airtribe-step5-category-ambiguity` | **Base:** `main` @ `f4dbed4` (merge of PR #7)
**Implementation commit:** `14fc76b` | **Status:** Not merged, not deployed.

**Chain:** [Skill invocation](#2-skill-invocation) → [Finding](#4-ambiguity-identified) → [Design conflict and decision](#5-design-conflict-and-decision) → [UI change](#6-ui-change) → [Validation](#8-validation)

| File | Contents |
|---|---|
| `skill-SKILL.md` | Verbatim copy of the skill definition that was invoked |
| `baseline/CategoryTile.tsx`, `baseline/CategoryTile.module.css` | CategoryTile as it was on `main` before any change |
| `implementation.diff` | `git diff main..14fc76b` (the whole frontend change) |
| `logs/baseline-validate.log`, `logs/after-validate.log` | Full `npm run validate` output, before and after |
| `screenshots/` | Real Chromium captures at 360 × 640 (@2x), plus the capture script |

---

## 1. Skill definition

- **Name:** `category-ambiguity-helper` (user's own custom skill, listed in the session's available skills).
- **Location:** `/mnt/skills/plugins/category-ambiguity-helper/SKILL.md`
- **SHA-256:** `fd594cd633cd99a1479bfab2c387e065d44e455b38853b2faf11a575080586f5` (copy: `skill-SKILL.md`)
- **Key instructions applied:** flag only meaningful ambiguities; explanations from the app's actual definitions; Info (ⓘ) opens a simple modal with an obvious close; never trigger selection; no Info on unambiguous categories; reuse the design system; preserve accessibility; **present proposed changes for approval before implementing** (workflow step 5).

The skill was **not recreated or substituted**; no file in the skill folder was modified.

## 2. Skill invocation

- **Mechanism:** the session's `Skill` tool, called with `skill: "category-ambiguity-helper"` in response to the user's `/category-ambiguity-helper` command, as the first action of the session (24 Oct 2026, ~06:13 IST).
- **Tool result header (verbatim):** `Base directory for this skill: /mnt/skills/plugins/category-ambiguity-helper`, followed by the full SKILL.md body, which loaded into the turn and was followed.
- **Skill workflow, as executed:**

| Skill step | What happened |
|---|---|
| 1. Read category definitions and UI | Read `src/data/categories.json` (v1.0.0, approved), `CategoryTile.tsx`, `CategoryGrid.tsx`, `CategoryTile.md`, `CategoryGrid.md`, `STYLE_GUIDE.md` |
| 2. Identify competing choices | Transit vs Travel (primary); Fun vs Home on streaming/subscriptions (flagged only) |
| 3. Explain ambiguity, propose text | §4 below |
| 4. Which tiles need Info | Transit and Travel only |
| 5. Present for approval | Presented to the user with a design conflict (§5); user chose the grid-level placement |
| 6. Implement | Commit `14fc76b` |
| 7. Validate selection still works | §8 — tests and real-browser checks |

## 3. Baseline (before any change)

- **Branch / commit:** `main` @ `f4dbed4a4ebc8457a3f30428bc03e44575fa07bc`
- **CategoryTile:** `src/components/category/CategoryTile.tsx` (copied to `baseline/`, SHA-256 `6408885b…2955`). A `<label>` wrapping a visually hidden native checkbox, an icon plate, the label text and a check badge when selected. No Info affordance anywhere on the page.
- **Behavior:** 9 tiles in 3 columns at 360 px, each 101 × 100 px; multi-select checkboxes; live summary "No category selected — you can still continue" / "n selected: …". Screenshot: `screenshots/before-page.png`.
- **Baseline validation:** `npm run validate` → exit 0. Tokens check ✓, categories check ✓, data tests **48/48**, UI tests **21/21** (2 files), typecheck ✓. Log: `logs/baseline-validate.log`.

## 4. Ambiguity identified

**Categories involved:** Transit (`transport`) and Travel (`travel`).

**Evidence — approved definitions in `src/data/categories.json`:**
- Transit: *"Day-to-day travel: fuel, cabs, autos, parking, public transport."*
- Travel: *"Trips away from home: flights, trains, hotels, holiday spending."*

**Potential misunderstanding:** Both definitions describe *travel*, and the labels differ by one word. Items such as a cab to the airport, or a train journey (Transit lists "public transport", Travel lists "trains"), plausibly fit either. Users may hesitate or assume they must pick exactly one.

**Explanation needed:** The difference the data already states — everyday getting around vs trips away from home — plus the product rule that tags can overlap (Vision §4.5; SG-25; SG-26: zero, one or several categories; zero saves as Uncategorized).

**Why it helps:** It removes a decision the product never forces (Vision §4.1 "capture first, organize later") at the exact moment of hesitation, without adding a step (Vision §4.2).

**No classification rules were invented.** The modal does not say where an airport cab "belongs"; it shows both approved descriptions and says either or both are fine.

**Flagged, not addressed — Fun vs Home:** Fun lists *"streaming"*; Home lists *"subscriptions"*. A streaming subscription fits both. Explaining it would require a product-owner decision, so it is left as an open question.

**Not flagged:** Home ("household bills") vs Shop ("household items") — the definitions already separate bills from purchases.

## 5. Design conflict and decision

The request was an Info button **on the category tile**. Against the approved specification this does not fit:

| Rule | Requirement | Conflict |
|---|---|---|
| SG-17 Minimum Touch Targets | Every control ≥ 48 × 48 px, ≥ 8 px from other targets | Tiles are 88 px (320 px viewport) to 101 px wide with a centred 48 px icon plate and a 20 px top-right badge. A 48 px target in the free corner overlaps about a third of the plate (tapping the icon would open the modal instead of selecting) and sits inside the tile's own target. |
| SG-21 Equal-Weight Category Tiles | All tiles identical in the unselected state | The skill requires Info only on ambiguous tiles, so Transit and Travel would differ from the other seven. |

Per the user's instruction, the conflict was **reported, not resolved by changing rules**. Options offered: (1) Info next to the grid, tiles unchanged; (2) Info in tiles plus a spec amendment; (3) report only.
**User decision:** option 1, *"ⓘ next to grid (Recommended)"*. No Style Guide rule, token or component spec was modified.

## 6. UI change

**New:** `CategoryDifferenceInfo` (`src/components/category/`) rendered in the page header under the helper text: the supporting text "Transit or Travel?" and a 48 px circular Info icon button (the Style Guide §E "Icon button … info" proposal). Pressing it opens a bottom-aligned modal:

- Title "Transit or Travel?"; each category with its tile icon on the standard 48 px plate, its label and its **approved description read from `categories.json` at runtime** (no copied text that could drift).
- Note: "Not sure? You can choose both, or neither — categories can overlap."
- **Close** button (Style Guide secondary button); Escape and backdrop click also close.

**Unchanged:** `CategoryTile.*`, `CategoryGrid.*`, `src/data/*`, `design-system/*` (verified with `git diff --quiet main..14fc76b -- …`). One line added to `CategorySelectionPage.tsx` plus the ID constant and import.

**Requirement check:**

| Requirement | Result |
|---|---|
| Info must not select/deselect | No tile contains a button; test and browser run confirm selection unchanged after Info round-trip |
| Multi-select preserved | Transit + Travel selected together → "2 selected: Transit, Travel" |
| Tile appearance as close to original as possible | Identical — every tile 101 × 100 px before and after |
| No interactive control nested in checkbox/label | Info is outside the `role="group"` grid |
| Keyboard / screen reader | Native `<button>` named "Transit or Travel? How they differ" (contains visible text), `aria-haspopup="dialog"`; dialog has `role="dialog"`, `aria-modal`, `aria-labelledby`, `aria-describedby`; focus → Close on open, Tab/Shift+Tab stay inside, focus returns to Info on close |
| Existing icons, styles, tokens | Lucide `Info` (already a dependency); all values are existing tokens except gap G-8 |
| No new dependencies or animations | None added; no transitions |

**Known gap G-8 — backdrop colour.** `tokens.json` has no scrim/overlay token. Interim: `color-mix(in srgb, var(--color-text-primary) 40%, transparent)`, documented in the CSS. Proposed token: `color.overlay.scrim`. `tokens.json` not modified.

## 7. Before / after

| Before (`main`) | After (branch) | Modal open |
|---|---|---|
| `screenshots/before-page.png` | `screenshots/after-page.png` | `screenshots/after-modal.png` |

Also `screenshots/after-selected-after-info.png` (Travel selected, then Info opened and closed). The header row pushes the grid down ~56 px; Other remains visible without scrolling at 360 × 640 (SG-26).

## 8. Validation

**`npm run validate` (after):** exit 0 — tokens ✓, categories ✓, data tests **48/48**, UI tests **30/30** in 3 files (21 existing + 9 new), typecheck ✓. Log: `logs/after-validate.log`.

New tests (`CategoryDifferenceInfo.test.tsx`): one Info button, outside every tile; tiles unchanged; modal shows both approved descriptions; Info never changes selection; Transit + Travel multi-select; focus in/trapped/returned; Enter opens, Escape closes; backdrop closes, panel click does not; renders nothing if a competing category is missing.

**Real-browser check** (Chromium, 360 × 640, production build): tiles 101 × 100 px before and after; Info box 48 × 48 px; focus on open = "Close"; focus after Escape = Info; summary after Info round-trip = "1 selected: Travel".

**Design-compliance subagent: not run.** Its definitions (`design-compliance-auditor.md`, `design-system-auditor.md`) exist only on the unmerged branches `feat/design-compliance-auditor` and `feat/airtribe-step3-compliance-agent`; neither is on `main` or loaded in this session. It was not imitated with a generic agent.

**Unresolved / not verified:** VoiceOver and TalkBack not tested on devices (as with the existing tile spec); 200 % text not checked for the new row; background content is not made `inert` (relies on `aria-modal` plus focus trap); G-8 scrim token; Fun vs Home open question.

## 9. Session and token usage

- **Sessions:** 1 (this Claude session; skill invocation, implementation and evidence in one run).
- **Tokens:** about **215,000** consumed, read from the session's remaining-token counter (15,000,000 at start → ~14,785,000 when this file was written). This is an approximate context-budget figure, not a billing report; per-call input/output token counts were not available in this session.
