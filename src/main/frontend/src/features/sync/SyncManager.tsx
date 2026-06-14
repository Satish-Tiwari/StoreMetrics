import React, { useState } from 'react';
import { RefreshCcw, Clock, AlertCircle } from 'lucide-react';
import { WooCommerceHealthCard } from './WooCommerceHealthCard';
import { EntitySyncCard } from './EntitySyncCard';
import { useSyncStatusQuery } from './api/useSyncStatusQuery';
import { useTriggerSyncMutation } from './api/useTriggerSyncMutation';

const ENTITIES = [
  { type: 'categories', title: 'Product Categories', desc: 'Syncs category hierarchy and metadata.' },
  { type: 'products', title: 'Products', desc: 'Syncs simple/variable products, prices, and stock.' },
  { type: 'customers', title: 'Customers', desc: 'Syncs customer profiles and billing/shipping addresses.' },
  { type: 'orders', title: 'Orders', desc: 'Syncs orders, line items, and fulfillment statuses.' },
  { type: 'refunds', title: 'Refunds', desc: 'Syncs refund records associated with orders.' },
  { type: 'coupons', title: 'Coupons', desc: 'Syncs discount codes and usage limits.' },
  { type: 'reviews', title: 'Product Reviews', desc: 'Syncs customer reviews and ratings.' }
];

export const SyncManager: React.FC = () => {
  const { data: syncStates } = useSyncStatusQuery();
  const { mutate: triggerGlobalSync, isPending: isGlobalSyncingMutation } = useTriggerSyncMutation();

  // Determine if a global sync is active by checking if ANY entity is syncing
  // OR if the mutation itself is pending.
  const isAnyEntitySyncing = syncStates?.some(s => s.syncStatus === 'IN_PROGRESS') || false;
  const isGlobalSyncing = isGlobalSyncingMutation || isAnyEntitySyncing;

  const handleGlobalSync = () => {
    triggerGlobalSync(undefined); // undefined means global
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header & Global Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
        <div>
          <h2 className="text-xl font-bold mb-2">Data Sync Manager</h2>
          <p className="text-sm text-slate-500">
            Monitor connection health and manage synchronization of WooCommerce data.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            Automated sync runs every 8 hours
          </div>
          <button
            onClick={handleGlobalSync}
            disabled={isGlobalSyncing}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition shadow-sm ${
              isGlobalSyncing 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <RefreshCcw className={`w-5 h-5 ${isGlobalSyncing ? 'animate-spin' : ''}`} />
            {isGlobalSyncing ? 'Global Sync in Progress...' : 'Sync All Entities Now'}
          </button>
        </div>
      </div>

      {/* Health Check Card */}
      <WooCommerceHealthCard />

      {/* Entities Grid */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold">Individual Entities</h3>
          <div className="group relative">
             <AlertCircle className="w-4 h-4 text-slate-400 cursor-help" />
             <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-slate-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none z-10">
               Entities are processed in topological order to prevent foreign-key violations during global syncs.
             </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {ENTITIES.map(entity => (
            <EntitySyncCard
              key={entity.type}
              entityType={entity.type}
              title={entity.title}
              description={entity.desc}
              syncState={syncStates?.find(s => s.entityType === entity.type)}
              globalSyncing={isGlobalSyncing}
            />
          ))}
        </div>
      </div>

    </div>
  );
};
