from dataclasses import dataclass
from typing import Protocol
from uuid import UUID

from app.models.enums import FacialVerificationStatus


@dataclass(frozen=True)
class FaceVerificationResult:
    status: FacialVerificationStatus
    provider_name: str
    similarity_score: float | None = None
    template_id: UUID | None = None


class FaceRecognitionProvider(Protocol):
    async def verify(
        self,
        *,
        tenant_id: UUID,
        employee_id: UUID,
        photo_bytes: bytes,
    ) -> FaceVerificationResult: ...


class UnconfiguredFaceRecognitionProvider:
    """Explicit default until a real embedding and matching engine is connected."""

    async def verify(
        self,
        *,
        tenant_id: UUID,
        employee_id: UUID,
        photo_bytes: bytes,
    ) -> FaceVerificationResult:
        del tenant_id, employee_id, photo_bytes
        return FaceVerificationResult(
            status=FacialVerificationStatus.NOT_CONFIGURED,
            provider_name="unconfigured",
        )


face_recognition_provider: FaceRecognitionProvider = UnconfiguredFaceRecognitionProvider()