import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import type { SalesTrend } from '@/types';

interface RevenueChartProps {
  data: SalesTrend[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="card p-3 shadow-lg border-slate-200 dark:border-slate-800 text-xs">
        <p className="font-bold text-slate-900 dark:text-white mb-2">{label}</p>
        <p className="text-blue-500 mb-1">
          Revenue: <span className="font-semibold">${payload[0].value.toFixed(2)}</span>
        </p>
        <p className="text-purple-500">
          Orders: <span className="font-semibold">{payload[1].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

/**
 * Composed chart showing daily revenue trends and order volume over the selected date range.
 */
export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => (
  <div className="card lg:col-span-2">
    <h3 className="card-header">Revenue &amp; Order Volume Trends</h3>
    <div className="h-80 w-full">
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" opacity={0.5} />
            <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
            <YAxis yAxisId="left" stroke="#94A3B8" fontSize={11} tickLine={false} tickFormatter={(value) => `$${value}`} />
            <YAxis yAxisId="right" orientation="right" stroke="#94A3B8" fontSize={11} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              stroke="#3B82F6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRev)"
              name="Revenue"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="orders"
              stroke="#A855F7"
              strokeWidth={2}
              dot={{ r: 3, fill: '#A855F7', strokeWidth: 2, stroke: '#FFF' }}
              activeDot={{ r: 5 }}
              name="Orders"
            />
          </ComposedChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full flex items-center justify-center text-slate-400 text-sm">
          No sales records in selected date range.
        </div>
      )}
    </div>
  </div>
);
