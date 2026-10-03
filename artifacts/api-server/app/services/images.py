import base64
import binascii

MAX_PHOTO_BYTES = 5 * 1024 * 1024
JPEG_SIGNATURE = b"\xff\xd8\xff"
PNG_SIGNATURE = b"\x89PNG\r\n\x1a\n"


class InvalidPhotoError(ValueError):
    pass


def decode_photo(photo_base64: str) -> bytes:
    declared_mime: str | None = None
    encoded = photo_base64.strip()
    if encoded.startswith("data:"):
        try:
            header, encoded = encoded.split(",", 1)
            declared_mime = header.split(";", 1)[0].removeprefix("data:")
        except ValueError as error:
            raise InvalidPhotoError("Photo data URI is malformed.") from error
        if declared_mime not in {"image/jpeg", "image/png"}:
            raise InvalidPhotoError("Only JPEG and PNG photos are accepted.")

    if len(encoded) > ((MAX_PHOTO_BYTES + 2) // 3) * 4:
        raise InvalidPhotoError("Photo exceeds the 5 MB size limit.")

    try:
        photo = base64.b64decode(encoded, validate=True)
    except (binascii.Error, ValueError) as error:
        raise InvalidPhotoError("Photo must be valid base64.") from error

    if not photo or len(photo) > MAX_PHOTO_BYTES:
        raise InvalidPhotoError("Photo is empty or exceeds the 5 MB size limit.")

    if photo.startswith(JPEG_SIGNATURE):
        actual_mime = "image/jpeg"
    elif photo.startswith(PNG_SIGNATURE):
        actual_mime = "image/png"
    else:
        raise InvalidPhotoError("Photo content must be a JPEG or PNG image.")

    if declared_mime is not None and declared_mime != actual_mime:
        raise InvalidPhotoError("Photo data URI content type does not match the image.")
    return photo