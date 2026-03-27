from firebase_admin import auth as firebase_auth
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer(auto_error=True)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """
    Verify Firebase ID token on every authenticated request.
    Returns a dict with uid, email, phone, role.
    """
    raw = credentials.credentials

    # Reject any mock/dev tokens
    if raw.startswith("mock-") or raw.startswith("dev-"):
        raise HTTPException(status_code=401, detail="Mock tokens are not accepted by this API")

    try:
        decoded = firebase_auth.verify_id_token(raw)
        return {
            "uid":   decoded["uid"],
            "email": decoded.get("email"),
            "phone": decoded.get("phone_number"),
            "role":  decoded.get("vela_role", "patient"),
        }
    except firebase_auth.ExpiredIdTokenError:
        raise HTTPException(status_code=401, detail="Token expired — please sign in again")
    except firebase_auth.RevokedIdTokenError:
        raise HTTPException(status_code=401, detail="Token revoked — please sign in again")
    except firebase_auth.InvalidIdTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")
