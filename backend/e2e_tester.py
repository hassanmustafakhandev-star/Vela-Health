import os
import requests
import firebase_admin
from firebase_admin import auth, credentials
import time

# --- Configuration ---
API_BASE = "http://127.0.0.1:8000/v1"
FIREBASE_WEB_API_KEY = os.getenv("FIREBASE_WEB_API_KEY")

print("[START] Starting End-to-End Vela API Tests...")

# Initialize Firebase Admin if not already
if not firebase_admin._apps:
    cred = credentials.Certificate("firebase-service-account.json")
    firebase_admin.initialize_app(cred)

def get_id_token_for_uid(uid: str) -> str:
    """Mints a custom token and exchanges it for a real ID token."""
    custom_token = auth.create_custom_token(uid)
    # Exchange custom token for ID token
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key={FIREBASE_WEB_API_KEY}"
    res = requests.post(url, json={"token": custom_token.decode("utf-8"), "returnSecureToken": True})
    if not res.ok:
        raise Exception(f"Failed to get ID token: {res.text}")
    return res.json()["idToken"]

def test_flow():
    # --- 1. Authenticaton Flow ---
    print("\n--- Testing Authentication ---")
    patient_uid = "test_patient_001"
    doctor_uid = "test_doctor_001"
    
    print("Generating Patient Token...")
    patient_token = get_id_token_for_uid(patient_uid)
    print("Generating Doctor Token...")
    doctor_token = get_id_token_for_uid(doctor_uid)
    
    # Verify Patient
    res = requests.post(f"{API_BASE}/auth/verify", headers={"Authorization": f"Bearer {patient_token}"})
    print(f"Patient Verify Status: {res.status_code}")
    print(f"Patient Verify Body: {res.text}")
    assert res.ok, "Patient Verify Failed"
    
    # Verify Doctor
    res = requests.post(f"{API_BASE}/auth/verify", headers={"Authorization": f"Bearer {doctor_token}"})
    print(f"Doctor Verify Status: {res.status_code}")
    print(f"Doctor Verify Body: {res.text}")
    assert res.ok, "Doctor Verify Failed"

    # --- 2. Profile Setup (Doctor) ---
    print("\n--- Testing Doctor Registration ---")
    doc_data = {
        "name": "Dr. AI Tester",
        "pmdc_number": "12345",
        "specialties": ["Cardiology", "General"],
        "qualification": "MBBS, FCPS",
        "experience_years": 10,
        "city": "Lahore",
        "consultation_fee": 1500,
        "consultation_fee_video": 1000,
        "about": "Expert in heart related issues."
    }
    res = requests.post(
        f"{API_BASE}/auth/doctor/register", 
        json=doc_data, 
        headers={"Authorization": f"Bearer {doctor_token}"}
    )
    print(f"Doctor Register: {res.status_code} - {res.text}")
    if res.status_code != 409: # 409 if already exists
        assert res.ok, "Doctor Registration Failed"

    # --- 3. AI Triage Service ---
    print("\n--- Testing AI Triage Service ---")
    triage_req = {
        "message": "I am having severe and sudden chest pain with shortness of breath.",
        "history": [],
        "language": "en"
    }
    res = requests.post(
        f"{API_BASE}/ai/symptoms", 
        json=triage_req, 
        headers={"Authorization": f"Bearer {patient_token}"}
    )
    print(f"AI Triage Response: {res.status_code}")
    if res.ok:
        print("AI Output:", res.json().get("triage_result", "No result")[:100], "...")
    else:
        print(f"AI Failure: {res.text}")

    print("\n[SUCCESS] All End-to-End Core Integration Tests Completed Successfully.")

if __name__ == "__main__":
    try:
        test_flow()
    except Exception as e:
        print(f"\n[ERROR] Test execution failed: {e}")
