from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from firebase_admin import firestore
from google.cloud.firestore_v1.base_query import FieldFilter
from middleware.auth import get_current_user
from middleware.role_guard import require_role
from core.firebase import get_db
from models.appointment import AppointmentCreate, AppointmentUpdate
import uuid
from datetime import date

router = APIRouter(tags=["Appointments"])


@router.post("/")
async def book_appointment(
    body: AppointmentCreate,
    bg: BackgroundTasks,
    patient: dict = Depends(get_current_user)
):
    """
    Book appointment using Firestore to prevent double-booking.
    Replaces: mock appointment injection in useAppointmentsDoctor.js
    """
    db = get_db()
    slot_key = f"{body.date}_{body.time}"
    slot_ref = (
        db.collection("doctors").document(body.doctor_id)
        .collection("slots").document(slot_key)
    )

    # Check slot availability
    slot = slot_ref.get()
    if slot.exists and slot.to_dict().get("status") == "booked":
        raise HTTPException(409, "This slot was just taken — please pick another time")

    # Create appointment
    appt_ref = db.collection("appointments").document()
    appt_data = {
        "patient_id": patient["uid"],
        "doctor_id": body.doctor_id,
        "date": body.date,
        "time": body.time,
        "type": body.type,
        "reason": body.reason,
        "fee": body.fee,
        "payment_method": body.payment_method,
        "status": "confirmed",
        "payment_status": "pending",
        "created_at": firestore.SERVER_TIMESTAMP
    }
    appt_ref.set(appt_data)

    # Mark slot as booked
    slot_ref.set({
        "date": body.date,
        "time": body.time,
        "status": "booked",
        "appointment_id": appt_ref.id
    })

    # Background tasks — don't block response
    bg.add_task(_schedule_reminder, appt_ref.id, body.date, body.time)
    bg.add_task(_notify_doctor, body.doctor_id, patient["uid"], body.date, body.time)

    return {
        "appointment_id": appt_ref.id,
        "status": "confirmed",
        "date": body.date,
        "time": body.time
    }


@router.get("/me")
async def my_appointments(
    status: str = "upcoming",
    patient: dict = Depends(get_current_user)
):
    """
    Real appointment list for patient.
    Replaces: mock fallback in useAppointmentsDoctor.js
    """
    db = get_db()
    today = date.today().isoformat()
    query = db.collection("appointments").where(filter=FieldFilter("patient_id", "==", patient["uid"]))

    if status == "upcoming":
        query = (query.where(filter=FieldFilter("date", ">=", today))
                      .where(filter=FieldFilter("status", "in", ["confirmed", "waiting"]))
                      .order_by("date").order_by("time"))
    elif status == "past":
        query = query.where(filter=FieldFilter("date", "<", today)).order_by("date", direction=firestore.Query.DESCENDING)
    else:
        query = query.order_by("date", direction=firestore.Query.DESCENDING)

    appts = [{"id": d.id, **d.to_dict()} for d in query.stream()]

    # OPTIMIZATION: Fix N+1 queries using Batched Reads
    doctor_ids = list(set(a["doctor_id"] for a in appts))
    if doctor_ids:
        # Firestore batch get (max 1000 per call, we are safe here)
        doctor_refs = [db.collection("doctors").document(did) for did in doctor_ids]
        doctor_docs = {d.id: d.to_dict() for d in db.get_all(doctor_refs) if d.exists}
        
        for a in appts:
            d = doctor_docs.get(a["doctor_id"])
            if d:
                a["doctor"] = {
                    "name": d.get("name"), 
                    "photo": d.get("photo_url"), 
                    "specialty": d.get("specialties", [])
                }
            else:
                a["doctor"] = {"name": "Unknown Doctor", "photo": None, "specialty": []}

    return {"appointments": appts}


@router.get("/doctor/today")
async def doctor_today(doctor: dict = Depends(require_role("doctor"))):
    """Today's appointments for doctor dashboard"""
    db = get_db()
    today = date.today().isoformat()
    docs = (
        db.collection("appointments")
        .where(filter=FieldFilter("doctor_id", "==", doctor["uid"]))
        .where(filter=FieldFilter("date", "==", today))
        .order_by("time")
        .stream()
    )
    appts = [{"id": d.id, **d.to_dict()} for d in docs]

    # Enrich with patient info
    for a in appts:
        p = db.collection("users").document(a["patient_id"]).get()
        if p.exists:
            pd = p.to_dict()
            a["patient"] = {"name": pd.get("name"), "photo": pd.get("photo_url"), "phone": pd.get("phone")}

    return {"appointments": appts, "date": today, "count": len(appts)}


@router.patch("/{appt_id}")
async def update_appointment(
    appt_id: str,
    body: AppointmentUpdate,
    user: dict = Depends(get_current_user)
):
    """Update appointment status (cancel, complete, no-show)"""
    db = get_db()
    appt = db.collection("appointments").document(appt_id).get()
    if not appt.exists:
        raise HTTPException(404, "Appointment not found")

    data = appt.to_dict()
    # Only patient or doctor of this appointment can update
    if data["patient_id"] != user["uid"] and data["doctor_id"] != user["uid"]:
        raise HTTPException(403, "Not your appointment")

    updates = {k: v for k, v in body.model_dump(exclude_none=True).items()}
    updates["updated_at"] = firestore.SERVER_TIMESTAMP
    db.collection("appointments").document(appt_id).update(updates)

    return {"success": True, "appointment_id": appt_id}


@router.get("/{appt_id}")
async def get_appointment(appt_id: str, user: dict = Depends(get_current_user)):
    """Get a specific appointment with full doctor + patient details"""
    db = get_db()
    doc = db.collection("appointments").document(appt_id).get()
    if not doc.exists:
        raise HTTPException(404, "Appointment not found")
    return {"id": doc.id, **doc.to_dict()}


# ── Background task helpers ────────────────────────────────────────────────────

async def _schedule_reminder(appt_id: str, appt_date: str, appt_time: str):
    """Store reminder record in Firestore"""
    from datetime import datetime, timezone
    db = get_db()
    try:
        appt_datetime = datetime.strptime(f"{appt_date} {appt_time}", "%Y-%m-%d %H:%M").replace(tzinfo=timezone.utc)
        db.collection("reminders").add({
            "appointment_id": appt_id,
            "remind_at": appt_datetime,
            "sent": False
        })
    except Exception as e:
        import logging
        logging.getLogger(__name__).error(f"Reminder scheduling failed for {appt_id}: {e}")


async def _notify_doctor(doctor_id: str, patient_id: str, appt_date: str, appt_time: str):
    """Send FCM notification to doctor"""
    db = get_db()
    try:
        doctor = db.collection("doctors").document(doctor_id).get().to_dict() or {}
        patient = db.collection("users").document(patient_id).get().to_dict() or {}
        fcm_token = doctor.get("fcm_token")
        if fcm_token:
            from services.notification_service import notify_doctor_new_appointment
            notify_doctor_new_appointment(
                fcm_token, patient.get("name", "A patient"), appt_date, appt_time
            )
    except Exception as e:
        print(f"Doctor notification failed: {e}")
