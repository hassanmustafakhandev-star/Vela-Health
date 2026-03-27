from core.groq_client import get_groq
from core.config import settings

INSIGHT_PROMPT = """You are a health data analyst for Vela Health Pakistan.
Analyze this patient's health records and give a concise insight.

Instructions:
- Write 2-3 sentences maximum  
- Use plain language (no medical jargon)
- Mention any positive trends or concerns
- Be caring and non-alarming unless truly urgent
- Respond in {language}

Patient Health Data:
{data}

Provide a clear, helpful health summary:"""


def generate_health_insight(records: dict, language: str = "en") -> str:
    """
    Generate AI health insight from Firestore records using Groq (free).
    Called from /v1/ai/insights endpoint.
    """
    client = get_groq()

    # Format the health data for the prompt
    data_parts = []
    if records.get("bp_readings"):
        data_parts.append(f"Blood Pressure (recent): {records['bp_readings'][-5:]}")
    if records.get("sugar_readings"):
        data_parts.append(f"Blood Sugar (recent): {records['sugar_readings'][-5:]}")
    if records.get("weight_readings"):
        data_parts.append(f"Weight trend: {records['weight_readings'][-5:]}")
    if records.get("diagnoses"):
        data_parts.append(f"Recent diagnoses: {records['diagnoses']}")
    if records.get("medications"):
        data_parts.append(f"Current medications: {records['medications']}")
    if records.get("vitals"):
        data_parts.append(f"Recent vitals: {records['vitals'][:3]}")

    if not data_parts:
        return "No health records found. Start tracking your vitals to get personalized insights."

    data_str = "\n".join(data_parts)
    lang_label = "Urdu" if language == "ur" else "English"

    response = client.chat.completions.create(
        model=settings.groq_model,
        messages=[{
            "role": "user",
            "content": INSIGHT_PROMPT.format(data=data_str, language=lang_label)
        }],
        max_tokens=200,
        temperature=0.2,
    )
    return response.choices[0].message.content
