# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm** (see `pnpm-workspace.yaml`, `pnpm-lock.yaml`).

- `pnpm dev` — start Next.js dev server on `http://localhost:3000`
- `pnpm build` — production build
- `pnpm start` — run production build
- `pnpm lint` — run ESLint (uses `eslint-config-next` with core-web-vitals + typescript presets)

There is no test runner configured in this repo.

## Stack

- Next.js 16 (App Router, RSC), React 19, TypeScript strict
- Supabase (`@supabase/ssr` for cookies-based SSR auth, `@supabase/supabase-js`)
- Tailwind v4 (`@tailwindcss/postcss`), shadcn/ui (`style: radix-lyra`, base color `neutral`, Phosphor icons)
- Zod for runtime validation at API boundaries
- MercadoPago SDK via `src/lib/mercadopago/*` (Checkout Pro + webhook with x-signature)
- Resend / `@react-email/components` for transactional emails

Path alias: `@/*` → `src/*`.

## Architecture

The codebase follows a **strict layered architecture per domain entity**, mirrored across five top-level folders inside `src/`:

```
controllers/<domain>/   ← thin orchestration; called from API routes / server components
services/<domain>/      ← business logic, cross-domain composition, validation
repositories/<domain>/  ← Supabase data access (single table + filters)
exceptions/<domain>/    ← typed exception classes that bubble up the layers
types/<domain>/         ← request/response/domain types (separate from DB types)
```

Every domain (e.g. `packages`, `experiences`, `hotels`, `orders`, `payments`, `reservations`, `users`, `checkout`, `payment-processing`, `auth`, etc.) has its own folder in each layer. Adding a new entity means creating these five folders.

### Base classes

All CRUD plumbing is generic over a `PublicTableName` of `Database["public"]["Tables"]`:

- `BaseRepository<TTableName>` (`src/repositories/base/base.repository.ts`) — `findAll`, `findMany`, `findOne`, `create`, `update`, `delete` against Supabase. `applyFilters` walks a filter object and chains `.eq()` calls. `update`/`delete` require non-empty filters (`ensureFilters`).
- `BaseService<TTableName>` (`src/services/base/base.service.ts`) — wraps repository calls and translates errors via the domain's exception factory (`createServiceException`, `createNotFoundException`). Includes `getOrThrow` for "must exist" semantics.
- `BaseController<TTableName>` and `BaseIdController<TTableName>` (`src/controllers/base/base.controller.ts`) — pass-through to service, plus `getById/updateById/deleteById` helpers that build the id filter.
- Exceptions extend `BaseException` (`src/exceptions/base/base.exception.ts`) with a `NotFoundException` and per-layer `RepositoryException`/`ServiceException`/`ValidationException`.

Concrete domain classes extend the base class and only override what they need (extra service methods, custom queries, validation). They are instantiated via `create<Domain>Repository(supabase)`, `create<Domain>Service(repository)`, `create<Domain>Controller(service)` factory functions and assembled at the entry point (API route or server component) using a Supabase client from `@/lib/supabase/server`.

`CheckoutService` (`src/services/checkout/checkout.service.ts`) is the canonical example of a service that composes multiple domain services rather than extending `BaseService`.

### Supabase clients

Three clients in `src/lib/supabase/`:

- `server.ts` — `createClient()` for RSC/route handlers, uses Next `cookies()`.
- `client.ts` — browser client.
- `admin-client.ts` — service-role client for backend-only privileged operations (webhooks, admin tasks). Never import from client components.
- `middleware.ts` — `updateSession()` used by the proxy.

### Routing (proxy.ts, not middleware.ts)

This project uses Next.js 16's `proxy.ts` at the repo root (replaces the legacy `middleware.ts` convention). It calls `updateSession()` which:

1. Refreshes the Supabase session cookie.
2. Redirects unauthenticated users away from `/checkout`, `/account` to `/login`.
3. Gates `/dashboard` and `/api/dashboard` to `usuarios.tipo === "admin"` (returns 401/403 JSON for API routes, redirects for pages).

When changing protected paths, edit the `authRoutes` / `adminRoutes` arrays in `src/lib/supabase/middleware.ts`.

### App Router layout

- `src/app/(public)/` — public storefront (homepage, `paquetes`, `experiencias`, `hoteleria`, `emisivo`, `para-agencias`, `contacto`, `carrito`, `checkout`, `mis-reservas`).
- `src/app/(auth)/login` — login flow.
- `src/app/auth/callback` — Supabase OAuth/OTP callback.
- `src/app/dashboard/` — admin-only pages (gated by proxy).
- `src/app/api/` — route handlers. `checkout`, `payments/{mercadopago,bank-transfer}`, `webhooks/mercadopago`, `dashboard/upload`, `auth/sync-profile`, `contact-requests`. API routes parse input with Zod, build the controller via a `createServer<Domain>Controller()` factory, and translate typed exceptions into HTTP status codes (see `src/app/api/checkout/route.ts` for the pattern).

