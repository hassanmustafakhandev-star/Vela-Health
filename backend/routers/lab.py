from fastapi import APIRouter, Depends, HTTPException
from firebase_admin import firestore
from google.cloud.firestore_v1.base_query import FieldFilter
from middleware.auth import get_current_user
from core.firebase import get_db

router = APIRouter(tags=["Lab"])


@router.get("/tests")
async def list_tests(category: str = None, limit: int = 50):
    """List available lab tests"""
    db = get_db()
    query = db.collection("lab_tests")
    if category:
        query = query.where(filter=FieldFilter("category", "==", category))
    tests = list(query.order_by("name").limit(limit).stream())
    return {"tests": [{"id": t.id, **t.to_dict()} for t in tests]}


@router.post("/orders")
async def order_test(body: dict, user: dict = Depends(get_current_user)):
    """Order lab tests — home collection or walk-in"""
    db = get_db()
    order_ref = db.collection("lab_orders").document()
    order_ref.set({
        "patient_id": user["uid"],
        "tests": body.get("tests", []),
        "collection_type": body.get("collection_type", "home"),  # home | walk-in
        "collection_address": body.get("collection_address"),
        "preferred_date": body.get("preferred_date"),
        "status": "pending",
        "created_at": firestore.SERVER_TIMESTAMP
    })
    return {"order_id": order_ref.id, "status": "pending"}


@router.get("/orders/me")
async def my_lab_orders(user: dict = Depends(get_current_user)):
    """Get patient's lab orders and results"""
    db = get_db()
    orders = (
        db.collection("lab_orders")
        .where(filter=FieldFilter("patient_id", "==", user["uid"]))
        .order_by("created_at", direction=firestore.Query.DESCENDING)
        .limit(20).stream()
    )
    return {"orders": [{"id": o.id, **o.to_dict()} for o in orders]}


@router.post("/results/{order_id}")
async def upload_result(
    order_id: str,
    body: dict,
    user: dict = Depends(get_current_user)
):
    """Upload lab result (URL + structured data) for a patient"""
    db = get_db()
    db.collection("lab_orders").document(order_id).update({
        "result_url": body.get("result_url"),
        "result_data": body.get("result_data", {}),
        "status": "completed",
        "completed_at": firestore.SERVER_TIMESTAMP
    })
    return {"success": True}
