from groq import Groq
from core.config import settings

_client = None


def get_groq() -> Groq:
    global _client
    if _client is None:
        if not settings.groq_api_key:
            raise RuntimeError("GROQ_API_KEY not set. Get free key at console.groq.com (no card needed)")
        _client = Groq(api_key=settings.groq_api_key)
    return _client
