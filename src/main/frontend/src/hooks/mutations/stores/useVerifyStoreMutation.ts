import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@lib/api';

export function useVerifyStoreMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.post(`/api/stores/${id}/verify`, {});
      return { id, data: res.data };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stores'] }),
  });
}
