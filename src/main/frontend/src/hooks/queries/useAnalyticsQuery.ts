import { useQuery, UseQueryResult } from '@tanstack/react-query';
import api from '@lib/api';
import type { AnalyticsPayload } from '@/types';

export function useAnalyticsQuery(
  storeId: string,
  startDate: string,
  endDate: string
): UseQueryResult<AnalyticsPayload | null, Error> {
  return useQuery({
    queryKey: ['analytics', storeId, startDate, endDate],
    queryFn: async () => {
      if (!storeId) return null;
      const res = await api.get<AnalyticsPayload>('/api/analytics/overview', {
        params: { storeId, startDate, endDate },
      });
      return res.data;
    },
    enabled: !!storeId,
  });
}
