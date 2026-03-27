import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, collection, query, where, orderBy } from 'firebase/firestore';

export function usePatientRecord(patientId) {
  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) return;

    // Fetch patient basic info
    const unsubPatient = onSnapshot(doc(db, 'users', patientId), (docSnap) => {
      if (docSnap.exists()) {
        setPatient({ id: docSnap.id, ...docSnap.data() });
      }
    });

    // Fetch consultation history
    const historyQuery = query(
      collection(db, 'consultations'),
      where('patient_id', '==', patientId),
      orderBy('created_at', 'desc')
    );

    const unsubHistory = onSnapshot(historyQuery, (snap) => {
      setHistory(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Fetch vitals
    const vitalsQuery = query(
      collection(db, 'vitals'),
      where('patient_id', '==', patientId),
      orderBy('timestamp', 'desc')
    );

    const unsubVitals = onSnapshot(vitalsQuery, (snap) => {
      setVitals(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => {
      unsubPatient();
      unsubHistory();
      unsubVitals();
    };
  }, [patientId]);

  return { patient, history, vitals, loading };
}