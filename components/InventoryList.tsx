
import React, { useState } from 'react';
import { Search, PlusCircle, Pencil, Trash2, Package } from 'lucide-react';
import { Product } from '../types';
import { useLanguage } from '../src/i18n/LanguageContext';
import ProductForm from './ProductForm';

interface InventoryListProps {
  products: Product[];
  onAdd: (product: Omit<Product, 'id'>) => void;
  onEdit: (id: string, product: Omit<Product, 'id'>) => void;
  onDelete: (id: string) => void;
}

const InventoryList: React.FC<InventoryListProps> = ({ products, onAdd, onEdit, onDelete }) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (productData: Omit<Product, 'id'>) => {
    if (editingProduct) {
        onEdit(editingProduct.id, productData);
    } else {
        onAdd(productData);
    }
    setIsFormOpen(false);
    setEditingProduct(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Package className="text-blue-600" />
            {t('inventory')}
        </h2>
        <button 
            onClick={() => { setEditingProduct(undefined); setIsFormOpen(true); }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all font-medium"
        >
            <PlusCircle size={20} />
            {t('addProduct')}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">{t('productName')}</th>
                <th className="px-6 py-4">{t('sku')}</th>
                <th className="px-6 py-4 text-right">{t('price')}</th>
                <th className="px-6 py-4 text-right">{t('costPrice')}</th>
                <th className="px-6 py-4 text-right">{t('margin')}</th>
                <th className="px-6 py-4 text-right">{t('quantity')}</th>
                <th className="px-6 py-4 text-center">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">
                      {p.name}
                      {p.description && <p className="text-xs text-slate-400 font-normal truncate max-w-[200px]">{p.description}</p>}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                      {p.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right text-slate-800">
                      ${p.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-600">
                      ${p.costPrice?.toFixed(2) || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                       {p.costPrice ? (
                           <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                               ((p.price - p.costPrice) / p.price) * 100 > 30 ? 'bg-green-100 text-green-700' : 
                               ((p.price - p.costPrice) / p.price) * 100 > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                           }`}>
                               {(((p.price - p.costPrice) / p.price) * 100).toFixed(1)}%
                           </span>
                       ) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right">
                        <span className={`px-2 py-1 rounded-full text-xs ${p.quantity === 0 ? 'bg-red-100 text-red-700' : p.quantity < 5 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                            {p.quantity} {p.quantity === 0 ? t('outOfStock') : p.quantity < 5 ? t('lowStock') : t('stock')}
                        </span>
                    </td>
                    <td className="px-6 py-4 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEditClick(p)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title={t('edit')}
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        onClick={() => onDelete(p.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title={t('delete')}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400 text-sm">
                    {t('noRecords')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

       {/* Modal Overlay for Product Form */}
       {isFormOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center md:p-4">
            <div className="bg-white w-full h-[100dvh] md:h-auto md:max-h-[90vh] md:max-w-md md:rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 md:zoom-in duration-200">
              <ProductForm 
                product={editingProduct}
                onSubmit={handleFormSubmit} 
                onCancel={() => { setIsFormOpen(false); setEditingProduct(undefined); }} 
              />
            </div>
          </div>
        )}
    </div>
  );
};

export default InventoryList;
