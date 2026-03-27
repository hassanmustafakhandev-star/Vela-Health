from core.groq_client import get_groq
from core.config import settings
from services.ai.embeddings_service import query_medical_knowledge
from fastapi.responses import StreamingResponse

SYSTEM_PROMPT = """You are Sehat AI — a medical triage assistant for Vela Health Pakistan.

LANGUAGE RULE: Detect language from user message. Respond in SAME language.
Urdu message → Urdu response. English message → English response.

VERIFIED MEDICAL CONTEXT (PMDC + WHO guidelines):
{context}

YOUR JOB:
1. Listen carefully to the symptom described
2. Ask 1 focused follow-up question only if truly needed
3. Give your assessment in this EXACT format at the end:

URGENCY: green (rest at home) | yellow (see doctor in 24-48hrs) | red (go to hospital NOW)
POSSIBLE: [condition in plain language — no medical jargon]
RECOMMEND: [clear action for the patient]

STRICT RULES:
- Never give a definitive diagnosis — always say "possibly" or "this may indicate"
- Always recommend professional consultation
- Red urgency = urgent, direct language — do NOT soften it
- Keep response under 150 words
- No complicated medical terms — speak like a caring family doctor
- If asked something non-medical, politely redirect to health topics"""


async def stream_triage(message: str, history: list, language: str = "auto"):
    """
    Sehat AI — main triage function.
    1. Get RAG context from ChromaDB (HuggingFace embeddings)
    2. Build prompt with context injected
    3. Stream Groq LLaMA3 response token by token
    """
    client = get_groq()

    # Step 1: Retrieve relevant medical context (RAG)
    context = query_medical_knowledge(message)

    # Step 2: Build conversation messages
    # Filter history to only valid message format
    safe_history = [
        {"role": m.get("role", "user"), "content": str(m.get("content", m.get("text", "")))}
        for m in history[-10:]  # Keep last 10 messages to avoid token overflow
        if m.get("role") in ("user", "assistant")
    ]

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT.format(context=context)},
        *safe_history,
        {"role": "user", "content": message}
    ]

    # Step 3: Stream Groq LLaMA3 response with Fallback Handling
    def generate():
        try:
            stream = client.chat.completions.create(
                model=settings.groq_model,
                messages=messages,
                stream=True,
                max_tokens=400,
                temperature=0.1,  # Low temp = consistent medical responses
            )
            for chunk in stream:
                if chunk.choices and chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
        except Exception as e:
            import logging
            logging.getLogger("vela").error(f"Groq API Failure: {e}")
            yield "\n[NOTICE: AI Engine is currently in safe mode]\n"
            yield "Based on your symptoms, please maintain health vigilance. "
            yield "If you are experiencing severe pain or difficulty breathing, visit an emergency center immediately. "
            yield "Otherwise, please schedule a consultation with one of our doctors for a precise evaluation.\n\n"
            yield "URGENCY: yellow | POSSIBLE: Temporary service interruption | RECOMMEND: Consult a human doctor via the appointments tab."

    return StreamingResponse(generate(), media_type="text/plain")


def parse_urgency(full_response: str) -> str:
    """Extract urgency color from AI response text"""
    text = full_response.lower()
    if "urgency: red" in text:
        return "red"
    elif "urgency: yellow" in text:
        return "yellow"
    return "green"
