import React, { useState, useEffect } from 'react';
import type { TabId } from '@/types';
import { useStoresQuery } from '@hooks/queries/useStoresQuery';
import { useAnalyticsQuery } from '@hooks/queries/useAnalyticsQuery';

import { Sidebar } from '@components/layout/Sidebar';
import { Header } from '@components/layout/Header';

import { AnalyticsOverview } from '@features/analytics/AnalyticsOverview';
import { StoresManager } from '@features/stores/StoresManager';
import { AiChatPanel } from '@features/chat/AiChatPanel';
import { ReportsExporter } from '@features/reports/ReportsExporter';

interface DashboardPageProps {
  onLogout: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(() => new Date().toISOString().split('T')[0]);

  const { data: storesResponse } = useStoresQuery();
  const stores = storesResponse || [];

  const { data, isLoading, isError, error, refetch } = useAnalyticsQuery(
    selectedStoreId,
    startDate,
    endDate
  );

  useEffect(() => {
    if (stores.length > 0 && !selectedStoreId) {
      setSelectedStoreId(stores[0].id);
    }
  }, [stores, selectedStoreId]);

  const storeName = stores.find((s) => s.id === selectedStoreId)?.name;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50 transition-colors">
      <Sidebar
        stores={stores}
        selectedStoreId={selectedStoreId}
        onSelectStore={setSelectedStoreId}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={onLogout}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <Header
          activeTab={activeTab}
          storeName={storeName}
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

          {activeTab === 'stores' && <StoresManager />}

          {activeTab === 'chat' && <AiChatPanel selectedStoreId={selectedStoreId} />}

          {activeTab === 'reports' && (
            <ReportsExporter
              selectedStoreId={selectedStoreId}
              startDate={startDate}
              endDate={endDate}
            />
          )}
        </div>
      </main>
    </div>
  );
};
