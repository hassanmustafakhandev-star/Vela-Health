import hashlib
import hmac
import datetime
import httpx
from core.config import settings


# ─── JazzCash ─────────────────────────────────────────────────────────────────

JAZZCASH_SANDBOX_URL = "https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/"
JAZZCASH_LIVE_URL = "https://payments.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/"


def _jazzcash_hash(data: dict) -> str:
    """Generate JazzCash integrity hash"""
    sorted_values = sorted(data.values())
    hash_string = f"{settings.jazzcash_integrity_salt}&" + "&".join(str(v) for v in sorted_values)
    return hmac.new(
        settings.jazzcash_integrity_salt.encode(),
        hash_string.encode(),
        hashlib.sha256
    ).hexdigest()


async def jazzcash_initiate(
    amount_pkr: int,
    appointment_id: str,
    patient_phone: str,
    description: str = "Vela Health Consultation"
) -> dict:
    """
    Initiate JazzCash payment.
    Uses sandbox by default (JAZZCASH_SANDBOX=true env var).
    Returns redirect URL + form data for frontend.
    """
    now = datetime.datetime.now()
    txn_ref = f"VELA-{appointment_id[:8]}-{now.strftime('%Y%m%d%H%M%S')}"
    expiry = (now + datetime.timedelta(hours=1)).strftime("%Y%m%d%H%M%S")

    payload = {
        "pp_Version": "1.1",
        "pp_TxnType": "MWALLET",
        "pp_Language": "EN",
        "pp_MerchantID": settings.jazzcash_merchant_id,
        "pp_Password": settings.jazzcash_password,
        "pp_TxnRefNo": txn_ref,
        "pp_Amount": str(amount_pkr * 100),  # JazzCash uses paisas
        "pp_TxnCurrency": "PKR",
        "pp_TxnDateTime": now.strftime("%Y%m%d%H%M%S"),
        "pp_BillReference": appointment_id,
        "pp_Description": description,
        "pp_TxnExpiryDateTime": expiry,
        "pp_ReturnURL": f"{settings.api_base_url}/v1/payments/jazzcash/callback",
        "pp_MobileNumber": patient_phone.replace("+92", "0"),
        "ppmpf_1": appointment_id,
    }

    payload["pp_SecureHash"] = _jazzcash_hash(payload)
    url = JAZZCASH_SANDBOX_URL if settings.jazzcash_sandbox else JAZZCASH_LIVE_URL

    return {
        "payment_url": url,
        "form_data": payload,
        "txn_ref": txn_ref
    }


# ─── Easypaisa ────────────────────────────────────────────────────────────────

EASYPAISA_SANDBOX_URL = "https://easypay.easypaisa.com.pk/tpg/index.jsp"
EASYPAISA_LIVE_URL = "https://easypay.easypaisa.com.pk/tpg/index.jsp"


async def easypaisa_initiate(
    amount_pkr: int,
    appointment_id: str,
    patient_email: str,
    description: str = "Vela Health Consultation"
) -> dict:
    """
    Initiate Easypaisa payment.
    Returns redirect URL + params for frontend.
    """
    now = datetime.datetime.now()
    order_id = f"V{appointment_id[:8]}{now.strftime('%H%M%S')}"

    return {
        "payment_url": EASYPAISA_SANDBOX_URL,
        "order_id": order_id,
        "amount": amount_pkr,
        "store_id": settings.easypaisa_store_id,
        "description": description,
        "email": patient_email
    }


def verify_payment_callback(payload: dict, gateway: str) -> bool:
    """Verify payment callback integrity hash"""
    if gateway == "jazzcash":
        received_hash = payload.pop("pp_SecureHash", "")
        expected_hash = _jazzcash_hash(payload)
        return hmac.compare_digest(received_hash, expected_hash)
    return True  # Easypaisa — verify in production with their SDK
