# Starting a fresh Claude Code session in Plan Mode

These steps reproduce the Step 4 planning exercise **interactively** on your own machine. The headless run recorded in [`session-log.md`](session-log.md) used the same prompt; an interactive run is what lets you capture screenshots and the `/cost` / `/context` panels yourself.

## 1. Prepare the repository

```bash
git clone https://github.com/KR4705/expense-tracker.git   # or: cd into your existing clone
cd expense-tracker
git fetch origin
git checkout docs/airtribe-step4-planning-mode              # branch that contains CLAUDE.md
npm ci && npm run validate                                  # optional: confirm the green baseline
```

Start from the repository root so Claude Code loads `CLAUDE.md` automatically.

## 2. Start a fresh session in Plan Mode

Either option gives a new session with no prior conversation:

- **Directly:** `claude --permission-mode plan`
- **Or:** run `claude`, then press **Shift+Tab** until the status line shows **plan mode on**.

If you are reusing a terminal that already had a session, run `/clear` first or exit and start `claude` again so the session count stays at one.

Optional check before prompting: run `/memory` and confirm `./CLAUDE.md` is listed as loaded.

## 3. Send the planning prompt

Paste the full contents of [`planning-prompt.md`](planning-prompt.md) as the first message. In Plan Mode Claude reads files and returns a plan; it cannot edit files.

When Claude presents the plan and asks whether to proceed, **choose "No, keep planning"** (or press Esc). Do **not** approve — approving exits Plan Mode and starts implementation, which is outside Step 4.

## 4. Capture the evidence

| Evidence | How |
|---|---|
| Exact prompt | Already in `planning-prompt.md`; confirm you pasted it unchanged |
| Generated plan | Copy the plan text into `interactive-plan.md`, or run `/export` and save the transcript |
| Plan Mode proof | Screenshot showing "plan mode on" and the plan |
| Session count | One session from start to plan (note it in the log) |
| Token usage | Run `/cost` (API billing) and/or `/context` before exiting; screenshot or copy the output. On a Pro/Max subscription `/cost` may not show dollar figures — record what it shows |
| No changes made | `git status` should show no modified files afterwards |

Save captures under `docs/airtribe/step-04/` (for example `interactive-plan.md`, `screenshots/plan-mode.png`, `screenshots/cost.png`) and update the "Interactive run" section of `session-log.md`.

## 5. Commit on the feature branch

```bash
git add docs/airtribe/step-04
git commit -m "docs(step-04): add interactive Plan Mode evidence"
git push origin docs/airtribe-step4-planning-mode
```

Do not merge into `main` — merges to `main` trigger a Vercel production deploy.
