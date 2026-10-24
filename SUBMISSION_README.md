# Airtribe Final Submission — Expense Tracker

**Course:** Agentic AI and AI Systems in Production  
**Submission branch:** `submission/airtribe-final`  
**Project:** Mobile-first Expense Tracker, intended for unorganized high-spending users.

## Start here

The eight numbered folders in `submission/` are the evaluator's primary entrypoint. The runnable frontend remains at the repository root (`src/`, `design-system/`, `scripts/`, `package.json`). The newest demonstration UI is the **Transit vs Travel** information dialog introduced in Step 5.

| # | Deliverable | Folder |
|---|---|---|
| 01 | Visual references and provenance | [01-Visual-References](submission/01-Visual-References/) |
| 02 | Style guide, design tokens, component specs | [02-Design-System](submission/02-Design-System/) |
| 03 | Structured category data and rendered page source | [03-Structured-Content](submission/03-Structured-Content/) |
| 04 | Compliance subagent, three planted-violation audits | [04-Compliance-Subagent](submission/04-Compliance-Subagent/) |
| 05 | CLAUDE.md and Plan Mode prompt | [05-Claude-Planning-Mode](submission/05-Claude-Planning-Mode/) |
| 06 | Fresh-session log and generated plan | [06-Fresh-Session-Evidence](submission/06-Fresh-Session-Evidence/) |
| 07 | Custom skill, source changes, screenshots, validation | [07-Custom-Skill](submission/07-Custom-Skill/) |
| 08 | Recorded token/session counts | [08-Token-Usage](submission/08-Token-Usage/) |

## How to run

```bash
npm ci
npm run validate
npm run dev
```

The frontend is a demonstration of category selection and clarification, **not** a completed end-to-end expense-entry product. The Step 5 evidence includes baseline and updated test logs (48 category-data tests; 21 baseline vs. 30 updated UI tests).

## Evidence and limits

- **Compliance agent:** `.claude/agents/design-compliance-auditor.md`; two audits in `docs/subagent_run/`. The auditor detected all 3 intentionally planted violations. The bad code was reverted, and this branch inherits the compliant source; `violations.diff` is evidence only.
- **Plan Mode:** `CLAUDE.md` and `docs/airtribe/step-04/`; actual new session log, generated plan, and exact token usage JSON.
- **Custom skill:** `docs/airtribe/step5/`; skill definition, real browser screenshots, and before/after test logs. Custom skill was invoked in the session, but the invocation transcript itself is not committed.
- **Reference screenshots:** `references/` contains source catalogs but not the original third-party reference image binaries (its category directories are placeholders). The five visual reference image assets are separately available in the [Drive reference folder](https://drive.google.com/drive/folders/1LhbiPMV73wDhJYfdDHuomv4yj7y7kRgB); those images are **not inside the GitHub ZIP**.
- **Usage:** Planning Mode exact billed usage plus a separate, approximate Custom Skill context-budget estimate; full project token and session totals are **not known**. Do not add unlike counts.
- **Scope:** This is a consolidated submission branch for evaluation, not a deployment. It does not merge or remove feature branches or modify `main`.

[Google Drive submission root](https://drive.google.com/drive/folders/1PmZTyysIsDKjzYKo5MwaTqVtAJ17iA8A)
