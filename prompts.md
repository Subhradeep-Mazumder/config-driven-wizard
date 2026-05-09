# Prompts & Build Log

A record of how this project was built. Five parts: what I asked for, the tool I used, what it gave me, what I pushed back on (and why), and where all of that landed in the code.

---

## Part 1 — The full prompt used

The prompts I gave are reproduced verbatim below, in the order they were sent. There are eight of them. Each one builds on the state the repo was left in after the previous prompt.

### Prompt 1 — Initial project setup

```
Objective
--------------
Design and implement a config-driven multi-step Wizard component with built-in form validation, real-time status
updates from the server, and support for internationalization, accessibility, authentication, and role-based authorization.
This assignment is intended to evaluate deeper frontend capabilities, architecture thinking, and real-time integration
handling.
------------------

Requirements
-----------------------
--------------------------------------------------------------------------------
What You Need to Build
1. Config-Driven Wizard Engine
- Accept a JSON configuration:
- Step order
- Form fields per step (type, label, validations)
- Conditional logic (e.g., skip or include based on previous input)
- Dynamically render steps and navigation controls
2. Validation System
- Support:
- Synchronous validations: required, minLength, maxLength, pattern
- Async validations: e.g., email uniqueness via mock API
- Inline validation messages with accessibility support
3. State Persistence
- Persist wizard progress in localStorage or sessionStorage
- Allow user to resume from last completed step
4. Server Push Integration
- Implement one of:
- Polling or
- Server-Sent Events (SSE)
- Simulate backend pushing status updates (e.g., document verification)
- Display real-time progress or status change in the UI
--------------------------------------------------------------------------------

Required Features
| Area                 | Requirement                                                                |
|----------------------|----------------------------------------------------------------------------|
| Accessibility        | ARIA labels, keyboard nav, semantic tags                                   |
| Internationalization | react-i18next or similar with at least 2 languages                         |
| Authentication       | Mock login with token/session handling                                     |
| Authorization        | Render fields or steps conditionally based on role (e.g., admin vs. user)  |
| Performance          | Efficient renders, memoization for heavy logic                             |
| Cross-Browser        | Should work on Chrome, Firefox, Safari                                     |
| Security Awareness   | Basic XSS safety, field sanitization, no secrets in client code            |
--------------------------------------------------------------------------------
Testing
- Unit Tests (Jest + React Testing Library):
- Field validation logic
- Wizard step rendering
- Role-based behavior
- Automation Test (optional but preferred):
- Full wizard flow using Playwright or Cypress
--------------------------------------------------------------------------------
Additional Tasks
- Minimal Node.js/Express or Fastify backend:
- For login
- For SSE/polling simulation
--------------------------------------------------------------------------------

Create this Project for me in this path - /Users/subhmazu/Library/CloudStorage/OneDrive-VisaInc/Desktop/projects

Please Follow the conventions below exactly. Do not introduce alternative patterns unless I explicitly ask.

1. Tech Stack (fixed)
React 18 + TypeScript 5 (strict mode)
Webpack 5 with separate webpack.dev.js / webpack.prod.js configs (no CRA, no Vite unless asked)
Babel (@babel/preset-env, preset-react, preset-typescript) + ts-loader
SCSS with a root _variables.scss for tokens (colors, spacing, breakpoints)
Redux Toolkit + react-redux + redux-persist for shared/persisted state
React Router v6 for routing
MUI v5 as the primary component library (swap only if I specify)
Jest + @testing-library/react + @testing-library/jest-dom for tests
ESLint (@typescript-eslint) + Prettier + eslint-config-prettier
Charts: pick one of Recharts / Chart.js / ApexCharts based on need — do not install all
Axios or fetch wrapper for HTTP (one, not both)

2. Root Layout
<project>/
├── .eslintrc.json, .eslintignore, .prettierrc.json
├── .env, .env.example
├── .gitignore
├── babel.config.json
├── jest.config.js
├── tsconfig.json
├── webpack.dev.js
├── webpack.prod.js
├── package.json
├── __mocks__/              # fileMock.js, styleMock.js for Jest
├── public/                 # index.html + favicons only
└── src/

3. src/ Layout (enforce this shape)
src/
├── main.tsx                # entry — ReactDOM root + providers
├── app.tsx                 # routes + top-level layout
├── app.test.tsx
├── app.scss
├── _variables.scss
├── globals.d.ts
├── types.d.ts
│
├── assets/images/
│
├── layout/                 # app chrome (header, sideNav, footer, notice)
│   └── <part>/<part>.tsx + .scss + .test.tsx + index.ts
│
├── common/
│   ├── components/         # reusable, presentational UI (one folder per component)
│   ├── utills/
│   │   ├── hooks/          # one folder per custom hook, named useGetX / useX
│   │   └── helpers/        # pure functions only
│   ├── constants/          # static data, enums, table headers
│   └── configs/            # env-specific configs: local.ts, dev.ts, qacert.ts, prod.ts + getEnvConfig.ts + index.ts
│
├── modules/                # feature pages — one folder per route/feature
│   └── <feature>/
│       ├── <feature>.tsx
│       ├── <feature>.scss
│       ├── <feature>.d.ts
│       ├── <feature>.test.tsx
│       ├── index.ts
│       └── <subView>/      # nest sub-views for complex features
│
├── services/               # API layer — one folder per domain
│   └── <domain>/
│       ├── <operation>.ts       # the fetch/axios call
│       ├── <operation>.d.ts     # request/response types
│       └── <operation>.test.ts  # mocked network tests
│
└── store/
    ├── store.ts            # configureStore + persist config
    └── slices/
        └── <slice>/<slice>Slice.ts + .d.ts + .test.ts

4. Per-Folder File Convention (strict)
Every component, module, layout part, and hook folder must contain:
name.tsx — implementation
name.scss — scoped styles (use BEM or CSS modules — pick one project-wide)
name.d.ts — props and local types
name.test.tsx — tests colocated (never a separate __tests__ folder)
index.ts or index.tsx — barrel export (export { default } from './name')
Services use .ts / .d.ts / .test.ts (no .tsx).

5. Data-Fetching Pattern (enforce layering)
Three layers, never skip one:
services/<domain>/<operation>.ts — raw HTTP call, returns typed data, throws on error. No React here.
common/utills/hooks/use<Name>/ — custom hook wrapping the service (handles loading/error/data state, caching, retries). Components consume only hooks, never services directly.
store/slices/ — only for state that is shared across routes or persisted (auth, user profile, cross-page filters). Do not put per-page data in Redux.

6. Coding Rules
TypeScript strict mode on. No any without a // eslint-disable + justification.
Props interfaces live in .d.ts, not inline.
No default-exported anonymous functions — name every component for stack traces.
Barrel index.ts files only re-export; no logic.
SCSS variables come from _variables.scss — no hardcoded colors/spacing in component styles.
Environment config goes through common/configs/getEnvConfig.ts, not process.env scattered across the app.
No comments that describe WHAT the code does — only WHY when non-obvious.
Colocate tests; mirror the source filename.

7. NPM Scripts (exact names)
{
  "start":         "webpack-dev-server --port 4200 --open --mode development --hot --config webpack.dev.js",
  "build":         "webpack --mode production --config webpack.prod.js",
  "test":          "jest",
  "test:watch":    "jest --watch",
  "test:coverage": "jest --coverage",
  "lint":          "eslint .",
  "lint:fix":      "eslint --fix .",
  "format":        "prettier --write './**/*.{js,jsx,ts,tsx,css,scss,md,json}'",
  "analyze":       "source-map-explorer 'dist/*.js'"
}

8. Jest Setup
jest.config.js with ts-jest, jsdom environment
__mocks__/fileMock.js for images/fonts, __mocks__/styleMock.js (identity-obj-proxy) for CSS/SCSS
@testing-library/jest-dom loaded via setup file
Minimum coverage target: 80% lines on src/common/ and src/services/

9. What to Scaffold First
Root config files (tsconfig, webpack dev/prod, babel, eslint, prettier, jest)
src/main.tsx + src/app.tsx with Router + Redux Provider + PersistGate
src/store/store.ts with one example slice
src/common/configs/ with local.ts + getEnvConfig.ts + index.ts
One example modules/home/ feature
One example services/<domain>/ + matching common/utills/hooks/use<Name>/
One example common/components/ (e.g., a Button) showing the full 5-file convention
layout/ with header + footer stubs

10. Deliverables
A running npm start dev server on port 4200
A passing npm test with the example hook + slice tests
A green npm run lint
A green npm run build producing dist/
```

