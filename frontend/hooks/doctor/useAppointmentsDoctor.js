import { useState, useEffect, useRef } from 'react';
import { auth, db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';
import useAuthStore from '@/store/authStore';

/**
 * useAppointmentsDoctor
 *
 * Reactive Firestore listener for the authenticated doctor's appointments.
 * Fixed: subscribes to `user?.uid` from authStore (not auth.currentUser directly)
 * so it re-attaches correctly after auth state changes.
 */
export function useAppointmentsDoctor() {
  const uid = useAuthStore((s) => s.user?.uid);
  const retriedAfterPermissionRef = useRef(false);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todayCount, setTodayCount] = useState(0);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      retriedAfterPermissionRef.current = false;
      return;
    }

    setLoading(true);
    retriedAfterPermissionRef.current = false;

    const todayStr = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

    const q = query(
      collection(db, 'appointments'),
      where('doctor_id', '==', uid),
      orderBy('date', 'asc'),
      orderBy('time', 'asc')
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAppointments(list);
        setTodayCount(list.filter((a) => a.date === todayStr).length);
        setLoading(false);
      },
      (error) => {
        if (error.code === 'permission-denied') {
          if (!retriedAfterPermissionRef.current) {
            retriedAfterPermissionRef.current = true;
            auth.currentUser?.getIdToken(true).catch(() => {});
          } else {
            // Stop indefinite spinner if token refresh already failed to recover access.
            setLoading(false);
          }
        } else {
          console.error('[Appointments] Snapshot error:', error);
          setLoading(false);
        }
      }
    );

    return () => unsub();
  }, [uid]);

  /** Returns only today's appointments */
  const todayAppointments = appointments.filter(
    (a) => a.date === new Date().toISOString().split('T')[0]
  );

  /** Returns upcoming appointments (today + future, status != completed/cancelled) */
  const upcomingAppointments = appointments.filter(
    (a) =>
      a.date >= new Date().toISOString().split('T')[0] &&
      !['completed', 'cancelled'].includes(a.status)
  );

  /** Returns past/completed appointments */
  const completedAppointments = appointments.filter(
    (a) => a.status === 'completed' || a.date < new Date().toISOString().split('T')[0]
  );

  return {
    appointments,
    todayAppointments,
    upcomingAppointments,
    completedAppointments,
    loading,
    todayCount,
  };
}
