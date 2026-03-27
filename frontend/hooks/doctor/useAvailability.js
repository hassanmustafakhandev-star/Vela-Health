import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  onSnapshot,
} from 'firebase/firestore';
import useAuthStore from '@/store/authStore';
import doctorApi from '@/lib/doctorApi';

/**
 * useAvailability
 *
 * Manages the doctor's weekly schedule stored in the Firestore SUBCOLLECTION:
 *   doctors/{uid}/availability/{0..6}   (0=Monday, 6=Sunday)
 *
 * Fixed Bug #6: The old hook read from an embedded `availability` field on the
 * doctor document. The backend stores data in a subcollection. This hook now
 * reads the subcollection correctly.
 *
 * Fixed Bug #5: Uses uid from authStore, not auth.currentUser.
 */
export function useAvailability() {
  const uid = useAuthStore((s) => s.user?.uid);

  // schedule: { 0: { active, start_time, end_time }, 1: {...}, ... }
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Listen to all documents in the availability subcollection
    const availRef = collection(db, 'doctors', uid, 'availability');
    const unsub = onSnapshot(
      availRef,
      (snap) => {
        const built = {};
        snap.docs.forEach((d) => {
          built[d.id] = d.data(); // key is day_of_week string "0"–"6"
        });
        setSchedule(built);
        setLoading(false);
      },
      (error) => {
        if (error.code !== 'permission-denied') {
          console.error('[Availability] Snapshot error:', error);
          setLoading(false);
        }
      }
    );

    return () => unsub();
  }, [uid]);

  /**
   * Save a single day's availability.
   * Writes to Firestore subcollection AND syncs through backend API.
   */
  const saveDay = useCallback(
    async (dayOfWeek, updates) => {
      if (!uid) return;
      setSaving(true);
      try {
        const payload = {
          day_of_week: Number(dayOfWeek),
          active: updates.active ?? false,
          start_time: updates.start_time ?? '09:00',
          end_time: updates.end_time ?? '17:00',
        };
        // Persist via backend (validates & writes to subcollection)
        await doctorApi.setAvailability(uid, payload);
      } catch (e) {
        console.error('[Availability] Save failed:', e);
        throw e;
      } finally {
        setSaving(false);
      }
    },
    [uid]
  );

  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return { schedule, loading, saving, saveDay, DAYS };
}