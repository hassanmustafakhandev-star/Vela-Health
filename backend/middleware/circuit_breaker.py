import time
import logging
from functools import wraps
from fastapi import HTTPException

logger = logging.getLogger("vela")

class CircuitBreaker:
    def __init__(self, name, failure_threshold=5, recovery_timeout=60):
        self.name = name
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.failures = 0
        self.last_failure_time = 0
        self.state = "CLOSED" # CLOSED, OPEN, HALF-OPEN

    def __call__(self, func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            if self.state == "OPEN":
                if time.time() - self.last_failure_time > self.recovery_timeout:
                    self.state = "HALF-OPEN"
                    logger.info(f"Circuit Breaker [{self.name}] entering HALF-OPEN state")
                else:
                    logger.warning(f"Circuit Breaker [{self.name}] is OPEN. Blocking request.")
                    raise HTTPException(status_code=503, detail=f"Service {self.name} is temporarily unavailable (Circuit Breaker)")

            try:
                result = await func(*args, **kwargs)
                if self.state == "HALF-OPEN":
                    self.state = "CLOSED"
                    self.failures = 0
                    logger.info(f"Circuit Breaker [{self.name}] recovered to CLOSED state")
                return result
            except Exception as e:
                self.failures += 1
                self.last_failure_time = time.time()
                
                if self.failures >= self.failure_threshold:
                    self.state = "OPEN"
                    logger.error(f"Circuit Breaker [{self.name}] TRIPPED to OPEN state due to {self.failures} failures. Error: {str(e)}")
                
                raise e
        return wrapper

# Global instances for specific services
ai_circuit_breaker = CircuitBreaker("AI_SERVICE", failure_threshold=3, recovery_timeout=30)
storage_circuit_breaker = CircuitBreaker("STORAGE_SERVICE", failure_threshold=5, recovery_timeout=60)
