import socketio

sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*",    # Restrict in production via ALLOWED_ORIGINS env
    logger=False,
    engineio_logger=False
)
