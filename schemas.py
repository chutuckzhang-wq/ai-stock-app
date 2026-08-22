from pydantic import BaseModel, Field, confloat
from typing import List, Optional, Any, Union

class ExecutiveSummary(BaseModel):
    investment_rating: Optional[str] = "Hold"
    confidence_score: Optional[float] = 50.0
    current_market_price: Optional[float] = 0.0
    fair_value_estimate: Optional[float] = 0.0
    margin_of_safety_percentage: Optional[float] = 0.0
    expected_upside_downside_percentage: Optional[float] = 0.0
    risk_rating: Optional[str] = "Moderate"
    investment_horizon: Optional[str] = "Medium-term"
    last_updated: Optional[str] = "Today"

class ValuationAnalysis(BaseModel):
    current_market_price: Optional[float] = 0.0
    fair_value_estimate: Optional[float] = 0.0
    margin_of_safety: Optional[float] = 0.0
    discount_premium_to_fair_value: Optional[str] = "N/A"
    intrinsic_value_range: Optional[str] = "N/A"
    fair_value_confidence: Optional[str] = "Medium"
    analyst_consensus_target: Optional[float] = 0.0
    valuation_status: Optional[str] = "Fairly Valued"
    valuation_methods_summary: Optional[str] = "N/A"

class CompanyOverview(BaseModel):
    company_description: Optional[str] = "N/A"
    industry: Optional[str] = "N/A"
    sector: Optional[str] = "N/A"
    market_capitalization: Optional[Any] = "N/A"
    business_model: Optional[str] = "N/A"
    main_products_services: Optional[List[str]] = []
    competitive_advantages: Optional[List[str]] = []
    major_competitors: Optional[List[str]] = []

class FinancialHealth(BaseModel):
    revenue: Optional[Any] = "N/A"
    revenue_growth: Optional[Any] = "N/A"
    net_income: Optional[Any] = "N/A"
    eps: Optional[Any] = "N/A"
    gross_margin: Optional[Any] = "N/A"
    operating_margin: Optional[Any] = "N/A"
    net_profit_margin: Optional[Any] = "N/A"
    debt_to_equity: Optional[Any] = "N/A"
    free_cash_flow: Optional[Any] = "N/A"
    cash_position: Optional[Any] = "N/A"
    dividend_yield: Optional[Any] = "N/A"

class GrowthAnalysis(BaseModel):
    revenue_growth_trend: Optional[str] = "N/A"
    earnings_growth_trend: Optional[str] = "N/A"
    historical_growth_summary: Optional[str] = "N/A"
    forecast_revenue_growth: Optional[str] = "N/A"
    forecast_eps_growth: Optional[str] = "N/A"
    growth_sustainability: Optional[str] = "N/A"

class FundamentalQualityScore(BaseModel):
    overall_score: Optional[float] = 50.0
    quality_rating: Optional[str] = "Standard"
    profitability_score: Optional[float] = 50.0
    financial_stability_score: Optional[float] = 50.0
    operational_efficiency_score: Optional[float] = 50.0

class TechnicalAnalysis(BaseModel):
    current_trend: Optional[str] = "Neutral"
    fifty_day_ma: Optional[float] = 0.0
    two_hundred_day_ma: Optional[float] = 0.0
    rsi: Optional[float] = 50.0
    support_levels: Optional[List[float]] = []
    resistance_levels: Optional[List[float]] = []
    suggested_entry_zone: Optional[str] = "N/A"
    suggested_stop_loss: Optional[float] = 0.0
    suggested_take_profit: Optional[float] = 0.0

class AIRecommendation(BaseModel):
    recommendation: Optional[str] = "HOLD"
    confidence_score: Optional[float] = 50.0
    investment_horizon: Optional[str] = "3-6 Months"
    overall_summary: Optional[str] = "N/A"
    positive_factors: Optional[List[str]] = []
    negative_factors: Optional[List[str]] = []
    weighted_drivers: Optional[List[Any]] = []

class MarketIntelligence(BaseModel):
    latest_news_headlines: Optional[List[str]] = []
    ai_news_summary: Optional[str] = "N/A"
    overall_news_sentiment: Optional[str] = "Neutral"
    macroeconomic_factors: Optional[str] = "N/A"

