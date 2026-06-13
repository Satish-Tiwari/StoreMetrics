// ─── Entity Types ────────────────────────────────────────────────────────────

export interface Store {
  id: string;
  name: string;
  storeUrl: string;
  status: 'Active' | 'Syncing' | 'Error' | 'Pending';
  lastSyncedAt?: string;
}

export interface SyncLog {
  id: string;
  storeId: string;
  status: 'Pending' | 'Processing' | 'Success' | 'Failed';
  startedAt: string;
  completedAt?: string;
  recordsProcessed: number;
  errorMessage?: string;
}

export interface KpiOverview {
  grossRevenue: number;
  totalRefunds: number;
  netRevenue: number;
  orderVolume: number;
  averageOrderValue: number;
}

export interface CustomerCohort {
  totalCustomers: number;
  newCustomers: number;
  repeatCustomers: number;
  retentionRate: number;
}

export interface ProductPerformance {
  productName: string;
  quantitySold: number;
  totalRevenue: number;
}

export interface SalesTrend {
  date: string;
  revenue: number;
  orders: number;
}

export interface AnalyticsPayload {
  kpis: KpiOverview;
  retention: CustomerCohort;
  topProducts: ProductPerformance[];
  salesTrend: SalesTrend[];
  computedAt: string;
}

// ─── UI / State Types ─────────────────────────────────────────────────────────

export type TabId = 'overview' | 'stores' | 'chat' | 'reports';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface StoreVerificationData {
  apiConnected: boolean;
  apiVersion?: string;
  dbConnected: boolean | null;
  dbVersion?: string;
}

export interface StoreVerificationState {
  loading?: boolean;
  error?: string;
  data?: StoreVerificationData;
}

export interface AddStorePayload {
  name: string;
  storeUrl: string;
  consumerKey: string;
  consumerSecret: string;
  dbHost: string | null;
  dbPort: number | null;
  dbUser: string | null;
  dbPassword: string | null;
  dbName: string | null;
}
