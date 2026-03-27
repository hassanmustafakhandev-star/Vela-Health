from google.cloud import firestore as fs
from core.firebase import get_db
from datetime import datetime


# ─── Users ────────────────────────────────────────────────────────────────────

def get_user(uid: str) -> dict | None:
    db = get_db()
    doc = db.collection("users").document(uid).get()
    return doc.to_dict() if doc.exists else None


def create_user(uid: str, data: dict) -> dict:
    db = get_db()
    db.collection("users").document(uid).set({
        **data,
        "created_at": fs.SERVER_TIMESTAMP,
        "updated_at": fs.SERVER_TIMESTAMP
    })
    return data


def update_user(uid: str, data: dict):
    db = get_db()
    db.collection("users").document(uid).update({
        **data,
        "updated_at": fs.SERVER_TIMESTAMP
    })


# ─── Doctors ──────────────────────────────────────────────────────────────────

def get_doctor(uid: str) -> dict | None:
    db = get_db()
    doc = db.collection("doctors").document(uid).get()
    return {"id": doc.id, **doc.to_dict()} if doc.exists else None


def create_doctor(uid: str, data: dict) -> str:
    db = get_db()
    db.collection("doctors").document(uid).set({
        **data,
        "created_at": fs.SERVER_TIMESTAMP,
        "updated_at": fs.SERVER_TIMESTAMP
    })
    return uid


# ─── Appointments ─────────────────────────────────────────────────────────────

def create_appointment(data: dict) -> str:
    db = get_db()
    ref = db.collection("appointments").document()
    ref.set({**data, "created_at": fs.SERVER_TIMESTAMP})
    return ref.id


def get_appointment(appt_id: str) -> dict | None:
    db = get_db()
    doc = db.collection("appointments").document(appt_id).get()
    return {"id": doc.id, **doc.to_dict()} if doc.exists else None


def update_appointment(appt_id: str, data: dict):
    db = get_db()
    db.collection("appointments").document(appt_id).update({
        **data,
        "updated_at": fs.SERVER_TIMESTAMP
    })


# ─── Prescriptions ────────────────────────────────────────────────────────────

def create_prescription(data: dict) -> str:
    db = get_db()
    ref = db.collection("prescriptions").document()
    ref.set({**data, "created_at": fs.SERVER_TIMESTAMP})
    return ref.id


def get_prescription(rx_id: str) -> dict | None:
    db = get_db()
    doc = db.collection("prescriptions").document(rx_id).get()
    return {"id": doc.id, **doc.to_dict()} if doc.exists else None


# ─── AI Rate Limiting ─────────────────────────────────────────────────────────

def get_ai_usage_today(uid: str) -> int:
    db = get_db()
    today = datetime.today().date().isoformat()
    ref = db.collection("rate_limits").document(f"{uid}_{today}")
    doc = ref.get()
    return doc.to_dict().get("count", 0) if doc.exists else 0


def increment_ai_usage(uid: str):
    db = get_db()
    today = datetime.today().date().isoformat()
    ref = db.collection("rate_limits").document(f"{uid}_{today}")
    doc = ref.get()
    count = doc.to_dict().get("count", 0) if doc.exists else 0
    ref.set({"count": count + 1, "date": today}, merge=True)
