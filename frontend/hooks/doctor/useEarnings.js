import { useState, useEffect, useMemo, useRef } from 'react';
import { auth, db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import useAuthStore from '@/store/authStore';

/**
 * useEarnings
 *
 * Real-time earnings aggregation from the `transactions` Firestore collection.
 *
 * Fixed Bug #5: Uses uid from authStore, not auth.currentUser.
 * Fixed Bug #8: Replaces fake multiplier calc with real date-based filtering.
 */
export function useEarnings() {
  const uid = useAuthStore((s) => s.user?.uid);
  const retriedAfterPermissionRef = useRef(false);

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      retriedAfterPermissionRef.current = false;
      return;
    }

    setLoading(true);
    retriedAfterPermissionRef.current = false;

    const q = query(
      collection(db, 'transactions'),
      where('doctor_id', '==', uid)
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        setTransactions(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      (error) => {
        if (error.code === 'permission-denied') {
          if (!retriedAfterPermissionRef.current) {
            retriedAfterPermissionRef.current = true;
            auth.currentUser?.getIdToken(true).catch(() => {});
          } else {
            setLoading(false);
          }
        } else {
          console.error('[Earnings] Snapshot error:', error);
          setLoading(false);
        }
      }
    );

    return () => unsub();
  }, [uid]);

  /** Real date-based aggregation — computed only when transactions change */
  const earnings = useMemo(() => {
    const now = new Date();

    // Month boundaries
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    // Week boundaries (Monday-based)
    const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1;
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - dayOfWeek);
    weekStart.setHours(0, 0, 0, 0);

    let total = 0;
    let thisMonth = 0;
    let thisWeek = 0;
    const recent = [];

    for (const tx of transactions) {
      const amount = tx.amount ?? 0;
      const txDate =
        tx.created_at instanceof Timestamp
          ? tx.created_at.toDate()
          : new Date(tx.created_at);

      total += amount;
      if (txDate >= monthStart) thisMonth += amount;
      if (txDate >= weekStart) thisWeek += amount;

      recent.push({ ...tx, date: txDate });
    }

    // Sort recent by date desc, keep top 20
    recent.sort((a, b) => b.date - a.date);

    const avgPerConsult =
      transactions.length > 0 ? Math.round(total / transactions.length) : 0;

    return {
      total,
      thisMonth,
      thisWeek,
      avgPerConsult,
      recentTransactions: recent.slice(0, 20),
      totalCount: transactions.length,
    };
  }, [transactions]);

  return { earnings, loading };
}