### Prompt 2 — Separate folder structure for backend and frontend

```
Create a separate folder structure for backend and frontend. The repository should cleanly split the two so
that each has its own source tree, its own package.json, and its own build/run toolchain.

Target layout:

config-driven-wizard/
├── package.json           # root — npm workspaces + orchestration scripts (dev, build, etc.)
├── prompts.md
├── README.md
├── frontend/              # all React app code and its config
│   ├── package.json
│   ├── tsconfig.json
│   ├── webpack.common.js / webpack.dev.js / webpack.prod.js
│   ├── babel.config.json
│   ├── jest.config.js / jest.setup.ts
│   ├── .eslintrc.json / .eslintignore / .prettierrc.json
│   ├── __mocks__/
│   ├── public/
│   └── src/
└── backend/               # all Express / mock API code and its config
    ├── package.json
    ├── tsconfig.json
    ├── .env / .env.example
    └── src/
        └── index.ts

Constraints:
- Use npm workspaces so `npm install` at the root installs both.
- Root `npm run dev` must start both workspaces concurrently (web on 4200, api on 4300).
- Frontend keeps all existing behavior (routes, config-driven wizard, tests, lint, build).
- Backend keeps all existing endpoints (/api/auth/login, /api/wizard/check-email, /api/wizard/submit, /events).
- Each workspace has only the dependencies it actually uses (no express in frontend, no react in backend).
```

