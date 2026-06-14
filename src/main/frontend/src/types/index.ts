// ─── Entity Types ────────────────────────────────────────────────────────────


export interface SyncLog {
  id: string;
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

export type TabId = 
  | 'overview' 
  | 'chat' 
  | 'reports' 
  | 'sync'
  | 'data-products'
  | 'data-categories'
  | 'data-orders'
  | 'data-customers'
  | 'data-coupons'
  | 'data-refunds'
  | 'data-reviews';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

