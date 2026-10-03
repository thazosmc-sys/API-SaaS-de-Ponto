import asyncio
from getpass import getpass
from uuid import uuid4

from app.core.security import hash_password
from app.db.session import async_session_factory
from app.models.tenant import Tenant
from app.models.user import User


async def bootstrap_admin() -> None:
    tenant_name = input("Organization name: ").strip()
    email = input("Admin email: ").strip().lower()
    cpf = input("Admin CPF: ").strip()
    password = getpass("Admin password: ")
    confirmation = getpass("Confirm password: ")

    if not tenant_name or not email or not cpf:
        raise SystemExit("Organization name, email, and CPF are required.")
    if len(password) < 12:
        raise SystemExit("Use an admin password with at least 12 characters.")
    if password != confirmation:
        raise SystemExit("Passwords do not match.")

    async with async_session_factory() as session:
        tenant_id = uuid4()
        session.add(Tenant(tenant_id=tenant_id, name=tenant_name))
        session.add(
            User(
                tenant_id=tenant_id,
                email=email,
                cpf=cpf,
                password_hash=hash_password(password),
                is_active=True,
            )
        )
        await session.commit()

    print(f"Admin account created for tenant_id={tenant_id}.")


if __name__ == "__main__":
    asyncio.run(bootstrap_admin())