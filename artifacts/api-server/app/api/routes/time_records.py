from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import CurrentUser, get_current_user
from app.db.session import get_db
from app.schemas.time_records import (
    OfflineSyncRequest,
    SyncResponse,
    TimeRecordCreate,
    TimeRecordResponse,
)
from app.services.time_records import create_record, sync_offline_records

router = APIRouter()


@router.post("", response_model=TimeRecordResponse, status_code=status.HTTP_201_CREATED)
async def create_time_record(
    payload: TimeRecordCreate,
    user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
) -> TimeRecordResponse:
    try:
        record = await create_record(session, payload, user)
        await session.commit()
        return TimeRecordResponse.from_record(record)
    except HTTPException:
        await session.rollback()
        raise
    except Exception:
        await session.rollback()
        raise


@router.post("/sync", response_model=SyncResponse)
async def sync_time_records(
    payload: OfflineSyncRequest,
    user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
) -> SyncResponse:
    try:
        records, already_synced_count = await sync_offline_records(
            session,
            payload.records,
            user,
        )
        await session.commit()
        return SyncResponse(
            accepted_count=len(records) - already_synced_count,
            already_synced_count=already_synced_count,
            records=[TimeRecordResponse.from_record(record) for record in records],
        )
    except HTTPException:
        await session.rollback()
        raise
    except Exception:
        await session.rollback()
        raise