### Prompt 3 — JSON config via UI input

```
The user should give the JSON in UI as input. The UI must NOT get this configuration from the backend API
(e.g., /api/wizard/config).
```

### Prompt 4 — Lazy loading at the route level

```
Route-level components are currently imported directly in app.tsx (eager imports), so they all land in the
initial bundle. Convert them to lazy-loaded components so each route ships as its own chunk.

Requirements:
- In frontend/src/app.tsx, replace the direct imports of Home, Login, and WizardBuilder with
  React.lazy(() => import('...')).
- Wrap the <Routes> tree in a single <Suspense> boundary with an accessible fallback (e.g. an MUI
  CircularProgress in a role="status" container).
- Keep Header, Footer, and RequireAuth as eager imports — they are part of the app shell and render
  on every route.
- Webpack should emit a separate chunk per lazy route (verify via npm run build).
- Update app.test.tsx to await the lazy boundary (use findBy* / waitFor instead of sync getBy* for
  content inside a route).
```

### Prompt 5 — Swap `localStorage` for `sessionStorage`

```
## Context
User data (auth token, wizard progress) is currently persisted in localStorage. Because localStorage is
shared across every tab and window of the same origin, a user who opens the app in a second tab
automatically inherits the authenticated session of the first — and closing the tab does not end it.

## Problem
This is a security and UX risk:
- A second tab silently piggybacks on an active session; the user never re-authenticates.
- Logout in one tab does not log the user out of another until that tab refreshes.
- Anyone with physical access to a closed browser can reopen the tab and still be logged in.

## Requirement
Switch all persisted state from localStorage to sessionStorage so that each tab gets its own isolated
session that ends when the tab closes.

## Scope of changes
- frontend/src/store/store.ts — change the redux-persist storage driver from
  redux-persist/lib/storage to redux-persist/lib/storage/session.
- frontend/src/services/http/client.ts — change the Axios interceptor that reads the persist envelope
  to use sessionStorage.getItem(...) instead of localStorage.getItem(...).
- Verify there are no other localStorage references in frontend/src/.

## Acceptance criteria
- Opening the app in a new tab shows the login page (no shared auth).
- Closing the tab and reopening it requires logging in again.
- Wizard progress is still restored on refresh within the same tab.
- npm run lint is clean; npm test stays green.
- DevTools → Application → Session Storage contains persist:config-driven-wizard;
  Local Storage does not.
```

### Prompt 6 — Keep wizard step nav inside the card

