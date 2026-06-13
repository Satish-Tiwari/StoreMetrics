import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@lib/api';
import type { AddStorePayload } from '@/types';

export function useAddStoreMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AddStorePayload) => {
      const res = await api.post('/api/stores', payload);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stores'] }),
  });
}
