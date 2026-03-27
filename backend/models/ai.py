from pydantic import BaseModel, Field
from typing import Optional, List


class SymptomRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    history: List[dict] = Field(default_factory=list)
    language: str = Field(default="auto", description="auto | en | ur")


class ScanRequest(BaseModel):
    barcode: Optional[str] = None


class HealthInsightRequest(BaseModel):
    language: str = "en"


class SaveSessionRequest(BaseModel):
    messages: List[dict]
    urgency: str = "green"
    specialty: Optional[str] = None
