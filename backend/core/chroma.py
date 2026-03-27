import json
import os
import numpy as np
from pathlib import Path

# Local storage path for our zero-dependency vector store
DATA_DIR = Path(__file__).parent.parent / "data" / "vector_store"
os.makedirs(DATA_DIR, exist_ok=True)


class VelaVectorStore:
    """
    Zero-dependency local vector store for small datasets.
    Replaces ChromaDB to avoid Windows C++ build errors.
    Uses numpy for fast cosine similarity.
    """
    def __init__(self, collection_name: str):
        self.collection_name = collection_name
        self.file_path = DATA_DIR / f"{collection_name}.json"
        self._load()

    def _load(self):
        if self.file_path.exists():
            with open(self.file_path, "r") as f:
                self.data = json.load(f)
        else:
            self.data = {"ids": [], "embeddings": [], "documents": [], "metadatas": []}

    def _save(self):
        with open(self.file_path, "w") as f:
            json.dump(self.data, f, indent=2)

    def add(self, embeddings: list[list[float]], documents: list[str], ids: list[str], metadatas: list[dict]):
        self.data["ids"].extend(ids)
        self.data["embeddings"].extend(embeddings)
        self.data["documents"].extend(documents)
        self.data["metadatas"].extend(metadatas)
        self._save()

    def query(self, query_embeddings: list[list[float]], n_results: int = 3) -> dict:
        if not self.data["embeddings"]:
            return {"documents": [[]], "metadatas": [[]]}

        # Convert to numpy for fast math
        search_vec = np.array(query_embeddings[0])
        all_vecs = np.array(self.data["embeddings"])

        # Cosine similarity
        # Similarity = (A . B) / (||A|| * ||B||)
        norm_a = np.linalg.norm(search_vec)
        norm_b = np.linalg.norm(all_vecs, axis=1)
        
        # Avoid division by zero
        dot_product = np.dot(all_vecs, search_vec)
        denominator = norm_a * norm_b + 1e-9
        similarities = dot_product / denominator

        # Get top N indices
        top_indices = np.argsort(similarities)[-n_results:][::-1]
        
        # Filter for only those with some content
        valid_indices = [i for i in top_indices if i < len(self.data["documents"])]

        results = {
            "documents": [[self.data["documents"][i] for i in valid_indices]],
            "metadatas": [[self.data["metadatas"][i] for i in valid_indices]],
            "distances": [[float(1 - similarities[i]) for i in valid_indices]]
        }
        return results


def get_medical_collection():
    return VelaVectorStore("medical")


def get_medicines_collection():
    return VelaVectorStore("medicines")


def init_chroma():
    """Kept for compatibility with existing imports in core/chroma.py"""
    os.makedirs(DATA_DIR, exist_ok=True)
