import { useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/v1', '') || 'http://localhost:8000';

export default function useConsultation(sessionId, role) {
  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('initializing'); // initializing, waiting, connected, ended
  const [messages, setMessages] = useState([]);
  
  const socketRef = useRef();
  const peerRef = useRef();
  const userVideo = useRef();
  const partnerVideo = useRef();

  useEffect(() => {
    // 1. Initialize Socket
    socketRef.current = io(SOCKET_URL);

    // 2. Get Media
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(currentStream => {
      setStream(currentStream);
      if (userVideo.current) userVideo.current.srcObject = currentStream;

      // 3. Join Room
      socketRef.current.emit('join_room', { session_id: sessionId, role });
    });

    // 4. Handle Signaling
    socketRef.current.on('waiting_for_peer', () => setConnectionStatus('waiting'));
    
    socketRef.current.on('both_joined', ({ initiator }) => {
      if (role === initiator) {
        // I am the one who starts the call (Patient in our backend logic)
        initiateCall();
      }
    });

    socketRef.current.on('webrtc_offer', (data) => {
      if (role === 'doctor') {
        answerCall(data);
      }
    });

    socketRef.current.on('webrtc_answer', (data) => {
      if (peerRef.current) {
        peerRef.current.signal(data.sdp);
      }
    });

    socketRef.current.on('ice_candidate', (data) => {
      if (peerRef.current) {
        peerRef.current.signal(data.candidate);
      }
    });

    socketRef.current.on('chat_message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    socketRef.current.on('call_ended', () => {
      setConnectionStatus('ended');
      if (peerRef.current) peerRef.current.destroy();
    });

    return () => {
      socketRef.current.disconnect();
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [sessionId, role]);

  const initiateCall = () => {
    setConnectionStatus('connecting');
    const peer = new Peer({ initiator: true, trickle: false, stream: stream });

    peer.on('signal', data => {
      socketRef.current.emit('webrtc_offer', { session_id: sessionId, sdp: data });
    });

    peer.on('stream', remoteStream => {
      setRemoteStream(remoteStream);
      if (partnerVideo.current) partnerVideo.current.srcObject = remoteStream;
      setConnectionStatus('connected');
    });

    peerRef.current = peer;
  };

  const answerCall = (data) => {
    setConnectionStatus('connecting');
    const peer = new Peer({ initiator: false, trickle: false, stream: stream });

    peer.on('signal', signalData => {
      socketRef.current.emit('webrtc_answer', { session_id: sessionId, sdp: signalData });
    });

    peer.on('stream', remoteStream => {
      setRemoteStream(remoteStream);
      if (partnerVideo.current) partnerVideo.current.srcObject = remoteStream;
      setConnectionStatus('connected');
    });

    peer.signal(data.sdp);
    peerRef.current = peer;
  };

  const sendMessage = (text) => {
    const msg = { text, sender: role, timestamp: new Date() };
    socketRef.current.emit('chat_message', { session_id: sessionId, ...msg });
    setMessages(prev => [...prev, msg]);
  };

  const endCall = () => {
    socketRef.current.emit('end_call', { session_id: sessionId, role });
    setConnectionStatus('ended');
  };

  return {
    stream,
    remoteStream,
    connectionStatus,
    messages,
    userVideo,
    partnerVideo,
    sendMessage,
    endCall
  };
}
