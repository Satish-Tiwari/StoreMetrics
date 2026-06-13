import React from 'react';
import type { Store } from '@/types';

interface StatusBadgeProps {
  status: Store['status'];
}

const config: Record<
  Store['status'],
  { wrapper: string; dot: string; label: string }
> = {
  Active: {
    wrapper: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    dot: 'bg-emerald-500',
    label: 'Active',
  },
  Syncing: {
    wrapper: 'bg-blue-50 border-blue-200 text-blue-700',
    dot: 'bg-blue-500 animate-ping',
    label: 'Syncing',
  },
  Error: {
    wrapper: 'bg-red-50 border-red-200 text-red-700',
    dot: 'bg-red-500',
    label: 'Error',
  },
  Pending: {
    wrapper: 'bg-amber-50 border-amber-200 text-amber-700',
    dot: 'bg-amber-500',
    label: 'Pending',
  },
};

/**
 * Renders a coloured pill badge for a WooCommerce store's sync status.
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const { wrapper, dot, label } = config[status] ?? config.Pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold border ${wrapper}`}
    >
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      {label}
    </span>
  );
};
