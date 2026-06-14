import React from 'react';
import { RefreshCcw, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { SyncState } from './api/useSyncStatusQuery';
import { useTriggerSyncMutation } from './api/useTriggerSyncMutation';

interface EntitySyncCardProps {
  entityType: string;
  title: string;
  description: string;
  syncState?: SyncState;
  globalSyncing: boolean;
}

export const EntitySyncCard: React.FC<EntitySyncCardProps> = ({ 
  entityType, 
  title, 
  description, 
  syncState,
  globalSyncing 
}) => {
  const { mutate: triggerSync, isPending } = useTriggerSyncMutation();

  const handleSync = () => {
    triggerSync(entityType);
  };

  const isSyncing = isPending || syncState?.syncStatus === 'IN_PROGRESS';
  const isDisabled = isSyncing || globalSyncing;

  const getStatusColor = () => {
    if (isSyncing) return 'text-blue-500';
    if (syncState?.syncStatus === 'FAILED') return 'text-red-500';
    if (syncState?.syncStatus === 'SUCCESS') return 'text-green-500';
    return 'text-slate-400';
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg">{title}</h3>
        {syncState?.syncStatus === 'SUCCESS' && !isSyncing && <CheckCircle2 className="w-5 h-5 text-green-500" />}
        {syncState?.syncStatus === 'FAILED' && !isSyncing && <XCircle className="w-5 h-5 text-red-500" />}
      </div>
      
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 flex-grow">
        {description}
      </p>

      <div className="mt-auto space-y-4">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Clock className="w-4 h-4" />
          <span>
            {syncState?.lastSuccessfulSync 
              ? new Date(syncState.lastSuccessfulSync).toLocaleString() 
              : 'Never synced'}
          </span>
        </div>

        {syncState?.errorMessage && !isSyncing && (
          <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100">
            {syncState.errorMessage}
          </div>
        )}

        <button
          onClick={handleSync}
          disabled={isDisabled}
          className={`w-full flex justify-center items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isDisabled
              ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed'
              : 'bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50'
          }`}
        >
          <RefreshCcw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-blue-500' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Sync Now'}
        </button>
      </div>
    </div>
  );
};