```
The step nav (1. Account, 2. Profile, …) overflows the wizard card when rendered in narrow containers
(e.g. inside the builder's right column). Fix the CSS in frontend/src/modules/wizard/wizard.scss so the
nav always stays within the card.

Minimum changes:
- Reset the <ol>: list-style: none; padding: 0; margin: 0.
- Add box-sizing: border-box and width: 100% to .wizard so padding is included in max-width.
- Add overflow-wrap: break-word to items for defensive wrapping.
```

### Prompt 7 — Full-block submit states + reusable ErrorBanner

```
## Context
After Submit, a small panel appears at the bottom of the form with the verifying status. This is easy to
miss and blurs success vs. failure.

## Requirement
Replace the bottom panel with three distinct views that own the whole wizard block, and introduce a
reusable error banner for app-wide use.

## Views
- Verifying — fills the wizard block with a spinner, title, and the latest SSE message. Form is hidden
  during this phase.
- Completed — fills the block with a success message and asks: "Would you like to start a new
  submission?" with two actions:
  - Start new → resetWizard() and return to a fresh form.
  - Close → dismiss the success view and return to the filled form (values preserved).
- Failed — return to the form with all previously entered values intact, and show an <ErrorBanner />
  at the top of the form with a Retry + Dismiss action.

## Reusable ErrorBanner
- Location: frontend/src/common/components/errorBanner/ (5-file convention).
- Props: message, title?, severity? (error | warning | info | success), onDismiss?, onRetry?,
  retryLabel?, dismissLabel?, className?.
- Uses MUI Alert under the hood; role="alert" so screen readers announce.
- Must be usable anywhere in the app, not just the wizard.

## Acceptance criteria
- During SSE verification, the form is replaced by the full-block verifying view.
- On approval, the form is replaced by the completed view with the Start new / Close prompt.
- On failure, user lands back on the form with values intact and an error banner at the top; Retry
  fires submit again.
- Lint clean, all tests green.
```

### Prompt 8 — README with setup, architecture, and design decisions

```
## Requirement
Write a README.md at the repo root that covers three sections:

1. Setup — prerequisites, install, run, mock accounts, scripts table.
2. Architecture — monorepo layout, frontend and backend trees, three-layer data-fetching pattern,
   wizard data flow, submit-state views.
3. Design decisions — the why behind the non-obvious choices: SSE vs. polling, sessionStorage vs.
   localStorage, config-as-prop vs. fetched, three-layer HTTP, route-level lazy loading,
   MUI + SCSS split, validation location, generic ErrorBanner, DOMPurify, mock backend scope,
   npm workspaces.

## Acceptance criteria
- A newcomer can clone the repo and be running both servers in under 60 seconds using only the README.
- Each design decision is one short paragraph explaining the trade-off, not just the choice.
- Architecture section reflects the current code (lazy routes, sessionStorage, prop-based config, etc.).
```

---

## Part 2 — The tool used

**Claude** — specifically **Claude Opus 4.7** (1M-context) from Anthropic, accessed through the **Claude Code** VS Code extension. Every prompt above was sent through the chat panel; Claude had live access to the workspace (read, edit, write, run shell commands, start dev servers) and used those capabilities to both implement and verify each change. No other AI assistant or code-gen tool was used on this project.

---

## Part 3 — What the tool generated

On the back of the initial brief (Prompt 1), Claude produced a complete, working project — not a stub. Specifically:

- **The whole scaffold.** Root configs (three Webpack files, Babel, Jest, TypeScript, ESLint, Prettier), an `src/` tree that honored the five-file-per-folder convention, and a `server/` with an Express mock. It wired up `main.tsx` with Provider + PersistGate, registered Router v6, and installed the full MUI + Redux Toolkit + i18next toolchain.
- **The wizard engine.** A `FieldRenderer` that covered nine field types (text, email, password, number, date, select, radio, checkbox, textarea), a pure `validate.ts` with six rule types (required, minLength, maxLength, pattern, email, asyncUnique), step- and field-level conditional visibility, role gates, an SSE hook using `EventSource`, and a Redux slice holding step index / values / completed steps / status.
- **The mock backend.** Login with HMAC-signed token, async email-uniqueness, submit, and a scripted SSE stream simulating a document-verification pipeline.
- **Supporting systems.** i18n in English and Spanish, an accessible header with skip-link and language switcher, XSS sanitization via DOMPurify, an axios singleton with an auth interceptor, environment-specific config files, and 15 Jest suites covering slices, hooks, helpers, services, and key components.
- **Operational correctness.** Every deliverable I named — `npm start` on 4200, a green test run, clean lint, and a real `dist/` — was working before Claude handed control back to me.

