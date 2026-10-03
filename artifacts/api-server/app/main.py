from contextlib import asynccontextmanager
from collections.abc import AsyncIterator

from fastapi import FastAPI

from app.api.router import api_router
from app.api.routes.health import router as health_router
from app.core.config import get_settings
from app.db.session import engine


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    yield
    await engine.dispose()


settings = get_settings()
app = FastAPI(
    title="Time Tracking API",
    version="0.1.0",
    description="Multi-tenant time tracking API scaffold.",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
    redoc_url="/api/redoc",
    lifespan=lifespan,
)
app.include_router(api_router, prefix="/api/v1")
app.include_router(health_router, prefix="/api")