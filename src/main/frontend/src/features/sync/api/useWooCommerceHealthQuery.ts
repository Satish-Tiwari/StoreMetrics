import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/config/apiEndpoints';

export interface EndpointHealth {
  name: string;
  path: string;
  status: 'OK' | 'ERROR';
  message: string;
}

export interface WooCommerceHealth {
  siteUrl: string;
  isHttps: boolean;
  mainSiteReachable: boolean;
  endpoints: EndpointHealth[];
}

export const fetchHealth = async (): Promise<WooCommerceHealth> => {
  const token = localStorage.getItem('token');
  const res = await fetch(API_ENDPOINTS.WOOCOMMERCE_HEALTH, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch health status');
  }
  return res.json();
};

export const useWooCommerceHealthQuery = () => {
  return useQuery({
    queryKey: ['woocommerceHealth'],
    queryFn: fetchHealth,
    refetchInterval: 30000, // Check every 30 seconds
  });
};
