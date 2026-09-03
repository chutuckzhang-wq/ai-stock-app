'use client';

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from 'react';
import { 
  Search, TrendingUp, Activity, BarChart3, 
  ShieldCheck, Target, Zap, AlertOctagon, Flame, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

// --- Shared Framer Motion Scroll Animation Configuration ---
const cardAnimation = {
  initial: { opacity: 0, y: 35, scale: 0.98 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.5 }
};

// --- Utility Formatters ---
const formatPrice = (val: any) => {
  if (val === null || val === undefined || val === 'N/A' || isNaN(Number(val))) return String(val || 'N/A');
  return `$${Number(val).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// --- Institutional Sentiment Rating Gauge ---
function SentimentGauge({ rating = 'Neutral' }: { rating?: string }) {
  const normalized = (rating || 'Neutral').toLowerCase();
  
  let angle = 0;
  let label = 'Neutral';
  let badgeBg = 'bg-slate-500/20 text-slate-200 border-slate-400/30';

  if (normalized.includes('very bullish') || normalized.includes('strong buy')) {
    angle = 70;
    label = 'Very Bullish';
    badgeBg = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-950/40';
  } else if (normalized.includes('bullish') || normalized.includes('buy')) {
    angle = 35;
    label = 'Bullish';
    badgeBg = 'bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-teal-950/40';
  } else if (normalized.includes('very bearish') || normalized.includes('strong sell')) {
    angle = -70;
    label = 'Very Bearish';
    badgeBg = 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-rose-950/40';
  } else if (normalized.includes('bearish') || normalized.includes('sell')) {
    angle = -35;
    label = 'Bearish';
    badgeBg = 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-950/40';
  } else {
    angle = 0;
    label = 'Neutral';
    badgeBg = 'bg-sky-500/20 text-sky-300 border-sky-400/30';
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-b from-white/10 to-blue-950/50 backdrop-blur-md rounded-2xl border border-white/15 shadow-inner">
      <div className="text-[11px] font-semibold text-blue-200/70 tracking-wider uppercase mb-1">
        Institutional Sentiment
      </div>

      <div className="relative w-48 h-28 flex items-end justify-center overflow-hidden">
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
          <path
            d="M 22 105 A 78 78 0 0 1 178 105"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M 22 105 A 78 78 0 0 1 178 105"
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <line x1="53" y1="48" x2="57" y2="53" stroke="rgba(15,23,42,0.8)" strokeWidth="2" />
          <line x1="84" y1="29" x2="86" y2="36" stroke="rgba(15,23,42,0.8)" strokeWidth="2" />
          <line x1="116" y1="29" x2="114" y2="36" stroke="rgba(15,23,42,0.8)" strokeWidth="2" />
          <line x1="147" y1="48" x2="143" y2="53" stroke="rgba(15,23,42,0.8)" strokeWidth="2" />
        </svg>

        {/* Tapered Gauge Needle */}
        <div 
          className="absolute bottom-2 left-1/2 origin-bottom transition-transform duration-1000"
          style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
        >
          <div className="w-1 h-20 bg-gradient-to-t from-slate-200 via-white to-cyan-200 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] mx-auto" />
        </div>

        {/* Needle Hub */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-slate-900 border-2 border-cyan-400/80 shadow-lg flex items-center justify-center z-10">
          <div className="w-2 h-2 rounded-full bg-cyan-300 shadow-sm" />
        </div>
      </div>

      <div className="flex justify-between w-full px-4 text-[10px] text-blue-200/60 font-medium -mt-1">
        <span>Bearish</span>
        <span>Neutral</span>
        <span>Bullish</span>
      </div>

      <div className={`mt-2 px-3.5 py-1 rounded-full text-xs font-bold border shadow-sm transition-all duration-300 ${badgeBg}`}>
        {label}
      </div>
    </div>
  );
}

export default function OptionsDashboard() {
  const [ticker, setTicker] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeOptions = async () => {
    if (!ticker) return;
    setLoading(true);
    setError('');
    setData(null);

    try {
      const res = await fetch(`https://ai-stock-backend-8flu.onrender.com/api/analyze/${ticker}`);
      if (!res.ok) {
        throw new Error('Could not fetch analysis. Verify ticker or server status.');
      }
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || 'Something went wrong while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed text-white p-4 md:p-10 font-sans relative"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-blue-950/65 pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        {/* Header & Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3.5 mb-3">
            <Image 
              src="/logo.png" 
              alt="App Logo" 
              width={56} 
              height={56} 
              className="rounded-xl shadow-lg border border-white/10"
            />
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              TradeWise Pulse AI
            </h1>
          </div>
          <p className="text-blue-100/80 mb-6 text-sm md:text-base font-medium">
            Institutional US equity research, multi-horizon price targets, and smart money positioning powered by Gemini.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Enter Stock Ticker (e.g., AAPL, NVDA, TSLA)"
              className="px-5 py-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md focus:outline-none focus:border-cyan-300 focus:bg-white/20 text-center sm:text-left flex-1 placeholder:text-blue-200/60 text-white transition-all shadow-lg"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && analyzeOptions()}
            />
            <button
              onClick={analyzeOptions}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 font-semibold transition-all shadow-xl shadow-cyan-900/30 disabled:opacity-50 border border-blue-400/30 flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Search size={18} />
              {loading ? 'Synthesizing...' : 'Run Flow Analysis'}
            </button>
          </div>

          {error && (
            <p className="text-red-300 mt-4 text-sm font-medium bg-red-900/40 inline-block px-4 py-1.5 rounded-lg border border-red-500/30">
              {error}
            </p>
          )}
        </motion.div>

        {/* Dynamic Analysis Content */}
        {data && (
          <div className="space-y-6">
            
            {/* 1. Executive Intelligence & Consensus */}
            <motion.div 
              {...cardAnimation}
              className="p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-xl"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-cyan-200">
                  <TrendingUp size={20} />
                  <h2 className="text-lg font-bold">1. Executive Flow Summary — {data.company_name} ({data.ticker})</h2>
                </div>
                <span className="text-xs text-blue-200/80">
                  Horizon: <strong className="text-white">{data.executive_summary?.expected_time_horizon}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
                <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-blue-900/25 p-3 rounded-xl border border-white/10">
                    <span className="text-xs text-blue-200/70 block">Reference Price</span>
                    <span className="text-xl font-bold">{formatPrice(data.current_price)}</span>
                  </div>
                  <div className="bg-blue-900/25 p-3 rounded-xl border border-white/10">
                    <span className="text-xs text-blue-200/70 block">Confidence Score</span>
                    <span className="text-xl font-bold text-cyan-300">{data.executive_summary?.confidence_score}%</span>
                  </div>
                  <div className="bg-blue-900/25 p-3 rounded-xl border border-white/10">
                    <span className="text-xs text-blue-200/70 block">Uptrend Prob.</span>
                    <span className="text-xl font-bold text-emerald-300">{data.executive_summary?.probability_uptrend}%</span>
                  </div>
                  <div className="bg-blue-900/25 p-3 rounded-xl border border-white/10">
                    <span className="text-xs text-blue-200/70 block">Top Recommendation</span>
                    <span className="text-sm font-bold text-amber-300 truncate block mt-1">
                      {data.executive_summary?.trading_recommendation}
                    </span>
                  </div>
                  
                  <div className="col-span-2 sm:col-span-4 bg-blue-950/40 p-3 rounded-xl border border-white/10 text-xs space-y-1">
                    <div className="text-blue-100">
                      <strong className="text-cyan-200">Institutional Sentiment:</strong> {data.executive_summary?.institutional_sentiment}
                    </div>
                    <div className="text-blue-200/80">
                      <strong className="text-cyan-200">Expected Direction:</strong> {data.executive_summary?.expected_price_direction}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <SentimentGauge rating={data.executive_summary?.overall_rating} />
                </div>
              </div>
            </motion.div>

            {/* 2 & 3. Options Flow vs GEX / Dealer Positioning */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Options Market Overview */}
              <motion.div 
                {...cardAnimation}
                className="p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10 text-cyan-200">
                    <BarChart3 size={20} />
                    <h2 className="text-lg font-bold">2. Options Volume & Put/Call Skew</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div className="bg-blue-900/20 p-2.5 rounded-lg border border-white/5">
                      Call Volume: <span className="font-bold text-emerald-300">{data.options_market_overview?.total_call_volume}</span>
                    </div>
                    <div className="bg-blue-900/20 p-2.5 rounded-lg border border-white/5">
                      Put Volume: <span className="font-bold text-rose-300">{data.options_market_overview?.total_put_volume}</span>
                    </div>
                    <div className="bg-blue-900/20 p-2.5 rounded-lg border border-white/5">
                      Call Open Int.: <span className="font-semibold">{data.options_market_overview?.open_interest_calls}</span>
                    </div>
                    <div className="bg-blue-900/20 p-2.5 rounded-lg border border-white/5">
                      Put Open Int.: <span className="font-semibold">{data.options_market_overview?.open_interest_puts}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-blue-950/40 p-2.5 rounded-lg border border-white/10 text-xs mb-3">
                    <span>Put / Call Ratio:</span>
                    <span className="font-bold text-cyan-300 text-sm">{data.options_market_overview?.call_put_ratio}</span>
                  </div>
                  <p className="text-xs text-blue-50 bg-blue-950/20 p-2.5 rounded-lg border border-white/5 leading-relaxed">
                    <strong className="text-cyan-200 block mb-1">Unusual Activity:</strong>
                    {data.options_market_overview?.unusual_options_activity}
                  </p>
                </div>
              </motion.div>

              {/* Gamma Exposure (GEX) & Dealer Mechanics */}
              <motion.div 
                {...cardAnimation}
                className="p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10 text-cyan-200">
                    <Zap size={20} />
                    <h2 className="text-lg font-bold">3. Gamma Exposure (GEX) & Dealer Bias</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div className="bg-blue-900/20 p-2.5 rounded-lg border border-white/5">
                      Gamma Flip: <span className="font-bold text-cyan-300">{formatPrice(data.gex_and_dex_analysis?.gamma_flip_level)}</span>
                    </div>
                    <div className="bg-blue-900/20 p-2.5 rounded-lg border border-white/5">
                      Max Pain Price: <span className="font-bold text-amber-300">{formatPrice(data.gex_and_dex_analysis?.max_pain_price)}</span>
                    </div>
                    <div className="bg-blue-900/20 p-2.5 rounded-lg border border-white/5">
                      Implied Volatility: <span className="font-semibold">{data.gex_and_dex_analysis?.implied_volatility}</span>
                    </div>
                    <div className="bg-blue-900/20 p-2.5 rounded-lg border border-white/5">
                      IV Percentile: <span className="font-semibold">{data.gex_and_dex_analysis?.iv_percentile}</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="bg-blue-950/40 p-2.5 rounded-lg border border-white/10">
                      <span className="text-blue-200/70">Dealer Regime:</span> <strong className="text-white block mt-0.5">{data.gex_and_dex_analysis?.dealer_gamma_regime}</strong>
                    </div>
                    <div className="bg-blue-950/40 p-2.5 rounded-lg border border-white/10 flex justify-between">
                      <span className="text-blue-200/70">Expected Weekly Move:</span>
                      <span className="font-bold text-emerald-300">{data.gex_and_dex_analysis?.expected_weekly_move}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* 4. Multi-Horizon Price Targets & Scenarios */}
            <motion.div 
              {...cardAnimation}
              className="p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-xl"
            >
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10 text-cyan-200">
                <Target size={20} />
                <h2 className="text-lg font-bold">4. Multi-Horizon Price Targets & Scenarios</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-emerald-950/30 border border-emerald-500/30 p-3.5 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-emerald-300 flex items-center gap-1">
                      <ArrowUpRight size={16} /> Bull Case
                    </span>
                    <span className="bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-200">
                      {data.price_targets?.bull_case?.probability}
                    </span>
                  </div>
                  <div className="text-xl font-extrabold text-white my-1">{data.price_targets?.bull_case?.price}</div>
                  <span className="text-[11px] text-emerald-200/70">Upside expansion target</span>
                </div>

                <div className="bg-sky-950/30 border border-sky-500/30 p-3.5 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sky-300 flex items-center gap-1">
                      <Activity size={16} /> Base Case
                    </span>
                    <span className="bg-sky-500/20 px-2 py-0.5 rounded text-sky-200">
                      {data.price_targets?.base_case?.probability}
                    </span>
                  </div>
                  <div className="text-xl font-extrabold text-white my-1">{data.price_targets?.base_case?.price}</div>
                  <span className="text-[11px] text-sky-200/70">Consolidation / Range target</span>
                </div>

                <div className="bg-rose-950/30 border border-rose-500/30 p-3.5 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-rose-300 flex items-center gap-1">
                      <ArrowDownRight size={16} /> Bear Case
                    </span>
                    <span className="bg-rose-500/20 px-2 py-0.5 rounded text-rose-200">
                      {data.price_targets?.bear_case?.probability}
                    </span>
                  </div>
                  <div className="text-xl font-extrabold text-white my-1">{data.price_targets?.bear_case?.price}</div>
                  <span className="text-[11px] text-rose-200/70">Downside support test</span>
                </div>
              </div>
            </motion.div>

            {/* 5. Actionable Trading Blueprint (Bull vs Bear Setups) */}
            <motion.div 
              {...cardAnimation}
              className="p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-xl"
            >
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10 text-cyan-200">
                <Flame size={20} />
                <h2 className="text-lg font-bold">5. High-Probability Actionable Trading Blueprint</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                
                {/* Bullish Options Blueprint */}
                <div className="bg-emerald-950/20 border border-emerald-500/25 p-4 rounded-xl space-y-2">
                  <div className="font-bold text-emerald-300 text-sm pb-1 border-b border-emerald-500/20">
                    🟢 Bullish Strategy: {data.trading_plan?.bullish_strategy?.strategy_type}
                  </div>
                  <div className="flex justify-between"><span>Entry Price:</span> <strong>{data.trading_plan?.bullish_strategy?.entry_price}</strong></div>
                  <div className="flex justify-between"><span>Strike Selection:</span> <strong>{data.trading_plan?.bullish_strategy?.strike_selection}</strong></div>
                  <div className="flex justify-between"><span>Expiration:</span> <strong>{data.trading_plan?.bullish_strategy?.expiration}</strong></div>
                  <div className="flex justify-between text-emerald-300"><span>Target Price:</span> <strong>{data.trading_plan?.bullish_strategy?.target_price}</strong></div>
                  <div className="flex justify-between text-rose-300"><span>Stop Loss:</span> <strong>{data.trading_plan?.bullish_strategy?.stop_loss}</strong></div>
                  <div className="flex justify-between"><span>Risk/Reward:</span> <strong className="text-cyan-300">{data.trading_plan?.bullish_strategy?.risk_reward}</strong></div>
                </div>

                {/* Bearish Options Blueprint */}
                <div className="bg-rose-950/20 border border-rose-500/25 p-4 rounded-xl space-y-2">
                  <div className="font-bold text-rose-300 text-sm pb-1 border-b border-rose-500/20">
                    🔴 Bearish Strategy: {data.trading_plan?.bearish_strategy?.strategy_type}
                  </div>
                  <div className="flex justify-between"><span>Entry Price:</span> <strong>{data.trading_plan?.bearish_strategy?.entry_price}</strong></div>
                  <div className="flex justify-between"><span>Strike Selection:</span> <strong>{data.trading_plan?.bearish_strategy?.strike_selection}</strong></div>
                  <div className="flex justify-between"><span>Expiration:</span> <strong>{data.trading_plan?.bearish_strategy?.expiration}</strong></div>
                  <div className="flex justify-between text-rose-300"><span>Target Price:</span> <strong>{data.trading_plan?.bearish_strategy?.target_price}</strong></div>
                  <div className="flex justify-between text-emerald-300"><span>Stop Loss:</span> <strong>{data.trading_plan?.bearish_strategy?.stop_loss}</strong></div>
                  <div className="flex justify-between"><span>Risk/Reward:</span> <strong className="text-cyan-300">{data.trading_plan?.bearish_strategy?.risk_reward}</strong></div>
                </div>

              </div>
            </motion.div>

            {/* 6. Institutional Sentiment Breakdown & Final Plain English Verdict */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Scorecard */}
              <motion.div 
                {...cardAnimation}
                className="p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-xl"
              >
                <div className="flex items-center gap-2 mb-3 text-cyan-200">
                  <ShieldCheck size={20} />
                  <h2 className="text-sm font-bold uppercase tracking-wider">Flow Scorecard</h2>
                </div>
                <div className="text-3xl font-extrabold text-white mb-3">
                  {data.institutional_sentiment_score?.overall_score} <span className="text-xs text-blue-200/70 font-normal">/ 100</span>
                </div>
                <div className="space-y-1.5 text-xs text-blue-100">
                  <div className="flex justify-between"><span>Options Flow:</span> <strong>{data.institutional_sentiment_score?.options_flow_score}/10</strong></div>
                  <div className="flex justify-between"><span>Dark Pool Prints:</span> <strong>{data.institutional_sentiment_score?.dark_pool_score}/10</strong></div>
                  <div className="flex justify-between"><span>Technical Alignment:</span> <strong>{data.institutional_sentiment_score?.technical_score}/10</strong></div>
                  <div className="flex justify-between"><span>News Sentiment:</span> <strong>{data.institutional_sentiment_score?.news_sentiment_score}/10</strong></div>
                </div>
              </motion.div>

              {/* Plain English Verdict */}
              <motion.div 
                {...cardAnimation}
                className="md:col-span-2 p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3 text-cyan-200">
                    <AlertOctagon size={20} />
                    <h2 className="text-sm font-bold uppercase tracking-wider">Plain-English Institutional Verdict</h2>
                  </div>
                  <p className="text-xs text-blue-50 leading-relaxed mb-3 whitespace-pre-line">
                    {data.final_verdict?.plain_english_summary}
                  </p>
                </div>
                <div className="text-xs text-amber-300 bg-amber-950/30 p-2.5 rounded-lg border border-amber-500/20">
                  <strong>Top Identified Risks:</strong> {data.final_verdict?.top_risks}
                </div>
              </motion.div>

            </div>

          </div>
        )}
      </div>
    </div>
  );
}