import { useQuery, useMutation } from '@tanstack/react-query';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { post } from '@/lib/api';

export function useVitals(userId) {
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, 'users', userId, 'vitals'),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snap) => {
      setVitals(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
  }, [userId]);

  return { vitals, loading };
}

export function useLabResults(userId) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, 'lab_results'),
      orderBy('date', 'desc')
    );
    return onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setResults(data.filter(d => d.userId === userId));
      setLoading(false);
    });
  }, [userId]);

  return { results, loading };
}

export function useAddVitals() {
  return useMutation({
    mutationFn: async ({ userId, data }) => {
      const colRef = collection(db, 'users', userId, 'vitals');
      await addDoc(colRef, {
        ...data,
        createdAt: serverTimestamp(),
      });
    }
  });
}

export function useAIInsights() {
  return useMutation({
    mutationFn: async (userId) => {
      const { data } = await post('/vela/records/insights', { userId });
      return data;
    }
  });
}
