import os
import json
from datetime import datetime, timedelta
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import finnhub
from google import genai
from google.genai import types

# Load environment variables
load_dotenv()

# Initialize API Clients
gemini_api_key = os.getenv("GEMINI_API_KEY")
finnhub_api_key = os.getenv("FINNHUB_API_KEY")

client = genai.Client(api_key=gemini_api_key)
finnhub_client = finnhub.Client(api_key=finnhub_api_key) if finnhub_api_key else None

app = FastAPI(title="Professional Options Flow & Institutional Sentiment API")

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Institutional Options Flow Intelligence Server Live"}


def fetch_market_baseline(ticker_symbol: str) -> dict:
    """Fetch live quote and news context from Finnhub to anchor the analysis."""
    try:
        quote = finnhub_client.quote(ticker_symbol)
        current_price = quote.get("c", 0.0)
        if current_price == 0:
            raise ValueError(
                f"Ticker '{ticker_symbol}' returned no price data."
            )

        profile = finnhub_client.company_profile2(symbol=ticker_symbol)
        financials = finnhub_client.company_basic_financials(
            ticker_symbol, "all"
        )
        metrics = financials.get("metric", {})

        # Fetch recent news
        end_date = datetime.now().strftime("%Y-%m-%d")
        start_date = (datetime.now() - timedelta(days=14)).strftime("%Y-%m-%d")
        raw_news = finnhub_client.company_news(
            ticker_symbol, _from=start_date, to=end_date
        )
        news_headlines = (
            [n.get("headline", "") for n in raw_news[:6] if n.get("headline")]
            if raw_news
            else []
        )

        return {
            "ticker": ticker_symbol,
            "company_name": profile.get("name", ticker_symbol),
            "current_price": current_price,
            "daily_change": quote.get("d", 0.0),
            "percent_change": quote.get("dp", 0.0),
            "high_today": quote.get("h", current_price),
            "low_today": quote.get("l", current_price),
            "market_cap": profile.get("marketCapitalization", "N/A"),
            "high_52w": metrics.get("52WeekHigh", current_price * 1.15),
            "low_52w": metrics.get("52WeekLow", current_price * 0.85),
            "news": news_headlines,
        }
    except Exception as e:
        print(f"Finnhub baseline fetch error: {e}")
        # Return fallback baseline if ticker is non-standard
        return {
            "ticker": ticker_symbol,
            "company_name": ticker_symbol,
            "current_price": 0.0,
            "daily_change": 0.0,
            "percent_change": 0.0,
            "high_today": 0.0,
            "low_today": 0.0,
            "market_cap": "N/A",
            "high_52w": 0.0,
            "low_52w": 0.0,
            "news": [],
        }


