from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from firebase_admin import firestore
from google.cloud.firestore_v1.base_query import FieldFilter
from middleware.auth import get_current_user
from core.firebase import get_db
import uuid

router = APIRouter(tags=["Consult — Video Call"])


@router.post("/start")
async def start_consult(body: dict, user: dict = Depends(get_current_user)):
    """
    Create a consultation session. Generates a unique session_id for WebRTC.
    Called when patient or doctor opens the video call page.
    """
    db = get_db()
    appt_id = body.get("appointment_id")
    if not appt_id:
        raise HTTPException(400, "appointment_id required")

    appt = db.collection("appointments").document(appt_id).get()
    if not appt.exists:
        raise HTTPException(404, "Appointment not found")

    appt_data = appt.to_dict()
    # Verify caller is the patient or doctor for this appointment
    if user["uid"] not in [appt_data["patient_id"], appt_data["doctor_id"]]:
        raise HTTPException(403, "Not your appointment")

    # Check if session already exists
    existing = appt_data.get("session_id")
    if existing:
        return {"session_id": existing, "status": "existing"}

    session_id = str(uuid.uuid4())
    consult_ref = db.collection("consultations").document()
    consult_ref.set({
        "appointment_id": appt_id,
        "patient_id": appt_data["patient_id"],
        "doctor_id": appt_data["doctor_id"],
        "session_id": session_id,
        "status": "waiting",
        "started_at": firestore.SERVER_TIMESTAMP
    })

    db.collection("appointments").document(appt_id).update({
        "session_id": session_id,
        "status": "waiting"
    })

    return {"session_id": session_id, "status": "created"}


@router.post("/end")
async def end_consult(body: dict, user: dict = Depends(get_current_user)):
    """Save consultation data and mark as completed"""
    db = get_db()
    session_id = body.get("session_id")
    if not session_id:
        raise HTTPException(400, "session_id required")

    docs = list(
        db.collection("consultations")
        .where(filter=FieldFilter("session_id", "==", session_id)).stream()
    )
    if not docs:
        raise HTTPException(404, "Session not found")

    ref = docs[0].reference
    ref.update({
        "status": "completed",
        "ended_at": firestore.SERVER_TIMESTAMP,
        "duration_minutes": body.get("duration_seconds", 0) // 60,
        "notes": body.get("notes", ""),
        "symptoms_logged": body.get("symptoms", []),
        "vitals": body.get("vitals", {})
    })

    # Update appointment status
    appt_id = docs[0].to_dict().get("appointment_id")
    if appt_id:
        db.collection("appointments").document(appt_id).update({
            "status": "completed",
            "updated_at": firestore.SERVER_TIMESTAMP
        })

    return {"saved": True, "duration_minutes": body.get("duration_seconds", 0) // 60}


@router.get("/{session_id}")
async def get_session(session_id: str, user: dict = Depends(get_current_user)):
    """Get consultation session details"""
    db = get_db()
    docs = list(db.collection("consultations").where(filter=FieldFilter("session_id", "==", session_id)).stream())
    if not docs:
        raise HTTPException(404, "Session not found")
    return {"id": docs[0].id, **docs[0].to_dict()}
