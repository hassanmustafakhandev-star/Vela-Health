import requests
from core.config import settings

HF_API_URL = (
    f"https://router.huggingface.co/hf-inference/models/"
    f"{settings.hf_embedding_model}"
)
HEADERS = {"Authorization": f"Bearer {settings.hf_api_key}"}


def embed_text(text: str) -> list[float]:
    """
    Get text embedding from HuggingFace free inference API.
    Model: sentence-transformers/all-MiniLM-L6-v2
    Free tier: 30K chars/month — more than enough for MVP.
    """
    if not settings.hf_api_key:
        # Return dummy embedding for local dev without HF key
        return [0.0] * 384

    response = requests.post(
        HF_API_URL,
        headers=HEADERS,
        json={"inputs": text, "options": {"wait_for_model": True}},
        timeout=30
    )
    if not response.ok:
        raise RuntimeError(f"HuggingFace API error: {response.status_code} — {response.text}")

    result = response.json()
    # HF sentence-transformers returns nested list — take first element
    if isinstance(result, list) and isinstance(result[0], list):
        return result[0]
    return result


def query_medical_knowledge(query: str, n_results: int = 3) -> str:
    """
    Query ChromaDB for relevant medical context using HuggingFace embeddings.
    Called before every Groq AI call for RAG (retrieval-augmented generation).
    """
    try:
        from core.chroma import get_medical_collection
        collection = get_medical_collection()
        query_embedding = embed_text(query)
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results,
            include=["documents", "metadatas"]
        )
        if not results["documents"] or not results["documents"][0]:
            return "No specific context available."
        return "\n\n".join(results["documents"][0])
    except Exception as e:
        return f"Context unavailable: {str(e)}"


def add_to_knowledge_base(
    texts: list[str],
    ids: list[str],
    metadatas: list[dict],
    collection_name: str = "medical"
):
    """Add documents to ChromaDB (run once via scripts/index_knowledge.py)"""
    from core.chroma import get_medical_collection, get_medicines_collection
    collection = get_medical_collection() if collection_name == "medical" else get_medicines_collection()
    embeddings = [embed_text(t) for t in texts]
    collection.add(
        embeddings=embeddings,
        documents=texts,
        ids=ids,
        metadatas=metadatas
    )
    return len(texts)
