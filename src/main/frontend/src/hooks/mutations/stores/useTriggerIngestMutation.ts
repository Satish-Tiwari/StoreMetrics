import { useMutation } from '@tanstack/react-query';
import api from '@lib/api';

export function useTriggerIngestMutation() {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.post(`/api/ai/ingest/${id}`, {});
      return res.data;
    },
  });
}
