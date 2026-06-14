import React, { useState, useEffect } from 'react';
import type { TabId } from '@/types';
import { useAnalyticsQuery } from '@hooks/queries/useAnalyticsQuery';

import { Sidebar } from '@components/layout/Sidebar';
import { Header } from '@components/layout/Header';

import { AnalyticsOverview } from '@features/analytics/AnalyticsOverview';
import { AiChatPanel } from '@features/chat/AiChatPanel';
import { ReportsExporter } from '@features/reports/ReportsExporter';
import { SyncManager } from '@features/sync/SyncManager';
import { DataExplorerPage } from '@/pages/DataExplorerPage';

interface DashboardPageProps {
  onLogout: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(() => new Date().toISOString().split('T')[0]);

  const { data, isLoading, isError, error, refetch } = useAnalyticsQuery(
    startDate,
    endDate
  );

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50 transition-colors">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={onLogout}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <Header
          activeTab={activeTab}
          storeName="WooCommerce Store"
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onRefresh={() => refetch()}
        />

        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'overview' && (
            <AnalyticsOverview
              data={data || null}
              loading={isLoading}
              error={isError && error ? error.message : null}
            />
          )}

          {activeTab === 'sync' && <SyncManager />}

          {activeTab === 'chat' && <AiChatPanel />}

          {activeTab === 'reports' && (
            <ReportsExporter
              startDate={startDate}
              endDate={endDate}
            />
          )}

          {activeTab.startsWith('data-') && (
            <DataExplorerPage entityType={activeTab.replace('data-', '')} />
          )}
        </div>
      </main>
    </div>
  );
};
