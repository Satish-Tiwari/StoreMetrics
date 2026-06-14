import { useQuery } from '@tanstack/react-query';
import api from '@lib/api';
import type { SyncLog } from '@/types';

/**
 * Fetches the execution logs for a specific store's sync processes.
 * Polling is enabled to simulate a real-time terminal view of the BullMQ workers.
 */
export const useSyncLogsQuery = () => {
  return useQuery({
    queryKey: ['logs'],
    queryFn: async (): Promise<SyncLog[]> => {
      const { data } = await api.get(`/api/sync/logs`);
      return data;
    },
    enabled: true,
    refetchInterval: 5000, // Poll every 5 seconds for real-time updates
  });
};
