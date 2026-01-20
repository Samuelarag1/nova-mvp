
import React, { useState } from 'react';
import { Sparkles, RefreshCw, AlertCircle, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { BusinessMetrics, Transaction } from '../types';
import { getBusinessInsights } from '../services/geminiService';
import { useLanguage } from '../src/i18n/LanguageContext';

interface InsightsProps {
  metrics: BusinessMetrics;
  transactions: Transaction[];
}

const Insights: React.FC<InsightsProps> = ({ metrics, transactions }) => {
  const { t } = useLanguage();
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateInsights = async () => {
    if (metrics.transactionCount === 0) {
      setError(t('pleaseAddTransactions'));
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await getBusinessInsights(metrics, transactions.slice(0, 10));
      setInsight(result);
    } catch (err) {
      setError(t('failedToGenerate'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl shadow-blue-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Sparkles className="text-amber-300" />
              {t('aiBusinessAdvisor')}
            </h2>
            <p className="text-blue-100 text-lg">
              {t('getInsightsIntro')}
            </p>
          </div>
          <button 
            onClick={generateInsights}
            disabled={loading}
            className="shrink-0 flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all disabled:opacity-50 shadow-lg"
          >
            {loading ? <RefreshCw className="animate-spin" /> : <Sparkles size={20} />}
            {loading ? t('analyzing') : t('generateInsights')}
          </button>
        </div>
      </div>

      {!insight && !loading && !error && (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500">
            <Info size={32} />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">{t('readyToAnalyze')}</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            {t('clickToAnalyze')}
          </p>
        </div>
      )}

      {loading && (
        <div className="space-y-4">
          <div className="h-4 bg-slate-200 rounded-full w-3/4 animate-pulse"></div>
          <div className="h-4 bg-slate-200 rounded-full w-1/2 animate-pulse"></div>
          <div className="h-4 bg-slate-200 rounded-full w-5/6 animate-pulse"></div>
          <div className="h-4 bg-slate-200 rounded-full w-2/3 animate-pulse"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-4 text-red-700">
          <AlertCircle className="shrink-0 mt-1" />
          <div>
            <h4 className="font-bold mb-1">{t('observationRequired')}</h4>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {insight && (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm prose prose-blue max-w-none animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ReactMarkdown
            components={{
              h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-slate-900 mb-4" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-xl font-bold text-slate-800 mt-6 mb-3" {...props} />,
              p: ({node, ...props}) => <p className="text-slate-600 leading-relaxed mb-4" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-2 mb-4" {...props} />,
              li: ({node, ...props}) => <li className="text-slate-600" {...props} />,
              strong: ({node, ...props}) => <strong className="font-bold text-slate-900" {...props} />,
            }}
          >
            {insight}
          </ReactMarkdown>
          
          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center text-slate-400 text-xs italic">
            <span>{t('lastAnalyzed')}: {new Date().toLocaleString()}</span>
            <span className="flex items-center gap-1">{t('poweredBy')} <Sparkles size={12} /></span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Insights;
