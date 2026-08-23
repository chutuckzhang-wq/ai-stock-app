'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, TrendingUp, ShieldAlert, Activity, CheckCircle2, 
  BarChart3, Building2, DollarSign, Newspaper, PieChart, AlertTriangle 
} from 'lucide-react';

// --- Utility Formatters ---
const formatPrice = (val: any, decimals = 3) => {
  if (val === null || val === undefined || val === 'N/A' || isNaN(Number(val))) return 'N/A';
  return `$${Number(val).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  })}`;
};

const formatMarketCap = (val: any) => {
  if (!val || val === 'N/A') return 'N/A';
  const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.-]+/g, ''));
  if (isNaN(num)) return String(val);

  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)} Trillion`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)} Billion`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)} Million`;
  return `$${num.toLocaleString()}`;
};

// --- High-End Institutional Rating Gauge ---
function RatingGauge({ rating = 'Hold' }: { rating?: string }) {
  const normalized = (rating || 'Hold').toLowerCase();
  
  // Needle rotation angles: -72° (Strong Sell) to +72° (Strong Buy)
  let angle = 0;
  let color = '#38bdf8';
  let label = 'Hold';
  let badgeBg = 'bg-sky-500/10 text-sky-300 border-sky-400/30';

  if (normalized.includes('strong buy')) {
    angle = 70;
    color = '#10b981';
    label = 'Strong Buy';
    badgeBg = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-emerald-950/40';
  } else if (normalized.includes('buy')) {
    angle = 35;
    color = '#34d399';
    label = 'Buy';
    badgeBg = 'bg-teal-500/15 text-teal-300 border-teal-500/40 shadow-teal-950/40';
  } else if (normalized.includes('strong sell')) {
    angle = -70;
    color = '#f43f5e';
    label = 'Strong Sell';
    badgeBg = 'bg-rose-500/15 text-rose-300 border-rose-500/40 shadow-rose-950/40';
  } else if (normalized.includes('sell')) {
    angle = -35;
    color = '#f59e0b';
    label = 'Sell';
    badgeBg = 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-amber-950/40';
  } else {
    angle = 0;
    color = '#94a3b8';
    label = 'Neutral';
    badgeBg = 'bg-slate-500/15 text-slate-300 border-slate-500/40 shadow-slate-950/40';
  }

  return (
    <div className="flex flex-col items-center justify-center p-3.5 bg-gradient-to-b from-white/10 to-blue-950/40 backdrop-blur-md rounded-2xl border border-white/15 shadow-inner">
      <div className="text-[11px] font-semibold text-blue-200/70 tracking-wider uppercase mb-1">
        Analyst Consensus
      </div>

      <div className="relative w-48 h-28 flex items-end justify-center overflow-hidden">
        {/* SVG Gauge Track */}
        <svg viewBox="0 0 200 115" className="w-full h-full drop-shadow-md">
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="25%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#cbd5e1" />
              <stop offset="75%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>

          {/* Background Outer Soft Ring */}
          <path
            d="M 22 105 A 78 78 0 0 1 178 105"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Main Gradient Arc */}
          <path
            d="M 22 105 A 78 78 0 0 1 178 105"
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Subtle Segment Divider Tick Marks */}
          <line x1="53" y1="48" x2="57" y2="53" stroke="rgba(15,23,42,0.8)" strokeWidth="2" />
          <line x1="84" y1="29" x2="86" y2="36" stroke="rgba(15,23,42,0.8)" strokeWidth="2" />
          <line x1="116" y1="29" x2="114" y2="36" stroke="rgba(15,23,42,0.8)" strokeWidth="2" />
          <line x1="147" y1="48" x2="143" y2="53" stroke="rgba(15,23,42,0.8)" strokeWidth="2" />
        </svg>

        {/* Tapered Needle */}
        <div 
          className="absolute bottom-2 left-1/2 origin-bottom transition-transform duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1)"
          style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
        >
          {/* Needle Spine */}
          <div className="w-1 h-20 bg-gradient-to-t from-slate-200 via-white to-cyan-200 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] mx-auto" />
        </div>

        {/* Needle Hub / Center Cap */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-slate-900 border-2 border-cyan-400/80 shadow-lg flex items-center justify-center z-10">
          <div className="w-2 h-2 rounded-full bg-cyan-300 shadow-sm" />
        </div>
      </div>

      {/* Five-Scale Labels */}
      <div className="flex justify-between w-full px-4 text-[10px] text-blue-200/60 font-medium -mt-1">
        <span>Strong Sell</span>
        <span>Hold</span>
        <span>Strong Buy</span>
      </div>

      {/* Pill Badge */}
      <div className={`mt-2 px-3.5 py-1 rounded-full text-xs font-bold border shadow-sm transition-all duration-300 ${badgeBg}`}>
        {label}
      </div>
    </div>
  );
}

export default function StockDashboard() {
  const [ticker, setTicker] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeStock = async () => {
    if (!ticker) return;
    setLoading(true);
    setError('');
    setData(null);

    try {
      const res = await fetch(`https://ai-stock-backend-8flu.onrender.com/api/analyze/${ticker}`);
      if (!res.ok) {
        throw new Error('Could not fetch stock analysis. Check your ticker or server.');
      }
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed text-white p-6 md:p-12 font-sans relative"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-blue-950/50 pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header & Search */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-cyan-300 mb-3">
            Institutional AI Stock Intelligence
          </h1>
          <p className="text-blue-100/80 mb-8 text-sm md:text-base font-medium">
            Comprehensive 18-Section Fundamental, Technical & Risk Analysis Powered by Gemini
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Enter Ticker (e.g., AAPL, NVDA)"
              className="px-5 py-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md focus:outline-none focus:border-cyan-300 focus:bg-white/20 text-center sm:text-left flex-1 placeholder:text-blue-200/60 text-white transition-all shadow-lg"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && analyzeStock()}
            />
            <button
              onClick={analyzeStock}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 font-semibold transition-all shadow-xl shadow-cyan-900/30 disabled:opacity-50 border border-blue-400/30 flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
            >
              <Search size={18} />
              {loading ? 'Analyzing...' : 'Run Analysis'}
            </button>
          </div>

          {error && <p className="text-red-300 mt-4 text-sm font-medium bg-red-900/30 inline-block px-3 py-1 rounded-md">{error}</p>}
        </div>

        {/* Dashboard Sections */}
        {data && (
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* 1. Executive Summary & Analyst Gauge */}
            <div className="p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-xl">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-cyan-200">
                  <TrendingUp size={20} />
                  <h2 className="text-lg font-bold">1. Executive Summary</h2>
                </div>
                <span className="text-xs text-blue-200/70">
                  Horizon: <strong className="text-white">{data.executive_summary?.investment_horizon}</strong> | Updated: {data.executive_summary?.last_updated}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
                {/* Metric Cards */}
                <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-blue-900/20 p-3 rounded-xl border border-white/10">
                    <span className="text-xs text-blue-200/70 block">Market Price</span>
                    <span className="text-xl font-bold">{formatPrice(data.executive_summary?.current_market_price, 3)}</span>
                  </div>
                  <div className="bg-blue-900/20 p-3 rounded-xl border border-white/10">
                    <span className="text-xs text-blue-200/70 block">Fair Value</span>
                    <span className="text-xl font-bold text-cyan-300">{formatPrice(data.executive_summary?.fair_value_estimate, 3)}</span>
                  </div>
                  <div className="bg-blue-900/20 p-3 rounded-xl border border-white/10">
                    <span className="text-xs text-blue-200/70 block">AI Confidence</span>
                    <span className="text-xl font-bold">{data.executive_summary?.confidence_score}%</span>
                  </div>
                  <div className="bg-blue-900/20 p-3 rounded-xl border border-white/10">
                    <span className="text-xs text-blue-200/70 block">Risk Rating</span>
                    <span className="text-xl font-bold text-amber-300">{data.executive_summary?.risk_rating}</span>
                  </div>
                </div>

                {/* Needle Rating Gauge */}
                <div className="lg:col-span-1">
                  <RatingGauge rating={data.executive_summary?.investment_rating} />
                </div>
              </div>
            </div>

            {/* 2 & 3. Valuation & Company Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Valuation Analysis */}
              <div className="p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-xl">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10 text-cyan-200">
                  <DollarSign size={20} />
                  <h2 className="text-lg font-bold">2. Valuation & Fair Value</h2>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-blue-200/70">Status:</span> <span className="font-bold text-cyan-300">{data.fair_value_analysis?.valuation_status}</span></div>
                  <div className="flex justify-between"><span className="text-blue-200/70">Margin of Safety:</span> <span className="font-semibold">{data.fair_value_analysis?.margin_of_safety}%</span></div>
                  <div className="flex justify-between"><span className="text-blue-200/70">Intrinsic Range:</span> <span className="font-semibold">{data.fair_value_analysis?.intrinsic_value_range}</span></div>
                  <p className="text-xs text-blue-100 bg-blue-950/30 p-2.5 rounded-lg mt-3 border border-white/5">{data.fair_value_analysis?.valuation_methods_summary}</p>
                </div>
              </div>

              {/* Company Overview */}
              <div className="p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-xl">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10 text-cyan-200">
                  <Building2 size={20} />
                  <h2 className="text-lg font-bold">3. Company Overview</h2>
                </div>
                <p className="text-xs text-blue-50 leading-relaxed mb-3">{data.company_overview?.company_description}</p>
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="bg-blue-900/20 p-2 rounded border border-white/10">Sector: <span className="font-semibold">{data.company_overview?.sector}</span></div>
                  <div className="bg-blue-900/20 p-2 rounded border border-white/10">Cap: <span className="font-semibold text-cyan-300">{formatMarketCap(data.company_overview?.market_capitalization)}</span></div>
                </div>
                <div className="text-xs text-blue-200/80">
                  <strong className="text-cyan-200">Competitors:</strong> {Array.isArray(data.company_overview?.major_competitors) ? data.company_overview?.major_competitors.join(', ') : 'N/A'}
                </div>
              </div>
            </div>

            {/* 4 & 6. Financial Health & Score */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Financial Health */}
              <div className="p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-xl">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10 text-cyan-200">
                  <BarChart3 size={20} />
                  <h2 className="text-lg font-bold">4. Financial Health</h2>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between bg-blue-900/20 p-2 rounded"><span>Revenue:</span> <span className="font-semibold">{data.financial_health?.revenue}</span></div>
                  <div className="flex justify-between bg-blue-900/20 p-2 rounded"><span>Net Income:</span> <span className="font-semibold">{data.financial_health?.net_income}</span></div>
                  <div className="flex justify-between bg-blue-900/20 p-2 rounded"><span>Gross Margin:</span> <span className="font-semibold">{data.financial_health?.gross_margin}</span></div>
                  <div className="flex justify-between bg-blue-900/20 p-2 rounded"><span>Debt/Equity:</span> <span className="font-semibold">{data.financial_health?.debt_to_equity}</span></div>
                  <div className="flex justify-between bg-blue-900/20 p-2 rounded"><span>Free Cash Flow:</span> <span className="font-semibold">{formatMarketCap(data.financial_health?.free_cash_flow)}</span></div>
                  <div className="flex justify-between bg-blue-900/20 p-2 rounded"><span>Dividend Yield:</span> <span className="font-semibold">{data.financial_health?.dividend_yield}</span></div>
                </div>
              </div>

              {/* Fundamental Quality Score */}
              <div className="p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-xl">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10 text-cyan-200">
                  <PieChart size={20} />
                  <h2 className="text-lg font-bold">6. Fundamental Quality Score</h2>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-3xl font-extrabold text-white">{data.fundamental_quality_score?.overall_score} / 100</div>
                    <span className="text-xs text-cyan-300 font-semibold">{data.fundamental_quality_score?.quality_rating}</span>
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between mb-1"><span>Profitability</span> <span>{data.fundamental_quality_score?.profitability_score}%</span></div>
                    <div className="w-full bg-blue-950 h-1.5 rounded-full overflow-hidden"><div className="bg-cyan-300 h-full" style={{ width: `${data.fundamental_quality_score?.profitability_score}%` }}></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1"><span>Financial Stability</span> <span>{data.fundamental_quality_score?.financial_stability_score}%</span></div>
                    <div className="w-full bg-blue-950 h-1.5 rounded-full overflow-hidden"><div className="bg-blue-400 h-full" style={{ width: `${data.fundamental_quality_score?.financial_stability_score}%` }}></div></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 7. Technical Analysis */}
            <div className="p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-xl">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10 text-cyan-200">
                <Activity size={20} />
                <h2 className="text-lg font-bold">7. Technical Analysis</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs mb-4">
                <div className="bg-blue-900/20 p-3 rounded-xl border border-white/10">Trend: <span className="font-bold block text-cyan-300">{data.technical_analysis?.current_trend}</span></div>
                <div className="bg-blue-900/20 p-3 rounded-xl border border-white/10">RSI (14): <span className="font-bold block text-white">{data.technical_analysis?.rsi}</span></div>
                <div className="bg-blue-900/20 p-3 rounded-xl border border-white/10">50-Day MA: <span className="font-bold block text-white">{formatPrice(data.technical_analysis?.fifty_day_ma, 3)}</span></div>
                <div className="bg-blue-900/20 p-3 rounded-xl border border-white/10">200-Day MA: <span className="font-bold block text-white">{formatPrice(data.technical_analysis?.two_hundred_day_ma, 3)}</span></div>
              </div>
              <div className="text-xs text-blue-200 bg-blue-950/40 p-3 rounded-lg flex justify-between flex-wrap gap-2">
                <span>Entry Zone: <strong>{data.technical_analysis?.suggested_entry_zone}</strong></span>
                <span>Stop Loss: <strong className="text-rose-300">{formatPrice(data.technical_analysis?.suggested_stop_loss, 3)}</strong></span>
                <span>Take Profit: <strong className="text-emerald-300">{formatPrice(data.technical_analysis?.suggested_take_profit, 3)}</strong></span>
              </div>
            </div>

            {/* 8, 9, 12. Thesis, News & Risk */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* AI Recommendation */}
              <div className="p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-xl">
                <h2 className="text-sm font-bold text-cyan-200 uppercase tracking-wider mb-3">8. AI Recommendation</h2>
                <p className="text-xs text-blue-50 leading-relaxed mb-3">{data.ai_investment_recommendation?.overall_summary}</p>
                <div className="space-y-1 text-xs">
                  <span className="text-emerald-300 font-semibold block">✔ {data.ai_investment_recommendation?.positive_factors?.[0]}</span>
                  <span className="text-rose-300 font-semibold block">✘ {data.ai_investment_recommendation?.negative_factors?.[0]}</span>
                </div>
              </div>

              {/* Recent News */}
              <div className="p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-xl">
                <h2 className="text-sm font-bold text-cyan-200 uppercase tracking-wider mb-3">9. News Intelligence</h2>
                <p className="text-xs text-blue-50 leading-relaxed mb-3">{data.recent_news_intelligence?.ai_news_summary}</p>
                <div className="space-y-1">
                  {data.recent_news_intelligence?.latest_news_headlines?.slice(0, 2).map((h: string, i: number) => (
                    <p key={i} className="text-[11px] text-blue-200/80 truncate">• {h}</p>
                  ))}
                </div>
              </div>

              {/* Risk Analysis */}
              <div className="p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-xl">
                <h2 className="text-sm font-bold text-cyan-200 uppercase tracking-wider mb-3">12. Risk Analysis</h2>
                <p className="text-xs text-blue-50 leading-relaxed mb-2">{data.risk_analysis?.ai_risk_assessment}</p>
                <div className="text-xs text-amber-300 bg-amber-950/30 p-2 rounded border border-amber-500/20">
                  Overall Risk: {data.risk_analysis?.overall_risk_rating}
                </div>
              </div>
            </div>

            {/* 16. AI Investment Checklist */}
            <div className="p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-xl">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10 text-cyan-200">
                <CheckCircle2 size={20} />
                <h2 className="text-lg font-bold">16. AI Investment Checklist</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                {Object.entries(data.ai_checklist || {}).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2 bg-blue-900/20 p-2.5 rounded-lg border border-white/5">
                    <span className={value ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                      {value ? "✔" : "✘"}
                    </span>
                    <span className="capitalize text-blue-100">{key.replace(/_/g, ' ')}</span>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}
      </div>
    </div>
  );
}