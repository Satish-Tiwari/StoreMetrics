import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '@/config/apiEndpoints';

export const triggerManualSync = async (entityType?: string): Promise<string> => {
  const token = localStorage.getItem('token');
  const endpoint = entityType ? API_ENDPOINTS.SYNC_MANUAL_ENTITY(entityType) : API_ENDPOINTS.SYNC_MANUAL_GLOBAL;
  
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });
  
  if (!res.ok) {
    throw new Error('Failed to start sync');
  }
  
  return res.text();
};

export const useTriggerSyncMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (entityType?: string) => triggerManualSync(entityType),
    onSuccess: (data, variables) => {
      const typeStr = variables ? variables.charAt(0).toUpperCase() + variables.slice(1) : 'Global';
      toast.success(`${typeStr} Sync Started!`);
      // Invalidate the status query to refresh immediately
      queryClient.invalidateQueries({ queryKey: ['syncStatus'] });
    },
    onError: (error, variables) => {
      const typeStr = variables ? variables.charAt(0).toUpperCase() + variables.slice(1) : 'Global';
      toast.error(`Failed to start ${typeStr} sync: ${error.message}`);
    }
  });
};
