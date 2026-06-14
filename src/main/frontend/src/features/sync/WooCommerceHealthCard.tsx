import React from 'react';
import { useWooCommerceHealthQuery } from './api/useWooCommerceHealthQuery';
import { Server, ShieldCheck, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';

export const WooCommerceHealthCard: React.FC = () => {
  const { data: health, isLoading, error } = useWooCommerceHealthQuery();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 animate-pulse">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
      </div>
    );
  }

  if (error || !health) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 flex items-start gap-3">
        <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 mt-0.5" />
        <div>
          <h3 className="font-semibold text-red-800 dark:text-red-300">Health Check Failed</h3>
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">Unable to verify connection to WooCommerce. Is the backend running?</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
            <Server className="w-5 h-5 text-slate-500" /> Connection Health
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Monitoring the live connection status to your WooCommerce store.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            {health.isHttps ? (
              <span className="flex items-center gap-1 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full">
                <ShieldCheck className="w-4 h-4" /> Secure (HTTPS)
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-3 py-1 rounded-full">
                <ShieldAlert className="w-4 h-4" /> Insecure (HTTP)
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 rounded-lg border bg-slate-50 dark:bg-slate-800/50 dark:border-slate-700 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider block mb-1">Target Store URL</span>
          <span className="font-mono text-sm break-all text-blue-600 dark:text-blue-400">{health.siteUrl}</span>
        </div>
        <div>
          {health.mainSiteReachable ? (
             <span className="flex items-center gap-1.5 text-sm font-medium text-green-600 dark:text-green-400">
               <CheckCircle2 className="w-4 h-4" /> Reachable
             </span>
          ) : (
            <span className="flex items-center gap-1.5 text-sm font-medium text-red-600 dark:text-red-400">
               <XCircle className="w-4 h-4" /> Unreachable
             </span>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">API Endpoints</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {health.endpoints.map(ep => (
            <div key={ep.name} className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800">
              <span className="text-sm font-medium">{ep.name}</span>
              {ep.status === 'OK' ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
