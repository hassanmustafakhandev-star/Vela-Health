from pydantic import BaseModel, Field
from typing import Optional, List


class Medication(BaseModel):
    name: str
    dose: str
    frequency: str
    duration: str
    instructions: Optional[str] = None


class PrescriptionCreate(BaseModel):
    patient_id: str
    appointment_id: Optional[str] = None
    diagnosis: str
    medications: List[Medication]
    advice: Optional[str] = None
    follow_up_days: Optional[int] = None
    lab_tests: Optional[List[str]] = None
