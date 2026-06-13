import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import type { CustomerCohort } from '@/types';

interface CohortPanelProps {
  retention: CustomerCohort;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="card p-3 shadow-lg border-slate-200 dark:border-slate-800 text-xs">
        <p className="font-bold text-slate-900 dark:text-white mb-1">{payload[0].payload.name}</p>
        <p className="text-slate-600 dark:text-slate-400">
          Count: <span className="font-semibold text-blue-500">{payload[0].value.toLocaleString()}</span>
        </p>
      </div>
    );
  }
  return null;
};

/**
 * Customer loyalty cohort breakdown panel with retention rate highlight and BarChart.
 */
export const CohortPanel: React.FC<CohortPanelProps> = ({ retention }) => {
  const chartData = [
    { name: 'New', count: retention.newCustomers },
    { name: 'Repeat', count: retention.repeatCustomers }
  ];

  return (
    <div className="card flex flex-col justify-between">
      <div>
        <h3 className="card-header">Loyalty Cohort Analysis</h3>
        
        <div className="h-48 w-full mt-2 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#94A3B8' : '#3B82F6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-between items-center text-sm border-t border-slate-100 dark:border-slate-800 pt-3">
          <span className="text-slate-500 font-medium">Total Customers</span>
          <span className="font-bold text-slate-900 dark:text-white">{retention.totalCustomers.toLocaleString()}</span>
        </div>
      </div>

      <div className="mt-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-5 text-center">
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
          Retention Ratio
        </p>
        <p className="text-4xl font-extrabold text-blue-600 mt-2">
          {retention.retentionRate}%
        </p>
        <p className="text-xs text-slate-400 mt-2">
          Percentage of buyers returning for multiple orders
        </p>
      </div>
    </div>
  );
};
