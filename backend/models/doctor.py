from pydantic import BaseModel, Field
from typing import Optional, List


class DoctorCreate(BaseModel):
    name: str
    pmdc_number: str = Field(..., min_length=5, description="PMDC registration number")
    specialties: List[str] = Field(..., min_length=1)
    qualification: str
    experience_years: int = Field(..., ge=0, le=60)
    city: str
    consultation_fee_video: int = Field(..., ge=0)
    consultation_fee_clinic: Optional[int] = None
    clinic_address: Optional[str] = None
    clinic_lat: Optional[float] = None
    clinic_lng: Optional[float] = None
    bio: Optional[str] = None
    languages: List[str] = ["Urdu", "English"]
    session_duration: int = Field(default=30, ge=15, le=60)
    buffer_minutes: int = Field(default=5, ge=0, le=30)
 
    # Verification Files
    degree_url: Optional[str] = None
    pmdc_card_url: Optional[str] = None


class DoctorAvailability(BaseModel):
    day_of_week: int = Field(..., ge=0, le=6, description="0=Monday ... 6=Sunday")
    active: bool
    start_time: str = Field(..., description="HH:MM format e.g. 09:00")
    end_time: str = Field(..., description="HH:MM format e.g. 17:00")


class DoctorReview(BaseModel):
    rating: float = Field(..., ge=1, le=5)
    comment: Optional[str] = None
    appointment_id: str


class DoctorVerification(BaseModel):
    status: str = Field(..., description="verified, suspended, or rejected")


class DoctorProfileUpdate(BaseModel):
    """Fields that a verified doctor is allowed to self-update"""
    bio: Optional[str] = None
    city: Optional[str] = None
    phone: Optional[str] = None
    fee: Optional[int] = Field(None, ge=100, le=10000)
