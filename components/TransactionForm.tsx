import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { TransactionType, Transaction, Product } from '../types';
import { CATEGORIES } from '../constants';
import { useLanguage } from '../src/i18n/LanguageContext';

interface TransactionFormProps {
  type: TransactionType;
  products?: Product[];
  onSubmit: (transaction: Omit<Transaction, 'id'>, productId?: string, quantity?: number) => void;
  onCancel: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ type, onSubmit, onCancel, products = [] }) => {
  const { t } = useLanguage();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[type][0]);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [quantity, setQuantity] = useState('1');
  const [supplier, setSupplier] = useState('');
  const [error, setError] = useState('');

  // Update form when product is selected
  useEffect(() => {
    if (selectedProductId && type === TransactionType.SALE) {
        const product = products.find(p => p.id === selectedProductId);
        if (product) {
            setAmount((product.price * parseInt(quantity || '0')).toString());
            setDescription(product.name);
        }
    }
  }, [selectedProductId, quantity, products, type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!amount || parseFloat(amount) <= 0) {
      setError(t('enterValidAmount'));
      return;
    }

    if (type === TransactionType.SALE && selectedProductId) {
         const product = products.find(p => p.id === selectedProductId);
         if (product && parseInt(quantity) > product.quantity) {
             setError(`${t('lowStock')}: ${product.quantity} ${t('quantity')}`);
             return;
         }
    }

    onSubmit({
      type,
      amount: parseFloat(amount),
      category,
      description,
      date,
      supplier: type === TransactionType.EXPENSE ? supplier : undefined
    }, selectedProductId, parseInt(quantity));
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800">
           {t('addNew')} {type === TransactionType.SALE ? t('sale') : t('expense')}
        </h3>
        <button type="button" onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('amount')} ($)</label>
          <input 
            type="number" 
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="0.00"
            // If product selected, amount might be readOnly or just pre-filled
            // Let's keep it editable but typically calced
          />
        </div>

        {type === TransactionType.SALE && products.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
                 <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('productName')} ({t('optional')})</label>
                    <select
                        value={selectedProductId}
                        onChange={(e) => setSelectedProductId(e.target.value)}
                         className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                    >
                        <option value="">{t('selectProduct')}</option>
                        {products.map(p => (
                            <option key={p.id} value={p.id} disabled={p.quantity === 0}>
                                {p.name} ({p.quantity} avl.) - ${p.price}
                            </option>
                        ))}
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('quantity')}</label>
                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        disabled={!selectedProductId}
                    />
                 </div>
            </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('category')}</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
            >
              {CATEGORIES[type].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('date')}</label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {type === TransactionType.EXPENSE && (
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('supplier')} ({t('optional')})</label>
                <input 
                  type="text" 
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="e.g., Tech Distributor Inc."
                />
            </div>
        )}

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

        <div className="flex gap-3 pt-4">
          <button 
            type="button" 
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors"
          >
          
            {t('cancel')}
          </button>
          <button 
            type="submit"
            className={`flex-1 px-4 py-2 rounded-xl text-white font-medium shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 ${type === TransactionType.SALE ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
          >
            <Save size={18} />
            {t('save')} {type === TransactionType.SALE ? t('sale') : t('expense')}
          </button>
        </div>
      </div>
    </form>
  );
};

export default TransactionForm;
