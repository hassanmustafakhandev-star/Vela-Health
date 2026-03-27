from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Firebase
    firebase_project_id: str
    firebase_private_key: str
    firebase_client_email: str
    firebase_storage_bucket: str
    firebase_service_account_path: Optional[str] = None

    # Groq (free API — no card — console.groq.com)
    groq_api_key: str
    groq_model: str = "llama-3.3-70b-versatile"
    groq_whisper_model: str = "whisper-large-v3"

    # HuggingFace (free API — no card — huggingface.co)
    hf_api_key: str
    hf_embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    hf_vision_model: str = "Salesforce/blip-image-captioning-large"

    # App
    api_base_url: str = "http://localhost:8000"
    frontend_url: str = "http://localhost:3000"
    secret_key: str = "changeme-dev-secret-key-replace-in-production"
    debug: bool = True
    allowed_origins: str = "http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,http://127.0.0.1:3001"

    # JazzCash sandbox
    jazzcash_merchant_id: str = ""
    jazzcash_password: str = ""
    jazzcash_integrity_salt: str = ""
    jazzcash_sandbox: bool = True

    # Easypaisa sandbox
    easypaisa_store_id: str = ""
    easypaisa_hash_key: str = ""

    @property
    def allowed_origins_list(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",")]

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
