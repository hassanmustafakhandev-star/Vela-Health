from fastapi import HTTPException, Depends
from middleware.auth import get_current_user


def require_role(*roles: str):
    """
    Role-based access guard. Use as a FastAPI dependency.

    Example:
        @router.post("/prescriptions")
        async def create_prescription(doctor=Depends(require_role("doctor"))):
            ...

        @router.put("/doctor/verify/{uid}")
        async def verify_doctor(admin=Depends(require_role("admin"))):
            ...
    """
    async def _guard(current_user: dict = Depends(get_current_user)) -> dict:
        if current_user["role"] not in roles:
            raise HTTPException(
                status_code=403,
                detail=f"Forbidden. Required: {list(roles)}, your role: '{current_user['role']}'"
            )
        return current_user
    return _guard
