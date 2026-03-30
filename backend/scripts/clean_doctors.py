import os
import sys

# Backend package root (parent of scripts/)
_BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Settings loads ".env" relative to cwd — must run as if cwd is backend/
os.chdir(_BACKEND_DIR)
sys.path.insert(0, _BACKEND_DIR)

from firebase_admin import auth as firebase_auth
from core.config import settings
from core.firebase import init_firebase, get_db


def delete_all_doctors():
    print("=" * 60)
    print("DELETING ALL REGISTERED DOCTOR ACCOUNTS")
    print("=" * 60)

    init_firebase()
    # Must match the Firebase project your running API uses (see backend/.env).
    print(f"[INFO] Target Firestore project_id: {settings.firebase_project_id}")
    db = get_db()

    doctor_docs = list(db.collection("doctors").stream())
    deleted = 0

    for doctor_doc in doctor_docs:
        uid = doctor_doc.id
        doctor_data = doctor_doc.to_dict() or {}
        email = doctor_data.get("email", "unknown")
        status = doctor_data.get("status", "unknown")

        print(f"[DELETE] doctor uid={uid} email={email} status={status}")

        # Delete auth account (if exists)
        try:
            firebase_auth.delete_user(uid)
            print("  - removed from Firebase Auth")
        except firebase_auth.UserNotFoundError:
            print("  - auth user not found, continuing")
        except Exception as exc:
            print(f"  - auth delete failed: {exc}")

        # Delete doctor document
        db.collection("doctors").document(uid).delete()
        print("  - removed from doctors collection")

        # Delete user identity document (doctor account record)
        db.collection("users").document(uid).delete()
        print("  - removed from users collection")

        deleted += 1

    print("=" * 60)
    print(f"DONE: deleted {deleted} doctor account(s)")
    print("=" * 60)


if __name__ == "__main__":
    delete_all_doctors()
