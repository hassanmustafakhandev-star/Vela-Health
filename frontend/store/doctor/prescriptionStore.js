import { create } from 'zustand';

export const usePrescriptionStore = create((set) => ({
  patientId: null,
  appointmentId: null,
  diagnosis: '',
  medicines: [],
  advice: '',
  followUpDays: 0,
  referral: null,
  status: 'draft', // draft | sent

  initPrescription: (patientId, appointmentId) => set({
    patientId,
    appointmentId,
    diagnosis: '',
    medicines: [],
    advice: '',
    followUpDays: 0,
    referral: null,
    status: 'draft'
  }),

  addMedicine: (medicine) => set((state) => ({
    medicines: [...state.medicines, { ...medicine, id: Math.random().toString(36).substr(2, 9) }]
  })),

  removeMedicine: (id) => set((state) => ({
    medicines: state.medicines.filter((m) => m.id !== id)
  })),

  updateMedicine: (id, updates) => set((state) => ({
    medicines: state.medicines.map((m) => m.id === id ? { ...m, ...updates } : m)
  })),

  setDiagnosis: (diagnosis) => set({ diagnosis }),
  setAdvice: (advice) => set({ advice }),
  setFollowUpDays: (days) => set({ followUpDays: days }),
  setReferral: (referral) => set({ referral }),

  loadTemplate: (template) => set({
    diagnosis: template.diagnosis || '',
    medicines: template.medicines || [],
    advice: template.advice || ''
  }),

  sendPrescription: async () => {
    // Logic for POST /vela/prescriptions would go here
    set({ status: 'sent' });
  },

  clear: () => set({
    patientId: null,
    appointmentId: null,
    diagnosis: '',
    medicines: [],
    advice: '',
    followUpDays: 0,
    referral: null,
    status: 'draft'
  })
}));
