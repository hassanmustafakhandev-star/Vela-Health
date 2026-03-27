from core.config import settings

# All CORS origins allowed — set via ALLOWED_ORIGINS env var
CORS_ORIGINS = settings.allowed_origins_list
CORS_METHODS = ["*"]
CORS_HEADERS = ["*"]
CORS_CREDENTIALS = True
