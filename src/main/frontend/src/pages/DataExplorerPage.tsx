import React, { useState } from 'react';
import { useDataExplorerQuery } from '@/hooks/queries/useDataExplorerQuery';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';
import { API_ENDPOINTS } from '@/config/apiEndpoints';

interface DataExplorerPageProps {
  entityType: string;
}

export const DataExplorerPage: React.FC<DataExplorerPageProps> = ({ entityType }) => {
  const [page, setPage] = useState(0);
  const size = 20;

  // Map entityType to endpoint
  const getEndpoint = (type: string) => {
    switch (type) {
      case 'products': return API_ENDPOINTS.DATA.PRODUCTS;
      case 'categories': return API_ENDPOINTS.DATA.CATEGORIES;
      case 'orders': return API_ENDPOINTS.DATA.ORDERS;
      case 'customers': return API_ENDPOINTS.DATA.CUSTOMERS;
      case 'coupons': return API_ENDPOINTS.DATA.COUPONS;
      case 'refunds': return API_ENDPOINTS.DATA.REFUNDS;
      case 'reviews': return API_ENDPOINTS.DATA.REVIEWS;
      default: return API_ENDPOINTS.DATA.PRODUCTS;
    }
  };

  const { data, isLoading, isError, error } = useDataExplorerQuery<any>(
    getEndpoint(entityType),
    page,
    size
  );

  // Dynamic columns based on the entity type
  const getColumns = (): ColumnDef<any>[] => {
    switch (entityType) {
      case 'products':
        return [
          { header: 'ID', accessorKey: 'id' },
          { header: 'Name', accessorKey: 'name' },
          { header: 'Type', accessorKey: 'type' },
          { header: 'Price', accessorKey: 'price' },
          { header: 'Status', accessorKey: 'status' },
        ];
      case 'orders':
        return [
          { header: 'Order ID', accessorKey: 'id' },
          { header: 'Status', accessorKey: 'status' },
          { header: 'Total', accessorKey: 'total' },
          { header: 'Currency', accessorKey: 'currency' },
          { header: 'Created At', accessorKey: 'dateCreated' },
        ];
      case 'customers':
        return [
          { header: 'ID', accessorKey: 'id' },
          { header: 'Email', accessorKey: 'email' },
          { header: 'First Name', accessorKey: 'firstName' },
          { header: 'Last Name', accessorKey: 'lastName' },
          { header: 'Role', accessorKey: 'role' },
        ];
      case 'categories':
        return [
          { header: 'ID', accessorKey: 'id' },
          { header: 'Name', accessorKey: 'name' },
          { header: 'Slug', accessorKey: 'slug' },
          { header: 'Count', accessorKey: 'count' },
        ];
      case 'coupons':
        return [
          { header: 'ID', accessorKey: 'id' },
          { header: 'Code', accessorKey: 'code' },
          { header: 'Amount', accessorKey: 'amount' },
          { header: 'Type', accessorKey: 'discountType' },
        ];
      case 'refunds':
        return [
          { header: 'ID', accessorKey: 'id' },
          { header: 'Amount', accessorKey: 'amount' },
          { header: 'Reason', accessorKey: 'reason' },
        ];
      case 'reviews':
        return [
          { header: 'ID', accessorKey: 'id' },
          { header: 'Product ID', accessorKey: 'productId' },
          { header: 'Reviewer', accessorKey: 'reviewer' },
          { header: 'Rating', accessorKey: 'rating' },
        ];
      default:
        return [{ header: 'ID', accessorKey: 'id' }];
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Reset page when entity type changes
  React.useEffect(() => {
    setPage(0);
  }, [entityType]);

  if (isError) {
    return (
      <div className="p-8 text-red-500 bg-red-50 rounded-lg">
        Error loading {entityType}: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 capitalize mb-2">
          {entityType} Explorer
        </h1>
        <p className="text-slate-500">
          Browse synchronized {entityType} directly from the local database.
        </p>
      </div>

      <DataTable
        data={data?.content || []}
        columns={getColumns()}
        isLoading={isLoading}
        page={data?.pageable?.pageNumber || 0}
        totalPages={data?.totalPages || 0}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