### Checkout & payments flow

`CheckoutService.submitCheckout` is the orchestrator:

1. Authenticates user; validates cart with Zod at the route boundary.
2. Asserts the chosen payment method is configured (`getMercadoPagoConfig` / `getBankTransferConfig` in `src/lib/payments/payments.config.ts`).
3. Creates `ordenes` row + per-item `ordenes_items` + `reservas` (one per cart item; checks `paquete_fecha.cupo_disponible` or experience `activo`/`precio`). Note table names stay Spanish; the TypeScript layer that touches them lives under `orders/`, `order-items/`, `reservations/`, `package-dates/`.
4. Optionally upserts the user's `checkout_profiles` record.
5. Dispatches to `PaymentProcessingService` for the chosen method:
   - `mercadopago` → creates Checkout Pro preference, returns `initPoint` as `redirectUrl`.
   - `transferencia` → creates pending bank-transfer payment + returns bank instructions; redirects to `/checkout/transferencia?orderId=...`.
   - `efectivo` → creates `cash_local` payment placeholder.
6. Sends transactional "order created" email.

Order/payment state machine lives in `ordenes` + `pagos` + `pagos_eventos` tables, created by `supabase/migrations/20260317121500_checkout_orders_payments.sql`. The MercadoPago webhook (`/api/webhooks/mercadopago`) updates `pagos`/`ordenes` and validates `x-signature` using `MERCADOPAGO_WEBHOOK_SECRET` and `MERCADOPAGO_WEBHOOK_TOLERANCE_MS`.

### Database & migrations

SQL migrations live in `supabase/migrations/` and must be applied in order. Generated DB types are referenced from `@/types/database/database.types`; `PublicTableName`, `TableRow`, `TableInsert`, `TableUpdate`, `TableFilters`, `DatabaseClient` are the types repositories generalize over.

External setup (Google OAuth, email OTP templates, MercadoPago `notification_url`, bank-transfer env vars, the `payment-receipts` private storage bucket) is documented in `docs/auth-payments-setup.md`. Do not assume these are auto-configured in a fresh project.

## Conventions

- **Internal code is English; database is Spanish.** Domain folders under `src/{controllers,services,repositories,exceptions,types}` use English kebab-case (`packages`, `orders`, `reservations`, `users`, `contact-requests`, etc.). The Supabase tables they read/write remain Spanish (`paquetes`, `ordenes`, `reservas`, `usuarios`, `solicitudes_contacto`, ...) and column names stay Spanish snake_case (`nombre`, `descripcion`, `paquete_id`). Repositories bridge the two: `BaseRepository<"paquetes">` typed against the Spanish table key.
- **URL paths are Spanish.** App router routes under `src/app/` and component folders under `src/components/` keep their Spanish names (`/paquetes`, `/experiencias`, `/hoteleria`, `/mis-reservas`) — these are public contract and SEO-sensitive.
- **MercadoPago is a proper noun.** Never translate `MercadoPago`, `mercadopago` (slug), or related identifiers (`MercadoPagoCheckoutProService`, `getMercadoPagoConfig`, etc.).
- **Two payment layers, distinct names.** `src/{controllers,services,repositories,exceptions,types}/payments/` is the CRUD layer over the `pagos` table (classes: `PaymentsService`, `PaymentsRepository`, `PaymentsRow`). `src/{...}/payment-processing/` is the orchestrator that dispatches to MercadoPago / bank-transfer / cash-local gateways (classes: `PaymentProcessingService`, `PaymentProcessingRepository`).
- Files inside a domain folder are named `<domain>.<layer>.ts` (e.g. `packages.controller.ts`, `packages.service.ts`). Each domain has its own exception module `<domain>.exceptions.ts` exporting validation/service/repository exception classes.
- `src/controllers/index.ts` re-exports every controller; add new controllers there.
- API routes always validate with Zod before invoking a controller, and translate exceptions to status codes (`AuthenticationException → 401`, `ValidationException / ZodError → 400`, `ServiceException → 500`).
- Light mode only — recent commits explicitly removed dark-mode classes; do not reintroduce `dark:` variants unless asked.
- Never import `admin-client.ts` from client components or non-API server code; it uses the service role key.