@app.get("/api/analyze/{ticker}")
async def analyze_options_flow(ticker: str):
    ticker_clean = ticker.upper().strip()
    baseline = fetch_market_baseline(ticker_clean)
    today_str = datetime.now().strftime("%Y-%m-%d")

    system_prompt = f"""
    Act as a Senior Institutional Quantitative Strategist and Elite Options Flow Analyst.
    Perform an in-depth options market, gamma exposure (GEX), dealer positioning (DEX), dark pool, and market sentiment analysis for: {baseline['company_name']} ({baseline['ticker']}).

    LIVE MARKET BASELINE DATA:
    - Target Ticker: {baseline['ticker']}
    - Reference Price: ${baseline['current_price']} (Day Change: {baseline['percent_change']}%)
    - Intraday Range: ${baseline['low_today']} - ${baseline['high_today']}
    - 52-Week Range: ${baseline['low_52w']} - ${baseline['high_52w']}
    - Market Capitalization: {baseline['market_cap']}
    - Date of Analysis: {today_str}
    - Recent News Context: {json.dumps(baseline['news'])}

    OPERATIONAL INSTRUCTIONS:
    1. Synthesize realistic institutional options flow, open interest distribution, gamma flip levels, dealer positioning, and technical levels tailored to {baseline['ticker']}.
    2. Distinguish confirmed market observations from probabilistic quantitative estimates.
    3. Return your response STRICTLY as a valid JSON object matching the exact structure below. Do not wrap in markdown quotes or extra text outside JSON.

    REQUIRED JSON STRUCTURE:
    {{
      "ticker": "{baseline['ticker']}",
      "company_name": "{baseline['company_name']}",
      "current_price": {baseline['current_price']},
      "executive_summary": {{
        "overall_rating": "Very Bullish | Bullish | Neutral | Bearish | Very Bearish",
        "confidence_score": 80,
        "institutional_sentiment": "Summary of institutional bias",
        "retail_sentiment": "Summary of retail positioning",
        "probability_uptrend": 60,
        "probability_downtrend": 40,
        "expected_price_direction": "Expected price channel",
        "expected_time_horizon": "1-3 Months",
        "trading_recommendation": "Buy Calls | Buy Puts | Sell Cash-Secured Puts | Stay Out | Buy Shares"
      }},
      "options_market_overview": {{
        "total_call_volume": "450,000",
        "total_put_volume": "380,000",
        "call_put_ratio": 0.84,
        "open_interest_calls": "1.9M",
        "open_interest_puts": "2.1M",
        "unusual_options_activity": "Description of notable sweeps/blocks",
        "large_block_trades_summary": "Details on key institutional block trades"
      }},
      "gex_and_dex_analysis": {{
        "dealer_gamma_regime": "Positive Gamma (Volatility Dampened) | Negative Gamma (Volatility Accelerated)",
        "gamma_flip_level": 0.0,
        "max_pain_price": 0.0,
        "implied_volatility": "45%",
        "iv_percentile": "75%",
        "expected_weekly_move": "±$0.00 (0.0%)",
        "volatility_recommendation": "Buy Options (Cheap Vol) | Sell Options (Rich Vol)"
      }},
      "technical_and_darkpool": {{
        "trend_strength": "Bullish / Consolidating / Bearish",
        "key_support_levels": ["$0.00", "$0.00"],
        "key_resistance_levels": ["$0.00", "$0.00"],
        "rsi_14": 52.0,
        "dark_pool_summary": "Summary of off-exchange institutional accumulation/distribution",
        "insider_activity_summary": "Summary of insider buying/selling trends"
      }},
      "price_targets": {{
        "one_day_target": "$0.00",
        "one_week_target": "$0.00",
        "one_month_target": "$0.00",
        "bull_case": {{"price": "$0.00", "probability": "40%"}},
        "base_case": {{"price": "$0.00", "probability": "45%"}},
        "bear_case": {{"price": "$0.00", "probability": "15%"}}
      }},
      "trading_plan": {{
        "bullish_strategy": {{
          "strategy_type": "e.g., Bull Call Spread or Long Calls",
          "entry_price": "$0.00",
          "strike_selection": "$0.00 Calls",
          "expiration": "YYYY-MM-DD",
          "target_price": "$0.00",
          "stop_loss": "$0.00",
          "risk_reward": "1:3"
        }},
        "bearish_strategy": {{
          "strategy_type": "e.g., Bear Put Spread or Put Purchases",
          "entry_price": "$0.00",
          "strike_selection": "$0.00 Puts",
          "expiration": "YYYY-MM-DD",
          "target_price": "$0.00",
          "stop_loss": "$0.00",
          "risk_reward": "1:2.5"
        }}
      }},
      "institutional_sentiment_score": {{
        "options_flow_score": 7,
        "dark_pool_score": 8,
        "technical_score": 6,
        "news_sentiment_score": 7,
        "overall_score": 72
      }},
      "final_verdict": {{
        "smart_money_bias": "Institutions accumulating upside exposure",
        "highest_probability_trade": "Actionable top setup description",
        "top_risks": "Primary market or catalyst risks",
        "plain_english_summary": "2-paragraph summary translating all technical metrics into plain English for retail traders."
      }}
    }}
    """

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=system_prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.2,
            ),
        )

        raw_text = response.text.strip()
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:]
        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]

        parsed_data = json.loads(raw_text.strip())
        return parsed_data

    except Exception as e:
        print(f"Options Flow AI Analysis Crash: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Options Flow AI generation failed: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)