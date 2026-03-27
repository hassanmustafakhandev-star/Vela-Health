from fastapi import HTTPException, Depends
from middleware.auth import get_current_user


def require_role(*roles: str):
    """
    Role-based access control decorator.

    Usage in routers:
        @router.post("/prescription")
        async def create(doctor=Depends(require_role("doctor"))):
            ...
    """
    async def check(current_user: dict = Depends(get_current_user)):
        if current_user["role"] not in roles:
            raise HTTPException(
                status_code=403,
                detail=f"Access denied. Required role(s): {list(roles)}. Your role: {current_user['role']}"
            )
        return current_user
    return check
