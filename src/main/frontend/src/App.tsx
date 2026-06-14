import React from 'react';
import { useAuth } from '@hooks/useAuth';
import { AuthPage } from '@features/auth/AuthPage';
import { DashboardPage } from '@pages/DashboardPage';

export default function App() {
  const { token, logout, loginSuccess } = useAuth();

  if (!token) {
    return <AuthPage onLoginSuccess={loginSuccess} />;
  }

  return <DashboardPage onLogout={logout} />;
}
