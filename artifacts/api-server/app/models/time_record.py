import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    DateTime,
    Enum as SqlEnum,
    Float,
    ForeignKey,
    ForeignKeyConstraint,
    Index,
    String,
    UniqueConstraint,
    Uuid,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.enums import FacialVerificationStatus, RecordType


class TimeRecord(Base):
    __tablename__ = "time_records"
    __table_args__ = (
        UniqueConstraint(
            "tenant_id",
            "client_record_id",
            name="uq_time_records_tenant_client_record",
        ),
        ForeignKeyConstraint(
            ["tenant_id", "employee_id"],
            ["employees.tenant_id", "employees.employee_id"],
            ondelete="RESTRICT",
            name="fk_time_records_tenant_employee",
        ),
        CheckConstraint("latitude >= -90 AND latitude <= 90", name="ck_time_latitude"),
        CheckConstraint("longitude >= -180 AND longitude <= 180", name="ck_time_longitude"),
        Index("ix_time_records_tenant_server_timestamp", "tenant_id", "server_timestamp"),
    )

    record_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey("tenants.tenant_id", ondelete="CASCADE"),
        nullable=False,
    )
    employee_id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), nullable=False)
    client_record_id: Mapped[uuid.UUID | None] = mapped_column(Uuid(as_uuid=True))
    record_type: Mapped[RecordType] = mapped_column(
        SqlEnum(
            RecordType,
            name="time_record_type",
            values_callable=lambda enum_type: [item.value for item in enum_type],
        ),
        nullable=False,
    )
    client_timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    server_timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )
    offline_created_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    sync_timestamp: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    is_synced: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    hash_signature: Mapped[str] = mapped_column(String(64), nullable=False, unique=True)
    receipt_signature: Mapped[str] = mapped_column(String(64), nullable=False)
    facial_verification_status: Mapped[FacialVerificationStatus] = mapped_column(
        SqlEnum(
            FacialVerificationStatus,
            name="record_facial_verification_status",
            values_callable=lambda enum_type: [item.value for item in enum_type],
        ),
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )