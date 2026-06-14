import React from 'react';
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react';

export interface ColumnDef<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function DataTable<T>({
  data,
  columns,
  isLoading,
  page,
  totalPages,
  onPageChange,
}: DataTableProps<T>) {
  if (isLoading && data.length === 0) {
    return (
      <div className="flex items-center justify-center p-12 bg-white rounded-lg shadow-sm border border-slate-200">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs font-semibold">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="px-6 py-4">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 relative">
            {isLoading && (
              <tr>
                <td colSpan={columns.length} className="p-0">
                  <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
                     <Loader className="w-6 h-6 animate-spin text-blue-500" />
                  </div>
                </td>
              </tr>
            )}
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">
                  No records found.
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-slate-50/80 transition-colors">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                      {col.cell ? col.cell(row) : (col.accessorKey ? String(row[col.accessorKey]) : '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
        <span className="text-sm text-slate-500 font-medium">
          Page {page + 1} of {Math.max(1, totalPages)}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 0 || isLoading}
            className="p-2 border border-slate-200 rounded-md bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages - 1 || isLoading}
            className="p-2 border border-slate-200 rounded-md bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
