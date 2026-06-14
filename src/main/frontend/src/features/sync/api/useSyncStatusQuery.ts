import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/config/apiEndpoints';

export interface SyncState {
  id: string;
  entityType: string;
  lastSyncTimestamp: string | null;
  lastSuccessfulSync: string | null;
  syncStatus: 'IDLE' | 'IN_PROGRESS' | 'FAILED' | 'SUCCESS';
  errorMessage: string | null;
  updatedAt: string;
}

export const fetchSyncStatus = async (): Promise<SyncState[]> => {
  const token = localStorage.getItem('token');
  const res = await fetch(API_ENDPOINTS.SYNC_STATUS, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch sync status');
  }
  return res.json();
};

export const useSyncStatusQuery = (pollingInterval: number = 5000) => {
  return useQuery({
    queryKey: ['syncStatus'],
    queryFn: fetchSyncStatus,
    refetchInterval: pollingInterval,
  });
};
