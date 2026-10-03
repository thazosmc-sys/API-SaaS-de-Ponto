from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import create_access_token, verify_password
from app.core.config import get_settings
from app.db.session import get_db
from app.models.tenant import Tenant
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse

router = APIRouter()


@router.post("/login", response_model=TokenResponse)
async def login(
    credentials: LoginRequest,
    session: AsyncSession = Depends(get_db),
) -> TokenResponse:
    tenant = await session.get(Tenant, credentials.tenant_id)
    user = await session.scalar(
        select(User).where(
            User.tenant_id == credentials.tenant_id,
            func.lower(User.email) == credentials.email.lower(),
        )
    )

    if (
        tenant is None
        or tenant.status != "active"
        or user is None
        or not user.is_active
        or not verify_password(credentials.password, user.password_hash)
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid tenant, email, or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return TokenResponse(
        access_token=create_access_token(user),
        expires_in_minutes=get_settings().access_token_expire_minutes,
    )