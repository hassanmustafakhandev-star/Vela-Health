import Peer from 'simple-peer';
import { io } from 'socket.io-client';

export async function getUserMedia(constraints = { video: true, audio: true }) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    return stream;
  } catch (error) {
    console.error('Error accessing media devices:', error);
    throw error;
  }
}

export function createPeer(initiator, stream, signalingData = null) {
  const peer = new Peer({
    initiator,
    stream,
    trickle: false,
    config: {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:global.stun.twilio.com:3478' }
      ]
    }
  });

  if (signalingData) {
    peer.signal(signalingData);
  }

  return peer;
}

export function connectToSignalingServer(sessionId, token) {
  const url = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL || '';
  const socket = io(url, {
    query: { sessionId },
    auth: { token },
  });
  return socket;
}

export function cleanup(peer, stream, socket) {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
  if (peer) {
    peer.destroy();
  }
  if (socket) {
    socket.disconnect();
  }
}
