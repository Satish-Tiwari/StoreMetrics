import React from 'react';
import type { ProductPerformance } from '@/types';

interface ProductsTableProps {
  products: ProductPerformance[];
}

/**
 * Sortable-ready table of top-performing products ranked by revenue.
 */
export const ProductsTable: React.FC<ProductsTableProps> = ({ products }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
    <h3 className="font-bold text-slate-900 text-lg mb-6">
      Top performing products catalog
    </h3>
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-wider">
            <th className="pb-3.5 pl-4">Product Name</th>
            <th className="pb-3.5 text-right">Units Sold</th>
            <th className="pb-3.5 pr-4 text-right">Revenue ($)</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((p, idx) => (
              <tr
                key={idx}
                className="border-b border-slate-100 hover:bg-slate-50/50 transition"
              >
                <td className="py-4 pl-4 text-sm font-medium text-slate-900">
                  {p.productName}
                </td>
                <td className="py-4 text-sm font-semibold text-slate-700 text-right">
                  {p.quantitySold.toLocaleString()}
                </td>
                <td className="py-4 pr-4 text-sm font-bold text-slate-950 text-right">
                  ${p.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="py-8 text-center text-slate-400 text-sm">
                No sales catalog transactions calculated.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);
