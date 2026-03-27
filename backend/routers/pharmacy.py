from fastapi import APIRouter, Depends, HTTPException
from firebase_admin import firestore
from google.cloud.firestore_v1.base_query import FieldFilter
from middleware.auth import get_current_user
from core.firebase import get_db

router = APIRouter(tags=["Pharmacy"])


@router.get("/medicines/search")
async def search_medicines(q: str, limit: int = 20):
    """Search Pakistan medicine database by name or generic"""
    db = get_db()
    # Firestore doesn't support full text — use starts-with pattern
    results = list(
        db.collection("medicines")
        .where(filter=FieldFilter("name_lower", ">=", q.lower()))
        .where(filter=FieldFilter("name_lower", "<=", q.lower() + "\uf8ff"))
        .limit(limit)
        .stream()
    )
    return {"medicines": [{"id": m.id, **m.to_dict()} for m in results]}


@router.get("/medicines/{barcode}")
async def get_medicine(barcode: str):
    """Get medicine details by barcode"""
    db = get_db()
    doc = db.collection("medicines").document(barcode).get()
    if not doc.exists:
        raise HTTPException(404, "Medicine not found in database")
    return {"id": doc.id, **doc.to_dict()}


@router.post("/orders")
async def place_order(body: dict, user: dict = Depends(get_current_user)):
    """Place a pharmacy order linked to a prescription"""
    db = get_db()
    order_ref = db.collection("pharmacy_orders").document()
    order_ref.set({
        "patient_id": user["uid"],
        "prescription_id": body.get("prescription_id"),
        "items": body.get("items", []),
        "delivery_address": body.get("delivery_address"),
        "status": "pending",
        "created_at": firestore.SERVER_TIMESTAMP
    })
    return {"order_id": order_ref.id, "status": "pending"}


@router.get("/orders/me")
async def my_orders(user: dict = Depends(get_current_user)):
    """Get patient's pharmacy orders"""
    db = get_db()
    orders = (
        db.collection("pharmacy_orders")
        .where(filter=FieldFilter("patient_id", "==", user["uid"]))
        .order_by("created_at", direction=firestore.Query.DESCENDING)
        .limit(20).stream()
    )
    return {"orders": [{"id": o.id, **o.to_dict()} for o in orders]}
