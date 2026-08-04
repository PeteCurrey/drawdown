# Drawdown.trading Content Authoring Template

This guide and template collection allows authors to write SEO-optimized, highly structured content nodes that integrate directly with the **Pillar-and-Cluster Content Architecture** on drawdown.trading. 

Every page is compiled into static, high-performance HTML utilizing hybrid local configurations and Supabase overrides.

---

## Technical & Regulatory Mandate (FCA Compliance)

Before writing any content, you must adhere to the following regulatory constraints:
1. **Disclaimer Requirement**: Every single page containing market analysis, instrument details, comparison metrics, or tactical strategies must include the standard FCA disclaimer:
   > "CFDs and Spread Bets are complex instruments and come with a high risk of losing money rapidly due to leverage. [Broker Name] reports that [70-80]% of retail investor accounts lose money when trading CFDs with this provider. You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money. Educational content only; not financial advice."
2. **Retail Leverage Limits**: Leverage mentions must reflect FCA retail caps:
   * **Forex Majors**: Maximum 30:1
   * **Forex Minors, Gold, Major Indices**: Maximum 20:1
   * **Commodities (ex Gold), Minor Indices**: Maximum 10:1
   * **Cryptocurrencies**: Retail derivatives (Spread Betting & CFDs) are **banned** in the UK for retail clients since 2021. Crypto must only be represented as Spot/Physical assets with 2:1 maximum limit where appropriate, or noted as banned for retail derivatives.
3. **UK Tax Status Alignment**: 
   * **Spread Betting**: Emphasize tax-free status in the UK (no Capital Gains Tax, no Stamp Duty) under current tax laws.
   * **CFDs**: Taxable under CGT, but losses can be offset against other gains.
4. **Broker Whitelist**: Only refer to FCA-authorized brokers (e.g., Pepperstone, IG, Interactive Brokers, eToro).

---

## 1. Glossary Content Node Template (`glossary`)

Glossary terms are injected into `DefinedTerm` schemas and cross-link back to relevant instruments, how-to playbooks, and related terms.

### Frontmatter Specification
```yaml
slug: "position-sizing"
page_type: "glossary"
title: "Position Sizing"
seo_description: "The technical calculation of trade volume to control exact downside exposure. The foundation of professional risk management."
category: "risk-management" # Matches: forex, crypto, indices, commodities, risk-management, psychology, technical-analysis, fundamental-analysis
is_published: true
content:
  term: "Position Sizing"
  definition: "Position sizing is the calculation of the precise volume (lot size or contract units) allocated to a single trade to limit total risk to a predefined percentage of trading capital."
  detailedExplanation: "Professional traders never guess their trade size. Position sizing bridges the distance between your Entry Price and Stop Loss to ensure that if a trade hits your stop loss, you lose exactly 1% (or your chosen risk percentage) of your account equity. If your stop loss is wide, your position size is small. If your stop loss is narrow, your position size can be larger, while keeping the absolute monetary risk identical."
  example: "An account with £10,000 risking 1% has a maximum risk of £100. If buying GBP/USD with a 50-pip stop loss, the maximum pip risk is £2.00 per pip. This equates to a position size of 0.2 Mini Lots."
  relatedCoursePhase: "Phase 1: Risk & Capital"
  relatedTool: "Position Size Calculator"
```

### Supported Custom UI Rich Blocks
You can embed rich components within the `richBlocks` array inside your database JSON content:

#### A. Trade Example (`tradeExample`)
```json
{
  "type": "tradeExample",
  "title": "EUR/USD Long Risk Mitigation Example",
  "instrument": "EUR/USD",
  "session": "London Open",
  "entry": "1.0850",
  "stopLoss": "1.0800 (50 pips)",
  "takeProfit": "1.0950 (100 pips)",
  "riskReward": "1:2",
  "accountSize": "£10,000",
  "riskPercent": "1.00%",
  "positionSize": "0.20 Lots (20,000 Units)",
  "result": "+£200",
  "isProfit": true
}
```

#### B. Pro Tip (`proTip`)
```json
{
  "type": "proTip",
  "tip": "Never adjust your Stop Loss mid-trade to justify a larger position size. The stop placement is defined by the technical structure; the position size adjusts to fit the stop, not the other way around."
}
```

#### C. Risk Warning (`riskWarning`)
```json
{
  "type": "riskWarning",
  "message": "Failing to calculate your position size is the leading cause of account drawdown and liquidation. Always use absolute monetary risk thresholds."
}
```

---

## 2. How-To Content Node Template (`how-to`)

Procedural playbooks must define explicit difficulties, prerequisites, structured steps, and mistakes callouts.

