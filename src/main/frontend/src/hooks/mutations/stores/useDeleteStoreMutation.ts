import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@lib/api';

export function useDeleteStoreMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/stores/${id}`);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stores'] }),
  });
}
