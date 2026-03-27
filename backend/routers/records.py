from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from firebase_admin import firestore
from google.cloud.firestore_v1.base_query import FieldFilter
from middleware.auth import get_current_user
from core.firebase import get_db

router = APIRouter(tags=["Health Records"])


@router.post("/vitals")
async def add_vital(body: dict, user: dict = Depends(get_current_user)):
    """Log a vitals reading (BP, sugar, weight, temperature, etc.)"""
    db = get_db()
    db.collection("users").document(user["uid"]).collection("vitals").add({
        **body,
        "recorded_at": firestore.SERVER_TIMESTAMP
    })
    return {"success": True}


@router.get("/vitals")
async def get_vitals(
    type: str = None,
    limit: int = 30,
    user: dict = Depends(get_current_user)
):
    """Get vitals history for charts"""
    db = get_db()
    query = (
        db.collection("users").document(user["uid"]).collection("vitals")
        .order_by("recorded_at", direction=firestore.Query.DESCENDING)
        .limit(limit)
    )
    if type:
        query = query.where(filter=FieldFilter("type", "==", type))
    vitals = [{"id": v.id, **v.to_dict()} for v in query.stream()]
    return {"vitals": vitals}


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    document_type: str = "lab_report",
    user: dict = Depends(get_current_user)
):
    """Upload a medical document (lab report, scan, etc.) to Firebase Storage"""
    from services.storage_service import upload_file
    # HARDENING: File Size Validation (5MB Limit)
    MAX_FILE_SIZE = 5 * 1024 * 1024
    content_length = file.size if hasattr(file, 'size') else 0 # FastAPI >= 0.96.0
    if content_length > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large. Maximum size is 5MB.")

    # HARDENING: MIME Type Validation
    ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"]
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail=f"Invalid file type {file.content_type}. Only PDFs and images allowed.")

    file_bytes = await file.read()
    
    # Second check for size after reading if size attr was missing
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large. Maximum size is 5MB.")

    path = f"records/{user['uid']}/{document_type}/{file.filename}"
    
    try:
        url = upload_file(file_bytes, path, content_type=file.content_type or "application/octet-stream")
    except Exception as e:
        import logging
        logging.getLogger(__name__).error(f"Failed to upload document for user {user['uid']}: {e}")
        raise HTTPException(status_code=502, detail="Storage service temporarily unavailable")

    # Save record to Firestore
    db = get_db()
    doc_ref = db.collection("users").document(user["uid"]).collection("documents").add({
        "type": document_type,
        "filename": file.filename,
        "url": url,
        "uploaded_at": firestore.SERVER_TIMESTAMP
    })
    return {"url": url, "document_id": doc_ref[1].id}


@router.get("/documents")
async def get_documents(
    type: str = None,
    limit: int = 20,
    user: dict = Depends(get_current_user)
):
    """Get uploaded medical documents"""
    db = get_db()
    query = (
        db.collection("users").document(user["uid"]).collection("documents")
        .order_by("uploaded_at", direction=firestore.Query.DESCENDING)
        .limit(limit)
    )
    if type:
        query = query.where(filter=FieldFilter("type", "==", type))
    docs = [{"id": d.id, **d.to_dict()} for d in query.stream()]
    return {"documents": docs}


@router.get("/summary")
async def get_health_summary(user: dict = Depends(get_current_user)):
    """Get complete health summary for dashboard"""
    db = get_db()
    uid = user["uid"]

    # Latest vitals
    latest_vitals = list(
        db.collection("users").document(uid).collection("vitals")
        .order_by("recorded_at", direction=firestore.Query.DESCENDING)
        .limit(5).stream()
    )

    # Recent prescriptions
    recent_rx = list(
        db.collection("prescriptions")
        .where(filter=FieldFilter("patient_id", "==", uid))
        .order_by("issued_at", direction=firestore.Query.DESCENDING)
        .limit(3).stream()
    )

    # Latest insights
    latest_insight = list(
        db.collection("users").document(uid).collection("insights")
        .order_by("created_at", direction=firestore.Query.DESCENDING)
        .limit(1).stream()
    )

    return {
        "latest_vitals": [v.to_dict() for v in latest_vitals],
        "recent_prescriptions": [{"id": r.id, **r.to_dict()} for r in recent_rx],
        "latest_insight": latest_insight[0].to_dict() if latest_insight else None
    }
