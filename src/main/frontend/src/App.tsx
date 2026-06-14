import React from 'react';
import { useAuth } from '@hooks/useAuth';
import { AuthPage } from '@features/auth/AuthPage';
import { DashboardPage } from '@pages/DashboardPage';
import { Toaster } from 'react-hot-toast';

export default function App() {
  const { token, logout, loginSuccess } = useAuth();

  return (
    <>
      <Toaster position="top-right" />
      {!token ? (
        <AuthPage onLoginSuccess={loginSuccess} />
      ) : (
        <DashboardPage onLogout={logout} />
      )}
    </>
  );
}
