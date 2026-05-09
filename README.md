# config-driven-wizard

A config-driven multi-step Wizard with inline + async validation, SSE status updates, i18n, auth, RBAC, accessibility, and XSS hardening. The wizard engine consumes a **JSON configuration** provided by the user via an in-app editor — the backend is used only for auth, async uniqueness checks, submission, and status streaming.

---

## 1. Setup

### Prerequisites

- **Node.js 18+** (any LTS works)
- **npm 9+** (uses npm workspaces)

### Install

```bash
npm install          # single root install; hoists deps for both workspaces
```

### Run

```bash
npm run dev          # frontend (:4200) + backend (:4300) concurrently
```

Open http://localhost:4200 — you'll be redirected to `/login`.

**Mock accounts:**

| Username | Password | Role  | Notes |
| -------- | -------- | ----- | ----- |
| `admin`  | `admin`  | admin | sees Compliance step + admin-only fields |
| `user`   | `user`   | user  | Compliance step hidden |

**Useful test data:**

- `taken@example.com`, `existing@example.com` — trigger async-unique validation failure.
- Country = `us` — reveals the conditional ZIP field (`visibleWhen`).

### Scripts

All root scripts delegate to the appropriate workspace (`npm -w frontend …` / `npm -w backend …`).

| Script | What it does |
| --- | --- |
| `npm run dev` | Both servers in parallel (hot reload) |
| `npm start` | Frontend only, port 4200 |
| `npm run start:server` | Backend only, port 4300 |
| `npm run build` | Production build → `frontend/dist/` |
| `npm test` | Jest (run once) |
| `npm run test:watch` | Jest in watch mode |
| `npm run test:coverage` | Jest with coverage report |
| `npm run lint` / `lint:fix` | ESLint |
| `npm run format` | Prettier |
| `npm run analyze` | `source-map-explorer` on the built bundle |

---

## 2. Architecture

### Monorepo layout

```
config-driven-wizard/
├── package.json              npm workspaces + orchestration
├── prompts.md                numbered prompts + build log
├── sample_config.json        ready-to-paste wizard JSON covering every feature
├── frontend/                 React 18 + TS 5 + Webpack 5 + MUI + Redux Toolkit
└── backend/                  Express 4 + ts-node (mock API)
```

### Frontend layout (`frontend/src/`)

```
main.tsx                      React root + Provider + PersistGate + Suspense for i18n
app.tsx                       Routes; lazy-loaded route components; Suspense boundary
i18n.ts / locales/            react-i18next with en + es
store/                        Redux Toolkit + redux-persist (sessionStorage)
  slices/auth/                auth token, user, role
  slices/wizard/              step index, values, completedSteps, status

common/
  components/
    button/                   thin MUI Button wrapper
    errorBanner/              generic reusable Alert (error/warning/info/success)
    requireAuth/              route guard: redirects to /login or 403
  configs/                    env-specific (local/dev/qacert/prod) + getEnvConfig
  constants/wizardConfig.ts   default sample used by the builder editor
  utills/
    helpers/                  validate, sanitize
    hooks/useAuth/            selector + actions for auth slice
    hooks/useWizardStatusStream/  EventSource (SSE) client

services/                     three-layer HTTP (no React)
  http/client.ts              axios singleton + auth interceptor
  auth/login.ts               POST /api/auth/login
  wizard/checkEmailUnique.ts  GET  /api/wizard/check-email
  wizard/submitWizard.ts      POST /api/wizard/submit

layout/                       header (language switcher, logout), footer
modules/                      route-level features
  home/                       post-login landing
  login/                      login form
  wizard/
    wizardBuilder.tsx         JSON editor + live preview (default `/wizard`)
    wizard.tsx                pure engine — takes config as a prop
    fieldRenderer/            field-type dispatcher (text, email, select, …)
```

### Backend layout (`backend/src/`)

```
index.ts                      Express app
  POST /api/auth/login        issues HMAC-signed token
  GET  /api/wizard/check-email  async-unique check
  POST /api/wizard/submit     accepts submission, returns jobId
  GET  /events                Server-Sent Events, scripted status updates
```

### Data-fetching pattern (strict three-layer)

```
component ─▶ hook ─▶ service ─▶ HTTP
                               axios (singleton)
                               auth interceptor reads sessionStorage
```

- Services throw; never hold React state.
- Hooks wrap services with loading/error/data state.
- Components consume hooks only — never services directly.

### Wizard data flow

