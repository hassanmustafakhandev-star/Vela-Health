import logging
import json
import time
from fastapi import Request, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

# Structured Logging Formatter
class JsonFormatter(logging.Formatter):
    def format(self, record):
        log_record = {
            "timestamp": self.formatTime(record),
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module,
            "func": record.funcName
        }
        if record.exc_info:
            log_record["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_record)

# Initialize logging
logger = logging.getLogger("vela")
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
handler.setFormatter(JsonFormatter())
logger.addHandler(handler)
logger.propagate = False

class GlobalExceptionMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        try:
            response = await call_next(request)
            
            # Log successful requests (optional, but good for audit)
            # duration = time.time() - start_time
            # logger.info(f"Request {request.method} {request.url.path} - {response.status_code} - {duration:.2f}s")
            
            return response
        except Exception as e:
            duration = time.time() - start_time
            logger.error(f"Unhandled Exception: {str(e)}", exc_info=True)
            
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={
                    "error": "Internal Server Error",
                    "detail": "A secure telemetry report has been dispatched to our engineering nexus. This incident is being investigated.",
                    "request_id": str(int(time.time())), # Simple timestamp as ID
                    "method": request.method,
                    "path": request.url.path
                }
            )
