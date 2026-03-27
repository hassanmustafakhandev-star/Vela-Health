import os
import firebase_admin
from firebase_admin import credentials, firestore, storage
from core.config import settings

_initialized = False
db = None
bucket = None


def init_firebase():
    global _initialized, db, bucket
    if _initialized:
        return

    try:
        if settings.firebase_service_account_path and os.path.exists(settings.firebase_service_account_path):
            cred = credentials.Certificate(settings.firebase_service_account_path)
        elif settings.firebase_private_key and settings.firebase_client_email:
            # Fallback to env vars if file doesn't exist
            cred = credentials.Certificate({
                "type": "service_account",
                "project_id": settings.firebase_project_id,
                "private_key": settings.firebase_private_key.replace("\\n", "\n"),
                "client_email": settings.firebase_client_email,
                "token_uri": "https://oauth2.googleapis.com/token",
            })
        else:
            print("[WARN] Firebase credentials not found")
            _initialized = True
            return
        firebase_admin.initialize_app(cred, {
            "storageBucket": settings.firebase_storage_bucket
        })
        db = firestore.client()
        bucket = storage.bucket()
        _initialized = True
        print("[INFO] Firebase initialized")
    except Exception as e:
        print(f"[ERROR] Firebase init failed: {e}")
        _initialized = True


def get_db():
    if db is None:
        raise RuntimeError("Firebase not initialized or credentials missing")
    return db


def get_bucket():
    if bucket is None:
        raise RuntimeError("Firebase Storage not initialized")
    return bucket
