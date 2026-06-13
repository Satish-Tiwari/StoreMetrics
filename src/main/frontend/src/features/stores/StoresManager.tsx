import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2, RefreshCw, MessageSquare, Layers, Loader, AlertTriangle } from 'lucide-react';
import { useStoresQuery } from '@hooks/queries/useStoresQuery';
import { useAddStoreMutation } from '@hooks/mutations/stores/useAddStoreMutation';
import { useDeleteStoreMutation } from '@hooks/mutations/stores/useDeleteStoreMutation';
import { useVerifyStoreMutation } from '@hooks/mutations/stores/useVerifyStoreMutation';
import { useTriggerSyncMutation } from '@hooks/mutations/stores/useTriggerSyncMutation';
import { useTriggerIngestMutation } from '@hooks/mutations/stores/useTriggerIngestMutation';
import { StatusBadge } from '@components/ui/StatusBadge';
import { SyncLogsViewer } from './SyncLogsViewer';

const storeSchema = z.object({
  name: z.string().min(1, 'Store name is required'),
  storeUrl: z.string().url('Must be a valid URL'),
  consumerKey: z.string().min(1, 'Consumer Key is required'),
  consumerSecret: z.string().min(1, 'Consumer Secret is required'),
  dbHost: z.string().optional(),
  dbPort: z.string().optional(),
  dbUser: z.string().optional(),
  dbPassword: z.string().optional(),
  dbName: z.string().optional(),
});

type StoreFormData = z.infer<typeof storeSchema>;

