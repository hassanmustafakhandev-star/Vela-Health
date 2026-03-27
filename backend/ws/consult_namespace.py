from ws.server import sio

# In-memory room registry: { session_id: { "patient": sid, "doctor": sid } }
rooms: dict[str, dict] = {}


@sio.on("connect")
async def connect(sid, environ):
    print(f"🔌 Socket connected: {sid}")


@sio.on("disconnect")
async def disconnect(sid):
    """Clean up room when a peer disconnects"""
    print(f"🔴 Socket disconnected: {sid}")
    # Remove from any rooms they were in
    for session_id in list(rooms.keys()):
        peers = rooms.get(session_id, {})
        for role in list(peers.keys()):
            if peers[role] == sid:
                peers.pop(role, None)
                # Notify remaining peer
                await sio.emit("peer_disconnected", {"role": role}, room=session_id)
        
        if not peers:
            rooms.pop(session_id, None)


@sio.on("join_room")
async def join_room(sid, data):
    """
    Both patient and doctor call this when opening the consult page.
    data = { session_id: str, uid: str, role: "patient" | "doctor" }
    When both have joined, emits 'both_joined' to trigger WebRTC negotiation.
    """
    session_id = data.get("session_id")
    role = data.get("role")  # "patient" or "doctor"

    if not session_id or not role:
        return

    await sio.enter_room(sid, session_id)

    if session_id not in rooms:
        rooms[session_id] = {}
    rooms[session_id][role] = sid

    print(f"👤 {role} joined room {session_id[:8]}...")

    # If both patient and doctor are in the room — start WebRTC
    if "patient" in rooms[session_id] and "doctor" in rooms[session_id]:
        await sio.emit("both_joined", {"start": True, "initiator": "patient"}, room=session_id)
        print(f"✅ Both peers in room {session_id[:8]} — WebRTC starting")
    else:
        # Notify the first peer to wait
        await sio.emit("waiting_for_peer", {"room": session_id}, to=sid)


@sio.on("webrtc_offer")
async def webrtc_offer(sid, data):
    """Patient sends SDP offer to doctor"""
    await sio.emit("webrtc_offer", data, room=data.get("session_id"), skip_sid=sid)


@sio.on("webrtc_answer")
async def webrtc_answer(sid, data):
    """Doctor sends SDP answer back to patient"""
    await sio.emit("webrtc_answer", data, room=data.get("session_id"), skip_sid=sid)


@sio.on("ice_candidate")
async def ice_candidate(sid, data):
    """Exchange ICE candidates between peers"""
    await sio.emit("ice_candidate", data, room=data.get("session_id"), skip_sid=sid)


@sio.on("photo_sent")
async def photo_sent(sid, data):
    """Patient shares a photo/scan during consultation"""
    await sio.emit("photo_received", data, room=data.get("session_id"), skip_sid=sid)


@sio.on("chat_message")
async def chat_message(sid, data):
    """In-call chat message between patient and doctor"""
    await sio.emit("chat_message", data, room=data.get("session_id"), skip_sid=sid)


@sio.on("typing")
async def typing(sid, data):
    """Typing indicator for in-call chat"""
    await sio.emit("typing", data, room=data.get("session_id"), skip_sid=sid)


@sio.on("end_call")
async def end_call(sid, data):
    """Either party ends the call — notify all and clean up"""
    session_id = data.get("session_id")
    role = data.get("role", "unknown")
    await sio.emit("call_ended", {"ended_by": role}, room=session_id)
    rooms.pop(session_id, None)
    await sio.close_room(session_id)
    print(f"📴 Call ended in room {session_id[:8] if session_id else '?'} by {role}")
