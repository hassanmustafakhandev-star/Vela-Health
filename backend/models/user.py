from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserProfile(BaseModel):
    name: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    language: Optional[str] = "en"
    photo_url: Optional[str] = None
    fcm_token: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None


class FamilyMember(BaseModel):
    name: str
    relation: str
    date_of_birth: Optional[str] = None
    blood_group: Optional[str] = None
    gender: Optional[str] = None
