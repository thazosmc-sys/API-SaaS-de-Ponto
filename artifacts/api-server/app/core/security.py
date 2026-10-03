from datetime import datetime, timedelta, timezone
from typing import Any

import jwt
from pwdlib import PasswordHash

from app.core.config import get_settings
from app.models.user import User

password_hasher = PasswordHash.recommended()


def hash_password(password: str) -> str:
    return password_hasher.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return password_hasher.verify(password, password_hash)
    except (ValueError, TypeError):
        return False


def create_access_token(user: User) -> str:
    settings = get_settings()
    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(minutes=settings.access_token_expire_minutes)
    claims: dict[str, Any] = {
        "sub": str(user.user_id),
        "user_id": str(user.user_id),
        "tenant_id": str(user.tenant_id),
        "iat": now,
        "exp": expires_at,
        "type": "access",
    }
    return jwt.encode(
        claims,
        settings.session_secret.get_secret_value(),
        algorithm=settings.jwt_algorithm,
    )