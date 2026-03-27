import tempfile
import os
from core.groq_client import get_groq
from core.config import settings


async def transcribe_audio(audio_bytes: bytes, filename: str) -> dict:
    """
    Transcribe Urdu/English voice using Groq Whisper (free).
    Groq Whisper supports 90+ languages including Urdu natively.

    Returns:
        { transcript: str, language_detected: str }
    """
    client = get_groq()

    # Get file extension
    ext = filename.split(".")[-1].lower() if "." in filename else "webm"

    with tempfile.NamedTemporaryFile(suffix=f".{ext}", delete=False) as tmp:
        tmp.write(audio_bytes)
        tmp_path = tmp.name

    try:
        with open(tmp_path, "rb") as audio_file:
            transcription = client.audio.transcriptions.create(
                file=(filename, audio_file.read()),
                model=settings.groq_whisper_model,
                # language="ur" — leave blank for auto-detection (handles Urdu+English mixed)
                response_format="verbose_json",
            )
        return {
            "transcript": transcription.text,
            "language_detected": transcription.language or "unknown"
        }
    finally:
        os.unlink(tmp_path)
