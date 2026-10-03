import hashlib
import hmac
import json
from datetime import datetime
from typing import Any
from uuid import UUID

from app.core.config import get_settings


def _timestamp(value: datetime | None) -> str | None:
    return value.isoformat() if value is not None else None


def build_record_digest(
    *,
    tenant_id: UUID,
    employee_id: UUID,
    record_type: str,
    client_timestamp: datetime,
    server_timestamp: datetime,
    offline_created_at: datetime | None,
    latitude: float,
    longitude: float,
    client_record_id: UUID | None,
) -> str:
    payload: dict[str, Any] = {
        "tenant_id": str(tenant_id),
        "employee_id": str(employee_id),
        "record_type": record_type,
        "client_timestamp": _timestamp(client_timestamp),
        "server_timestamp": _timestamp(server_timestamp),
        "offline_created_at": _timestamp(offline_created_at),
        "latitude": latitude,
        "longitude": longitude,
        "client_record_id": str(client_record_id) if client_record_id else None,
    }
    canonical = json.dumps(payload, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(canonical).hexdigest()


def sign_receipt(record_digest: str) -> str:
    root_key = get_settings().session_secret.get_secret_value().encode("utf-8")
    signing_key = hmac.new(root_key, b"time-record-receipt:v1", hashlib.sha256).digest()
    return hmac.new(signing_key, record_digest.encode("ascii"), hashlib.sha256).hexdigest()