from enum import Enum


class RecordType(str, Enum):
    ENTRADA_1 = "ENTRADA_1"
    SAIDA_1 = "SAIDA_1"
    ENTRADA_2 = "ENTRADA_2"
    SAIDA_2 = "SAIDA_2"


class FacialVerificationStatus(str, Enum):
    VERIFIED = "verified"
    REJECTED = "rejected"
    NOT_CONFIGURED = "not_configured"