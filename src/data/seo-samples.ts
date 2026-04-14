export const seoGlossaryData = [
  {
    slug: "drawdown",
    title: "Drawdown",
    seo_title: "What is Drawdown in Trading? Definition & Meaning | Drawdown Platform",
    seo_description: "Learn what a drawdown is in trading, why it happens, and how to protect your capital from severe equity curve drops.",
    content: `
# Drawdown

**Definition:** A drawdown is the peak-to-trough decline during a specific record period of an investment, fund, or trading account. It is usually quoted as the percentage between the peak and the subsequent trough.

## Why it matters to traders (the "so what")
Your drawdown is the only metric that truly measures your survival capability. Anyone can make 50% in a month by over-leveraging, but if your max drawdown is 80%, you are one bad trade away from blowing your account. Professional traders structure their entire strategy around *minimising* their maximum historically expected drawdown, not just chasing high win rates.

## Example in Action
You fund a new trading account with £10,000. 
You run a winning streak and the balance peaks at £12,000. 
You then hit a losing streak and the balance drops to £9,000 before recovering.
The decline from £12,000 to £9,000 is £3,000.
Your drawdown is calculated as (£3,000 / £12,000) * 100 = **25% drawdown**.

## Common Misconceptions
A common mistake is calculating drawdown from the starting balance instead of the *highest peak*. If you start at £10,000, go up to £20,000, and drop back to £10,000, you haven't "broken even." You've experienced a massive 50% drawdown, which indicates a massive flaw in your risk management.
    `
  },
  {
    slug: "bid-ask-spread",
    title: "Bid-Ask Spread",
    seo_title: "Bid-Ask Spread Explained | Trading Glossary | Drawdown Platform",
    seo_description: "Understand the bid-ask spread, the true cost of trading, and how to find brokers with tight enough spreads to maintain your edge.",
    content: `
# Bid-Ask Spread

**Definition:** The bid-ask spread is the difference between the highest price a buyer is willing to pay for an asset (the bid) and the lowest price a seller is willing to accept (the ask). 

## Why it matters to traders
The spread is the hidden tax on every trade you take. If your strategy relies on capturing 5 to 10 pips of movement per trade, a 2-pip spread means you are immediately abandoning 20% to 40% of your potential profit just to enter the market. Wide spreads destroy short-term edges. 

## Example in Action
You are looking at GBP/USD.
The broker quotes:
- **Sell (Bid):** 1.2500
- **Buy (Ask):** 1.2502
The spread is 2 pips. If you hit "Buy," your order fills at 1.2502. If you want to immediately sell that same position, you would sell at the Bid of 1.2500. You are instantly down 2 pips.

## Common Misconceptions
New traders often obsess over "zero commission" brokers, not realising that these brokers simply widen the bid-ask spread to make their money. You are always paying the broker; it's just a matter of whether it's through an upfront fee or a hidden spread markup.
    `
  }
];

export const seoHowToData = [
  {
    slug: "calculate-position-size",
    title: "Calculate Position Size",
    seo_title: "How to Calculate Position Size in Trading | Drawdown Platform",
    seo_description: "Learn step-by-step how to calculate professional position sizing to protect your capital and standardize your risk on every trade.",
    content: `
# How to Calculate Position Size

If you're guessing your lot sizes, you aren't trading—you're gambling. Position sizing is the mathematical engine of risk management. It ensures that whether your stop loss is 10 pips or 100 pips away, you only lose exactly 1% of your account.

## Step-by-Step Breakdown

### 1. Define your Account Risk (£)
First, decide what percentage of your total equity you are willing to lose on a single trade. For professionals, this is usually 1%.
*Example: If your account is £10,000, your Account Risk is £100.*

### 2. Determine your Stop Loss Distance
Identify your invalidation point on the chart. How many pips (or points/cents) away is your stop loss from your entry price?
*Example: Your stop loss is 20 pips away.*

### 3. Calculate the Pip Value Required
Divide your Account Risk by your Stop Loss Distance.
*Example: £100 / 20 pips = £5 per pip.*

### 4. Convert to Lot Size
Use your broker's lot size metrics to convert your required pip value into a lot size. For Forex (standard lots): 1 Standard Lot = £10 per pip (roughly, depending on base currency).
*Example: To risk £5 per pip, you need to trade 0.5 Lots.*

## Common Pitfalls
Traders often use a fixed lot size (e.g., always trading 1 lot) regardless of their stop loss distance. This means a trade with a 50-pip stop loss risks five times as much money as a trade with a 10-pip stop loss, completely breaking the mathematics of your edge.
    `
  }
];
