import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

const fetchData = async <T>(endpoint: string, page: number, size: number): Promise<PageResponse<T>> => {
  const token = localStorage.getItem('token');
  const response = await axios.get(endpoint, {
    params: { page, size },
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
  return response.data;
};

export function useDataExplorerQuery<T>(endpoint: string, page: number, size: number = 20) {
  return useQuery({
    queryKey: ['data-explorer', endpoint, page, size],
    queryFn: () => fetchData<T>(endpoint, page, size),
  });
}
