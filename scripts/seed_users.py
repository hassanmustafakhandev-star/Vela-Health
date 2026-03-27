# -*- coding: utf-8 -*-
import sys
import os

# Ensure stdout uses UTF-8 on Windows
sys.stdout.reconfigure(encoding='utf-8')

import requests

FIREBASE_API_KEY = os.getenv("FIREBASE_WEB_API_KEY")
BACKEND_URL = "http://127.0.0.1:8000/v1"

SIGNUP_URL = f"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={FIREBASE_API_KEY}"
SIGNIN_URL = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_API_KEY}"


def fire_register(email, password):
    """Register or sign in user on Firebase. Returns (token, uid) or (None, None)."""
    payload = {"email": email, "password": password, "returnSecureToken": True}
    res = requests.post(SIGNUP_URL, json=payload)
    if res.status_code == 200:
        data = res.json()
        print(f"  [OK] Firebase: Created {email} (UID: {data['localId']})")
        return data["idToken"], data["localId"]
    elif "EMAIL_EXISTS" in res.text:
        res2 = requests.post(SIGNIN_URL, json=payload)
        if res2.status_code == 200:
            data = res2.json()
            print(f"  [INFO] Firebase: {email} already exists — signed in (UID: {data['localId']})")
            return data["idToken"], data["localId"]
    print(f"  [FAIL] Firebase failed for {email}: {res.text}")
    return None, None


def backend_verify(token):
    """Call backend /auth/verify to initialize Firestore user doc."""
    try:
        res = requests.post(
            f"{BACKEND_URL}/auth/verify",
            headers={"Authorization": f"Bearer {token}"},
            timeout=5
        )
        if res.status_code == 200:
            data = res.json()
            print(f"  [OK] Backend: Initialized with role='{data['role']}'")
            return True
        else:
            print(f"  [WARN] Backend response: {res.status_code} {res.text}")
    except requests.exceptions.ConnectionError:
        print("  [WARN] Backend not running (port 8000). Skipping Firestore init.")
    return False


def backend_doctor_register(token, doctor_data):
    """Submit doctor application to backend."""
    try:
        res = requests.post(
            f"{BACKEND_URL}/auth/doctor/register",
            headers={"Authorization": f"Bearer {token}"},
            json=doctor_data,
            timeout=5
        )
        if res.status_code == 200:
            print("  [OK] Backend: Doctor application submitted — status=pending")
        else:
            print(f"  [WARN] Backend: {res.status_code} {res.text}")
    except requests.exceptions.ConnectionError:
        print("  [WARN] Backend not running. Skipping doctor registration call.")


def seed_patient(email, password):
    print(f"\n[PATIENT] Seeding: {email}")
    token, uid = fire_register(email, password)
    if not token:
        return
    backend_verify(token)


def seed_doctor(email, password, name, pmdc, city, specialties):
    print(f"\n[DOCTOR] Seeding: {email}")
    token, uid = fire_register(email, password)
    if not token:
        return
    if backend_verify(token):
        backend_doctor_register(token, {
            "name": name,
            "pmdc_number": pmdc,
            "specialties": specialties,
            "qualification": "MBBS, FCPS",
            "experience_years": 8,
            "city": city,
            "consultation_fee_video": 1500,
            "bio": f"Experienced specialist in {', '.join(specialties)} based in {city}.",
            "languages": ["Urdu", "English"]
        })


if __name__ == "__main__":
    print("=" * 55)
    print("   VELA HEALTH -- USER SEED SCRIPT")
    print("=" * 55)

    # Patients
    seed_patient("patient1@vela.com", "vela@1234")
    seed_patient("patient2@vela.com", "vela@1234")

    # Doctors
    seed_doctor("drsmith@vela.com", "vela@1234", "Dr. Adam Smith", "PMDC-10001", "Lahore",    ["Cardiology"])
    seed_doctor("drsarah@vela.com", "vela@1234", "Dr. Sarah Khan", "PMDC-10002", "Karachi",   ["Pediatrics"])
    seed_doctor("drazhar@vela.com", "vela@1234", "Dr. Azhar Raza", "PMDC-10003", "Islamabad", ["General Medicine"])

    print("\n" + "=" * 55)
    print("  Done! Start the backend and re-run to sync Firestore.")
    print("=" * 55)
