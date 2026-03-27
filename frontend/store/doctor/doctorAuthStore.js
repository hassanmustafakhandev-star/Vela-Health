import { create } from 'zustand';

/**
 * Doctor Authentication Store
 *
 * Single source of truth for the authenticated doctor's profile and status.
 * STRICT: No persist middleware — status must always reflect real-time Firestore.
 * STRICT: State mutations only via DoctorAuthContext listener — never set directly.
 */
export const useDoctorAuthStore = create((set) => ({
  doctorProfile: null,   // Full Firestore doctor document
  token: null,           // Current Firebase ID token
  // null = syncing | 'pending' | 'verified' | 'suspended' | 'rejected'
  status: null,
  loading: true,

  /** Called when Firestore doc resolves to 'verified' */
  initDoctorAuth: (profile, token) =>
    set({
      doctorProfile: profile,
      token,
      status: profile?.status ?? null,
      loading: false,
    }),

  /** Real-time availability toggle (optimistic update) */
  updateAvailableNow: (available) =>
    set((state) => ({
      doctorProfile: state.doctorProfile
        ? { ...state.doctorProfile, available_now: available }
        : null,
    })),

  /** Called for non-verified terminal states */
  setStatus: (status) => set({ status: status ?? null, loading: false }),

  setLoading: (loading) => set({ loading }),

  /** Full reset on logout */
  logout: () =>
    set({
      doctorProfile: null,
      token: null,
      status: null,
      loading: false,
    }),
}));
