import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    Enum as SqlEnum,
    Float,
    ForeignKey,
    ForeignKeyConstraint,
    String,
    UniqueConstraint,
    Uuid,
)
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.enums import FacialVerificationStatus


class FacialTemplate(Base):
    __tablename__ = "facial_templates"
    __table_args__ = (
        UniqueConstraint(
            "tenant_id",
            "template_id",
            name="uq_facial_templates_tenant_template",
        ),
        CheckConstraint(
            "array_length(embedding, 1) = 512",
            name="ck_facial_templates_embedding_512",
        ),
        ForeignKeyConstraint(
            ["tenant_id", "employee_id"],
            ["employees.tenant_id", "employees.employee_id"],
            ondelete="CASCADE",
            name="fk_facial_templates_tenant_employee",
        ),
    )

    template_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey("tenants.tenant_id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    employee_id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), nullable=False)
    embedding: Mapped[list[float]] = mapped_column(
        ARRAY(Float, dimensions=1),
        nullable=False,
    )
    is_active: Mapped[bool] = mapped_column(nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )


class FacialVerification(Base):
    __tablename__ = "facial_verifications"
    __table_args__ = (
        ForeignKeyConstraint(
            ["tenant_id", "employee_id"],
            ["employees.tenant_id", "employees.employee_id"],
            ondelete="CASCADE",
            name="fk_facial_verifications_tenant_employee",
        ),
        ForeignKeyConstraint(
            ["tenant_id", "template_id"],
            ["facial_templates.tenant_id", "facial_templates.template_id"],
            ondelete="RESTRICT",
            name="fk_facial_verifications_tenant_template",
        ),
    )

    verification_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey("tenants.tenant_id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    employee_id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), nullable=False)
    template_id: Mapped[uuid.UUID | None] = mapped_column(Uuid(as_uuid=True))
    status: Mapped[FacialVerificationStatus] = mapped_column(
        SqlEnum(
            FacialVerificationStatus,
            name="facial_verification_status",
            values_callable=lambda enum_type: [item.value for item in enum_type],
        ),
        nullable=False,
    )
    similarity_score: Mapped[float | None] = mapped_column(Float)
    provider_name: Mapped[str] = mapped_column(String(100), nullable=False)
    verified_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )