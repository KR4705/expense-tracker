# Expense Tracker

A mobile-first personal expense-tracking product focused on making spending visible without turning expense recording into financial administration.

## Product overview

The intended audience is financially unorganized high-net-worth individuals and high spenders. The product emphasizes fast capture, flexible categorization, and understandable insights.

The core experience aims to make a typical expense recordable in approximately three or four simple interactions:
- A clear, guided sequence with one prominent next action.
- Large, recognizable controls.
- Icon-supported category tiles that permit multiple tags, including Unknown.
- A readable financial summary that does not double-count transactions assigned to multiple categories.

These are product intentions, not yet validated usability outcomes.

## Documentation

| Document | Purpose |
|---|---|
| [Product vision](docs/PRODUCT_VISION.md) | Problem, audience, product principles and proposed MVP |
| [Design reference catalog](references/REFERENCE_CATALOG.md) | Approved inspiration roles and design observations |
| [Screen references](references/SCREEN_REFERENCES.md) | Exact external image sources and current attachment status |
| [Style guide](design-system/STYLE_GUIDE.md) | Visual and interaction rules (SG-01 – SG-44) |
| [Design tokens](design-system/tokens.json) | DTCG tokens — the single source of truth for frontend styling |
| [Component specifications](design-system/components/README.md) | Appearance and behavior of the seven MVP components |
| `src/` | Application source code (React + TypeScript) |
| `scripts/build-tokens.mjs` | Token-to-CSS-variable generator |
| [Category data](src/data/README.md) | Approved category list, icon registry, display-order evidence and validation rules |

## Design reference directions

- **PhonePe:** Equal-weight, unmistakable visual choices.
- **Duolingo:** Clear current, completed and upcoming states.
- **Uber:** One dominant forward action in a guided sequence.
- **Groww mobile:** Readable financial summaries, charts and breakdowns.

## Current stage

**Frontend foundation.** The style guide, tokens and component specifications are in place. The frontend is set up with Vite, React and TypeScript, and currently shows a placeholder screen inside the mobile-first app shell. The category dataset in `src/data/` is validated and approved for the initial MVP. The expense-entry flow, category selection UI and dashboard have not been built yet.

This repository documents the product and design process as decisions develop.

## Local setup

**Requirements:** Node.js 20.19 or later (22 LTS recommended) and npm.

```bash
npm install      # install dependencies
npm run dev      # generate tokens, then start the dev server at http://localhost:5173
```

To check the app at mobile size, open your browser's device toolbar and start at 360 × 640.

### Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Generates `src/styles/tokens.css`, then starts the Vite dev server. |
| `npm run tokens` | Validates `design-system/tokens.json` and regenerates `src/styles/tokens.css`. |
| `npm run tokens:validate` | Validates the tokens only; writes nothing. |
| `npm run categories:validate` | Validates `src/data/categories.json` against the icon registry and the category rules (see [src/data/README.md](src/data/README.md)). |
| `npm test` | Runs the test suite in `tests/` with Node's built-in test runner. |
| `npm run typecheck` | Generates tokens, then runs the TypeScript compiler (`tsc -b`). |
| `npm run validate` | Token validation, category validation, tests and type checking. |
| `npm run build` | `validate`, then a production build into `dist/`. |
| `npm run preview` | Serves the production build locally. |

### Design tokens → CSS variables

`design-system/tokens.json` is the single source of truth. `npm run tokens` turns every token into a CSS custom property on `:root` in `src/styles/tokens.css`:

- Names follow the token path in kebab-case, e.g. `color.background.app` → `--color-background-app`, `layout.screen.maxContentWidth` → `--layout-screen-max-content-width`.
- Aliases stay aliases, e.g. `--color-background-app: var(--color-palette-neutral-50)`, so the foundation → semantic → component chain is visible in the browser.
- Typography tokens expand into one property per field, e.g. `--typography-heading-1-font-size`, plus `-font-variant-numeric` (tabular figures) and `-text-transform` where the token defines them.
- Font sizes and line heights are written in `rem` (px ÷ 16) so text follows the user's browser text-size setting (SG-43). The values are unchanged at default size.

Validation fails the build if an alias points at a missing token, aliases form a loop, a token has no `$type`, or two tokens would produce the same CSS name.

`src/styles/tokens.css` is generated and git-ignored; never edit it by hand. Components use `var(--…)` token properties only. To change a value, change `tokens.json` (and the Style Guide it traces to) through review.

### Fonts and licences

The UI font is [Inter](https://github.com/rsms/inter), installed from the [`@fontsource/inter`](https://fontsource.org/fonts/inter) npm package and bundled with the app (no third-party font CDN). Only weights 400, 500 and 600 (the weights in `tokens.json`) and the latin and latin-ext subsets are loaded; latin-ext contains the ₹ glyph.

Inter is licensed under the SIL Open Font License 1.1. The full licence text ships with the app at `public/licenses/Inter-OFL.txt` (served at `/licenses/Inter-OFL.txt`). See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Deploying to Vercel

The repository is ready to deploy with Vercel's **Vite** framework preset. `vercel.json` pins the settings:

| Setting | Value |
|---|---|
| Framework preset | Vite |
| Install command | `npm ci` |
| Build command | `npm run build` (runs token generation and validation first) |
| Output directory | `dist` |
| Node.js version | 20.x or later (Project Settings → Build and Deployment) |

**From the dashboard**

1. In Vercel, choose **Add New… → Project** and import `KR4705/expense-tracker`.
2. Leave **Root Directory** as the repository root. Vercel detects the Vite preset and reads `vercel.json`.
3. Deploy. Every pull request then gets a preview deployment, and merges to `main` deploy to production.

**From the command line**

```bash
npm i -g vercel
vercel          # preview deployment
vercel --prod   # production deployment
```

No environment variables are needed yet.
