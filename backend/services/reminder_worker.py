import asyncio
import logging
import time
from datetime import datetime, timezone
from core.firebase import get_db
from google.cloud.firestore_v1.base_query import FieldFilter

logger = logging.getLogger("vela")

async def run_reminder_worker():
    """
    Background worker to process pending medical reminders.
    Ensures persistence: if server restarts, it picks up all unsent reminders 
    whose scheduled time has passed.
    """
    logger.info("Starting Resilient Reminder Worker...")
    
    while True:
        try:
            db = get_db()
            now = datetime.now(timezone.utc)
            
            # Query unsent reminders that are due using modern FieldFilter API
            pending_query = (
                db.collection("reminders")
                .where(filter=FieldFilter("sent", "==", False))
                .where(filter=FieldFilter("remind_at", "<=", now))
                .limit(50) # Process in batches
            )
            
            pending = pending_query.get()
            
            if not pending:
                await asyncio.sleep(30) # Wait 30s if nothing to do
                continue

            for doc in pending:
                data = doc.to_dict()
                appt_id = data.get("appointment_id")
                
                logger.info(f"Processing reminder for appointment {appt_id}")
                
                # SIMULATION: In a real app, this is where SMS/Push/Email is triggered
                # await send_push_notification(user_id, "You have an appointment soon!")
                
                # Mark as sent
                doc.reference.update({"sent": True, "sent_at": datetime.now(timezone.utc)})
                
            logger.info(f"Successfully processed {len(pending)} reminders")
            
        except Exception as e:
            if "The query requires an index" in str(e):
                logger.warning("Action Required: A composite index is needed for medical reminders. Please create it in the Firebase console.")
            else:
                logger.error(f"Reminder Worker Error: {str(e)}")
            await asyncio.sleep(60) # Backoff on error
        
        await asyncio.sleep(60) # Interval check

def start_reminder_worker(loop: asyncio.AbstractEventLoop):
    """Entry point to start the worker in the existing event loop"""
    loop.create_task(run_reminder_worker())
