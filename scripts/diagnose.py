import requests
import os
import socket
import sys
from pathlib import Path

def check_port(port, host='127.0.0.1'):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex((host, port)) == 0

def diagnose():
    print("=== VELA 3.0 DIAGNOSTIC TOOL ===")
    
    # 1. Check Paths
    root = Path(__file__).parent.parent
    frontend = root / "frontend"
    backend = root / "backend"
    
    print(f"\n[1] Paths:")
    print(f"  Frontend: {frontend.exists()}")
    print(f"  Backend: {backend.exists()}")

    # 2. Check Env Files
    print(f"\n[2] Configurations:")
    fe_env = frontend / ".env.local"
    be_env = backend / ".env"
    
    if fe_env.exists():
        print(f"  [OK] Frontend .env.local found")
        with open(fe_env, 'r') as f:
            content = f.read()
            if 'NEXT_PUBLIC_API_URL' in content:
                url = [l for l in content.splitlines() if 'NEXT_PUBLIC_API_URL' in l][0]
                print(f"     -> {url}")
    else:
        print(f"  [FAIL] Frontend .env.local MISSING")

    if be_env.exists():
        print(f"  [OK] Backend .env found")
    else:
        print(f"  [FAIL] Backend .env MISSING")

    # 3. Check Ports
    print(f"\n[3] Service Status (Network):")
    fe_running = check_port(3000) or check_port(3001)
    be_running = check_port(8000)
    
    print(f"  Frontend (3000/3001): {'UP' if fe_running else 'DOWN'}")
    print(f"  Backend (8000): {'UP' if be_running else 'DOWN'}")

    # 4. Check API Integration
    if be_running:
        print(f"\n[4] API Integration Test:")
        try:
            # Check Health
            res = requests.get("http://127.0.0.1:8000/health", timeout=2)
            print(f"  [OK] Backend Health (Root): {res.status_code}")
            
            # Check Auth Verify (Expected 401/405, not 404)
            res = requests.post("http://127.0.0.1:8000/v1/auth/verify", timeout=2)
            if res.status_code in [401, 403, 405]:
                print(f"  [OK] Auth Endpoint reachable (Status {res.status_code})")
            else:
                print(f"  [WARN] Auth Endpoint returned unexpected status: {res.status_code}")
        except Exception as e:
            print(f"  [FAIL] Backend Integration FAIL: {e}")

    # 5. Check Requirements
    print(f"\n[5] System Locks:")
    lock_file = frontend / ".next" / "dev" / "lock"
    if lock_file.exists():
        print(f"  [WARN] Next.js Dev Lock exists. If the server is not starting, another instance is running.")
    else:
        print(f"  [OK] No Next.js dev lock detected.")

    be_venv = backend / ".venv"
    if be_venv.exists():
        print(f"  [OK] Virtual environment found")
    else:
        print(f"  ❌ .venv MISSING — please run: python -m venv .venv")

    print(f"\n=== DIAGNOSIS COMPLETE ===")
    if not be_running:
        print("\nSUGGESTION: Backend is not running. Start it with:")
        print("cd backend && .venv\\Scripts\\python -m uvicorn main:socket_app --reload --port 8000")
    if not fe_running:
        print("\nSUGGESTION: Frontend is not running. Start it with:")
        print("cd frontend && npm run dev")

if __name__ == "__main__":
    diagnose()