export const StoresManager: React.FC = () => {
  const storesQuery = useStoresQuery();
  const addStoreMutation = useAddStoreMutation();
  const deleteStoreMutation = useDeleteStoreMutation();
  const verifyStoreMutation = useVerifyStoreMutation();
  const triggerSyncMutation = useTriggerSyncMutation();
  const triggerIngestMutation = useTriggerIngestMutation();

  const stores = storesQuery.data || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
    defaultValues: { dbPort: '3306' }
  });

  const onSubmit = (data: StoreFormData) => {
    addStoreMutation.mutate({
      name: data.name,
      storeUrl: data.storeUrl,
      consumerKey: data.consumerKey,
      consumerSecret: data.consumerSecret,
      dbHost: data.dbHost || null,
      dbPort: data.dbPort ? parseInt(data.dbPort, 10) : null,
      dbUser: data.dbUser || null,
      dbPassword: data.dbPassword || null,
      dbName: data.dbName || null,
    }, {
      onSuccess: () => reset()
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this store registry?')) {
      deleteStoreMutation.mutate(id, {
        onError: () => alert('Failed to remove store')
      });
    }
  };

  const handleIngest = (id: string) => {
    triggerIngestMutation.mutate(id, {
      onSuccess: () => alert(`Semantic context ingestion queued. Vector base will construct in background.`),
      onError: (err: any) => alert(err.response?.data?.message || 'Failed to trigger ingestion.')
    });
  };

  const handleSync = (id: string, full: boolean) => {
    triggerSyncMutation.mutate({ id, isFullSync: full }, {
      onSuccess: () => alert(`Synchronization successfully queued. The status will update shortly.`),
      onError: (err: any) => alert(err.response?.data?.message || 'Failed to enqueue sync job.')
    });
  };

  const formError = addStoreMutation.error 
    ? (addStoreMutation.error as any).response?.data?.message || addStoreMutation.error.message 
    : null;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Register Store Form */}
      <div className="card h-fit">
        <h3 className="card-header">
          <Plus className="w-5 h-5 text-blue-500" />
          <span>Register Store</span>
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label-base">Friendly Name</label>
            <input
              type="text"
              {...register('name')}
              className="input-base"
              placeholder="My Store"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="label-base">Store URL</label>
            <input
              type="url"
              {...register('storeUrl')}
              className="input-base"
              placeholder="https://example.com"
            />
            {errors.storeUrl && <p className="text-red-400 text-xs mt-1">{errors.storeUrl.message}</p>}
          </div>

          <div>
            <label className="label-base">WC Consumer Key</label>
            <input
              type="text"
              {...register('consumerKey')}
              className="input-base font-mono"
              placeholder="ck_..."
            />
            {errors.consumerKey && <p className="text-red-400 text-xs mt-1">{errors.consumerKey.message}</p>}
          </div>

          <div>
            <label className="label-base">WC Consumer Secret</label>
            <input
              type="password"
              {...register('consumerSecret')}
              className="input-base font-mono"
              placeholder="cs_..."
            />
            {errors.consumerSecret && <p className="text-red-400 text-xs mt-1">{errors.consumerSecret.message}</p>}
          </div>

          <div className="border-t border-slate-100 pt-4 mt-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Optional: Direct Database (MySQL)</h4>
            
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">DB Host</label>
                <input
                  type="text"
                  {...register('dbHost')}
                  className="input-base py-1.5 px-3 text-xs"
                  placeholder="localhost"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Port</label>
                <input
                  type="number"
                  {...register('dbPort')}
                  className="input-base py-1.5 px-3 text-xs"
                  placeholder="3306"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">DB User</label>
                <input
                  type="text"
                  {...register('dbUser')}
                  className="input-base py-1.5 px-3 text-xs"
                  placeholder="db_user"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">DB Password</label>
                <input
                  type="password"
                  {...register('dbPassword')}
                  className="input-base py-1.5 px-3 text-xs"
                  placeholder="••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">DB Name</label>
              <input
                type="text"
                {...register('dbName')}
                className="input-base py-1.5 px-3 text-xs"
                placeholder="wordpress"
              />
            </div>
          </div>

          {formError && (
            <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg p-3 text-xs font-semibold">
              {formError}
            </div>
          )}

          <button
            type="submit"
            disabled={addStoreMutation.isPending}
            className="btn btn-primary w-full mt-4"
          >
            {addStoreMutation.isPending ? <Loader className="w-4 h-4 animate-spin" /> : 'Register Store'}
          </button>
        </form>
      </div>

      {/* Stores list */}
      <div className="card xl:col-span-2 space-y-6">
        <h3 className="font-bold text-slate-900 text-lg">Active Store Registries</h3>

        {storesQuery.isLoading ? (
          <div className="flex justify-center p-8"><Loader className="w-8 h-8 animate-spin text-blue-500" /></div>
        ) : stores.length > 0 ? (
          <div className="space-y-6">
            {stores.map((s) => (
              <div key={s.id} className="border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{s.name}</h4>
                    <p className="text-slate-400 text-xs mt-0.5">{s.storeUrl}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <StatusBadge status={s.status} />

                    <button
                      onClick={() => handleDelete(s.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Delete Store"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                  <button
                    onClick={() => verifyStoreMutation.mutate(s.id)}
                    disabled={verifyStoreMutation.isPending && verifyStoreMutation.variables === s.id}
                    className="btn btn-secondary py-1.5 px-3 text-xs"
                  >
                    {verifyStoreMutation.isPending && verifyStoreMutation.variables === s.id ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Layers className="w-3.5 h-3.5" />}
                    Verify Health
                  </button>

                  <button
                    onClick={() => handleSync(s.id, false)}
                    className="btn btn-secondary py-1.5 px-3 text-xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Incremental Sync
                  </button>

                  <button
                    onClick={() => handleSync(s.id, true)}
                    className="btn btn-secondary py-1.5 px-3 text-xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Full Sync History
                  </button>

                  <button
                    onClick={() => handleIngest(s.id)}
                    className="btn border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 py-1.5 px-3 text-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Ingest Vector RAG
                  </button>
                </div>

                {verifyStoreMutation.isSuccess && verifyStoreMutation.data?.id === s.id && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-1 mt-4">
                    <div className="grid grid-cols-2 gap-2 text-slate-600">
                      <div>
                        <p>REST API Connection:{' '}
                          <span className={verifyStoreMutation.data.data.apiConnected ? 'text-emerald-600 font-bold' : 'text-red-500 font-bold'}>
                            {verifyStoreMutation.data.data.apiConnected ? 'SUCCESS' : 'FAILED'}
                          </span>
                        </p>
                        {verifyStoreMutation.data.data.apiVersion && <p className="text-[10px] text-slate-400">WC Version: {verifyStoreMutation.data.data.apiVersion}</p>}
                      </div>
                      <div>
                        <p>Direct DB Connection:{' '}
                          <span className={verifyStoreMutation.data.data.dbConnected === null ? 'text-slate-400 font-bold' : verifyStoreMutation.data.data.dbConnected ? 'text-emerald-600 font-bold' : 'text-red-500 font-bold'}>
                            {verifyStoreMutation.data.data.dbConnected === null ? 'UNCONFIGURED' : verifyStoreMutation.data.data.dbConnected ? 'SUCCESS' : 'FAILED'}
                          </span>
                        </p>
                        {verifyStoreMutation.data.data.dbVersion && <p className="text-[10px] text-slate-400">MySQL Version: {verifyStoreMutation.data.data.dbVersion}</p>}
                      </div>
                    </div>
                  </div>
                )}
                {verifyStoreMutation.isError && verifyStoreMutation.variables === s.id && (
                  <div className="bg-red-50 text-red-500 text-xs font-bold p-3 rounded-lg mt-4 border border-red-200">
                    {(verifyStoreMutation.error as any).response?.data?.message || verifyStoreMutation.error.message}
                  </div>
                )}

                {/* Real-time sync logs panel */}
                <SyncLogsViewer storeId={s.id} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
            <AlertTriangle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 text-sm">No e-commerce stores configured yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