```
WizardBuilder (/wizard)
  │
  │  User edits JSON in a textarea (pre-filled with a sample).
  │  Click "Apply" → parseConfig → setActiveConfig(parsed)
  │
  └─▶ <Wizard config={activeConfig} />        pure engine (no fetching)
         │
         ├─ computes visibleSteps (role + visibleWhen)
         ├─ renders nav + current step via FieldRenderer
         ├─ runs sync validators on blur/next
         ├─ runs async `asyncUnique` (POST to backend) on next
         ├─ on Submit: POST /api/wizard/submit, set status='verifying'
         └─ useWizardStatusStream (EventSource /events) streams live updates
              └─ on 'approved' → status='completed', on 'rejected' → 'failed'
```

### Submit-state views

The wizard block swaps between three full-screen views after Submit:

- **Verifying** — spinner + live SSE message (form hidden).
- **Completed** — "Start new" resets to fresh form.
- **Failed** — form returns with all values intact; top-level `<ErrorBanner />` with Retry.

---

## 3. Design decisions

### SSE over polling
SSE is one-way server-to-client, exactly what we need for status updates. One HTTP connection instead of a polling loop; auto-reconnect is built into `EventSource`. Polling would either waste requests (short interval) or feel laggy (long interval).

### Redux Toolkit + redux-persist (sessionStorage)
Auth, wizard answers, and step progress are in Redux so they survive refresh. **`sessionStorage`, not `localStorage`** — each tab gets its own isolated session, and closing the tab ends the session. `localStorage` would leak the authenticated session across every tab of the same origin.

### Config passed as a prop, not fetched
The `Wizard` engine accepts `config: WizardConfig` as a prop. The caller (`WizardBuilder`) decides where the config comes from — in this project, from the user's textarea. This keeps the engine pure and reusable: a different caller could pass a config imported from a file, a Storybook story, or anywhere else. Per the spec (Prompt 3), the UI must **not** fetch config from the backend — there is deliberately no `/api/wizard/config` endpoint.

### Three-layer HTTP (service / hook / slice)
Prevents React and HTTP from tangling. Services are unit-testable without JSDOM; hooks are unit-testable without network; components never know about axios.

### Lazy loading at the route level
`Home`, `Login`, and `WizardBuilder` are `React.lazy(() => import(...))` imports in `app.tsx`, wrapped in a single `<Suspense>`. The app shell (Header, Footer, RequireAuth) stays eager. Webpack emits one chunk per route — the initial bundle only ships what the current route needs.

### MUI for components, custom SCSS for layout
MUI covers form controls, buttons, alerts, and icons consistently and with a11y baked in. Layout (grids, spacing, cards) uses SCSS + BEM with tokens from `_variables.scss` — no hardcoded colors or spacing in component styles.

### Validation lives in `common/utills/helpers/validate.ts`
Pure functions, no React. Called from both the wizard engine (on blur / on next) and directly from tests. Async validation is a separate concern: `asyncUnique` fires on next-click only and hits the backend.

### Generic `<ErrorBanner />`
Built on MUI `Alert`, supports `severity`, optional `onRetry` / `onDismiss`, and is used at the top of the form on submit failure. Designed for reuse anywhere in the app.

### DOMPurify for user-entered strings
All free-text values are sanitized through `sanitize.ts` before going into any `dangerouslySetInnerHTML` path (none today, but the helper is in place for future features). Field values are rendered as plain text everywhere, so XSS risk is already low.

### Mock backend, not a full one
The backend is intentionally a single file in `backend/src/index.ts`. Its purpose is to exercise the frontend — real auth, DB, and verification would replace it. The HMAC-signed token proves the interceptor / auth flow end to end without a JWT dependency.

### npm workspaces over polyrepo or nx
Zero tooling beyond npm; one `npm install` at the root installs both. Scripts at the root compose both workspaces (`concurrently`). Kept deliberately flat — no Lerna / Turborepo / Nx overhead for two packages.

---

## 4. Testing

- **Unit tests (Jest + RTL):** 49 tests across 16 suites — validation helpers, hooks, slices, services, field renderer, wizard engine, builder, error banner.
- **Accessibility:** every form field has an associated `<label>` and `aria-describedby`; error messages use `role="alert"`; nav uses `aria-current="step"`; skip link in header; live regions for status.
- **i18n:** `en` + `es`. Every visible string is a translation key; tests assert keys, not literals.

Run `npm run test:coverage` for a coverage report.
