import requests
from core.config import settings

HF_VISION_URL = (
    f"https://router.huggingface.co/hf-inference/models/{settings.hf_vision_model}"
)
HEADERS = {"Authorization": f"Bearer {settings.hf_api_key}"}


def scan_medicine_barcode(barcode: str) -> dict:
    """
    Check medicine authenticity using barcode.
    Queries Pakistan drug database stored in Firestore.
    """
    try:
        from core.firebase import get_db
        db = get_db()
        doc = db.collection("medicines").document(barcode).get()
        if doc.exists:
            medicine = doc.to_dict()
            return {
                "status": "verified",
                "barcode": barcode,
                "medicine": medicine,
                "message": f"{medicine.get('name', 'Medicine')} — Verified by DRAP Pakistan"
            }
    except Exception:
        pass

    return {
        "status": "unverified",
        "barcode": barcode,
        "medicine": None,
        "message": "Medicine not found in our database. Please verify with your pharmacist."
    }


def analyze_medicine_image(image_bytes: bytes) -> dict:
    """
    Use HuggingFace BLIP model (free) to caption a medicine image.
    Then search ChromaDB medicines collection for matches.
    """
    if not settings.hf_api_key:
        return {
            "caption": "Image analysis not available (HF_API_KEY not set)",
            "matches": []
        }

    response = requests.post(
        HF_VISION_URL,
        headers=HEADERS,
        data=image_bytes,
        timeout=30
    )

    caption = ""
    if response.ok:
        result = response.json()
        if isinstance(result, list) and result:
            caption = result[0].get("generated_text", "")

    # Search medicines collection using caption
    matches = []
    if caption:
        try:
            from services.ai.embeddings_service import query_medical_knowledge
            context = query_medical_knowledge(caption)
            matches = [context]
        except Exception:
            pass

    return {
        "caption": caption,
        "matches": matches,
        "message": "Please verify with your pharmacist before use."
    }
