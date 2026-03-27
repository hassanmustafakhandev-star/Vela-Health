from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, BackgroundTasks
from firebase_admin import firestore
from google.cloud.firestore_v1.base_query import FieldFilter
from middleware.auth import get_current_user
from services.ai.triage_service import stream_triage
from services.ai.voice_service import transcribe_audio
from services.ai.scan_service import scan_medicine_barcode, analyze_medicine_image
from services.ai.insight_service import generate_health_insight
from core.firebase import get_db
from models.ai import SymptomRequest, ScanRequest, SaveSessionRequest

router = APIRouter(tags=["AI — Sehat AI"])

AI_DAILY_LIMIT = 50


async def _check_rate_limit(uid: str):
    """50 AI calls per user per day — tracked in Firestore"""
    from services.firestore_service import get_ai_usage_today, increment_ai_usage
    try:
        count = get_ai_usage_today(uid)
        if count >= AI_DAILY_LIMIT:
            raise HTTPException(429, f"Daily AI limit reached ({AI_DAILY_LIMIT}/day). Try again tomorrow.")
        increment_ai_usage(uid)
    except HTTPException:
        raise
    except Exception:
        pass  # Don't block AI call if rate limit check fails


from middleware.circuit_breaker import ai_circuit_breaker

@router.post("/symptoms")
@ai_circuit_breaker
async def check_symptoms(
    body: SymptomRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Sehat AI — symptom triage using Groq LLaMA3 (free, 300+ tokens/sec).
    Streams response token by token.
    Replaces: mock setTimeout in app/(app)/ai/symptoms/page.js
    """
    await _check_rate_limit(current_user["uid"])
    return await stream_triage(body.message, body.history, body.language)


@router.post("/voice")
async def voice_to_text(
    audio: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """
    Transcribe Urdu/English voice using Groq Whisper (free).
    Max file size: 10MB. Supports webm, mp3, wav, m4a.
    """
    if audio.size and audio.size > 10 * 1024 * 1024:
        raise HTTPException(413, "Audio file too large — max 10MB")

    audio_bytes = await audio.read()
    return await transcribe_audio(audio_bytes, audio.filename or "audio.webm")


@router.post("/scan")
async def scan_medicine(
    body: ScanRequest = None,
    image: UploadFile = File(None),
    current_user: dict = Depends(get_current_user)
):
    """
    Medicine authenticity check.
    Accepts: barcode string (JSON body) OR image file (multipart).
    """
    if body and body.barcode:
        return scan_medicine_barcode(body.barcode)
    if image:
        img_bytes = await image.read()
        return analyze_medicine_image(img_bytes)
    raise HTTPException(400, "Provide either 'barcode' in request body or an 'image' file")


@router.post("/insights")
async def health_insights(
    current_user: dict = Depends(get_current_user)
):
    """
    Generate AI health insight from Firestore vitals/records using Groq (free).
    Saves insight back to Firestore for display in dashboard.
    """
    uid = current_user["uid"]
    db = get_db()

    # Fetch recent vitals
    vitals_ref = (
        db.collection("users").document(uid)
        .collection("vitals")
        .order_by("recorded_at", direction=firestore.Query.DESCENDING)
        .limit(30)
    )
    vitals = [v.to_dict() for v in vitals_ref.stream()]

    # Fetch user language pref
    user_data = db.collection("users").document(uid).get().to_dict() or {}
    language = user_data.get("language", "en")

    insight = generate_health_insight({"vitals": vitals}, language)

    # Save insight to Firestore
    db.collection("users").document(uid).collection("insights").add({
        "text": insight,
        "created_at": firestore.SERVER_TIMESTAMP
    })

    return {"insight": insight}


@router.post("/save-session")
async def save_ai_session(
    body: SaveSessionRequest,
    current_user: dict = Depends(get_current_user)
):
    """Save a completed Sehat AI session to Firestore for history"""
    db = get_db()
    db.collection("ai_sessions").add({
        "user_id": current_user["uid"],
        "messages": body.messages,
        "urgency_level": body.urgency,
        "suggested_specialty": body.specialty or "",
        "created_at": firestore.SERVER_TIMESTAMP
    })
    return {"saved": True}


@router.get("/sessions")
async def get_ai_sessions(
    limit: int = 10,
    current_user: dict = Depends(get_current_user)
):
    """Get user's past AI sessions"""
    db = get_db()
    sessions = (
        db.collection("ai_sessions")
        .where(filter=FieldFilter("user_id", "==", current_user["uid"]))
        .order_by("created_at", direction=firestore.Query.DESCENDING)
        .limit(limit)
        .stream()
    )
    return {"sessions": [{"id": s.id, **s.to_dict()} for s in sessions]}
