import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, collection, onSnapshot, query, where, orderBy, setDoc, deleteDoc } from 'firebase/firestore';

export function useDocument(collectionPath, docId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!collectionPath || !docId) {
      setLoading(false);
      return;
    }

    const docRef = doc(db, collectionPath, docId);
    const unsubscribe = onSnapshot(docRef, 
      (snapshot) => {
        setData(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionPath, docId]);

  return { data, loading, error };
}

export function useCollection(collectionPath, constraints = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!collectionPath) {
      setLoading(false);
      return;
    }

    const colRef = collection(db, collectionPath);
    let q = query(colRef, ...constraints);

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        setData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionPath, JSON.stringify(constraints)]);

  return { data, loading, error };
}

export async function setDocument(collectionPath, docId, data, merge = true) {
  const docRef = doc(db, collectionPath, docId);
  await setDoc(docRef, data, { merge });
}

export async function deleteDocument(collectionPath, docId) {
  const docRef = doc(db, collectionPath, docId);
  await deleteDoc(docRef);
}
