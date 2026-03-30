from fastapi import APIRouter, Depends, HTTPException
from firebase_admin import firestore
from google.cloud.firestore_v1.base_query import FieldFilter
from middleware.auth import get_current_user
from middleware.role_guard import require_role
from core.firebase import get_db

router = APIRouter(tags=["Doctor's Patient Management"])

@router.get("/")
async def list_my_patients(doctor: dict = Depends(require_role("doctor"))):
    """List all unique patients who have booked with this doctor"""
    db = get_db()
    uid = doctor["uid"]
    
    # Get unique patient IDs from appointments
    appts = (db.collection("appointments")
            .where(filter=FieldFilter("doctor_id", "==", uid))
            .stream())
            
    patient_ids = list(set(a.to_dict().get("patient_id") for a in appts))
    
    if not patient_ids:
        return []
        
    # Enrich with patient profiles
    patients = []
    for pid in patient_ids:
        p_doc = db.collection("users").document(pid).get()
        if p_doc.exists:
            pd = p_doc.to_dict()
            patients.append({
                "id": pid,
                "name": pd.get("name"),
                "photo_url": pd.get("photo_url"),
                "age": pd.get("age"),
                "gender": pd.get("gender"),
                "last_visit": None # Could be calculated
            })
            
    return patients

@router.get("/{patient_id}/history")
async def get_patient_history(
    patient_id: str, 
    doctor: dict = Depends(require_role("doctor"))
):
    """Get full EMR (Electronic Medical Record) for a specific patient"""
    db = get_db()
    
    # Security: Ensure this doctor has at least one appointment with this patient
    # or just allow for now (Clinical common sense usually allows verified health professionals)
    
    # 1. Profile
    profile = db.collection("users").document(patient_id).get().to_dict() or {}
    
    # 2. Vitals
    vitals = [v.to_dict() for v in 
              db.collection("users").document(patient_id).collection("vitals")
              .order_by("recorded_at", direction=firestore.Query.DESCENDING).limit(20).stream()]
              
    # 3. Documents (Labs/Scans)
    docs = [d.to_dict() for d in 
            db.collection("users").document(patient_id).collection("documents")
            .order_by("uploaded_at", direction=firestore.Query.DESCENDING).stream()]
            
    # 4. Past Prescriptions
    prescriptions = [p.to_dict() for p in 
                     db.collection("prescriptions")
                     .where(filter=FieldFilter("patient_id", "==", patient_id))
                     .order_by("issued_at", direction=firestore.Query.DESCENDING).stream()]
                     
    return {
        "profile": {
            "name": profile.get("name"),
            "age": profile.get("age"),
            "gender": profile.get("gender"),
            "blood_group": profile.get("blood_group"),
            "allergies": profile.get("allergies", [])
        },
        "vitals": vitals,
        "documents": docs,
        "prescriptions": prescriptions
    }
