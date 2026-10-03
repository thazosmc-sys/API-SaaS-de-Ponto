from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import CurrentUser
from app.models.audit_log import AuditLog
from app.models.employee import Employee
from app.models.enums import FacialVerificationStatus, RecordType
from app.models.facial import FacialVerification
from app.models.time_record import TimeRecord
from app.schemas.time_records import OfflineRecordCreate, TimeRecordCreate
from app.services.face_recognition import face_recognition_provider
from app.services.images import InvalidPhotoError, decode_photo
from app.services.receipts import build_record_digest, sign_receipt


def _record_payload_values(
    *,
    tenant_id: UUID,
    employee_id: UUID,
    record_type: RecordType,
    client_timestamp: datetime,
    server_timestamp: datetime,
    offline_created_at: datetime | None,
    latitude: float,
    longitude: float,
    client_record_id: UUID | None,
) -> dict[str, object]:
    return {
        "tenant_id": str(tenant_id),
        "employee_id": str(employee_id),
        "record_type": record_type.value,
        "client_timestamp": client_timestamp.isoformat(),
        "server_timestamp": server_timestamp.isoformat(),
        "offline_created_at": (
            offline_created_at.isoformat() if offline_created_at is not None else None
        ),
        "latitude": latitude,
        "longitude": longitude,
        "client_record_id": str(client_record_id) if client_record_id else None,
    }


async def _create_record(
    session: AsyncSession,
    payload: TimeRecordCreate | OfflineRecordCreate,
    user: CurrentUser,
    *,
    offline_created_at: datetime | None = None,
    client_record_id: UUID | None = None,
) -> TimeRecord:
    employee = await session.scalar(
        select(Employee).where(
            Employee.tenant_id == user.tenant_id,
            Employee.employee_id == payload.employee_id,
            Employee.is_active.is_(True),
        )
    )
    if employee is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Active employee not found in this tenant.",
        )

    try:
        photo_bytes = decode_photo(payload.photo_base64)
    except InvalidPhotoError as error:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(error)) from error

    verification = await face_recognition_provider.verify(
        tenant_id=user.tenant_id,
        employee_id=employee.employee_id,
        photo_bytes=photo_bytes,
    )
    if verification.status == FacialVerificationStatus.REJECTED:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Facial verification failed; no time record was created.",
        )

    server_timestamp = datetime.now(timezone.utc)
    digest = build_record_digest(
        tenant_id=user.tenant_id,
        employee_id=employee.employee_id,
        record_type=payload.record_type.value,
        client_timestamp=payload.client_timestamp,
        server_timestamp=server_timestamp,
        offline_created_at=offline_created_at,
        latitude=payload.latitude,
        longitude=payload.longitude,
        client_record_id=client_record_id,
    )
    receipt_signature = sign_receipt(digest)
    record = TimeRecord(
        tenant_id=user.tenant_id,
        employee_id=employee.employee_id,
        client_record_id=client_record_id,
        record_type=payload.record_type,
        client_timestamp=payload.client_timestamp,
        server_timestamp=server_timestamp,
        offline_created_at=offline_created_at,
        sync_timestamp=server_timestamp,
        is_synced=True,
        latitude=payload.latitude,
        longitude=payload.longitude,
        hash_signature=digest,
        receipt_signature=receipt_signature,
        facial_verification_status=verification.status,
    )
    session.add(record)
    await session.flush()

    session.add(
        FacialVerification(
            tenant_id=user.tenant_id,
            employee_id=employee.employee_id,
            template_id=verification.template_id,
            status=verification.status,
            similarity_score=verification.similarity_score,
            provider_name=verification.provider_name,
        )
    )
    session.add(
        AuditLog(
            tenant_id=user.tenant_id,
            actor_user_id=user.user_id,
            action="time_record.created",
            entity_type="time_record",
            entity_id=str(record.record_id),
            new_values=_record_payload_values(
                tenant_id=user.tenant_id,
                employee_id=employee.employee_id,
                record_type=payload.record_type,
                client_timestamp=payload.client_timestamp,
                server_timestamp=server_timestamp,
                offline_created_at=offline_created_at,
                latitude=payload.latitude,
                longitude=payload.longitude,
                client_record_id=client_record_id,
            )
            | {
                "hash_signature": digest,
                "facial_verification_status": verification.status.value,
            },
        )
    )
    await session.flush()
    return record


async def create_record(
    session: AsyncSession,
    payload: TimeRecordCreate,
    user: CurrentUser,
) -> TimeRecord:
    return await _create_record(session, payload, user)


async def sync_offline_records(
    session: AsyncSession,
    payloads: list[OfflineRecordCreate],
    user: CurrentUser,
) -> tuple[list[TimeRecord], int]:
    client_ids = [payload.client_record_id for payload in payloads]
    if len(client_ids) != len(set(client_ids)):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Each offline record in a sync request must have a unique client_record_id.",
        )

    results: list[TimeRecord] = []
    already_synced_count = 0
    for payload in payloads:
        existing = await session.scalar(
            select(TimeRecord).where(
                TimeRecord.tenant_id == user.tenant_id,
                TimeRecord.client_record_id == payload.client_record_id,
            )
        )
        if existing is not None:
            same_record = (
                existing.employee_id == payload.employee_id
                and existing.record_type == payload.record_type
                and existing.client_timestamp == payload.client_timestamp
                and existing.offline_created_at == payload.offline_created_at
                and existing.latitude == payload.latitude
                and existing.longitude == payload.longitude
            )
            if not same_record:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"client_record_id {payload.client_record_id} was already used for different data.",
                )
            results.append(existing)
            already_synced_count += 1
            continue

        record = await _create_record(
            session,
            payload,
            user,
            offline_created_at=payload.offline_created_at,
            client_record_id=payload.client_record_id,
        )
        results.append(record)

    return results, already_synced_count