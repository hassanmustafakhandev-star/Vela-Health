import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth } from '@/lib/firebase';
import { 
  onAuthStateChanged, 
  onIdTokenChanged,
  GoogleAuthProvider, 
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updateProfile
} from 'firebase/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/v1';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      role: 'patient',
      loading: true,
  
      confirmationResult: null,

      verifyWithBackend: async (token) => {
        const res = await fetch(`${API_URL}/auth/verify`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
        return res.ok ? await res.json() : {};
      },

      initAuth: () => {
        // Keep token in store in sync whenever Firebase rotates/refreshes it.
        onIdTokenChanged(auth, async (firebaseUser) => {
          if (!firebaseUser) return;
          try {
            const fresh = await firebaseUser.getIdToken();
            set({ token: fresh });
          } catch (_) {}
        });

        onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            try {
              // Force-refresh once on auth bootstrap so latest custom claims are loaded.
              let token = await firebaseUser.getIdToken(true);
              let data = await get().verifyWithBackend(token);

              // If doctor profile is verified but token claim is stale, refresh and retry once.
              if (data?.doctor_status === 'verified' && data?.token_role !== 'doctor') {
                token = await firebaseUser.getIdToken(true);
                data = await get().verifyWithBackend(token);
              }

              set({
                user: firebaseUser,
                token,
                role: data?.role || 'patient',
                loading: false,
              });
            } catch (e) {
              console.error('Auth verify failed:', e);
              set({ 
                user: firebaseUser, 
                token: await firebaseUser?.getIdToken(), 
                role: 'patient', 
                loading: false 
              });
            }
          } else {
            set({ user: null, token: null, role: 'patient', loading: false });
          }
        });
      },

      signInWithGoogle: async () => {
        const provider = new GoogleAuthProvider();
        try {
          const result = await signInWithPopup(auth, provider);
          let token = await result.user.getIdToken(true);
          let data = await get().verifyWithBackend(token);
          if (data?.doctor_status === 'verified' && data?.token_role !== 'doctor') {
            token = await result.user.getIdToken(true);
            data = await get().verifyWithBackend(token);
          }
          set({
            user: result.user,
            token,
            role: data.role || 'patient',
            loading: false,
          });
          return result.user;
        } catch (error) {
          console.error("Google Sign-In Error:", error);
          throw error;
        }
      },

      signInWithEmail: async (email, password) => {
        try {
          const result = await signInWithEmailAndPassword(auth, email, password);
          let token = await result.user.getIdToken(true);
          let data = await get().verifyWithBackend(token);
          if (data?.doctor_status === 'verified' && data?.token_role !== 'doctor') {
            token = await result.user.getIdToken(true);
            data = await get().verifyWithBackend(token);
          }
          set({ user: result.user, token, role: data.role || 'patient', loading: false });
          return result.user;
        } catch (error) {
          console.error("Email Sign-In Error:", error);
          throw error;
        }
      },

      signUpWithEmail: async (email, password, name) => {
        try {
          const result = await createUserWithEmailAndPassword(auth, email, password);
          if (name) {
            await updateProfile(result.user, { displayName: name });
          }
          const token = await result.user.getIdToken(true);
          // Backend verification creates the Firestore profile
          const data = await get().verifyWithBackend(token);
          set({ user: result.user, token, role: 'patient', loading: false });
          return result.user;
        } catch (error) {
          console.error("Email Sign-Up Error:", error);
          throw error;
        }
      },

      sendOTP: async (phoneNumber, containerId) => {
        try {
          const recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
            size: 'invisible',
          });
          const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
          set({ confirmationResult });
          return confirmationResult;
        } catch (error) {
          console.error("Phone Auth Error:", error);
          throw error;
        }
      },

      verifyOTP: async (otpCode) => {
        const { confirmationResult } = get();
        if (!confirmationResult) throw new Error("No pending verification");
        try {
          const result = await confirmationResult.confirm(otpCode);
          const token = await result.user.getIdToken(true);
          const data = await get().verifyWithBackend(token);
          set({ user: result.user, token, role: data.role || 'patient', loading: false, confirmationResult: null });
          return result.user;
        } catch (error) {
          console.error("OTP Verification Error:", error);
          throw error;
        }
      },

      refreshToken: async () => {
        const { user } = get();
        if (user) {
          const token = await user.getIdToken(true);
          set({ token });
          return token;
        }
        return null;
      },

      logout: async () => {
        await auth.signOut();
        // Clear doctor specific cache so stale states don't trap the next login
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem('vela-doctor-auth');
        }
        set({ user: null, token: null, role: 'patient' });
      },

      setUser: (user, token, role = 'patient') => {
        set({ user, token, role, loading: false });
      },
    }),
    {
      name: 'vela-auth',
    }
  )
);

export default useAuthStore;
