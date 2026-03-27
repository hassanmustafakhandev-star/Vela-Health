import { useState, useEffect } from 'react';
import doctorApi from '@/lib/doctorApi';
import useAuthStore from '@/store/authStore';

/**
 * usePrescriptions
 *
 * Fetches the authenticated doctor's issued prescriptions via the backend API.
 */
export function usePrescriptions() {
  const uid = useAuthStore((s) => s.user?.uid);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    setLoading(true);
    doctorApi.getPrescriptions()
      .then((data) => {
        setPrescriptions(data.items || data || []);
      })
      .catch((err) => {
        console.error('[Prescriptions] Error fetching:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [uid]);

  /** Returns prescriptions filtered by search term and status */
  const filterPrescriptions = (search, status) => {
    return prescriptions.filter((rx) => {
      const matchSearch =
        !search ||
        rx.id?.toLowerCase().includes(search.toLowerCase()) ||
        rx.patient_name?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !status || status === 'All' || rx.status === status;
      return matchSearch && matchStatus;
    });
  };

  return { prescriptions, loading, filterPrescriptions };
}
