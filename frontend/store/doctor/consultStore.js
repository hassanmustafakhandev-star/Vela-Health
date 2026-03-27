import { create } from 'zustand';

export const useConsultStore = create((set) => ({
  activeSession: null,
  sessionId: null,
  patientStream: null,
  localStream: null,
  peerConnected: false,
  callDuration: 0,
  chatMessages: [],

  setSession: (session) => set({ 
    activeSession: session, 
    sessionId: session?.id 
  }),

  setStreams: (local, patient) => set({ 
    localStream: local, 
    patientStream: patient 
  }),

  setPeerConnected: (connected) => set({ peerConnected: connected }),

  addChatMessage: (msg) => set((state) => ({ 
    chatMessages: [...state.chatMessages, msg] 
  })),

  setCallDuration: (duration) => set({ callDuration: duration }),

  endSession: () => set({
    activeSession: null,
    sessionId: null,
    patientStream: null,
    localStream: null,
    peerConnected: false,
    callDuration: 0,
    chatMessages: []
  })
}));
