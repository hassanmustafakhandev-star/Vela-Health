from core.firebase import get_bucket
import datetime


def upload_file(file_bytes: bytes, path: str, content_type: str = "application/octet-stream") -> str:
    """Upload file to Firebase Storage and return public URL"""
    bucket = get_bucket()
    blob = bucket.blob(path)
    blob.upload_from_string(file_bytes, content_type=content_type)
    blob.make_public()
    return blob.public_url


def upload_pdf(pdf_bytes: bytes, path: str) -> str:
    """Upload a PDF to Firebase Storage"""
    return upload_file(pdf_bytes, path, content_type="application/pdf")


def upload_image(image_bytes: bytes, path: str) -> str:
    """Upload an image to Firebase Storage"""
    return upload_file(image_bytes, path, content_type="image/jpeg")


def get_signed_url(path: str, expiry_hours: int = 1) -> str:
    """Return a time-limited signed URL for private files (e.g. prescriptions)"""
    bucket = get_bucket()
    blob = bucket.blob(path)
    url = blob.generate_signed_url(
        expiration=datetime.timedelta(hours=expiry_hours),
        method="GET"
    )
    return url


def delete_file(path: str):
    """Delete a file from Firebase Storage"""
    bucket = get_bucket()
    blob = bucket.blob(path)
    blob.delete()
