import { useQuery } from '@tanstack/react-query';
import api from '@lib/api';
import type { Store } from '@/types';

export function useStoresQuery() {
  return useQuery({
    queryKey: ['stores'],
    queryFn: async () => {
      const res = await api.get<Store[]>('/api/stores');
      return res.data;
    },
  });
}
