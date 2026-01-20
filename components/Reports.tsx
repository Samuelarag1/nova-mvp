import React, { useMemo } from 'react';
import { TrendingUp, AlertTriangle, AreaChart } from 'lucide-react';
import { Product, Transaction, TransactionType } from '../types';
import { useLanguage } from '../src/i18n/LanguageContext';

interface ReportsProps {
  products: Product[];
  transactions: Transaction[];
}

const Reports: React.FC<ReportsProps> = ({ products, transactions }) => {
  const { t } = useLanguage();

  const profitableProducts = useMemo(() => {
    // Calculate total profit per product based on sales
    const productStats = products.map(p => {
        // For MVP, Margin % is static per product. List by Margin % descending.
        // We could also multiply by quantity sold for 'total profit'.
        const margin = p.price > 0 ? ((p.price - (p.costPrice || 0)) / p.price) * 100 : 0;
        return { ...p, margin };
    });
    return productStats.sort((a, b) => b.margin - a.margin).slice(0, 5);
  }, [products, transactions]);

  const lowStockProducts = useMemo(() => {
    return products.filter(p => p.quantity < 5).sort((a, b) => a.quantity - b.quantity);
  }, [products]);

  const purchaseHistory = useMemo(() => {
      return transactions
        .filter(t => t.type === TransactionType.EXPENSE)
        .slice(0, 5);
  }, [transactions]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
        <AreaChart className="text-blue-600" />
        {t('reports')}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Profitable Products */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-2">
             <TrendingUp className="text-green-500" size={20} />
             <h3 className="font-semibold text-slate-800">{t('profitableProducts')}</h3>
          </div>
          <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase">
                  <tr>
                      <th className="px-6 py-3">{t('productName')}</th>
                      <th className="px-6 py-3 text-right">{t('margin')}</th>
                      <th className="px-6 py-3 text-right">{t('price')}</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                  {profitableProducts.map(p => (
                      <tr key={p.id}>
                          <td className="px-6 py-3 text-sm text-slate-800">{p.name}</td>
                          <td className="px-6 py-3 text-sm text-right font-bold text-green-600">{p.margin.toFixed(1)}%</td>
                          <td className="px-6 py-3 text-sm text-right text-slate-500">${p.price}</td>
                      </tr>
                  ))}
                  {profitableProducts.length === 0 && (
                      <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-400 text-sm">{t('noRecords')}</td></tr>
                  )}
              </tbody>
          </table>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-2">
             <AlertTriangle className="text-amber-500" size={20} />
             <h3 className="font-semibold text-slate-800">{t('lowStockAlerts')}</h3>
          </div>
          <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase">
                  <tr>
                      <th className="px-6 py-3">{t('productName')}</th>
                      <th className="px-6 py-3 text-right">{t('quantity')}</th>
                      <th className="px-6 py-3 text-right">{t('supplier')}</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                  {lowStockProducts.map(p => (
                      <tr key={p.id}>
                          <td className="px-6 py-3 text-sm text-slate-800">{p.name}</td>
                          <td className="px-6 py-3 text-sm text-right font-bold text-red-600">{p.quantity}</td>
                          <td className="px-6 py-3 text-sm text-right text-slate-500">{p.supplier || '-'}</td>
                      </tr>
                  ))}
                   {lowStockProducts.length === 0 && (
                      <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-400 text-sm">{t('noRecords')}</td></tr>
                  )}
              </tbody>
          </table>
        </div>
      </div>
      
      {/* Purchase History */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-2">
             <h3 className="font-semibold text-slate-800">{t('purchaseHistory')}</h3>
          </div>
          <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase">
                  <tr>
                      <th className="px-6 py-3">{t('date')}</th>
                      <th className="px-6 py-3">{t('productName')}</th>
                      <th className="px-6 py-3">{t('supplier')}</th>
                      <th className="px-6 py-3 text-right">{t('amount')}</th>
                  </tr>
              </thead>
               <tbody className="divide-y divide-slate-100">
                  {purchaseHistory.map(t => (
                      <tr key={t.id}>
                          <td className="px-6 py-3 text-sm text-slate-800">{new Date(t.date).toLocaleDateString()}</td>
                          <td className="px-6 py-3 text-sm text-slate-800">{t.description}</td>
                          <td className="px-6 py-3 text-sm text-slate-500">{t.supplier || '-'}</td>
                           <td className="px-6 py-3 text-sm text-right font-bold text-slate-800">${t.amount}</td>
                      </tr>
                  ))}
                   {purchaseHistory.length === 0 && (
                      <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400 text-sm">{t('noRecords')}</td></tr>
                  )}
              </tbody>
          </table>
      </div>
    </div>
  );
};

export default Reports;
