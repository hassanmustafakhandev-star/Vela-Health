'use client';
import { createContext, useContext, useEffect, useRef, useCallback } from 'react';
import { useDoctorAuthStore } from '@/store/doctor/doctorAuthStore';
import useAuthStore from '@/store/authStore';
import { auth, db } from '@/lib/firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/v1';

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

  const { user, setUser } = useAuthStore();

  // Module-level singleton guard — prevents duplicate listeners across re-renders
  const listenerRef = useRef(null);
  const attachedUidRef = useRef(null);
  const previousStatusRef = useRef(null);
  const refreshingVerifiedTokenRef = useRef(false);
  /** Stale JWT often causes permission-denied until claims catch up after admin approval. */
  const permissionDeniedRefreshAttemptsRef = useRef(0);
  const hydrateGenerationRef = useRef(0);

  /**
   * When client Firestore rules / token lag block onSnapshot, status stays null forever
   * ("Syncing Medical Registry…"). Backend reads Firestore with Admin SDK — hydrate from API.
   */
  const hydrateDoctorFromBackend = useCallback(
    async (uid, generation) => {
      const { status } = useDoctorAuthStore.getState();
      if (status !== null) return;
      if (generation !== hydrateGenerationRef.current) return;

      try {
        const token = await auth.currentUser?.getIdToken(true);
        if (generation !== hydrateGenerationRef.current) return;

        /** Primary path: backend reads Firestore with Admin SDK (same data admin UI uses). */
        const drRes = await fetch(`${API_URL}/doctors/${uid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (drRes.ok) {
          const raw = await drRes.json();
          const { id, ...rest } = raw;
          const profile = { ...rest, uid: id || uid };
          if (generation !== hydrateGenerationRef.current) return;
          if (profile.status === 'verified') {
            initDoctorAuth(profile, token);
            previousStatusRef.current = 'verified';
          } else if (profile.status === 'rejected') {
            setStatus('rejected');
          } else if (profile.status === 'suspended') {
            setStatus('suspended');
          } else {
            setStatus('pending');
          }
          return;
        }

        if (drRes.status === 404) {
          if (generation !== hydrateGenerationRef.current) return;
          setStatus('pending');
          return;
        }

        const verifyRes = await fetch(`${API_URL}/auth/verify`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
        const verifyJson = verifyRes.ok ? await verifyRes.json() : {};
        if (generation !== hydrateGenerationRef.current) return;
        if (verifyJson.role === 'doctor' || verifyJson.token_role === 'pending_doctor') {
          setStatus('pending');
        }
      } catch (e) {
        console.error('[DoctorAuth] hydrateDoctorFromBackend:', e);
      }
    },
    [initDoctorAuth, setStatus]
  );

  useEffect(() => {
    const uid = user?.uid;

    // Case 1: No user — tear down any existing listener
    if (!uid) {
      if (listenerRef.current) {
        listenerRef.current();
        listenerRef.current = null;
      }
      attachedUidRef.current = null;
      previousStatusRef.current = null;
      refreshingVerifiedTokenRef.current = false;
      permissionDeniedRefreshAttemptsRef.current = 0;
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
    permissionDeniedRefreshAttemptsRef.current = 0;
    hydrateGenerationRef.current += 1;
    const gen = hydrateGenerationRef.current;
    setLoading(true);

    const tHydrate0 = setTimeout(() => hydrateDoctorFromBackend(uid, gen), 0);
    const tHydrate2s = setTimeout(() => hydrateDoctorFromBackend(uid, gen), 2000);
    const tHydrate6s = setTimeout(() => hydrateDoctorFromBackend(uid, gen), 6000);
    /** Stop infinite "Syncing…" if Firestore never resolves */
    const tStall = setTimeout(() => {
      const st = useDoctorAuthStore.getState();
      if (gen !== hydrateGenerationRef.current) return;
      if (st.status !== null) return;
      hydrateDoctorFromBackend(uid, gen).finally(() => {
        if (gen !== hydrateGenerationRef.current) return;
        if (useDoctorAuthStore.getState().status === null) {
          setLoading(false);
          setStatus('pending');
        }
      });
    }, 12000);

    const unsub = onSnapshot(
      doc(db, 'doctors', uid),
      async (docSnap) => {
        permissionDeniedRefreshAttemptsRef.current = 0;
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

        // Refresh token once on transition into verified so custom claims propagate.
        const enteringVerified =
          data.status === 'verified' && previousStatusRef.current !== 'verified';
        if (enteringVerified && !refreshingVerifiedTokenRef.current) {
          refreshingVerifiedTokenRef.current = true;
          try {
            const freshToken = await auth.currentUser?.getIdToken(true);
            setUser(auth.currentUser, freshToken, 'doctor');
            currentToken = freshToken || currentToken;
          } catch (_) {}
          finally {
            refreshingVerifiedTokenRef.current = false;
          }
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
        previousStatusRef.current = data.status ?? null;
      },
      (error) => {
        console.error('[DoctorAuth] Listener auth error:', error);
        // permission-denied: token often still has pending_doctor after admin set verified + doctor claim.
        // Do NOT setStatus('pending') — that traps the user on "Identity Under Review" forever.
        if (error?.code === 'permission-denied') {
          const attempt = permissionDeniedRefreshAttemptsRef.current + 1;
          permissionDeniedRefreshAttemptsRef.current = attempt;
          if (attempt <= 3) {
            (async () => {
              try {
                const fresh = await auth.currentUser?.getIdToken(true);
                setUser(auth.currentUser, fresh, 'doctor');
                setStatus(null);
                setLoading(true);
              } catch (_) {
                setLoading(false);
                setStatus('pending');
              }
            })();
          } else {
            setLoading(false);
            setStatus('pending');
          }
        } else {
          setLoading(false);
          setStatus('pending');
        }
      }
    );

    listenerRef.current = unsub;

    return () => {
      hydrateGenerationRef.current += 1;
      clearTimeout(tHydrate0);
      clearTimeout(tHydrate2s);
      clearTimeout(tHydrate6s);
      clearTimeout(tStall);
      if (listenerRef.current) {
        listenerRef.current();
        listenerRef.current = null;
        attachedUidRef.current = null;
        previousStatusRef.current = null;
        refreshingVerifiedTokenRef.current = false;
        permissionDeniedRefreshAttemptsRef.current = 0;
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
