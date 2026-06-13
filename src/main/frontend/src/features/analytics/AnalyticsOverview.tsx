import React from 'react';
import { Loader, AlertTriangle, Layers } from 'lucide-react';
import type { AnalyticsPayload } from '@/types';
import { KpiGrid } from './KpiGrid';
import { RevenueChart } from './RevenueChart';
import { CohortPanel } from './CohortPanel';
import { ProductsTable } from './ProductsTable';

interface AnalyticsOverviewProps {
  data: AnalyticsPayload | null;
  loading: boolean;
  error: string | null;
}

/**
 * Wraps all analytics sub-components and handles loading/error states.
 */
export const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({
  data,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-slate-400 gap-4">
        <Loader className="w-10 h-10 animate-spin text-blue-500" />
        <p className="text-sm font-medium">Computing relational data calculations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md mx-auto mt-20">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h3 className="font-bold text-red-800 text-lg">Failed to compute metrics</h3>
        <p className="text-red-600 text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center p-20 bg-white border border-slate-200 rounded-2xl max-w-md mx-auto mt-20 shadow-sm">
        <Layers className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="font-bold text-slate-800 text-lg">No Store Selected</h3>
        <p className="text-slate-500 text-sm mt-1.5">
          Configure and register a store inside the Stores Manager tab to fetch data.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <KpiGrid kpis={data.kpis} retention={data.retention} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <RevenueChart data={data.salesTrend} />
        <CohortPanel retention={data.retention} />
      </div>

      <ProductsTable products={data.topProducts} />
    </div>
  );
};
