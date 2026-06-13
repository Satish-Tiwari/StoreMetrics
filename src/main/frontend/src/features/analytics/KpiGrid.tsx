import React from 'react';
import { DollarSign, TrendingUp, ShoppingCart, Percent, Layers, Users } from 'lucide-react';
import type { KpiOverview, CustomerCohort } from '@/types';

interface KpiCardProps {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ label, value, sub, icon, iconBg, iconColor }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
    <div className="flex items-center justify-between mb-3.5">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      <div className={`p-2 ${iconBg} rounded-lg ${iconColor}`}>{icon}</div>
    </div>
    <p className="text-2xl font-black text-slate-900">{value}</p>
    <p className="text-xs text-slate-400 mt-1">{sub}</p>
  </div>
);

interface KpiGridProps {
  kpis: KpiOverview;
  retention: CustomerCohort;
}

/**
 * Renders the 6-card KPI summary row at the top of the analytics overview.
 */
export const KpiGrid: React.FC<KpiGridProps> = ({ kpis, retention }) => {
  const cards: KpiCardProps[] = [
    {
      label: 'Gross Revenue',
      value: `$${kpis.grossRevenue.toLocaleString()}`,
      sub: 'Total revenue processed',
      icon: <DollarSign className="w-4 h-4" />,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Refunds Volume',
      value: `$${kpis.totalRefunds.toLocaleString()}`,
      sub: 'Returned return values',
      icon: <Percent className="w-4 h-4" />,
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-600',
    },
    {
      label: 'Net Sales',
      value: `$${kpis.netRevenue.toLocaleString()}`,
      sub: 'Gross minus refund totals',
      icon: <TrendingUp className="w-4 h-4" />,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Order Volume',
      value: kpis.orderVolume.toLocaleString(),
      sub: 'Successful transactional count',
      icon: <ShoppingCart className="w-4 h-4" />,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      label: 'Average Order',
      value: `$${kpis.averageOrderValue.toLocaleString()}`,
      sub: 'Mean purchase values',
      icon: <Layers className="w-4 h-4" />,
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
    },
    {
      label: 'Retention Cohort',
      value: `${retention.retentionRate}%`,
      sub: 'Loyal repeat user index',
      icon: <Users className="w-4 h-4" />,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {cards.map((card) => (
        <KpiCard key={card.label} {...card} />
      ))}
    </div>
  );
};
