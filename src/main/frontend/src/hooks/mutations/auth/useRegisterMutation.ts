import { useMutation } from '@tanstack/react-query';
import api from '@lib/api';

export function useRegisterMutation() {
  return useMutation({
    mutationFn: async ({ email, password }: any) => {
      const res = await api.post('/api/auth/register', { email, password });
      return res.data;
    },
  });
}