class SentimentAnalysis(BaseModel):
    overall_market_sentiment: Optional[str] = "Neutral"
    retail_sentiment: Optional[str] = "Neutral"
    institutional_sentiment: Optional[str] = "Neutral"
    fear_greed_assessment: Optional[str] = "Neutral"

class UpcomingCatalysts(BaseModel):
    earnings_release_date: Optional[Any] = "N/A"
    dividend_announcement: Optional[Any] = "N/A"
    agm_date: Optional[Any] = "N/A"
    product_launches_or_events: Optional[Any] = []

class RiskAnalysis(BaseModel):
    overall_risk_rating: Optional[str] = "Moderate"
    business_risk: Optional[Any] = "N/A"
    financial_risk: Optional[Any] = "N/A"
    valuation_risk: Optional[Any] = "N/A"
    regulatory_risk: Optional[Any] = "N/A"
    ai_risk_assessment: Optional[str] = "N/A"

class PeerComparisonItem(BaseModel):
    peer_name: Optional[Any] = "N/A"
    market_cap: Optional[Any] = "N/A"
    pe_ratio: Optional[Any] = "N/A"
    roe: Optional[Any] = "N/A"

class InvestmentThesis(BaseModel):
    bullish_factors: Optional[List[str]] = []
    bearish_factors: Optional[List[str]] = []
    long_term_outlook: Optional[str] = "N/A"
    short_term_outlook: Optional[str] = "N/A"
    conclusion: Optional[str] = "N/A"

class PortfolioSuitability(BaseModel):
    suitable_investor_types: Optional[List[str]] = []
    risk_tolerance_required: Optional[str] = "Moderate"
    recommended_holding_period: Optional[str] = "N/A"
    portfolio_allocation_suggestion: Optional[str] = "N/A"

class AIChecklist(BaseModel):
    undervalued_relative_to_fair_value: Optional[bool] = False
    positive_earnings_trend: Optional[bool] = False
    positive_free_cash_flow: Optional[bool] = False
    healthy_balance_sheet: Optional[bool] = False
    strong_profit_margins: Optional[bool] = False
    positive_technical_trend: Optional[bool] = False

class ExplainableAI(BaseModel):
    data_sources_used: Optional[List[str]] = []
    factors_considered: Optional[List[str]] = []
    confidence_by_category: Optional[str] = "N/A"
    limitations: Optional[str] = "N/A"

class DataQualityStatus(BaseModel):
    last_data_refresh: Optional[str] = "N/A"
    data_completeness_score: Optional[float] = 100.0

class StockRecommendationMaster(BaseModel):
    model_config = {"extra": "ignore"}

    ticker: Optional[str] = "UNKNOWN"
    executive_summary: Optional[ExecutiveSummary] = ExecutiveSummary()
    fair_value_analysis: Optional[ValuationAnalysis] = ValuationAnalysis()
    company_overview: Optional[CompanyOverview] = CompanyOverview()
    financial_health: Optional[FinancialHealth] = FinancialHealth()
    growth_analysis: Optional[GrowthAnalysis] = GrowthAnalysis()
    fundamental_quality_score: Optional[FundamentalQualityScore] = FundamentalQualityScore()
    technical_analysis: Optional[TechnicalAnalysis] = TechnicalAnalysis()
    ai_investment_recommendation: Optional[AIRecommendation] = AIRecommendation()
    recent_news_intelligence: Optional[MarketIntelligence] = MarketIntelligence()
    market_sentiment: Optional[SentimentAnalysis] = SentimentAnalysis()
    upcoming_catalysts: Optional[UpcomingCatalysts] = UpcomingCatalysts()
    risk_analysis: Optional[RiskAnalysis] = RiskAnalysis()
    peer_comparison: Optional[Any] = []
    investment_thesis: Optional[InvestmentThesis] = InvestmentThesis()
    portfolio_suitability: Optional[PortfolioSuitability] = PortfolioSuitability()
    ai_checklist: Optional[AIChecklist] = AIChecklist()
    explainable_ai: Optional[ExplainableAI] = ExplainableAI()
    data_quality_status: Optional[DataQualityStatus] = DataQualityStatus()