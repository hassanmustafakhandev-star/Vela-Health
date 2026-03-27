import { useCallback } from 'react';
import { useConsultStore } from '@/store/doctor/consultStore';

export function useDoctorConsult() {
  const store = useConsultStore();

  const startSession = useCallback((sessionId) => {
    store.setSession({ id: sessionId });
    // WebRTC signaling logic would be initialized here
  }, [store]);

  const endCall = useCallback(() => {
    store.endSession();
  }, [store]);

  const sendMessage = useCallback((text) => {
    store.addChatMessage({
      id: Date.now(),
      sender: 'doctor',
      text,
      timestamp: new Date()
    });
  }, [store]);

  return {
    ...store,
    startSession,
    endCall,
    sendMessage
  };
}