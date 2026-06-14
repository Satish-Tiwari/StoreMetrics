import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader, ArrowRight, ShieldAlert, CheckCircle } from 'lucide-react';

import { useLoginMutation } from '@hooks/mutations/auth/useLoginMutation';
import { useRegisterMutation } from '@hooks/mutations/auth/useRegisterMutation';

const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type AuthFormData = z.infer<typeof authSchema>;
export type RegisterFormData = AuthFormData;

interface AuthPageProps {
  onLoginSuccess: (token: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const loginMutation = useLoginMutation(onLoginSuccess);
  const registerMutation = useRegisterMutation();
  const [isRegistering, setIsRegistering] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = (data: AuthFormData) => {
    if (isRegistering) {
      registerMutation.mutate(data);
    } else {
      loginMutation.mutate(data);
    }
  };

  const toggleMode = () => {
    setIsRegistering((prev) => !prev);
    loginMutation.reset();
    registerMutation.reset();
  };

  const authLoading = loginMutation.isPending || registerMutation.isPending;
  
  const activeMutation = isRegistering ? registerMutation : loginMutation;
  const authError = activeMutation.error
    ? (activeMutation.error as any).response?.data?.message || activeMutation.error.message
    : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 font-sans p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl opacity-20 animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-20 animate-pulse pointer-events-none" />

      <div className="relative w-full max-w-md card p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            StoreMetrics
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            {isRegistering
              ? 'Create administrator credentials'
              : 'WooCommerce Platform Sign In'}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="label-base">
              Email Address
            </label>
            <input
              type="email"
              {...register('email')}
              autoComplete="email"
              className="input-base py-3 px-4"
              placeholder="admin@analytics.com"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="label-base">
              Password
            </label>
            <input
              type="password"
              {...register('password')}
              autoComplete={isRegistering ? 'new-password' : 'current-password'}
              className="input-base py-3 px-4"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1.5">{errors.password.message}</p>
            )}
          </div>

          {authError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400 flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {isRegistering && registerMutation.isSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-sm text-emerald-400 flex items-start gap-2.5">
              <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>Registration successful! Please sign in.</span>
            </div>
          )}

          <button
            type="submit"
            disabled={authLoading}
            className="btn btn-primary w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 border-none hover:from-blue-500 hover:to-purple-500 hover:shadow-lg hover:shadow-blue-500/20"
          >
            {authLoading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>{isRegistering ? 'Sign Up' : 'Sign In'}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={toggleMode}
            className="text-sm text-slate-400 hover:text-white transition"
          >
            {isRegistering
              ? 'Already have an account? Sign In'
              : "Don't have an administrator login? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};
