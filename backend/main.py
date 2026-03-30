from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import socketio

from core.config import settings
from core.firebase import init_firebase, get_db
from core.chroma import init_chroma
from middleware.error_handler import GlobalExceptionMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Initialize Rate Limiter
limiter = Limiter(key_func=get_remote_address)

# Import socket server + events (must import namespace to register events)
from ws.server import sio
import ws.consult_namespace  # noqa: F401 — registers all event handlers

# Import all routers
from routers import auth, ai, doctors, appointments, consult
from routers import prescriptions, records, pharmacy, lab, emergency, payments
from routers import admin, family, doctor_patients
import asyncio
from services.reminder_worker import start_reminder_worker

# ─── Initialize services on startup ──────────────────────────────────────────
def startup_checks():
    """Verify all critical environment variables are set before boot"""
    import logging
    logger = logging.getLogger("vela")
    
    missing = []
    for key in ["firebase_project_id", "firebase_private_key", "groq_api_key", "hf_api_key"]:
        if not getattr(settings, key):
            missing.append(key)
    
    if missing:
        logger.critical(f"FATAL: Missing environment variables: {', '.join(missing)}")
        import sys
        sys.exit(1)
    
    logger.info("Startup Environment Integrity Check: PASSED")

# Run checks immediately on import
startup_checks()

init_firebase()
init_chroma()

# ─── FastAPI app ─────────────────────────────────────────────────────────────
app = FastAPI(
    title="Vela Health API",
    version="3.0.0",
    description="Vela Health Pakistan — AI-powered telemedicine platform",
    docs_url="/docs",
    redoc_url="/redoc",
)

@app.on_event("startup")
async def on_startup():
    loop = asyncio.get_event_loop()
    start_reminder_worker(loop)

# ─── Middleware & Rate Limiting ──────────────────────────────────────────────
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(GlobalExceptionMiddleware)

# ─── CORS Middleware ──────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Include all routers ──────────────────────────────────────────────────────
app.include_router(auth.router,          prefix="/v1/auth")
app.include_router(ai.router,            prefix="/v1/ai")
app.include_router(doctors.router,       prefix="/v1/doctors")
app.include_router(appointments.router,  prefix="/v1/appointments")
app.include_router(consult.router,       prefix="/v1/consult")
app.include_router(prescriptions.router, prefix="/v1/prescriptions")
app.include_router(records.router,       prefix="/v1/records")
app.include_router(pharmacy.router,      prefix="/v1/pharmacy")
app.include_router(lab.router,           prefix="/v1/lab")
app.include_router(emergency.router,     prefix="/v1/emergency")
app.include_router(payments.router,      prefix="/v1/payments")
app.include_router(admin.router,          prefix="/v1/admin")
app.include_router(family.router,         prefix="/v1/family")
app.include_router(doctor_patients.router, prefix="/v1/doctor/patients")

# ─── Health check ─────────────────────────────────────────────────────────────
@app.get("/health", tags=["Health"])
@limiter.limit("10/minute")
async def health(request: Request):
    """Deep health check verifying core services connectivity"""
    db_status = "error"
    try:
        # Non-destructive read to verify Firestore is active
        get_db().collection("health").document("ping").get()
        db_status = "connected"
    except Exception:
        db_status = "disconnected"

    return {
        "status": "ok" if db_status == "connected" else "degraded",
        "version": "3.0.0",
        "database": db_status,
        "service": "Vela Health API"
    }

@app.get("/warmup", tags=["Health"])
async def warmup():
    """Endpoint for cold-start prevention / instance warming"""
    # Simply wake up the AI client or other pre-loaders
    from core.groq_client import get_groq
    get_groq()
    return {"warmed": True}


# ─── Mount Socket.io for WebRTC signaling ────────────────────────────────────
# socket_app is the ASGI app that wraps FastAPI + Socket.io
# Run with: uvicorn main:socket_app --reload --port 8000
socket_app = socketio.ASGIApp(sio, app)
