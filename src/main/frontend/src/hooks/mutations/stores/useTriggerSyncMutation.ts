import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@lib/api';

export function useTriggerSyncMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isFullSync }: { id: string; isFullSync: boolean }) => {
      const res = await api.post(`/api/sync/${id}/trigger`, { isFullSync });
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stores'] }),
  });
}
