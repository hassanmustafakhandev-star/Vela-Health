from pydantic import BaseModel, Field
from typing import Optional

class FamilyMemberCreate(BaseModel):
    name: str = Field(..., min_length=2)
    relation: str = Field(..., description="E.g., Son, Daughter, Wife, Mother")
    age: int = Field(..., ge=0, le=120)
    gender: Optional[str] = None
    blood_group: Optional[str] = None

class FamilyMemberUpdate(BaseModel):
    name: Optional[str] = None
    relation: Optional[str] = None
    age: Optional[int] = None
    status: Optional[str] = Field(None, description="Healthy, Mild Fever, Monitored")
    heart_rate: Optional[str] = None
    records_count: Optional[int] = None