From then on, each follow-up prompt triggered a focused edit: Claude read the relevant files, made the minimum change needed, kept tests green, and restarted the dev server where necessary. By the end, test coverage had climbed to **100% across statements, branches, functions, and lines** (82 tests across 22 suites), and the Jest coverage threshold was locked to 100/100/100/100 so future regressions fail CI.

---

## Part 4 — What changes I drove, and why

This is the part that actually shows the thinking. Claude built what was asked, but *what* was asked set the shape of the codebase. These are the directives I gave, in the order they mattered.

### 1. I pinned the architecture up front — not after the fact

I didn't just say "make a React app." I specified the data-fetching layering (service → hook → slice, never skip one), the five-file-per-folder convention, strict TypeScript, no hardcoded colors, env config through a single `getEnvConfig.ts`. That's a deliberate choice: codebases drift when conventions are implicit. Baking them into the first prompt meant every subsequent file — including every file Claude wrote later — inherited the pattern without me having to re-police it.

### 2. I split backend and frontend into a proper monorepo (Prompt 2)

Mixing React dependencies and Express dependencies in one `package.json` works, but it's wrong. `axios` and `@mui/material` have no business being in a backend's dependency tree, and vice versa. I forced the split: two workspaces, two `package.json`s, two toolchains, linked through npm workspaces so install stayed painless. The benefit is mechanical — the backend image (if dockerized later) doesn't carry 300 MB of React. It's also a communication artifact: anyone reading this repo can see at a glance where the boundary is.

### 3. I inverted the config flow (Prompt 3)

The initial scaffold had the wizard fetch config from `/api/wizard/config`. That's a trap: you end up with a "config-driven" component that can't actually be driven by anything except one specific backend. I made the engine take `config: WizardConfig` as a prop — pure, no fetch, no `useEffect`. Then I added a `WizardBuilder` that owns the JSON input. The engine is now genuinely reusable: a Storybook story, a file upload, a CMS-delivered blob — anything that produces valid JSON can drive it.

When I saw the builder still had a "Load from server" button, I cut that too, along with the backend endpoint. Optional fallbacks have a way of becoming the actual path people use; deleting the temptation is cleaner than documenting against it.

### 4. I demanded route-level code splitting (Prompt 4)

Eager imports of every route are the default in a hand-written Webpack setup, and nobody notices until the initial bundle is 500 KB. I had Claude convert the three route components to `React.lazy`, wrap them in one `<Suspense>`, and leave the app shell eager. The build went from 4 chunks to 8. That's three lazy routes plus new vendor splits for each. For any real deployment, that's the difference between a snappy first paint and a second of white screen.

### 5. I treated sessionStorage as a security concern, not a preference (Prompt 5)

This is the one I'm proudest of in terms of architectural judgment. `localStorage` is the default people pick for "make it persist." But auth tokens in localStorage leak across tabs — open the app in a second window and you inherit the logged-in state of the first. Worse: closing the tab doesn't end the session. I framed the switch as a security fix, not a tuning knob, and I rewrote Prompt 5 with an explicit *Context / Problem / Requirement / Scope / Acceptance* structure to set that tone. That template became the standard for later prompts.

### 6. I fixed the layout bug that only showed up in the builder view (Prompt 6)

Minor in lines of code, but it's a good discipline check. The step nav overflowed the card only when the wizard rendered inside the builder's right column — the standalone route hid the bug. Root cause: default `<ol>` padding, plus a missing `box-sizing: border-box` so the card's padding blew past its `max-width`. I asked for a surgical fix and a crisp prompt (no essay). The point is that I noticed.

### 7. I redesigned the submit experience (Prompt 7)

