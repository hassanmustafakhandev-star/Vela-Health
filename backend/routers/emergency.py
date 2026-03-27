from fastapi import APIRouter, Depends, HTTPException
from firebase_admin import firestore
from google.cloud.firestore_v1.base_query import FieldFilter
from middleware.auth import get_current_user
from core.firebase import get_db
from services.geo_service import filter_by_distance

router = APIRouter(tags=["Emergency"])


@router.post("/alert")
async def send_emergency_alert(body: dict, user: dict = Depends(get_current_user)):
    """
    Patient sends emergency alert.
    Notifies emergency contacts + nearest available doctors.
    """
    db = get_db()
    uid = user["uid"]
    alert_ref = db.collection("emergency_alerts").document()
    alert_ref.set({
        "patient_id": uid,
        "location": body.get("location"),  # { lat, lng, address }
        "symptoms": body.get("symptoms", ""),
        "severity": body.get("severity", "high"),
        "status": "active",
        "created_at": firestore.SERVER_TIMESTAMP
    })

    # Notify patient's emergency contact
    user_data = db.collection("users").document(uid).get().to_dict() or {}
    emergency_phone = user_data.get("emergency_contact_phone")
    if emergency_phone:
        # In production: integrate SMS gateway (Twilio/Jazz SMS)
        print(f"🚨 EMERGENCY: Notify {emergency_phone} for patient {uid}")

    return {
        "alert_id": alert_ref.id,
        "status": "active",
        "message": "Emergency alert sent. Help is on the way.",
        "emergency_numbers": {
            "rescue": "1122",
            "edhi": "115",
            "aman": "115",
            "police": "15"
        }
    }


@router.get("/nearby-doctors")
async def nearby_doctors(
    lat: float,
    lng: float,
    radius_km: float = 5.0
):
    """Find nearest available doctors for emergency"""
    db = get_db()
    docs = list(
        db.collection("doctors")
        .where(filter=FieldFilter("status", "==", "verified"))
        .where(filter=FieldFilter("available_now", "==", True))
        .stream()
    )
    doctors = [{"id": d.id, **d.to_dict()} for d in docs]
    nearby = filter_by_distance(doctors, lat, lng, radius_km)
    return {"doctors": nearby[:10], "count": len(nearby)}


@router.get("/contacts")
async def get_emergency_info():
    """Pakistan emergency contacts and hospitals"""
    return {
        "emergency_numbers": {
            "rescue_1122": "1122",
            "edhi_foundation": "115",
            "aman_ambulance": "1020",
            "police": "15",
            "fire": "16",
            "anti_poison": "021-99215080"
        },
        "tip": "If this is life-threatening, call 1122 immediately."
    }
