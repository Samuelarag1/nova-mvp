
import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
// Added missing TrendingUp and TrendingDown imports
import { DollarSign, Percent, ArrowUpRight, ArrowDownRight, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { BusinessMetrics, Transaction, TransactionType } from '../types';
import { COLORS } from '../constants';
import { useLanguage } from '../src/i18n/LanguageContext';

interface DashboardProps {
  metrics: BusinessMetrics;
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ metrics, transactions }) => {
  const { t } = useLanguage();
  const chartData = useMemo(() => {
    // Group transactions by date for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const daySales = transactions
        .filter(t => t.date === date && t.type === TransactionType.SALE)
        .reduce((sum, t) => sum + t.amount, 0);
      const dayExpenses = transactions
        .filter(t => t.date === date && t.type === TransactionType.EXPENSE)
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        date: new Date(date).toLocaleDateString(undefined, { weekday: 'short' }),
        revenue: daySales,
        expenses: dayExpenses
      };
    });
  }, [transactions]);

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-8 pb-12">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label={t('totalRevenue')}
          value={`$${metrics.totalRevenue.toLocaleString()}`} 
          icon={<DollarSign className="text-green-600" />}
          trend="+12.5%" 
          color="green"
        />
        <StatCard 
          label={t('totalExpenses')}
          value={`$${metrics.totalExpenses.toLocaleString()}`} 
          icon={<TrendingDown className="text-red-600" />}
          trend="+4.2%" 
          color="red"
        />
        <StatCard 
          label={t('netProfit')}
          value={`$${metrics.netProfit.toLocaleString()}`} 
          icon={<ArrowUpRight className="text-blue-600" />}
          trend="+18.3%" 
          color="blue"
        />
        <StatCard 
          label={t('profitMargin')}
          value={`${metrics.profitMargin.toFixed(1)}%`} 
          icon={<Percent className="text-amber-600" />}
          trend="-2.1%" 
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-800">{t('revenueVsExpenses')}</h3>
            <select className="text-sm bg-slate-50 border border-slate-200 rounded-md px-2 py-1 outline-none">
              <option>{t('last7Days')}</option>
              <option>{t('last30Days')}</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.1}/>
                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#cbd5e1', strokeWidth: 2 }}
                />
                <Area type="monotone" dataKey="revenue" stroke={COLORS.primary} strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="expenses" stroke={COLORS.danger} strokeWidth={2} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <Clock size={18} className="text-slate-400" />
            {t('recentActivity')}
          </h3>
          <div className="space-y-4">
            {recentTransactions.length > 0 ? (
              recentTransactions.map(t => (
                <div key={t.id} className="flex items-center gap-4 group">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${t.type === TransactionType.SALE ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {t.type === TransactionType.SALE ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{t.description || t.category}</p>
                    <p className="text-xs text-slate-500">{new Date(t.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${t.type === TransactionType.SALE ? 'text-green-600' : 'text-slate-800'}`}>
                      {t.type === TransactionType.SALE ? '+' : '-'}${t.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <p className="text-slate-400 text-sm">{t('noRecentTransactions')}</p>
              </div>
            )}
          </div>
          <button className="w-full mt-6 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
            {t('viewAllTransactions')}
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string; icon: React.ReactNode; trend: string; color: string }> = ({ label, value, icon, trend, color }) => {
  const bgColors: Record<string, string> = {
    green: 'bg-green-50',
    red: 'bg-red-50',
    blue: 'bg-blue-50',
    amber: 'bg-amber-50'
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${bgColors[color]}`}>{icon}</div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {trend}
        </span>
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium">{label}</p>
        <h4 className="text-2xl font-bold text-slate-900 mt-1">{value}</h4>
      </div>
    </div>
  );
};

export default Dashboard;
