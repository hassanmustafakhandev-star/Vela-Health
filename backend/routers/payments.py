from fastapi import APIRouter, Depends, HTTPException
from firebase_admin import firestore
from google.cloud.firestore_v1.base_query import FieldFilter
from middleware.auth import get_current_user
from core.firebase import get_db
from services.payment_service import jazzcash_initiate, easypaisa_initiate, verify_payment_callback

router = APIRouter(tags=["Payments"])


@router.post("/initiate")
async def initiate_payment(body: dict, user: dict = Depends(get_current_user)):
    """
    Initiate payment via JazzCash or Easypaisa (sandbox).
    Returns gateway URL + form data for frontend to redirect.
    """
    db = get_db()
    gateway = body.get("gateway", "jazzcash")  # jazzcash | easypaisa
    appointment_id = body.get("appointment_id")
    amount = body.get("amount")

    if not appointment_id or not amount:
        raise HTTPException(400, "appointment_id and amount required")

    # Get patient phone/email
    user_data = db.collection("users").document(user["uid"]).get().to_dict() or {}
    patient_phone = user_data.get("phone", "03000000000")
    patient_email = user_data.get("email", "patient@vela.com")

    if gateway == "jazzcash":
        result = await jazzcash_initiate(amount, appointment_id, patient_phone)
    elif gateway == "easypaisa":
        result = await easypaisa_initiate(amount, appointment_id, patient_email)
    else:
        raise HTTPException(400, f"Unknown gateway '{gateway}'. Use jazzcash or easypaisa")

    # Log payment initiation
    db.collection("payments").add({
        "patient_id": user["uid"],
        "appointment_id": appointment_id,
        "amount": amount,
        "gateway": gateway,
        "txn_ref": result.get("txn_ref") or result.get("order_id"),
        "status": "initiated",
        "created_at": firestore.SERVER_TIMESTAMP
    })

    return result


@router.post("/jazzcash/callback")
async def jazzcash_callback(payload: dict):
    """JazzCash payment callback — verify hash and update status"""
    db = get_db()
    is_valid = verify_payment_callback(dict(payload), "jazzcash")
    txn_ref = payload.get("pp_TxnRefNo")
    txn_status = payload.get("pp_ResponseCode")  # "000" = success

    # Update payment status
    payments = list(db.collection("payments").where(filter=FieldFilter("txn_ref", "==", txn_ref)).stream())
    if payments:
        ref = payments[0].reference
        appointment_id = payments[0].to_dict().get("appointment_id")
        new_status = "completed" if txn_status == "000" else "failed"
        ref.update({"status": new_status, "gateway_response": payload})

        # Update appointment payment status
        if appointment_id and new_status == "completed":
            db.collection("appointments").document(appointment_id).update({
                "payment_status": "paid",
                "updated_at": firestore.SERVER_TIMESTAMP
            })

    return {"received": True}


@router.get("/me")
async def my_payments(user: dict = Depends(get_current_user)):
    """Get patient's payment history"""
    db = get_db()
    payments = (
        db.collection("payments")
        .where(filter=FieldFilter("patient_id", "==", user["uid"]))
        .order_by("created_at", direction=firestore.Query.DESCENDING)
        .limit(20).stream()
    )
    return {"payments": [{"id": p.id, **p.to_dict()} for p in payments]}