The original UX — a small panel below the form — made success and failure nearly indistinguishable, and SSE messages scrolled past too fast to read. I reworked it into three full-block states:

- **Verifying** takes over the wizard block entirely with a spinner and the live SSE line. The form goes away, which is correct because there's nothing to edit.
- **Completed** replaces the block with a success card and asks "Would you like to start a new submission?" with a single *Start new* action. I deliberately removed a *Close* button I'd first added, because "Close and do what?" is a question with no good answer here.
- **Failed** returns the user to their exact form state with all values preserved, and puts a reusable `<ErrorBanner />` at the top.

The ErrorBanner itself was a deliberate investment in reuse: MUI `Alert` under the hood, props for severity and optional Retry / Dismiss actions, and its own five-file folder so it can be dropped anywhere.

### 8. I separately asked for the verifying loop to feel like a real workflow

SSE events originally landed at 0.5, 2, 3, 4.5 seconds — too fast to read. I had Claude stretch them to 1, 4, 7, 10 seconds, then noticed the wizard was flipping to "Completed" the instant the POST returned (~few ms) regardless of what SSE said. That's the wrong state machine: the POST is "submission accepted", not "verification finished". I had Claude rewire the logic so the terminal state (`completed` / `failed`) is set by the SSE's terminal event (`approved` / `rejected`), not by the POST response.

### 9. I pushed coverage to 100 %

The scaffold had an 80 % threshold. I told Claude to run `test:coverage` and get it to a clean 100. That surfaced half a dozen files with no tests — the axios client's auth interceptor, the SSE hook, both wizard services, sanitizer, env-config switcher. Coverage isn't the goal in itself — the goal is to force every branch to be considered. Writing the SSE hook test revealed that a malformed payload should *not* crash the stream, and the test locked that behavior down. I bumped the Jest `coverageThreshold` to 100/100/100/100 so it stays that way.

### 10. I added a sample file and a real README

Both are developer-experience work. `sample_config.json` at the repo root exercises every field type, every validation type, and every conditional feature in one file — a newcomer can paste it and see the full feature set at once. The README was expanded from "here's the npm scripts" to a three-section doc: setup, architecture, and design decisions. The design-decisions section isn't apology; it's the *why* that makes a codebase maintainable.

---

## Part 5 — Where it was applied in the project

Mapping each change from Part 4 to the concrete places in the repo:

### 1. Architecture baked in up front
- The initial scaffold in `src/` (now `frontend/src/`) follows the layering exactly — `services/*/<operation>.ts`, `common/utills/hooks/use<Name>/`, `store/slices/<name>/`.
- Root configs: [frontend/tsconfig.json](frontend/tsconfig.json), [frontend/.eslintrc.json](frontend/.eslintrc.json), [frontend/jest.config.js](frontend/jest.config.js), [frontend/webpack.*.js](frontend/webpack.common.js).
- [frontend/src/common/configs/getEnvConfig.ts](frontend/src/common/configs/getEnvConfig.ts) + `local.ts` / `dev.ts` / `qacert.ts` / `prod.ts`.

### 2. Monorepo split (Prompt 2)
- Root [package.json](package.json) — `workspaces: ["frontend", "backend"]`, orchestration scripts using `concurrently`.
- [frontend/package.json](frontend/package.json) — React / Webpack / Jest / ESLint / Prettier only.
- [backend/package.json](backend/package.json) — Express / ts-node only.
- Physical moves: everything React → [frontend/](frontend/), `server/index.ts` → [backend/src/index.ts](backend/src/index.ts).

### 3. Config-as-prop + UI-driven JSON (Prompt 3)
- Engine turned into a pure component: [frontend/src/modules/wizard/wizard.tsx](frontend/src/modules/wizard/wizard.tsx) (takes `config: WizardConfig`).
- Builder UI: [frontend/src/modules/wizard/wizardBuilder.tsx](frontend/src/modules/wizard/wizardBuilder.tsx) + [.scss](frontend/src/modules/wizard/wizardBuilder.scss) + tests.
- Barrel default switched: [frontend/src/modules/wizard/index.ts](frontend/src/modules/wizard/index.ts).
- Route now points to the builder: [frontend/src/app.tsx](frontend/src/app.tsx).
- Deleted: `getWizardConfig` service, `useWizardConfig` hook, and the `/api/wizard/config` endpoint in [backend/src/index.ts](backend/src/index.ts).
- Sample for users: [sample_config.json](sample_config.json).

