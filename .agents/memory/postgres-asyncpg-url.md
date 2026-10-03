---
name: Asyncpg URL TLS
description: Compatibility rule for PostgreSQL connection strings used with SQLAlchemy's asyncpg driver.
---

When converting a PostgreSQL URL to the `postgresql+asyncpg` dialect, translate its `sslmode` query parameter to the `ssl` parameter that asyncpg accepts. SQLAlchemy forwards an unconverted `sslmode` as a driver keyword and asyncpg raises a `TypeError`.

**Why:** Replit's managed PostgreSQL connection URL can include `sslmode`, which prevents an otherwise healthy FastAPI service from connecting.

**How to apply:** Normalize the URL before creating the async engine; never print the URL because it contains credentials.