from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from firebase_admin import auth as firebase_auth, firestore
from google.cloud.firestore_v1.base_query import FieldFilter
from middleware.auth import get_current_user
from middleware.role_guard import require_role
from core.firebase import get_db
from models.user import UserProfile
from models.doctor import DoctorCreate, DoctorVerification

router = APIRouter(tags=["Auth"])


@router.post("/verify")
async def verify_token(current_user: dict = Depends(get_current_user)):
    """
    Called by frontend after Firebase sign-in.
    Creates user doc if new user. Returns uid + role.
    Replaces: mock-token system in authStore.js
    """
    uid = current_user["uid"]
    db = get_db()
    user_ref = db.collection("users").document(uid)
    user_doc = user_ref.get()

    if not user_doc.exists:
        # New user — create Firestore document
        user_ref.set({
            "uid": uid,
            "email": current_user.get("email"),
            "phone": current_user.get("phone"),
            "role": "patient",
            "created_at": firestore.SERVER_TIMESTAMP,
            "updated_at": firestore.SERVER_TIMESTAMP
        })
        # Set Firebase custom claim for role-based access
        firebase_auth.set_custom_user_claims(uid, {"vela_role": "patient"})
        return {"uid": uid, "role": "patient", "is_new": True}

    data = user_doc.to_dict()
    role = data.get("role", "patient")

    # SELF-HEALING: If user is marked as patient/pending but has a verified doctor profile, heal them
    if role in ["patient", "pending_doctor"]:
        doctor_doc = db.collection("doctors").document(uid).get()
        if doctor_doc.exists:
            doctor_data = doctor_doc.to_dict()
            if doctor_data.get("status") == "verified":
                # Auto-sync roles across collections and claims
                db.collection("users").document(uid).update({
                    "role": "doctor",
                    "updated_at": firestore.SERVER_TIMESTAMP
                })
                firebase_auth.set_custom_user_claims(uid, {"vela_role": "doctor"})
                role = "doctor"
                print(f"Self-Healed identity for Doctor Node: {uid}")

    return {"uid": uid, "role": role, "is_new": False}


@router.put("/profile")
async def update_profile(
    profile: UserProfile,
    current_user: dict = Depends(get_current_user)
):
    """Update patient profile fields"""
    db = get_db()
    db.collection("users").document(current_user["uid"]).update({
        **profile.model_dump(exclude_none=True),
        "updated_at": firestore.SERVER_TIMESTAMP
    })
    return {"success": True}


@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get full user profile"""
    db = get_db()
    doc = db.collection("users").document(current_user["uid"]).get()
    if not doc.exists:
        raise HTTPException(404, "User not found")
    return {"uid": current_user["uid"], **doc.to_dict()}


@router.post("/doctor/register")
async def doctor_register(
    data: DoctorCreate,
    bg: BackgroundTasks,
    current_user: dict = Depends(get_current_user)
):
    """
    Doctor self-registration. Sets status=pending until admin verifies.
    Validates PMDC number format and uniqueness.
    """
    uid = current_user["uid"]
    db = get_db()

    # Check PMDC uniqueness
    existing = list(db.collection("doctors").where(filter=FieldFilter("pmdc_number", "==", data.pmdc_number)).stream())
    if existing:
        # Allow re-registration by same user
        if existing[0].id != uid:
            raise HTTPException(409, "PMDC number already registered with another account")

    # Create doctor document
    db.collection("doctors").document(uid).set({
        **data.model_dump(),
        "uid": uid,
        "status": "pending",
        "rating": 0.0,
        "total_reviews": 0,
        "available_now": False,
        "created_at": firestore.SERVER_TIMESTAMP,
        "updated_at": firestore.SERVER_TIMESTAMP
    })

    # Update user role to doctor in Firestore, but keep custom claims as pending
    db.collection("users").document(uid).update({
        "role": "doctor",
        "updated_at": firestore.SERVER_TIMESTAMP
    })
    firebase_auth.set_custom_user_claims(uid, {"vela_role": "pending_doctor"})

    return {"uid": uid, "status": "pending", "message": "Application submitted — pending admin review"}


@router.put("/doctor/verify/{uid}")
async def verify_doctor(
    uid: str,
    payload: DoctorVerification,
    admin: dict = Depends(require_role("admin"))
):
    """Admin endpoint to verify or suspend a doctor"""
    status = payload.status
    if status not in ["verified", "suspended", "rejected"]:
        raise HTTPException(400, "Status must be 'verified', 'suspended', or 'rejected'")

    db = get_db()
    db.collection("doctors").document(uid).update({
        "status": status,
        "updated_at": firestore.SERVER_TIMESTAMP
    })

    if status == "verified":
        firebase_auth.set_custom_user_claims(uid, {"vela_role": "doctor"})
        # SYNC: Update the users collection so the frontend's primary role check passes
        db.collection("users").document(uid).update({
            "role": "doctor",
            "updated_at": firestore.SERVER_TIMESTAMP
        })
    elif status == "suspended":
        firebase_auth.set_custom_user_claims(uid, {"vela_role": "suspended"})
        # Handle suspension in users too if needed
        db.collection("users").document(uid).update({
            "role": "suspended",
            "updated_at": firestore.SERVER_TIMESTAMP
        })
    elif status == "rejected":
        # Terminate their pending access
        firebase_auth.set_custom_user_claims(uid, {"vela_role": "rejected"})
        db.collection("users").document(uid).update({
            "role": "patient", # Downgrade to patient
            "updated_at": firestore.SERVER_TIMESTAMP
        })

    return {"uid": uid, "status": status}
 

@router.put("/doctor/availability")
async def toggle_availability(
    body: dict,
    doctor: dict = Depends(require_role("doctor"))
):
    """Doctor toggles their online availability status"""
    db = get_db()
    available = body.get("available_now", False)
    db.collection("doctors").document(doctor["uid"]).update({
        "available_now": available,
        "updated_at": firestore.SERVER_TIMESTAMP
    })
    return {"available_now": available}
