from dataclasses import dataclass
from uuid import UUID

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.db.session import get_db
from app.models.tenant import Tenant
from app.models.user import User

bearer_scheme = HTTPBearer(auto_error=False)


@dataclass(frozen=True)
class CurrentUser:
    user_id: UUID
    tenant_id: UUID


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    session: AsyncSession = Depends(get_db),
) -> CurrentUser:
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="A valid bearer token is required.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if credentials is None:
        raise unauthorized

    settings = get_settings()
    try:
        claims = jwt.decode(
            credentials.credentials,
            settings.session_secret.get_secret_value(),
            algorithms=[settings.jwt_algorithm],
            options={"require": ["exp", "iat", "sub", "tenant_id", "user_id"]},
        )
        user_id = UUID(claims["user_id"])
        tenant_id = UUID(claims["tenant_id"])
        if UUID(claims["sub"]) != user_id:
            raise unauthorized
    except (jwt.InvalidTokenError, KeyError, TypeError, ValueError):
        raise unauthorized from None

    user = await session.scalar(
        select(User).where(
            User.user_id == user_id,
            User.tenant_id == tenant_id,
            User.is_active.is_(True),
        )
    )
    tenant = await session.get(Tenant, tenant_id)
    if user is None or tenant is None or tenant.status != "active":
        raise unauthorized

    return CurrentUser(user_id=user_id, tenant_id=tenant_id)