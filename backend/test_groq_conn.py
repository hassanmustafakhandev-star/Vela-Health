import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

try:
    completion = client.chat.completions.create(
        model=os.getenv("LLM_MODEL"),
        messages=[{"role": "user", "content": "Say 'Groq Active' if you can read this."}],
        max_tokens=10
    )
    print(completion.choices[0].message.content)
except Exception as e:
    print(f"Error: {e}")