### 4. Route-level lazy loading (Prompt 4)
- [frontend/src/app.tsx](frontend/src/app.tsx) — `React.lazy(() => import(...))` for Home / Login / WizardBuilder, single `<Suspense>` boundary with a `CircularProgress` fallback.
- [frontend/src/app.scss](frontend/src/app.scss) — `.app__fallback` styles.
- [frontend/src/app.test.tsx](frontend/src/app.test.tsx) — switched to `findBy*` to await the lazy boundary.
- Webpack now emits one chunk per lazy route (visible in `frontend/dist/`).

### 5. sessionStorage swap (Prompt 5)
- [frontend/src/store/store.ts:3](frontend/src/store/store.ts#L3) — `import storage from 'redux-persist/lib/storage/session'`.
- [frontend/src/services/http/client.ts:16](frontend/src/services/http/client.ts#L16) — `sessionStorage.getItem(...)` in the auth interceptor.

### 6. Wizard-nav CSS fix (Prompt 6)
- [frontend/src/modules/wizard/wizard.scss](frontend/src/modules/wizard/wizard.scss) — `box-sizing`, `<ol>` reset, `overflow-wrap`, mobile `@media` block.

### 7. Full-block submit states + reusable ErrorBanner (Prompt 7)
- New component folder: [frontend/src/common/components/errorBanner/](frontend/src/common/components/errorBanner/) — `errorBanner.tsx`, `.scss`, `.d.ts`, `.test.tsx`, `index.ts`.
- [frontend/src/modules/wizard/wizard.tsx](frontend/src/modules/wizard/wizard.tsx) — three-view render structure; SSE-driven terminal state.
- [frontend/src/modules/wizard/wizard.scss](frontend/src/modules/wizard/wizard.scss) — `.wizard--full`, `.wizard__fullView`, action row.
- [frontend/src/locales/en.json](frontend/src/locales/en.json) + [es.json](frontend/src/locales/es.json) — added `wizard.completed.*`, `wizard.error.*`, `wizard.waitingForUpdates`.

### 8. SSE pacing + correct terminal state
- [backend/src/index.ts](backend/src/index.ts) — script delays widened to 1 / 4 / 7 / 10 seconds.
- [frontend/src/modules/wizard/wizard.tsx](frontend/src/modules/wizard/wizard.tsx) — `useEffect` watches `stream.latest`; terminal status flips on `approved` / `rejected`.

### 9. 100 % test coverage
- New tests: [frontend/src/common/configs/getEnvConfig.test.ts](frontend/src/common/configs/getEnvConfig.test.ts), [helpers/sanitize.test.ts](frontend/src/common/utills/helpers/sanitize.test.ts), [useWizardStatusStream.test.tsx](frontend/src/common/utills/hooks/useWizardStatusStream/useWizardStatusStream.test.tsx), [services/http/client.test.ts](frontend/src/services/http/client.test.ts), [services/wizard/checkEmailUnique.test.ts](frontend/src/services/wizard/checkEmailUnique.test.ts), [services/wizard/submitWizard.test.ts](frontend/src/services/wizard/submitWizard.test.ts).
- Extended: [validate.test.ts](frontend/src/common/utills/helpers/validate.test.ts), [useAuth.test.tsx](frontend/src/common/utills/hooks/useAuth/useAuth.test.tsx).
- Threshold locked: [frontend/jest.config.js](frontend/jest.config.js#L22) — 100/100/100/100.

### 10. README and sample config
- [README.md](README.md) — Setup / Architecture / Design decisions / Testing.
- [sample_config.json](sample_config.json) at the repo root.

---

**End result:** a monorepo with a clean frontend/backend split, a pure config-driven wizard engine fed by user-supplied JSON, route-level code splitting, tab-scoped session storage, a reusable error banner, three distinct post-submit views driven by SSE, 100 % test coverage, and a README that tells the next reader not just *how* to run the project, but *why* it was built this way.
