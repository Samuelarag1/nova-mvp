
import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import { useLanguage } from '../src/i18n/LanguageContext';

interface ProductFormProps {
  product?: Product;
  onSubmit: (product: Omit<Product, 'id'>) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, onCancel }) => {
  const { t } = useLanguage();
  const [name, setName] = useState(product?.name || '');
  const [price, setPrice] = useState(product?.price.toString() || '');
  const [costPrice, setCostPrice] = useState(product?.costPrice?.toString() || '');
  const [quantity, setQuantity] = useState(product?.quantity.toString() || '');
  const [sku, setSku] = useState(product?.sku || '');
  const [description, setDescription] = useState(product?.description || '');
  const [supplier, setSupplier] = useState(product?.supplier || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !price || !costPrice || !quantity || !sku) {
      setError(t('enterValidAmount')); // Reusing 'enterValidAmount' for generic validation or better create a new key "fillAllFields" but checking translations...
      // Actually let's use a generic error or specific.
      // For now let's assume 'Please fill all required fields' is needed but I didn't add it.
      // I'll stick to a simple error message.
      setError('Please fill all required fields');
      return;
    }

    if (parseFloat(price) < 0 || parseFloat(costPrice) < 0 || parseInt(quantity) < 0) {
        setError(t('enterValidAmount'));
        return;
    }

    onSubmit({
      name,
      price: parseFloat(price),
      costPrice: parseFloat(costPrice),
      quantity: parseInt(quantity),
      sku,
      description,
      supplier
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-white relative">
      <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-slate-100 flex justify-between items-center shrink-0">
        <h3 className="text-xl font-bold text-slate-800">
          {product ? t('editProduct') : t('addProduct')}
        </h3>
        <button type="button" onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('productName')}</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            autoFocus
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('price')} ($)</label>
            <input 
              type="number" 
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('costPrice')} ($)</label>
            <input 
              type="number" 
              step="0.01"
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('quantity')}</label>
            <input 
              type="number" 
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('sku')}</label>
            <input 
              type="text" 
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
        </div>
        
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('supplier')} ({t('optional')})</label>
            <input 
              type="text" 
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('description')} ({t('optional')})</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all h-24 resize-none"
            placeholder={t('addDetails')}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}
      </div>

      <div className="sticky bottom-0 bg-white p-4 border-t border-slate-100 flex gap-3 shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button 
            type="button" 
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors"
          >
            {t('cancel')}
          </button>
          <button 
            type="submit"
            className="flex-1 px-4 py-2 rounded-xl text-white font-medium shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Save size={18} />
            {t('save')}
          </button>
      </div>
    </form>
  );
};

export default ProductForm;
