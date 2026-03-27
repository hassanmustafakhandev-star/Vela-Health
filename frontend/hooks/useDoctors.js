import { useQuery } from '@tanstack/react-query';
import { get } from '@/lib/api';


export function useSearchDoctors(initialFilters = {}) {
  const query = useQuery({
    queryKey: ['doctors', initialFilters],
    queryFn: async () => {
      const { data } = await get('/doctors', initialFilters);
      return data;
    },
  });

  return {
    doctors: query.data || [],
    loading: query.isLoading,
    error: query.error,
    search: (newFilters) => {
      query.refetch();
    }
  };
}

export function useDoctor(id) {
  const query = useQuery({
    queryKey: ['doctor', id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await get(`/doctors/${id}`);
      return data;
    },
    enabled: !!id,
  });

  return {
    doctor: query.data,
    loading: query.isLoading,
    error: query.error
  };
}

export function useDoctorSlots(doctorId, date) {
  const query = useQuery({
    queryKey: ['slots', doctorId, date],
    queryFn: async () => {
      if (!doctorId || !date) return null;
      const { data } = await get(`/doctors/${doctorId}/slots`, { date });
      return data;
    },
    enabled: !!doctorId && !!date,
  });

  return {
    slots: query.data || [],
    loading: query.isLoading,
    error: query.error
  };
}
