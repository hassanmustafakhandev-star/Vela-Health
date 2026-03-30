import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useVitals() {
  return useQuery({
    queryKey: ['vitals', 'me'],
    queryFn: async () => {
      const { data } = await api.get('/records/vitals');
      return data.vitals || [];
    },
  });
}

export function useDocuments() {
  return useQuery({
    queryKey: ['documents', 'me'],
    queryFn: async () => {
      const { data } = await api.get('/records/documents');
      return data.documents || [];
    },
  });
}

export function useAddVitals() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vitalData) => {
      const { data } = await api.post('/records/vitals', vitalData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vitals'] });
    },
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ file, type }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', type);

      const { data } = await api.post('/records/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

export function useAIInsights() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/ai/insights');
      return data.insight;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health_summary'] });
    },
  });
}

export function useHealthSummary() {
  return useQuery({
    queryKey: ['health_summary', 'me'],
    queryFn: async () => {
      const { data } = await api.get('/records/summary');
      return data;
    },
  });
}