### Frontmatter Specification
```yaml
slug: "how-to-calculate-position-size"
page_type: "how-to"
title: "How to Calculate Position Size"
seo_description: "A step-by-step mathematical guide to calculating exact trading lot sizes to limit drawdown exposure."
category: "risk-management"
is_published: true
content:
  eyebrow: "RISK MANAGEMENT MANUAL"
  title: "How to Calculate Position Size — Step-by-Step"
  difficulty: "Beginner" # Options: Beginner, Intermediate, Advanced
  estimatedTime: "8 min read"
  introduction: "speculating without calculating trade sizes is gambling. This guide provides the complete, FCA-compliant mathematical framework to size your positions correctly."
  prerequisites:
    - "Defined account base currency and total balance."
    - "Pre-calculated Stop Loss distance in pips/points."
    - "Strict risk tolerance percentage (typically 1%)."
  steps:
    - title: "Determine Your Absolute Cash Risk"
      content: "Multiply your total account equity by your maximum risk tolerance. For a £10,000 account risking 1%, this is: £10,000 x 0.01 = £100."
    - title: "Measure Your Stop Loss Distance"
      content: "Identify the precise technical level where your trade thesis is invalidated. Measure the distance from your Entry Price to this level in pips (for Forex) or points (for Indices/Commodities)."
    - title: "Calculate the Pip Value & Lot Size"
      content: "Divide your Cash Risk by your Stop Loss distance to get your Value Per Pip. For a £100 risk and 50 pip stop: £100 / 50 = £2.00 per pip. Convert this to standard lots based on the instrument specifications."
  commonMistakes:
    - "Using fixed lot sizes across all trades regardless of stop loss width."
    - "Failing to account for currency conversions when your account base currency differs from the quote currency."
    - "Trading without a stop loss entirely."
  drawdownApproach:
    text: "We believe risk management is the only holy grail in trading. Our platform requires every pupil to calculate stop-loss metrics before executing single trades."
    ctaText: "Launch Risk Calculator"
    ctaLink: "/tools"
```

---

## 3. Comparison Content Node Template (`compare`)

Comparison pillars provide quick winners, sortable comparison tables, and user-persona guides.

### Frontmatter Specification
```yaml
slug: "pepperstone-vs-ig"
page_type: "compare"
title: "Pepperstone vs IG"
seo_description: "An in-depth, regulatory comparison of Pepperstone and IG Markets for UK retail traders."
category: "forex"
is_published: true
content:
  eyebrow: "BROKER COMPARISON"
  title: "Pepperstone vs IG — The UK Retail Trader Verdict"
  quickVerdict:
    winner: "Pepperstone for raw execution, IG for market selection."
    reason: "Pepperstone offers significantly tighter raw spreads and ultra-fast execution speeds for active scalpers, whereas IG is the unmatched giant for total tradable markets and long-term investment options."
    prosA:
      - "Ultra-competitive raw spreads from 0.0 pips."
      - "Exceptional integration with TradingView and cTrader."
      - "Fastest execution speeds (average < 30ms)."
  comparisonTable:
    - feature: "FCA Regulated"
      a: "Yes (FRN 684312)"
      b: "Yes (FRN 195355)"
    - feature: "Spread Betting Tax Status"
      a: "Tax-Free (UK retail)"
      b: "Tax-Free (UK retail)"
    - feature: "Minimum Deposit"
      a: "£0"
      b: "£250 (card), £0 (bank transfer)"
    - feature: "Typical EUR/USD Spread"
      a: "0.1 pips (Razor) / 1.0 pips (Standard)"
      b: "0.6 pips (MT4) / 0.8 pips (Standard)"
  sections:
    - title: "Execution Models & Technology"
      content: "Pepperstone operates primarily as an agency execution broker (STP/ECN), ensuring transparent price delivery. IG operates a hybrid market-making execution model, providing unmatched liquidity depth but slightly wider typical spreads."
    - title: "Spread Betting vs CFD Support"
      content: "Both providers are heavily regulated by the FCA and provide tax-free Spread Betting alongside CFDs for UK residents. This is an essential structural advantage for tax efficiency."
  whoShouldChooseA:
    - "You are an active day trader or scalper seeking the lowest possible execution spreads."
    - "Your trading execution is driven primarily through TradingView or cTrader."
  whoShouldChooseB:
    - "You require access to over 17,000+ tradable assets including global equities."
    - "You prefer the institutional stability and depth of a FTSE-250 listed provider."
```

---

## 4. Markets Content Node Template (`markets`)

Markets nodes act as the instrument specification sheets, complete with session boundaries and compliant broker matches.

### Frontmatter Specification
```yaml
slug: "eurusd"
page_type: "markets"
title: "EUR/USD"
seo_description: "Real-time rates, margins, leverage limits, trading conditions, and regulatory costs for trading EUR/USD under FCA compliance."
category: "forex"
is_published: true
content:
  ticker: "FX:EURUSD"
  displayPair: "EUR/USD"
  name: "Euro vs US Dollar"
  baseCurrency: "EUR"
  quoteCurrency: "USD"
```

The system automatically resolves session times, instrument specifications, recommended brokers, and related taxons dynamically using the unified taxonomy rules engine.
