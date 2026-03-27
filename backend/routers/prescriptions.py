from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from firebase_admin import firestore
from google.cloud.firestore_v1.base_query import FieldFilter
from middleware.auth import get_current_user
from middleware.role_guard import require_role
from core.firebase import get_db
from models.prescription import PrescriptionCreate
from datetime import date, timedelta

router = APIRouter(tags=["Prescriptions"])


@router.post("/")
async def create_prescription(
    body: PrescriptionCreate,
    bg: BackgroundTasks,
    doctor: dict = Depends(require_role("doctor"))
):
    """
    Doctor creates a digital prescription.
    Generates PDF in background and notifies patient.
    """
    db = get_db()

    # Save prescription to Firestore
    valid_until = (date.today() + timedelta(days=30)).isoformat()
    rx_ref = db.collection("prescriptions").document()
    rx_data = {
        **body.model_dump(),
        "doctor_id": doctor["uid"],
        "issued_at": firestore.SERVER_TIMESTAMP,
        "valid_until": valid_until,
        "pdf_url": None
    }
    rx_ref.set(rx_data)

    # PDF generation + patient notification in background (non-blocking)
    bg.add_task(_generate_and_store_pdf, rx_ref.id, rx_data, doctor)
    bg.add_task(_notify_patient, body.patient_id, doctor["uid"], rx_ref.id)

    return {
        "prescription_id": rx_ref.id,
        "status": "created",
        "valid_until": valid_until
    }


@router.get("/me")
async def my_prescriptions(
    limit: int = 20,
    patient: dict = Depends(get_current_user)
):
    """Get patient's prescription history"""
    db = get_db()
    docs = (
        db.collection("prescriptions")
        .where(filter=FieldFilter("patient_id", "==", patient["uid"]))
        .order_by("issued_at", direction=firestore.Query.DESCENDING)
        .limit(limit)
        .stream()
    )
    return {"prescriptions": [{"id": d.id, **d.to_dict()} for d in docs]}


@router.get("/doctor/issued")
async def doctor_prescriptions(
    limit: int = 20,
    doctor: dict = Depends(require_role("doctor"))
):
    """Get prescriptions issued by this doctor"""
    db = get_db()
    docs = (
        db.collection("prescriptions")
        .where(filter=FieldFilter("doctor_id", "==", doctor["uid"]))
        .order_by("issued_at", direction=firestore.Query.DESCENDING)
        .limit(limit)
        .stream()
    )
    return {"prescriptions": [{"id": d.id, **d.to_dict()} for d in docs]}


@router.get("/{rx_id}")
async def get_prescription(rx_id: str, user: dict = Depends(get_current_user)):
    """Get a specific prescription"""
    db = get_db()
    doc = db.collection("prescriptions").document(rx_id).get()
    if not doc.exists:
        raise HTTPException(404, "Prescription not found")
    rx = doc.to_dict()
    # Only patient or prescribing doctor can view
    if rx.get("patient_id") != user["uid"] and rx.get("doctor_id") != user["uid"]:
        raise HTTPException(403, "Access denied")
    return {"id": doc.id, **rx}


@router.get("/{rx_id}/pdf")
async def get_pdf_url(rx_id: str, user: dict = Depends(get_current_user)):
    """Get signed download URL for prescription PDF"""
    db = get_db()
    doc = db.collection("prescriptions").document(rx_id).get()
    if not doc.exists:
        raise HTTPException(404, "Prescription not found")
    rx = doc.to_dict()
    pdf_url = rx.get("pdf_url")
    if not pdf_url:
        raise HTTPException(404, "PDF not yet generated — please try again in a moment")
    return {"pdf_url": pdf_url}


# ── Background task helpers ────────────────────────────────────────────────────

async def _generate_and_store_pdf(rx_id: str, rx_data: dict, doctor: dict):
    """Generate PDF and upload to Firebase Storage"""
    db = get_db()
    try:
        patient = db.collection("users").document(rx_data["patient_id"]).get().to_dict() or {}
        from services.pdf_service import generate_prescription_pdf
        from services.storage_service import upload_pdf
        pdf_bytes = generate_prescription_pdf({**rx_data, "id": rx_id}, doctor, patient)
        url = upload_pdf(pdf_bytes, f"prescriptions/{rx_id}.pdf")
        db.collection("prescriptions").document(rx_id).update({"pdf_url": url})
    except Exception as e:
        print(f"PDF generation failed for {rx_id}: {e}")


async def _notify_patient(patient_id: str, doctor_id: str, rx_id: str):
    db = get_db()
    try:
        patient = db.collection("users").document(patient_id).get().to_dict() or {}
        doctor = db.collection("doctors").document(doctor_id).get().to_dict() or {}
        fcm_token = patient.get("fcm_token")
        if fcm_token:
            from services.notification_service import notify_patient_prescription
            notify_patient_prescription(fcm_token, doctor.get("name", "your doctor"), rx_id)
    except Exception as e:
        print(f"Patient notification failed: {e}")
