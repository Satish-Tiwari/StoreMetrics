import React from 'react';
import { Calendar, RefreshCw } from 'lucide-react';
import type { TabId } from '@/types';

const TAB_TITLES: Record<TabId, string> = {
  overview: 'Overview Analytics',
  stores:   'Stores Manager',
  chat:     'AI RAG Assistant',
  reports:  'Reports Exporter',
};

interface HeaderProps {
  activeTab: TabId;
  storeName?: string;
  startDate: string;
  endDate: string;
  onStartDateChange: (v: string) => void;
  onEndDateChange: (v: string) => void;
  onRefresh: () => void;
}

/**
 * Top header bar showing the current section title, active store badge,
 * and a date-range picker (visible only on analytics and reports tabs).
 */
export const Header: React.FC<HeaderProps> = ({
  activeTab,
  storeName,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onRefresh,
}) => {
  const showDateRange = activeTab === 'overview' || activeTab === 'reports';

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shrink-0 shadow-sm">
      {/* Left: title + active store badge */}
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">
          {TAB_TITLES[activeTab]}
        </h2>
        {storeName && (
          <span className="bg-slate-100 border border-slate-200 text-slate-600 text-xs px-2.5 py-1 rounded-full font-medium">
            {storeName}
          </span>
        )}
      </div>

      {/* Right: date range + refresh (analytics & reports only) */}
      {showDateRange && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-lg p-1.5 text-sm">
            <Calendar className="w-4 h-4 text-slate-500" />
            <input
              type="date"
              className="bg-transparent border-none text-slate-700 focus:outline-none"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
            />
            <span className="text-slate-400 px-1">to</span>
            <input
              type="date"
              className="bg-transparent border-none text-slate-700 focus:outline-none"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
            />
          </div>
          <button
            onClick={onRefresh}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 p-2 rounded-lg transition hover:shadow-sm active:scale-[0.98]"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
};
