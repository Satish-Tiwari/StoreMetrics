import { useMutation } from '@tanstack/react-query';
import api from '@lib/api';

export function useLoginMutation(onSuccessCallback: (token: string) => void) {
  return useMutation({
    mutationFn: async ({ email, password }: any) => {
      const res = await api.post('/api/auth/login', { email, password });
      return res.data;
    },
    onSuccess: (data) => {
      const userToken = data.token || data.accessToken || data.access_token;
      if (userToken) {
        onSuccessCallback(userToken);
      }
    },
  });
}
