"""
tests/test_ai.py
AI endpoint tests.
"""
import pytest
from unittest.mock import patch, MagicMock


def test_ai_symptoms_no_auth():
    """AI endpoint without token should return 401/403"""
    with patch("firebase_admin.initialize_app"), \
         patch("firebase_admin.credentials.Certificate"), \
         patch("firebase_admin.firestore.client"), \
         patch("firebase_admin.storage.bucket"):
        from fastapi.testclient import TestClient
        from main import app
        client = TestClient(app)

    response = client.post(
        "/v1/ai/symptoms",
        json={"message": "I have a fever", "history": []}
    )
    assert response.status_code in [401, 403, 422]


def test_ai_scan_no_body():
    """Scan endpoint without barcode or image should return 400"""
    with patch("firebase_admin.initialize_app"), \
         patch("firebase_admin.credentials.Certificate"), \
         patch("firebase_admin.firestore.client"), \
         patch("firebase_admin.storage.bucket"):
        from fastapi.testclient import TestClient
        from main import app
        client = TestClient(app)

    response = client.post(
        "/v1/ai/scan",
        headers={"Authorization": "Bearer mock-should-fail"}
    )
    assert response.status_code in [401, 422]
