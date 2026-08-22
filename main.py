from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
import pandas as pd
from google import genai
from google.genai import types
import os
from dotenv import load_dotenv
from schemas import StockRecommendationMaster

# Load environment variables
load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI(title="AI Stock Recommendation Master API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from your deployed Vercel frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Master AI Stock Intelligence Server is running!"}

def calculate_rsi(data: pd.Series, window: int = 14) -> float:
    """Calculate Relative Strength Index (RSI) from historical close prices."""
    try:
        delta = data.diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=window).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=window).mean()
        rs = gain / loss
        rsi = 100 - (100 / (1 + rs))
        return round(float(rsi.iloc[-1]), 2)
    except Exception:
        return 50.0  # Default neutral fallback

def fetch_financial_data(ticker_symbol: str) -> dict:
    ticker = yf.Ticker(ticker_symbol)
    info = ticker.info
    hist = ticker.history(period="6mo")
    
    if hist.empty:
        raise ValueError(f"Invalid ticker '{ticker_symbol}' or no data found.")
    
    current_price = float(hist['Close'].iloc[-1])
    rsi_value = calculate_rsi(hist['Close'])
    
    return {
        "ticker": ticker_symbol,
        "current_price": current_price,
        "long_name": info.get('longName', ticker_symbol),
        "sector": info.get('sector', 'N/A'),
        "industry": info.get('industry', 'N/A'),
        "market_cap": info.get('marketCap', 'N/A'),
        "pe_ratio": info.get('trailingPE', 'N/A'),
        "forward_pe": info.get('forwardPE', 'N/A'),
        "debt_to_equity": info.get('debtToEquity', 'N/A'),
        "free_cashflow": info.get('freeCashflow', 'N/A'),
        "fifty_day_ma": info.get('fiftyDayAverage', current_price),
        "two_hundred_day_ma": info.get('twoHundredDayAverage', current_price),
        "rsi": rsi_value,
        "recent_high": float(hist['High'].max()),
        "recent_low": float(hist['Low'].min()),
        "news": [news.get("title", "No Title") for news in ticker.news[:5]] if ticker.news else []
    }

