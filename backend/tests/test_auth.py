"""
tests/test_auth.py
Root-level auth endpoint tests.
Run: pytest tests/ -v
"""
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock

# Mock Firebase before importing app
with patch("firebase_admin.initialize_app"), \
     patch("firebase_admin.credentials.Certificate"), \
     patch("firebase_admin.firestore.client"), \
     patch("firebase_admin.storage.bucket"):
    from main import app

client = TestClient(app)


def test_health_check():
    """Health endpoint should always return 200"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["version"] == "3.0.0"


def test_verify_token_no_auth():
    """Auth endpoint without token should return 403"""
    response = client.post("/v1/auth/verify")
    assert response.status_code in [401, 403, 422]


def test_verify_token_mock_rejected():
    """Mock tokens must be rejected"""
    response = client.post(
        "/v1/auth/verify",
        headers={"Authorization": "Bearer mock-token-dr-hassan"}
    )
    assert response.status_code == 401


def test_docs_available():
    """FastAPI docs should be accessible"""
    response = client.get("/docs")
    assert response.status_code == 200
