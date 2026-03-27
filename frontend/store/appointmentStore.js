import { create } from 'zustand';

const useAppointmentStore = create((set) => ({
  activeAppointment: null,
  sessionId: null,
  peerConnected: false,

  setActiveAppointment: (appt) => set({ activeAppointment: appt }),
  
  setSessionId: (id) => set({ sessionId: id }),
  
  setPeerConnected: (bool) => set({ peerConnected: bool }),
  
  clearAppointment: () => set({ 
    activeAppointment: null, 
    sessionId: null, 
    peerConnected: false 
  }),
}));

export default useAppointmentStore;
