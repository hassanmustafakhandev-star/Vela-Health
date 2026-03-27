'use client';
import { createContext, useContext, useEffect, useRef, useCallback } from 'react';
import { useDoctorAuthStore } from '@/store/doctor/doctorAuthStore';
import useAuthStore from '@/store/authStore';
import { auth, db } from '@/lib/firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';

/**
 * DoctorAuthContext
 *
 * THE ONLY place where the Firestore doctor listener runs.
 * All nexus pages/components consume this context — never call
 * useDoctorAuth() directly inside individual components.
 *
 * Architecture:
 *   (nexus)/layout.js
 *     └─ DoctorAuthProvider          ← ONE listener here
 *          └─ DoctorAuthGuard        ← reads context, no listener
 *               └─ DoctorSidebar     ← reads context, no listener
 *               └─ page content      ← reads context, no listener
 */
const DoctorAuthContext = createContext(null);

export function DoctorAuthProvider({ children }) {
  const {
    initDoctorAuth,
    logout: logoutDoctor,
    setLoading,
    setStatus,
    updateAvailableNow,
  } = useDoctorAuthStore();

  const { user, setUser, role: globalRole } = useAuthStore();

  // Module-level singleton guard — prevents duplicate listeners across re-renders
  const listenerRef = useRef(null);
  const attachedUidRef = useRef(null);

  useEffect(() => {
    const uid = user?.uid;

    // Case 1: No user — tear down any existing listener
    if (!uid) {
      if (listenerRef.current) {
        listenerRef.current();
        listenerRef.current = null;
      }
      attachedUidRef.current = null;
      logoutDoctor();
      return;
    }

    // Case 2: Same UID already listening — do nothing (prevents duplicate on re-render)
    if (attachedUidRef.current === uid) return;

    // Case 3: UID changed — detach old listener first
    if (listenerRef.current) {
      listenerRef.current();
      listenerRef.current = null;
    }

    attachedUidRef.current = uid;
    setLoading(true);

    const unsub = onSnapshot(
      doc(db, 'doctors', uid),
      async (docSnap) => {
        if (!docSnap.exists()) {
          // Account exists but no doctor document yet
          setStatus('pending');
          return;
        }

        const data = docSnap.data();
        let currentToken = null;
        try {
          currentToken = await auth.currentUser?.getIdToken();
        } catch (_) {}

        // Auto-refresh Firebase custom claims when newly verified
        if (data.status === 'verified' && globalRole !== 'doctor') {
          try {
            const freshToken = await auth.currentUser?.getIdToken(true);
            setUser(auth.currentUser, freshToken, 'doctor');
          } catch (_) {}
        }

        switch (data.status) {
          case 'verified':
            initDoctorAuth(data, currentToken);
            break;
          case 'rejected':
            setStatus('rejected');
            break;
          case 'suspended':
            setStatus('suspended');
            break;
          default:
            setStatus('pending');
        }
      },
      (error) => {
        // Never tear down the listener on permission-denied —
        // this fires transiently during custom-claim propagation.
        if (error?.code !== 'permission-denied') {
          setLoading(false);
        }
      }
    );

    listenerRef.current = unsub;

    return () => {
      if (listenerRef.current) {
        listenerRef.current();
        listenerRef.current = null;
        attachedUidRef.current = null;
      }
    };
    // Only re-run when the user identity changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  /** Toggle doctor's real-time availability in Firestore */
  const toggleAvailability = useCallback(async (available) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    try {
      await updateDoc(doc(db, 'doctors', uid), { available_now: available });
      updateAvailableNow(available);
    } catch (e) {
      console.error('[DoctorAuth] toggleAvailability failed:', e);
    }
  }, [updateAvailableNow]);

  return (
    <DoctorAuthContext.Provider value={{ toggleAvailability }}>
      {children}
    </DoctorAuthContext.Provider>
  );
}

/** Consume the doctor auth context. Must be used inside DoctorAuthProvider. */
export function useDoctorAuthContext() {
  const ctx = useContext(DoctorAuthContext);
  if (!ctx) {
    throw new Error('useDoctorAuthContext must be used within DoctorAuthProvider');
  }
  return ctx;
}
