import React from 'react';
import { Loader, CheckCircle2, XCircle, Clock, RefreshCw } from 'lucide-react';
import { useSyncLogsQuery } from '@hooks/queries/useSyncLogsQuery';

interface SyncLogsViewerProps {
  storeId: string;
}

/**
 * Terminal-style panel to monitor real-time background synchronization execution logs.
 */
export const SyncLogsViewer: React.FC<SyncLogsViewerProps> = ({ storeId }) => {
  const { data: logs, isLoading, error, refetch, isRefetching } = useSyncLogsQuery(storeId);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'Failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'Processing':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="card mt-6">
      <div className="card-header border-b border-slate-100 dark:border-slate-800 pb-4 flex justify-between items-center mb-0">
        <h3 className="font-bold text-slate-900 dark:text-white">Execution Logs</h3>
        <button
          onClick={() => refetch()}
          disabled={isRefetching}
          className="btn btn-secondary py-1.5 px-3 text-xs flex items-center gap-2"
          title="Manual Refresh"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefetching ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="bg-slate-950 rounded-b-xl overflow-hidden font-mono text-sm max-h-80 overflow-y-auto">
        {isLoading ? (
          <div className="p-8 flex items-center justify-center text-slate-500 gap-2">
            <Loader className="w-4 h-4 animate-spin" />
            Loading execution logs...
          </div>
        ) : error ? (
          <div className="p-8 text-red-400 text-center">
            Failed to load sync logs. Check API connection.
          </div>
        ) : !logs || logs.length === 0 ? (
          <div className="p-8 text-slate-500 text-center">
            No synchronization history found for this store.
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {logs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-slate-900 transition flex items-start gap-4">
                <div className="mt-0.5">{getStatusIcon(log.status)}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <span className={`font-semibold ${log.status === 'Failed' ? 'text-red-400' : 'text-slate-300'}`}>
                      [JOB_{log.id.slice(0, 8).toUpperCase()}]
                    </span>
                    <span className="text-slate-500 text-xs">
                      {new Date(log.startedAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-1 text-slate-400 text-xs flex items-center gap-4">
                    <span>Status: <span className="text-slate-300">{log.status}</span></span>
                    <span>Records: <span className="text-slate-300">{log.recordsProcessed}</span></span>
                    {log.completedAt && (
                      <span>Completed: <span className="text-slate-300">{new Date(log.completedAt).toLocaleTimeString()}</span></span>
                    )}
                  </div>
                  {log.errorMessage && (
                    <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs whitespace-pre-wrap">
                      {log.errorMessage}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
