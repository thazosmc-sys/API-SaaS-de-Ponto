import asyncio

from app.db.base import Base
from app.db.session import engine
from app import models  # noqa: F401 - register all ORM models on Base.metadata


async def initialize_database() -> None:
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)


if __name__ == "__main__":
    asyncio.run(initialize_database())
    print("Database tables created or already present.")