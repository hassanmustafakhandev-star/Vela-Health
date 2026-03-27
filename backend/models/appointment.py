from pydantic import BaseModel, Field
from typing import Optional, Literal


class AppointmentCreate(BaseModel):
    doctor_id: str
    date: str = Field(..., description="YYYY-MM-DD format")
    time: str = Field(..., description="HH:MM format")
    type: Literal["video", "clinic"] = "video"
    reason: str = Field(..., min_length=3, max_length=500)
    fee: int = Field(..., ge=0)
    payment_method: Optional[str] = None


class AppointmentUpdate(BaseModel):
    status: Optional[Literal["confirmed", "cancelled", "completed", "no_show"]] = None
    notes: Optional[str] = None
