# SaaS de Controle de Ponto

API multi-tenant para controle de ponto, construída com FastAPI, PostgreSQL e SQLAlchemy assíncrono.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (Replit sets `PORT`)
- `pnpm --filter @workspace/api-server run init-db` — create initial development tables
- `pnpm --filter @workspace/api-server run bootstrap-admin` — create the first tenant administrator
- `pnpm --filter @workspace/api-server run check:python` — check Python syntax
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL`, `SESSION_SECRET` (at least 32 characters)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9, Python 3.12
- API: FastAPI, Pydantic v2
- API DB: PostgreSQL + SQLAlchemy 2 async + asyncpg
- Existing shared DB library: Drizzle ORM
- API codegen: Orval (from OpenAPI spec)
- Password hashing: Argon2 via pwdlib; JWT via PyJWT

## Where things live

- `artifacts/api-server/app/api` — API routes and authentication dependencies
- `artifacts/api-server/app/core` — settings, password hashing, JWT
- `artifacts/api-server/app/db` — async database sessions and development initialization
- `artifacts/api-server/app/models` — tenant-scoped SQLAlchemy entities
- `artifacts/api-server/app/schemas` — Pydantic v2 request and response schemas
- `artifacts/api-server/app/services` — time-record, image, receipt, and face-provider logic
- `artifacts/api-server/main.py` — FastAPI entry point

## Architecture decisions

- Every protected lookup scopes records by the authenticated `tenant_id`.
- The API's explicit `init-db` command is for a fresh development database; it is not a production migration system.
- Face recognition is an injected provider boundary. The default returns `not_configured`; it does not claim to verify identity.

## Product

Tenant-scoped login, individual and offline time records, GPS validation, hashed records, and signed receipts. Biometric matching requires a real provider before records can be called face-verified.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Create development tables before creating the first administrator.
- Photos are validated and passed to the biometric provider but are not persisted.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
