import { useQuery, UseQueryResult } from '@tanstack/react-query';
import api from '@lib/api';
import type { AnalyticsPayload } from '@/types';

export function useAnalyticsQuery(
  startDate: string,
  endDate: string
): UseQueryResult<AnalyticsPayload | null, Error> {
  return useQuery({
    queryKey: ['analytics', startDate, endDate],
    queryFn: async () => {
      const res = await api.get<AnalyticsPayload>('/api/analytics/overview', {
        params: { startDate, endDate },
      });
      return res.data;
    },
    enabled: true,
  });
}
