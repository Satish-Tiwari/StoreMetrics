import { useState, useEffect } from 'react';

/**
 * Manages JWT authentication local state.
 * Real API actions are handled by useLoginMutation and useRegisterMutation.
 */
export function useAuth() {
  const [token, setToken] = useState<string | null>(null);

  // Rehydrate token from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ecom_auth_token');
    if (saved) setToken(saved);
  }, []);

  const loginSuccess = (userToken: string) => {
    localStorage.setItem('ecom_auth_token', userToken);
    setToken(userToken);
  };

  const logout = () => {
    localStorage.removeItem('ecom_auth_token');
    setToken(null);
  };

  return { token, loginSuccess, logout };
}
