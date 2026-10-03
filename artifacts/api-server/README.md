# Time Tracking API

Async FastAPI scaffold for a PostgreSQL-backed, multi-tenant time and attendance service.

## Run in Replit

The API uses the project's `DATABASE_URL` and `SESSION_SECRET` environment variables.
`SESSION_SECRET` must contain at least 32 characters. Do not commit credentials to this
repository.

1. Create the initial development tables:

   ```sh
   pnpm --filter @workspace/api-server run init-db
   ```

2. Create the first tenant administrator (the password prompt is hidden):

   ```sh
   pnpm --filter @workspace/api-server run bootstrap-admin
   ```

3. Start the API using the existing Replit API Server workflow, or run:

   ```sh
   pnpm --filter @workspace/api-server run dev
   ```

The health endpoint is `/api/healthz`; OpenAPI docs are at `/api/docs`; versioned
routes are under `/api/v1`.

`init-db` uses SQLAlchemy `create_all` for a fresh development database. It does not
upgrade existing schemas. Add and apply versioned migrations before changing a
production schema.

## Implemented routes

- `POST /api/v1/auth/login` — tenant-scoped email/password login; returns a JWT with
  `tenant_id` and `user_id`.
- `POST /api/v1/time-records` — authenticated record creation with coordinate checks,
  server time, a SHA-256 record digest, and an HMAC-signed receipt.
- `POST /api/v1/time-records/sync` — authenticated, atomic batches of offline entries;
  retries with the same client ID and data are idempotent.

All record and employee lookups are scoped to the authenticated tenant. Offline sync
accepts at most 100 records per batch.

## Facial recognition boundary

The data models support 512-value PostgreSQL float arrays and record verification
outcomes. Photos are restricted to JPEG/PNG, capped at 5 MB, validated, passed to the
provider interface, and not stored. The default provider is deliberately marked
`not_configured`; it does not claim to recognize a face. Connect and validate a real
biometric provider before treating a saved record as facially verified.

## Main folders

- `app/api` — versioned API routes and authentication dependencies
- `app/core` — settings, password hashing, JWT security
- `app/db` — async SQLAlchemy sessions and explicit development initialization
- `app/models` — tenant-scoped ORM entities
- `app/schemas` — Pydantic v2 request and response contracts
- `app/services` — record, receipt, image-validation, and face-provider logic