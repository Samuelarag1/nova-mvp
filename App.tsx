
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  TrendingDown, 
  Lightbulb, 
  PlusCircle, 
  Package,
  ArrowRightLeft,
  Globe
} from 'lucide-react';
import { Transaction, TransactionType, ViewState, BusinessMetrics, Product } from './types';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import Insights from './components/Insights';
import InventoryList from './components/InventoryList';
import { useLanguage } from './src/i18n/LanguageContext';

const App: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const [view, setView] = useState<ViewState>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('biz_transactions');
    return saved ? JSON.parse(saved) : [];
  });
  const [products, setProducts] = useState<Product[]>(() => {
    // Force reset for this session to ensure products appear if empty or old format
    // In a real app we might migrate data, but for MVP demo purposes we re-seed if we detect "biz_products" might be stale or empty
    const saved = localStorage.getItem('biz_products');
    let parsed = [];
    try {
        parsed = saved ? JSON.parse(saved) : [];
    } catch (e) { parsed = []; }
    
    if (parsed.length > 0 && 'costPrice' in parsed[0]) {
        return parsed;
    }
    
    // Initial sample products (Seed if empty or missing new fields)
    const seeds = [
      { id: 'p1', name: 'Wireless Headphones', price: 99.99, costPrice: 45.00, quantity: 15, sku: 'WH-001', description: 'Noise cancelling high fidelity headphones' },
      { id: 'p2', name: 'Mechanical Keyboard', price: 149.50, costPrice: 85.00, quantity: 8, sku: 'MK-204', description: 'RGB backlit mechanical keyboard with blue switches' },
      { id: 'p3', name: 'Ergonomic Mouse', price: 59.99, costPrice: 25.00, quantity: 24, sku: 'EM-102', description: 'Vertical mouse for better wrist health' },
      { id: 'p4', name: 'USB-C Hub', price: 34.99, costPrice: 12.50, quantity: 42, sku: 'UH-550', description: '7-in-1 USB-C adapter for laptops' },
      { id: 'p5', name: 'Monitor Stand', price: 45.00, costPrice: 18.00, quantity: 5, sku: 'MS-900', description: 'Adjustable wooden monitor stand' }
    ];
    return seeds;
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState<TransactionType>(TransactionType.SALE);

  useEffect(() => {
    localStorage.setItem('biz_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('biz_products', JSON.stringify(products));
  }, [products]);

  const metrics = useMemo((): BusinessMetrics => {
    const totalRevenue = transactions
      .filter(t => t.type === TransactionType.SALE)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      profitMargin,
      transactionCount: transactions.length
    };
  }, [transactions]);

  const addTransaction = (newTransaction: Omit<Transaction, 'id'>, productId?: string, quantity?: number) => {
    const transaction = {
      ...newTransaction,
      id: Math.random().toString(36).substr(2, 9)
    };
    setTransactions(prev => [transaction, ...prev]);

    // Update inventory if sale
    if (newTransaction.type === TransactionType.SALE && productId && quantity) {
        setProducts(prev => prev.map(p => {
            if (p.id === productId) {
                return { ...p, quantity: Math.max(0, p.quantity - quantity) };
            }
            return p;
        }));
    }
    
    setIsFormOpen(false);
  };

  const addProduct = (newProduct: Omit<Product, 'id'>) => {
     const product = {
         ...newProduct,
         id: Math.random().toString(36).substr(2, 9)
     };
     setProducts(prev => [product, ...prev]);
  };

  const editProduct = (id: string, updatedProduct: Omit<Product, 'id'>) => {
     setProducts(prev => prev.map(p => p.id === id ? { ...updatedProduct, id } : p));
  };

  const deleteProduct = (id: string) => {
     setProducts(prev => prev.filter(p => p.id !== id));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            <Package className="w-8 h-8" />
            NovaSphere
          </h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">{t('managementSuite')}</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <button 
            onClick={() => setView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${view === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <LayoutDashboard size={20} /> {t('dashboard')}
          </button>
          <button 
            onClick={() => setView('sales')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${view === 'sales' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <TrendingUp size={20} /> {t('sales')}
          </button>
          <button 
            onClick={() => setView('expenses')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${view === 'expenses' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <TrendingDown size={20} /> {t('expenses')}
          </button>
          <button 
            onClick={() => setView('inventory')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${view === 'inventory' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Package size={20} /> {t('inventory')}
          </button>
          <button 
            onClick={() => setView('insights')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${view === 'insights' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Lightbulb size={20} /> {t('insights')}
          </button>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="bg-slate-900 rounded-xl p-4 text-white">
            <p className="text-xs text-slate-400 mb-1">Quick Actions</p>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => { setFormType(TransactionType.SALE); setIsFormOpen(true); }}
                className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <PlusCircle size={18} className="text-green-400 mb-1" />
                <span className="text-[10px]">{t('sale')}</span>
              </button>
              <button 
                onClick={() => { setFormType(TransactionType.EXPENSE); setIsFormOpen(true); }}
                className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <PlusCircle size={18} className="text-red-400 mb-1" />
                <span className="text-[10px]">{t('expense')}</span>
              </button>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-700">
                 <p className="text-xs text-slate-400 mb-2">{t('productsSeen')}</p>
                 <div className="space-y-2 max-h-40 overflow-y-auto">
                    {products.slice(0, 3).map(p => (
                        <button 
                            key={p.id}
                            onClick={() => { setFormType(TransactionType.SALE); setIsFormOpen(true); }}
                            className="w-full flex items-center justify-between p-2 rounded bg-slate-800 hover:bg-slate-700 transition-colors text-left"
                        >
                           <span className="text-xs font-medium truncate">{p.name}</span>
                           <span className="text-[10px] text-slate-400">${p.price}</span>
                        </button>
                    ))}
                    {products.length === 0 && <span className="text-[10px] text-slate-500">No products</span>}
                 </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-slate-800 capitalize">{t(view as any)}</h2>
          </div>
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
               className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors"
             >
               <Globe size={14} />
               {language.toUpperCase()}
             </button>
             <div className="hidden sm:block text-right">
                <p className="text-xs text-slate-500">{t('netProfit')}</p>
                <p className={`text-sm font-bold ${metrics.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${metrics.netProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
             </div>
             <button className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
               AD
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {view === 'dashboard' && <Dashboard metrics={metrics} transactions={transactions} />}
          {view === 'sales' && (
            <TransactionList 
              type={TransactionType.SALE} 
              transactions={transactions.filter(t => t.type === TransactionType.SALE)} 
              onDelete={deleteTransaction}
            />
          )}
          {view === 'expenses' && (
            <TransactionList 
              type={TransactionType.EXPENSE} 
              transactions={transactions.filter(t => t.type === TransactionType.EXPENSE)} 
              onDelete={deleteTransaction}
            />
          )}
          {view === 'inventory' && (
            <InventoryList
                products={products}
                onAdd={addProduct}
                onEdit={editProduct}
                onDelete={deleteProduct}
            />
          )}
          {view === 'insights' && <Insights metrics={metrics} transactions={transactions} />}
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden h-16 bg-white border-t border-slate-200 flex items-center justify-around px-2 shrink-0">
          <button onClick={() => setView('dashboard')} className={`p-2 ${view === 'dashboard' ? 'text-blue-600' : 'text-slate-400'}`}><LayoutDashboard size={24} /></button>
          <button onClick={() => setView('sales')} className={`p-2 ${view === 'sales' ? 'text-blue-600' : 'text-slate-400'}`}><TrendingUp size={24} /></button>
          <button onClick={() => { setFormType(TransactionType.SALE); setIsFormOpen(true); }} className="p-3 bg-blue-600 text-white rounded-full -translate-y-4 shadow-lg"><PlusCircle size={24} /></button>
          <button onClick={() => setView('expenses')} className={`p-2 ${view === 'expenses' ? 'text-blue-600' : 'text-slate-400'}`}><TrendingDown size={24} /></button>
          <button onClick={() => setView('inventory')} className={`p-2 ${view === 'inventory' ? 'text-blue-600' : 'text-slate-400'}`}><Package size={24} /></button>
        </div>

        {/* Modal Overlay */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
              <TransactionForm 
                type={formType} 
                products={products}
                onSubmit={addTransaction} 
                onCancel={() => setIsFormOpen(false)} 
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
