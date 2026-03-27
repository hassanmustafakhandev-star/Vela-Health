from fastapi import APIRouter, Depends, HTTPException
from firebase_admin import firestore
from google.cloud.firestore_v1.base_query import FieldFilter
from middleware.auth import get_current_user
from middleware.role_guard import require_role
from core.firebase import get_db
from models.doctor import DoctorAvailability, DoctorReview, DoctorProfileUpdate
from services.geo_service import filter_by_distance
from datetime import datetime, timedelta

router = APIRouter(tags=["Doctors"])


@router.get("/")
async def list_doctors(
    specialty: str = None,
    city: str = None,
    max_fee: int = None,
    available_now: bool = False,
    lat: float = None,
    lng: float = None,
    radius_km: float = 10.0,
    page: int = 1,
    limit: int = 20
):
    """
    Doctor search with filters.
    Replaces: mock doctor list in frontend useDoctors.js
    """
    db = get_db()
    query = db.collection("doctors").where(filter=FieldFilter("status", "==", "verified"))

    if specialty:
        query = query.where(filter=FieldFilter("specialties", "array_contains", specialty))
    if city:
        query = query.where(filter=FieldFilter("city", "==", city))
    if available_now:
        query = query.where(filter=FieldFilter("available_now", "==", True))

    docs = list(query.order_by("rating", direction=firestore.Query.DESCENDING).stream())
    doctors = [{"id": d.id, **d.to_dict()} for d in docs]

    # Geo filter (post-query — Firestore inequality compound limit workaround)
    if lat and lng:
        doctors = filter_by_distance(doctors, lat, lng, radius_km)

    # Fee filter
    if max_fee is not None:
        doctors = [d for d in doctors if d.get("consultation_fee_video", 0) <= max_fee]

    total = len(doctors)
    start = (page - 1) * limit
    paginated = doctors[start: start + limit]

    return {"doctors": paginated, "total": total, "page": page, "has_more": total > start + limit}


@router.get("/{uid}")
async def get_doctor(uid: str):
    """Get full doctor profile with recent reviews"""
    db = get_db()
    doc = db.collection("doctors").document(uid).get()
    if not doc.exists:
        raise HTTPException(404, "Doctor not found")

    doctor = {"id": doc.id, **doc.to_dict()}
    reviews = [
        r.to_dict() for r in
        db.collection("doctors").document(uid).collection("reviews")
        .order_by("created_at", direction=firestore.Query.DESCENDING)
        .limit(5).stream()
    ]
    doctor["recent_reviews"] = reviews
    return doctor


@router.get("/{uid}/slots")
async def get_slots(uid: str, date: str):
    """
    Return available time slots for a doctor on a given date.
    Replaces: mock slot data in frontend.
    """
    db = get_db()
    try:
        day_of_week = datetime.strptime(date, "%Y-%m-%d").weekday()
    except ValueError:
        raise HTTPException(400, "Invalid date format — use YYYY-MM-DD")

    # Get doctor availability for that weekday
    avail_doc = (
        db.collection("doctors").document(uid)
        .collection("availability").document(str(day_of_week)).get()
    )

    if not avail_doc.exists or not avail_doc.to_dict().get("active"):
        return {"date": date, "slots": [], "message": "Doctor not available this day"}

    avail = avail_doc.to_dict()
    doctor_doc = db.collection("doctors").document(uid).get().to_dict() or {}
    duration = doctor_doc.get("session_duration", 30)
    buffer = doctor_doc.get("buffer_minutes", 5)

    # Generate all possible time slots
    slot_start = datetime.strptime(f"{date} {avail['start_time']}", "%Y-%m-%d %H:%M")
    slot_end = datetime.strptime(f"{date} {avail['end_time']}", "%Y-%m-%d %H:%M")
    all_slots = []
    current = slot_start
    while current + timedelta(minutes=duration) <= slot_end:
        all_slots.append(current.strftime("%H:%M"))
        current += timedelta(minutes=duration + buffer)

    # Remove already booked slots
    booked = {
        s.id for s in
        db.collection("doctors").document(uid).collection("slots")
        .where(filter=FieldFilter("date", "==", date))
        .where(filter=FieldFilter("status", "==", "booked")).stream()
    }
    available = [s for s in all_slots if f"{date}_{s}" not in booked]

    return {"date": date, "slots": available, "duration_minutes": duration}


@router.put("/{uid}/availability")
async def set_availability(
    uid: str,
    body: DoctorAvailability,
    doctor: dict = Depends(require_role("doctor"))
):
    """Set/update weekly schedule for a specific day"""
    if doctor["uid"] != uid:
        raise HTTPException(403, "Cannot modify another doctor's schedule")
    db = get_db()
    db.collection("doctors").document(uid).collection("availability")\
      .document(str(body.day_of_week)).set(body.model_dump())
    return {"success": True}

@router.put("/me/profile")
async def update_profile(
    body: DoctorProfileUpdate,
    doctor: dict = Depends(require_role("doctor"))
):
    """Update authenticated doctor's own profile fields"""
    db = get_db()
    uid = doctor["uid"]
    update_data = {k: v for k, v in body.model_dump().items() if v is not None}
    
    if not update_data:
        return {"success": True, "message": "No fields to update"}
        
    db.collection("doctors").document(uid).update(update_data)
    return {"success": True, "updated_fields": list(update_data.keys())}


@router.post("/{uid}/reviews")
async def post_review(
    uid: str,
    body: DoctorReview,
    patient: dict = Depends(get_current_user)
):
    """Patient posts a review after consultation"""
    db = get_db()
    # Verify appointment existed
    appt = db.collection("appointments").document(body.appointment_id).get()
    if not appt.exists:
        raise HTTPException(404, "Appointment not found")
    if appt.to_dict().get("patient_id") != patient["uid"]:
        raise HTTPException(403, "Not your appointment")

    # Save review
    db.collection("doctors").document(uid).collection("reviews").add({
        "patient_id": patient["uid"],
        "rating": body.rating,
        "comment": body.comment,
        "appointment_id": body.appointment_id,
        "created_at": firestore.SERVER_TIMESTAMP
    })

    # Update doctor average rating
    reviews = list(db.collection("doctors").document(uid).collection("reviews").stream())
    avg = sum(r.to_dict().get("rating", 0) for r in reviews) / len(reviews)
    db.collection("doctors").document(uid).update({
        "rating": round(avg, 1),
        "total_reviews": len(reviews)
    })

    return {"success": True, "new_rating": round(avg, 1)}
