from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.enums import FacialVerificationStatus, RecordType


class TimeRecordFields(BaseModel):
    employee_id: UUID
    record_type: RecordType
    client_timestamp: datetime
    latitude: float = Field(ge=-90, le=90, allow_inf_nan=False)
    longitude: float = Field(ge=-180, le=180, allow_inf_nan=False)
    photo_base64: str = Field(min_length=1, max_length=7_000_000)

    @field_validator("client_timestamp")
    @classmethod
    def require_timezone_aware_client_timestamp(cls, value: datetime) -> datetime:
        if value.tzinfo is None or value.utcoffset() is None:
            raise ValueError("client_timestamp must include a timezone.")
        return value


class TimeRecordCreate(TimeRecordFields):
    pass


class OfflineRecordCreate(TimeRecordFields):
    client_record_id: UUID
    offline_created_at: datetime

    @field_validator("offline_created_at")
    @classmethod
    def require_timezone_aware_offline_timestamp(cls, value: datetime) -> datetime:
        if value.tzinfo is None or value.utcoffset() is None:
            raise ValueError("offline_created_at must include a timezone.")
        return value


class OfflineSyncRequest(BaseModel):
    records: list[OfflineRecordCreate] = Field(min_length=1, max_length=100)


class TimeRecordResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    record_id: UUID
    tenant_id: UUID
    employee_id: UUID
    client_record_id: UUID | None
    record_type: RecordType
    client_timestamp: datetime
    server_timestamp: datetime
    offline_created_at: datetime | None
    sync_timestamp: datetime | None
    is_synced: bool
    latitude: float
    longitude: float
    hash_signature: str
    receipt_signature: str
    facial_verification_status: FacialVerificationStatus

    @classmethod
    def from_record(cls, record: object) -> "TimeRecordResponse":
        return cls.model_validate(record)


class SyncResponse(BaseModel):
    accepted_count: int
    already_synced_count: int
    records: list[TimeRecordResponse]