from fastapi import APIRouter, Depends, HTTPException
from firebase_admin import auth as firebase_auth, firestore
from google.cloud.firestore_v1.base_query import FieldFilter
from middleware.auth import get_current_user
from middleware.role_guard import require_role
from core.firebase import get_db

router = APIRouter(tags=["Admin"])


@router.get("/stats")
async def get_admin_stats(admin: dict = Depends(require_role("admin"))):
    """Real-time platform telemetry for the Admin Dashboard"""
    db = get_db()
    
    # Count total patients using aggregation query
    patients_count_query = db.collection("users").where(filter=FieldFilter("role", "==", "patient")).count()
    patients_count_result = patients_count_query.get()
    total_patients = patients_count_result[0][0].value

    # Count all doctors
    all_doctors_query = db.collection("doctors").count()
    all_doctors_result = all_doctors_query.get()
    total_doctors = all_doctors_result[0][0].value
    
    # Count pending verifications
    pending_query = db.collection("doctors").where(filter=FieldFilter("status", "==", "pending")).count()
    pending_result = pending_query.get()
    pending_count = pending_result[0][0].value

    # active doctors
    active_count = total_doctors - pending_count

    # Count total appointments
    appointments_query = db.collection("appointments").count()
    appointments_result = appointments_query.get()
    total_appointments = appointments_result[0][0].value

    # Count today's appointments
    from datetime import date
    today_str = date.today().isoformat()
    todays_appointments_query = db.collection("appointments").where(filter=FieldFilter("date", "==", today_str)).count()
    todays_appointments_result = todays_appointments_query.get()
    todays_appointments_count = todays_appointments_result[0][0].value

    return {
        "total_patients": total_patients,
        "total_doctors": total_doctors,
        "active_doctors": active_count,
        "pending_doctors": pending_count,
        "total_appointments": total_appointments,
        "todays_appointments": todays_appointments_count,
    }


@router.get("/doctors/pending")
async def get_pending_doctors(admin: dict = Depends(require_role("admin"))):
    """Admin endpoint to see the queue of medical applicants"""
    db = get_db()
    docs = db.collection("doctors").where(filter=FieldFilter("status", "==", "pending")).stream()
    return [{**d.to_dict(), "uid": d.id} for d in docs]


@router.get("/doctors/all")
async def get_all_doctors(admin: dict = Depends(require_role("admin"))):
    """Admin endpoint to see the full registry"""
    db = get_db()
    docs = db.collection("doctors").stream()
    return [{**d.to_dict(), "uid": d.id} for d in docs]


@router.get("/users")
async def get_all_users(admin: dict = Depends(require_role("admin"))):
    """Fetch full registry of all user identities"""
    db = get_db()
    docs = db.collection("users").stream()
    return [{**d.to_dict(), "uid": d.id} for d in docs]


@router.get("/users/{uid}")
async def get_user_detail(uid: str, admin: dict = Depends(require_role("admin"))):
    """Fetch a single user's full profile + family members"""
    db = get_db()
    user_doc = db.collection("users").document(uid).get()
    if not user_doc.exists:
        raise HTTPException(404, "User not found")
    
    family = list(db.collection("users").document(uid).collection("family").stream())
    records = list(db.collection("users").document(uid).collection("records").stream())
    
    return {
        "uid": uid,
        **user_doc.to_dict(),
        "family_count": len(family),
        "health_record_count": len(records),
    }


@router.delete("/users/{uid}")
async def delete_user(uid: str, admin: dict = Depends(require_role("admin"))):
    """Permanently remove a user account from the platform"""
    db = get_db()
    try:
        firebase_auth.delete_user(uid)
    except Exception:
        pass  # User might not exist in Firebase Auth
    db.collection("users").document(uid).delete()
    return {"uid": uid, "deleted": True}


@router.get("/appointments")
async def get_all_appointments(admin: dict = Depends(require_role("admin"))):
    """Platform-wide appointment registry for oversight"""
    db = get_db()
    docs = db.collection("appointments").order_by("created_at", direction=firestore.Query.DESCENDING).limit(100).stream()
    return [{**d.to_dict(), "id": d.id} for d in docs]


@router.put("/doctors/{uid}/suspend")
async def suspend_doctor(uid: str, admin: dict = Depends(require_role("admin"))):
    """Suspend a verified doctor account"""
    db = get_db()
    db.collection("doctors").document(uid).update({
        "status": "suspended",
        "updated_at": firestore.SERVER_TIMESTAMP
    })
    firebase_auth.set_custom_user_claims(uid, {"vela_role": "suspended"})
    return {"uid": uid, "status": "suspended"}


@router.put("/doctors/{uid}/reinstate")
async def reinstate_doctor(uid: str, admin: dict = Depends(require_role("admin"))):
    """Reinstate a suspended doctor"""
    db = get_db()
    db.collection("doctors").document(uid).update({
        "status": "verified",
        "updated_at": firestore.SERVER_TIMESTAMP
    })
    firebase_auth.set_custom_user_claims(uid, {"vela_role": "doctor"})
    return {"uid": uid, "status": "verified"}
