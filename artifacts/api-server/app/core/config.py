from functools import lru_cache

from pydantic import SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy.engine import make_url


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    database_url: str
    session_secret: SecretStr
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    debug: bool = False

    @field_validator("database_url", mode="before")
    @classmethod
    def normalize_database_url(cls, value: str) -> str:
        if not value:
            raise ValueError("DATABASE_URL is required.")
        if not value.startswith(("postgres://", "postgresql://", "postgresql+asyncpg://")):
            raise ValueError("DATABASE_URL must use PostgreSQL.")

        url = make_url(value)
        query = dict(url.query)
        sslmode = query.pop("sslmode", None)
        if sslmode is not None:
            query["ssl"] = {
                "disable": "disable",
                "allow": "allow",
                "prefer": "prefer",
                "require": "require",
                "verify-ca": "verify-ca",
                "verify-full": "verify-full",
            }.get(str(sslmode).lower(), str(sslmode))

        return url.set(
            drivername="postgresql+asyncpg",
            query=query,
        ).render_as_string(hide_password=False)

    @field_validator("session_secret")
    @classmethod
    def validate_session_secret(cls, value: SecretStr) -> SecretStr:
        if len(value.get_secret_value()) < 32:
            raise ValueError("SESSION_SECRET must contain at least 32 characters.")
        return value

    @field_validator("access_token_expire_minutes")
    @classmethod
    def validate_token_lifetime(cls, value: int) -> int:
        if value < 1 or value > 1440:
            raise ValueError("ACCESS_TOKEN_EXPIRE_MINUTES must be between 1 and 1440.")
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()