@app.get("/api/analyze/{ticker}", response_model=StockRecommendationMaster)
async def analyze_stock(ticker: str):
    try:
        raw_data = fetch_financial_data(ticker.upper())
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
        
    prompt = f"""
    You are an expert institutional equity research analyst. Complete the stock analysis for {raw_data['long_name']} ({raw_data['ticker']}).
    
    LIVE MARKET DATA:
    - Current Price: ${raw_data['current_price']}
    - Sector: {raw_data['sector']} | Industry: {raw_data['industry']}
    - Market Cap: {raw_data['market_cap']}
    - P/E Ratio: {raw_data['pe_ratio']} | Forward P/E: {raw_data['forward_pe']}
    - Debt to Equity: {raw_data['debt_to_equity']} | Free Cash Flow: {raw_data['free_cashflow']}
    - 50-Day MA: ${raw_data['fifty_day_ma']} | 200-Day MA: ${raw_data['two_hundred_day_ma']}
    - RSI (14): {raw_data['rsi']}
    - 6-Month High: ${raw_data['recent_high']} | 6-Month Low: ${raw_data['recent_low']}
    
    RECENT NEWS HEADLINES:
    {raw_data['news']}
    
    CRITICAL: You must return a JSON object matching this exact key structure with realistic values:
    {{
      "ticker": "{raw_data['ticker']}",
      "executive_summary": {{
        "investment_rating": "Buy",
        "confidence_score": 85.0,
        "current_market_price": {raw_data['current_price']},
        "fair_value_estimate": 240.0,
        "margin_of_safety_percentage": 12.5,
        "expected_upside_downside_percentage": 15.0,
        "risk_rating": "Moderate",
        "investment_horizon": "6-12 Months",
        "last_updated": "2026-08-22"
      }},
      "fair_value_analysis": {{
        "current_market_price": {raw_data['current_price']},
        "fair_value_estimate": 240.0,
        "margin_of_safety": 12.5,
        "discount_premium_to_fair_value": "-12.5%",
        "intrinsic_value_range": "$220 - $260",
        "fair_value_confidence": "High",
        "analyst_consensus_target": 250.0,
        "valuation_status": "Undervalued",
        "valuation_methods_summary": "Based on 10-year DCF model and forward P/E expansion."
      }},
      "company_overview": {{
        "company_description": "Detailed description here...",
        "industry": "{raw_data['industry']}",
        "sector": "{raw_data['sector']}",
        "market_capitalization": "{raw_data['market_cap']}",
        "business_model": "Summary of business model...",
        "main_products_services": ["Product A", "Product B"],
        "competitive_advantages": ["Advantage 1", "Advantage 2"],
        "major_competitors": ["Competitor A", "Competitor B"]
      }},
      "financial_health": {{
        "revenue": "Healthy growth",
        "revenue_growth": "8.5% YoY",
        "net_income": "Stable",
        "eps": "$6.45",
        "gross_margin": "46.2%",
        "operating_margin": "30.5%",
        "net_profit_margin": "25.0%",
        "debt_to_equity": "{raw_data['debt_to_equity']}",
        "free_cash_flow": "{raw_data['free_cashflow']}",
        "cash_position": "Strong liquidity",
        "dividend_yield": "0.55%"
      }},
      "growth_analysis": {{
        "revenue_growth_trend": "Positive upward trend",
        "earnings_growth_trend": "Robust EPS expansion",
        "historical_growth_summary": "12% CAGR over 5 years",
        "forecast_revenue_growth": "7.5%",
        "forecast_eps_growth": "10.2%",
        "growth_sustainability": "High"
      }},
      "fundamental_quality_score": {{
        "overall_score": 88.0,
        "quality_rating": "Elite Institutional Grade",
        "profitability_score": 95.0,
        "financial_stability_score": 85.0,
        "operational_efficiency_score": 90.0
      }},
      "technical_analysis": {{
        "current_trend": "Bullish",
        "fifty_day_ma": {raw_data['fifty_day_ma']},
        "two_hundred_day_ma": {raw_data['two_hundred_day_ma']},
        "rsi": {raw_data['rsi']},
        "support_levels": [210.0, 200.0],
        "resistance_levels": [235.0, 250.0],
        "suggested_entry_zone": "$215 - $220",
        "suggested_stop_loss": 205.0,
        "suggested_take_profit": 255.0
      }},
      "ai_investment_recommendation": {{
        "recommendation": "BUY",
        "confidence_score": 85.0,
        "investment_horizon": "6-12 Months",
        "overall_summary": "Comprehensive summary here...",
        "positive_factors": ["Factor 1", "Factor 2"],
        "negative_factors": ["Risk 1", "Risk 2"],
        "weighted_drivers": [{{"feature": "FCF Generation", "weight_percentage": 40}}]
      }},
      "recent_news_intelligence": {{
        "latest_news_headlines": {raw_data['news']},
        "ai_news_summary": "Summary of news here...",
        "overall_news_sentiment": "Bullish",
        "macroeconomic_factors": "Interest rate outlook impacts tech valuation."
      }},
      "market_sentiment": {{
        "overall_market_sentiment": "Optimistic",
        "retail_sentiment": "Bullish",
        "institutional_sentiment": "Accumulation",
        "fear_greed_assessment": "Neutral to Greed"
      }},
      "upcoming_catalysts": {{
        "earnings_release_date": "Next quarter",
        "dividend_announcement": "Upcoming quarterly",
        "agm_date": "Annual meeting scheduled",
        "product_launches_or_events": ["Key event 1", "Event 2"]
      }},
      "risk_analysis": {{
        "overall_risk_rating": "Moderate",
        "business_risk": "Supply chain concentration",
        "financial_risk": "Low financial leverage risk",
        "valuation_risk": "Trading at premium multiple",
        "regulatory_risk": "App store antitrust scrutiny",
        "ai_risk_assessment": "Manageable drawdown profile"
      }},
      "peer_comparison": [
        {{"peer_name": "Competitor 1", "market_cap": "3T", "pe_ratio": "32.0", "roe": "35%"}}
      ],
      "investment_thesis": {{
        "bullish_factors": ["Ecosystem retention", "Services growth"],
        "bearish_factors": ["Hardware cycle slowdown"],
        "long_term_outlook": "Strong secular growth anchor.",
        "short_term_outlook": "Range-bound consolidation.",
        "conclusion": "Favorable risk/reward profile."
      }},
      "portfolio_suitability": {{
        "suitable_investor_types": ["Growth", "Quality Dividend"],
        "risk_tolerance_required": "Moderate",
        "recommended_holding_period": "1-3 Years",
        "portfolio_allocation_suggestion": "5% - 8%"
      }},
      "ai_checklist": {{
        "undervalued_relative_to_fair_value": true,
        "positive_earnings_trend": true,
        "positive_free_cash_flow": true,
        "healthy_balance_sheet": true,
        "strong_profit_margins": true,
        "positive_technical_trend": true
      }},
      "explainable_ai": {{
        "data_sources_used": ["Yahoo Finance", "SEC Filings", "News Feed"],
        "factors_considered": ["Valuation", "Technical Trend", "Earnings Quality"],
        "confidence_by_category": "High in Financials, Medium in Macro",
        "limitations": "Does not account for sudden geopolitical shifts"
      }},
      "data_quality_status": {{
        "last_data_refresh": "Real-Time Market Data",
        "data_completeness_score": 98.0
      }}
    }}
    """

    try:
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.2
            )
        )
        
        raw_text = response.text.strip()
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:]
        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]
            
        import json
        parsed_data = json.loads(raw_text.strip())
        return StockRecommendationMaster(**parsed_data)
        
    except Exception as e:
        print(f"CRASH ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")