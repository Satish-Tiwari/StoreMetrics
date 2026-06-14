export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  
  // Sync Status
  SYNC_STATUS: '/api/sync/status',
  
  // Manual Sync Triggers
  SYNC_MANUAL_GLOBAL: '/api/sync/manual',
  SYNC_MANUAL_ENTITY: (entityType: string) => `/api/sync/manual/${entityType}`,
  
  // WooCommerce Connection Health
  WOOCOMMERCE_HEALTH: '/api/woocommerce/health',
  
  // Dashboards / Analytics (example)
  ANALYTICS_OVERVIEW: '/api/analytics/overview',
  
  // Data Explorer (Synced Entities)
  DATA: {
    PRODUCTS: '/api/data/products',
    CATEGORIES: '/api/data/categories',
    ORDERS: '/api/data/orders',
    CUSTOMERS: '/api/data/customers',
    COUPONS: '/api/data/coupons',
    REFUNDS: '/api/data/refunds',
    REVIEWS: '/api/data/reviews',
  },
};
