import json
import urllib.request
import sys

modules = [
    {
        "phase_slug": "risk-manager",
        "phase_number": 4,
        "module_number": 1,
        "title": "The Math of Ruin — Why Good Traders Go Broke",
        "subtitle": "Understanding the asymmetrical nature of drawdowns and why survival precedes profit.",
        "estimated_minutes": 25,
        "content_html": """
<h2>The Asymmetry of Loss</h2>
<p>Trading is fundamentally an exercise in risk management, not prediction. Many novices believe that a high win rate is the key to trading success. The harsh reality, however, is that you can have a 70% win rate and still blow your account if your losses are out of control. This module covers the mathematical realities of risk and why survival must always precede profit.</p>
<div class="p-6 bg-accent/5 border-l-2 border-accent my-6"><strong>Key Concept:</strong> <em>The Asymmetry of Drawdown</em> — The percentage gain required to recover from a loss is always greater than the loss itself. The larger the loss, the steeper the recovery curve.</div>
<h3>The Drawdown Recovery Table</h3>
<p>To truly respect risk, you must internalise the math of recovery. If you lose 10% of your account, you do not need a 10% gain to recover; you need an 11.1% gain. This asymmetry becomes devastating as losses mount.</p>
<table border="1" style="width:100%; border-collapse: collapse;">
  <thead>
    <tr>
      <th>Account Drawdown</th>
      <th>Required Gain to Break Even</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>5%</td><td>5.3%</td></tr>
    <tr><td>10%</td><td>11.1%</td></tr>
    <tr><td>20%</td><td>25%</td></tr>
    <tr><td>30%</td><td>42.9%</td></tr>
    <tr><td>40%</td><td>66.7%</td></tr>
    <tr><td>50%</td><td>100%</td></tr>
    <tr><td>75%</td><td>300%</td></tr>
    <tr><td>90%</td><td>900%</td></tr>
  </tbody>
</table>
<p>If you drop an account by 50%, you must double your money (a 100% gain) just to get back to where you started. Achieving a 100% return is incredibly difficult; achieving it after suffering a 50% loss—when your confidence is shattered and your capital is halved—is near impossible.</p>
<h2>Risk of Ruin</h2>
<p>The Risk of Ruin (RoR) is a statistical concept that calculates the probability of losing all your trading capital, based on your win rate, payoff ratio (reward-to-risk), and the percentage of capital risked per trade. It is the grim reaper of trading.</p>
<h3>Real-World Examples</h3>
<p>Let's look at an example. Assume you have a £10,000 account and you risk a massive 10% (£1,000) per trade. You only need a string of 10 consecutive losses to blow the account completely. Is a 10-loss streak likely? Depending on your strategy, it might be. But even a 5-loss streak halves your account, putting you in the dreaded 50% drawdown territory.</p>
<ul>
  <li><strong>Scenario A:</strong> £10,000 account, risking 5% (£500). 5 consecutive losses = £2,500 drawdown (25%). Required gain to recover = 33%.</li>
  <li><strong>Scenario B:</strong> £10,000 account, risking 1% (£100). 5 consecutive losses = £500 drawdown (5%). Required gain to recover = 5.3%.</li>
</ul>
<div class="p-6 bg-accent/5 border-l-2 border-accent my-6"><strong>Key Concept:</strong> Professional traders rarely risk more than 1% to 2% of their total account capital on any single trade. This keeps the Risk of Ruin close to zero.</div>
<h2>The Illusion of Control</h2>
<p>Many amateur traders fall victim to the illusion of control. They believe their analysis is so rigorous that they can afford to risk a large portion of their capital. This is a fatal flaw. The market is an inherently unpredictable environment. You can conduct perfect analysis and still be wrong due to unforeseen macroeconomic events, liquidity gaps, or simply the chaotic nature of price action.</p>
<p>Your edge only plays out over a large sample size of trades. If you risk too much per trade, you deny yourself the opportunity to let the probabilities play out in your favour. You go broke before your edge can manifest.</p>
<h3>Expected Value (EV)</h3>
<p>Expected Value is a calculation that tells you how much you can expect to win or lose per trade over the long run. The formula is:</p>
<p><strong>EV = (Win Rate * Average Win) - (Loss Rate * Average Loss)</strong></p>
<p>Even with a positive EV, if your position size is too large, variance will destroy you. The Math of Ruin dictates that we must survive the short-term variance to realise the long-term Expected Value.</p>
<div class="p-6 bg-accent/5 border-l-2 border-accent my-6"><strong>Key Concept:</strong> If you cannot survive the inevitable losing streaks, your edge is irrelevant. Risk management is the mechanism that allows your edge to exist.</div>
<p>In the next module, we will explore precise formulas for sizing your positions to ensure you never run afoul of the Math of Ruin.</p>
""",
        "key_takeaways": [
            "Drawdown recovery is asymmetrical; a 50% loss requires a 100% gain to recover.",
            "Risk of Ruin (RoR) is the probability of blowing your account and must be kept near zero.",
            "Risking 1% to 2% per trade is the industry standard for professional traders.",
            "Survival in the short term is required to let your edge play out over the long term."
        ],
        "resources": [],
        "quiz": [],
        "is_published": True
    },
    {
        "phase_slug": "risk-manager",
        "phase_number": 4,
        "module_number": 2,
        "title": "Position Sizing Formulas — The Fixed Percentage Model",
        "subtitle": "How to calculate exactly how many shares or contracts to trade based on your predefined risk.",
        "estimated_minutes": 30,
        "content_html": """
<h2>Introduction to Position Sizing</h2>
<p>Position sizing is the most powerful tool in a trader's arsenal. It dictates exactly how much capital you deploy on a specific trade to ensure that if the trade goes against you, your total account loss is strictly controlled. The Fixed Percentage Model is the gold standard for independent traders.</p>
<div class="p-6 bg-accent/5 border-l-2 border-accent my-6"><strong>Key Concept:</strong> Position size is not how much capital you allocate to a trade; it is the amount of capital at risk if your stop loss is hit.</div>
<h2>The Core Formula</h2>
<p>To calculate your position size using the Fixed Percentage Model, you need three variables:</p>
<ol>
  <li><strong>Account Size:</strong> Your total trading capital (e.g., £10,000).</li>
  <li><strong>Risk Percentage:</strong> The percentage of your account you are willing to lose on this trade (e.g., 1%).</li>
  <li><strong>Trade Risk (Stop Loss Distance):</strong> The distance from your entry price to your stop loss price.</li>
</ol>
<h3>Step 1: Calculate Capital at Risk (R)</h3>
<p>First, determine the absolute currency amount you are willing to risk. This is often referred to as '1R' or simply 'R'.</p>
<p><strong>R = Account Size * Risk Percentage</strong></p>
<p>Example: £10,000 * 0.01 (1%) = £100. If this trade hits your stop loss, you will lose exactly £100.</p>
<h3>Step 2: Determine Trade Risk per Unit</h3>
<p>Next, find the difference between your Entry Price and your Stop Loss Price. This tells you how much you lose per share or per contract.</p>
<p>Example: You want to buy a stock at £50. Your stop loss is at £45. The Trade Risk per Unit is £5.</p>
<h3>Step 3: Calculate Position Size</h3>
<p>Finally, divide your Capital at Risk (R) by the Trade Risk per Unit to find the number of units to purchase.</p>
<p><strong>Position Size (Units) = R / Trade Risk per Unit</strong></p>
<p>Example: £100 / £5 = 20 Shares. You will buy 20 shares. Total capital deployed is £1,000 (20 * £50), but your actual risk is strictly £100.</p>
<div class="p-6 bg-accent/5 border-l-2 border-accent my-6"><strong>Key Concept:</strong> Never adjust your stop loss to accommodate a larger position size. Determine your stop loss based on technical levels, and let the formula dictate the position size.</div>
<h2>Applying the Formula to Different Markets</h2>
<p>The beauty of this formula is that it applies to any asset class, though the 'Unit' calculation varies slightly depending on leverage and tick values.</p>
<h3>Forex Example</h3>
<p>In Forex, we measure movement in pips. Let's say you have a £20,000 account, risking 1% (£200). Your stop loss is 40 pips wide. You need to calculate how many lots to trade so that 40 pips equals £200. Thus, you need a pip value of £5 (£200 / 40). If 1 Standard Lot (£100,000) yields roughly £8 per pip (depending on the pair), you would trade approximately 0.62 lots.</p>
<h3>Crypto Example</h3>
<p>You have a £5,000 account, risking 2% (£100). Bitcoin is trading at £40,000. Your stop loss is at £38,000. Trade Risk per Unit is £2,000. Position Size = £100 / £2,000 = 0.05 BTC. You deploy £2,000 of capital (0.05 * £40,000) to risk £100.</p>
<div class="p-6 bg-accent/5 border-l-2 border-accent my-6"><strong>Key Concept:</strong> Dynamic position sizing ensures that a tight stop loss allows for a larger position, while a wide stop loss demands a smaller position. The monetary risk remains constant.</div>
<h2>Common Pitfalls</h2>
<p>Many beginners make the mistake of using fixed unit sizes (e.g., always buying 100 shares or always trading 1 lot). This is incredibly dangerous because it ignores the volatility of the asset. A 100-share position in a highly volatile £200 stock carries massively different risk than 100 shares of a stable £10 stock.</p>
<p>By enforcing the Fixed Percentage Model, you normalise your risk across all trades, bringing mathematical consistency to an inconsistent market environment.</p>
""",
        "key_takeaways": [
            "Position size determines how many units to buy, based on a fixed risk amount.",
            "The formula is: Capital at Risk / Stop Loss Distance = Position Size.",
            "Never alter your logical stop loss placement just to trade a larger position.",
            "Fixed unit sizing is dangerous; always size dynamically based on volatility."
        ],
        "resources": [],
        "quiz": [],
        "is_published": True
    },
    {
        "phase_slug": "risk-manager",
        "phase_number": 4,
        "module_number": 3,
        "title": "Fixed vs. Percentage Risk Models Compared",
        "subtitle": "An in-depth analysis of capital allocation models and when to transition between them.",
        "estimated_minutes": 25,
        "content_html": """
<h2>Understanding the Models</h2>
<p>While the Fixed Percentage Model is widely taught, it is not the only way to manage risk. Different stages of a trader's journey, and different account sizes, often necessitate different approaches. We will compare the Fixed Fractional (Percentage) Model with the Fixed Cash Risk Model.</p>
<h3>The Fixed Percentage Model (Fractional)</h3>
<p>As discussed in the previous module, this model risks a set percentage of the current account equity on every trade. If you have £10,000 and risk 1%, you risk £100. If your account grows to £15,000, your 1% risk scales up to £150. If your account drops to £8,000, your risk scales down to £80.</p>
<div class="p-6 bg-accent/5 border-l-2 border-accent my-6"><strong>Key Concept:</strong> The Fixed Percentage model automatically compounds your winners and mitigates your losers by shrinking absolute risk during drawdowns.</div>
<h3>The Fixed Cash Risk Model</h3>
<p>In this model, you risk a static currency amount on every trade, regardless of the account equity. For example, you might decide to risk exactly £100 per trade on a £10,000 account (which equals 1%). However, if the account grows to £15,000, you still only risk £100 (now 0.66%). If the account drops to £8,000, you still risk £100 (now 1.25%).</p>
<h2>Pros and Cons Analysis</h2>
<table border="1" style="width:100%; border-collapse: collapse;">
  <thead>
    <tr>
      <th>Model</th>
      <th>Advantages</th>
      <th>Disadvantages</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Fixed Percentage</strong></td>
      <td>Built-in compounding; protects against total ruin during losing streaks.</td>
      <td>Recovery from deep drawdowns takes longer because risk amounts shrink.</td>
    </tr>
    <tr>
      <td><strong>Fixed Cash Risk</strong></td>
      <td>Simple to execute; recovers from small drawdowns faster.</td>
      <td>Can accelerate ruin during losing streaks as risk % increases.</td>
    </tr>
  </tbody>
</table>
<h2>The Asymmetric Impact of Drawdowns</h2>
<p>Let's run a simulation of 10 consecutive losing trades on a £10,000 account to see the difference.</p>
<ul>
  <li><strong>Fixed Cash (£200 risk per trade):</strong> You lose exactly £2,000. Ending balance = £8,000. Your 11th trade still risks £200, which is now 2.5% of your account.</li>
  <li><strong>Fixed Percentage (2% risk per trade):</strong> Trade 1 risks £200. Trade 2 risks £196. By trade 10, your risk has shrunk significantly. Ending balance = £8,170. Your 11th trade risks £163.40 (exactly 2%).</li>
</ul>
<p>The mathematical advantage of the Fixed Percentage model during a drawdown is clear: it acts as a parachute, slowing your descent.</p>
<div class="p-6 bg-accent/5 border-l-2 border-accent my-6"><strong>Key Concept:</strong> The psychological burden of the Fixed Cash model during a drawdown is immense. When you are performing poorly, the model forces you to risk a larger percentage of your remaining capital.</div>
<h2>When to Use Which?</h2>
<p>For accounts under £5,000, many traders find the Fixed Cash model more practical simply because dealing with fractional lot sizes or tiny stock positions becomes administratively difficult. A trader with a £2,000 account might simply say "I risk £20 per trade" until the account reaches £5,000.</p>
<p>However, for accounts above £10,000, and especially for funded accounts or professional capital, the Fixed Percentage model is mandatory. It ensures you never breach maximum drawdown limits through variance alone.</p>
<h3>The Tiered Approach</h3>
<p>A hybrid method used by many pros is the Tiered approach. You use a Fixed Cash risk amount within a specific equity band. For example:</p>
<ul>
  <li>Account £10k - £12k: Risk £100 per trade.</li>
  <li>Account £12k - £15k: Risk £120 per trade.</li>
  <li>Account below £10k: Drop risk to £50 per trade.</li>
</ul>
<p>This provides the simplicity of Fixed Cash with the protective elements of the Percentage model. Choose the model that fits your operational capacity and psychological tolerance.</p>
""",
        "key_takeaways": [
            "Fixed Percentage models automatically compound gains and cushion losses.",
            "Fixed Cash models are simpler but increase the relative risk during drawdowns.",
            "The Percentage model acts as a parachute during losing streaks.",
            "A tiered hybrid approach offers a practical middle ground for growing accounts."
        ],
        "resources": [],
        "quiz": [],
        "is_published": True
    },
    {
        "phase_slug": "risk-manager",
        "phase_number": 4,
        "module_number": 4,
        "title": "Drawdown Psychology & Recovery Strategies",
        "subtitle": "How to handle the inevitable losing streaks without losing your mind or your account.",
        "estimated_minutes": 35,
        "content_html": """
<h2>The Inevitability of Drawdowns</h2>
<p>A drawdown is the peak-to-trough decline during a specific period for an investment, trading account, or fund. It is usually quoted as the percentage between the peak and the subsequent trough. If you trade long enough, you will experience a significant drawdown. It is a mathematical certainty, not a reflection of your worth as a trader.</p>
<p>Understanding that drawdowns are a normal cost of doing business is the first step in surviving them.</p>
<div class="p-6 bg-accent/5 border-l-2 border-accent my-6"><strong>Key Concept:</strong> A drawdown does not mean your edge is broken. It simply means you are experiencing the negative variance side of your statistical probability distribution.</div>
<h2>The Psychological Spiral</h2>
<p>The true danger of a drawdown is not the capital loss; it is the psychological damage. A losing streak triggers the 'fight or flight' response in the brain, leading to emotional, irrational decision-making. We call this the Drawdown Spiral:</p>
<ol>
  <li><strong>Normal Losses:</strong> You take 2 or 3 losses. You feel fine, trusting the system.</li>
  <li><strong>Doubt Sets In:</strong> Losses reach 5 or 6. You start questioning your strategy. You tweak rules slightly.</li>
  <li><strong>Revenge Trading:</strong> Frustrated, you increase your position size to 'make it back' quickly.</li>
  <li><strong>The Blowup:</strong> The oversized trade loses, plunging the account into an unrecoverable deficit.</li>
</ol>
<h3>Recognising the Symptoms</h3>
<p>You must monitor yourself for symptoms of tilt. Are you staring at the charts outside of your normal trading hours? Are you feeling physical tension in your chest when entering a trade? Are you violating your own written rules? If yes, you are compromised.</p>
<h2>Active Recovery Strategies</h2>
<p>When you hit a predetermined drawdown threshold, you must have a mechanical protocol in place to stop the bleeding. You cannot rely on willpower when you are on tilt.</p>
<h3>1. The Risk Halving Protocol</h3>
<p>This is the most effective mechanical defence. If you normally risk 1% per trade, and your account drops by a set amount (e.g., 5%), you immediately cut your risk per trade in half to 0.5%.</p>
<ul>
  <li><strong>Account at £10,000:</strong> Risking 1% (£100).</li>
  <li><strong>Account drops to £9,500 (-5%):</strong> Mandatory reduction to 0.5% risk (£47.50).</li>
  <li><strong>Account drops to £9,000 (-10%):</strong> Stop trading entirely. Take a one-week break.</li>
</ul>
<div class="p-6 bg-accent/5 border-l-2 border-accent my-6"><strong>Key Concept:</strong> Earning the right to risk full size. You must trade your way out of the drawdown using half-risk before you are allowed to return to full-size risk.</div>
<h3>2. The Circuit Breaker</h3>
<p>Just like stock exchanges halt trading during extreme volatility, you need personal circuit breakers. This is a hard stop on trading activity based on daily or weekly limits.</p>
<ul>
  <li><strong>Daily Loss Limit:</strong> e.g., 2% of the account. If you lose 2% in one day, the screens are shut off. No exceptions.</li>
  <li><strong>Weekly Loss Limit:</strong> e.g., 4% of the account. If breached, you take the rest of the week off to recalibrate.</li>
</ul>
<h2>Review and Recalibrate</h2>
<p>During a circuit breaker period, your job is not to find a new holy grail strategy. Your job is to review the data.</p>
<p>Ask yourself two questions:</p>
<ol>
  <li>Did I follow my plan perfectly, and the market simply delivered a string of losing probabilities?</li>
  <li>Did I make execution errors, revenge trade, or break rules?</li>
</ol>
<p>If the answer is 1, you do nothing. You return to the market when the break is over and execute the plan. If the answer is 2, you have a discipline issue that must be addressed before you risk another penny. Drawdowns test your professionalism; recovery defines your career.</p>
""",
        "key_takeaways": [
            "Drawdowns are a mathematical certainty and part of the business of trading.",
            "The psychological Drawdown Spiral is more dangerous than the initial capital loss.",
            "Implement a Risk Halving Protocol when hitting a specific drawdown threshold.",
            "Use daily and weekly circuit breakers to prevent catastrophic emotional errors."
        ],
        "resources": [],
        "quiz": [],
        "is_published": True
    },
    {
        "phase_slug": "risk-manager",
        "phase_number": 4,
        "module_number": 5,
        "title": "Compounding Capital Safely",
        "subtitle": "The eighth wonder of the world applied to a trading account, without risking ruin.",
        "estimated_minutes": 25,
        "content_html": """
<h2>The Power of Compounding</h2>
<p>Albert Einstein supposedly called compound interest the eighth wonder of the world. In trading, compounding is the engine that turns a modest edge into substantial wealth. It is the process of reinvesting your trading profits so that your base capital grows, allowing your fixed percentage risk to command larger absolute returns over time.</p>
<div class="p-6 bg-accent/5 border-l-2 border-accent my-6"><strong>Key Concept:</strong> Compounding is a double-edged sword. As you increase absolute risk to compound gains, you also increase absolute exposure during the inevitable drawdowns.</div>
<h2>The Mechanics of Trading Compounding</h2>
<p>Unlike a savings account that compounds annually at a fixed rate, trading compounds erratically based on your win/loss sequence. Let's look at a realistic model.</p>
<p>Assume a £10,000 account, risking 1% per trade. Your strategy averages a 1:2 Risk/Reward ratio, with a 45% win rate. Over 100 trades, the math dictates you will have 45 winners (gaining 2% each) and 55 losers (losing 1% each).</p>
<h3>Linear vs. Compounded Growth</h3>
<table border="1" style="width:100%; border-collapse: collapse;">
  <thead>
    <tr>
      <th>Model</th>
      <th>Total Return after 100 Trades</th>
      <th>Ending Balance</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Linear (Fixed £100 risk)</strong></td>
      <td>+35% (45 wins * £200 - 55 losses * £100)</td>
      <td>£13,500</td>
    </tr>
    <tr>
      <td><strong>Compounded (Fixed 1% risk)</strong></td>
      <td>+41.2% (approximate, path dependent)</td>
      <td>£14,120</td>
    </tr>
  </tbody>
</table>
<p>The difference seems modest over 100 trades, but over 500 or 1,000 trades, the compounded curve goes exponential while the linear curve remains a straight line.</p>
<h2>Safe Compounding Strategies</h2>
<p>The danger of compounding is that you hit a severe drawdown right after a period of rapid growth, when your position sizes are at their absolute largest. To mitigate this, professional traders use structured compounding models rather than purely recalculating risk on every single trade.</p>
<h3>1. The Step-Up Method (Threshold Compounding)</h3>
<p>Instead of recalculating your 1% risk on a daily basis, you only increase your risk amount when your account equity crosses specific milestones.</p>
<ul>
  <li>Start: £10,000 balance. Risk = £100 per trade.</li>
  <li>Threshold 1: Account reaches £11,000. New Risk = £110 per trade.</li>
  <li>Threshold 2: Account reaches £12,000. New Risk = £120 per trade.</li>
</ul>
<p>Crucially, if the account drops below £11,000, you immediately step down your risk back to £100. This method creates a psychological safety net, preventing you from risking 'new money' too aggressively.</p>
<div class="p-6 bg-accent/5 border-l-2 border-accent my-6"><strong>Key Concept:</strong> Never compound on an unrealised gain. Only increase your base risk when profits have been secured and closed into the account equity.</div>
<h3>2. Withdrawing Profits vs. Compounding</h3>
<p>The ultimate goal of trading is to generate income or build long-term wealth, not just to watch numbers on a screen go up. A major flaw in many retail traders' plans is failing to define when they will extract capital.</p>
<p>A balanced approach is the 50/50 rule at the end of every quarter or year:</p>
<ol>
  <li>Calculate net profit for the period (e.g., £4,000).</li>
  <li>Withdraw 50% (£2,000) to pay yourself, fund your life, or invest in low-risk assets.</li>
  <li>Leave 50% (£2,000) in the account to increase your trading base and compound your future returns.</li>
</ol>
<h2>The Asymmetric Compounder</h2>
<p>If you have an edge and manage risk flawlessly, compounding will eventually do the heavy lifting. The key is extreme patience. Do not try to force a 10% monthly return to compound faster. Survive the market long enough, protecting your downside fiercely, and the upside will take care of itself through the mathematics of compounding.</p>
""",
        "key_takeaways": [
            "Compounding turns a modest trading edge into exponential wealth over large sample sizes.",
            "The Step-Up Method increases risk only at predefined account milestones.",
            "Always step risk down immediately if equity drops below a compounding threshold.",
            "Implement a structured withdrawal plan alongside your compounding strategy."
        ],
        "resources": [],
        "quiz": [],
        "is_published": True
    },
    {
        "phase_slug": "risk-manager",
        "phase_number": 4,
        "module_number": 6,
        "title": "Handling Correlation Risk",
        "subtitle": "Why taking five 1% trades can sometimes mean taking one 5% risk in disguise.",
        "estimated_minutes": 20,
        "content_html": """
<h2>The Invisible Risk</h2>
<p>You have meticulously calculated your position size. You are risking exactly 1% on a long EUR/USD trade. You are also risking 1% on long GBP/USD, 1% on long AUD/USD, and 1% shorting USD/CHF. You believe you have four distinct trades, each with a 1% risk.</p>
<p>In reality, you have essentially taken one massive 4% risk on a single variable: the weakness of the US Dollar. This is correlation risk, and it is the silent killer of heavily diversified retail portfolios.</p>
<div class="p-6 bg-accent/5 border-l-2 border-accent my-6"><strong>Key Concept:</strong> Correlation measures how two or more assets move in relation to one another. If highly correlated assets move together, your total risk exposure is cumulative.</div>
<h2>Understanding Correlation Coefficients</h2>
<p>Correlation is measured mathematically from -1.0 to +1.0.</p>
<ul>
  <li><strong>+1.0 (Perfect Positive Correlation):</strong> The assets move in the exact same direction 100% of the time. (e.g., EUR/USD and GBP/USD often have a high positive correlation, typically +0.7 to +0.9).</li>
  <li><strong>-1.0 (Perfect Negative Correlation):</strong> The assets move in exact opposite directions. (e.g., EUR/USD and USD/CHF).</li>
  <li><strong>0.0 (No Correlation):</strong> The assets move completely independently of one another.</li>
</ul>
<h3>The Danger of Positive and Negative Correlation</h3>
<p>If you are long two assets with a +0.9 correlation, a macroeconomic event that crashes one will likely crash the other. If you are risking 1% on each, your true risk is closer to 2%.</p>
<p>Similarly, if you are long EUR/USD and short USD/CHF (which have a strong negative correlation), you are doubling up. When EUR/USD goes up, USD/CHF goes down. Being long the first and short the second means both trades win together, but crucially, they both lose together if the US Dollar spikes.</p>
<h2>Portfolio Heat and Risk Limits</h2>
<p>To combat correlation risk, professionals manage total 'Portfolio Heat'. This is the maximum total open risk allowed across all positions at any one time.</p>
<table border="1" style="width:100%; border-collapse: collapse;">
  <thead>
    <tr>
      <th>Rule</th>
      <th>Application</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Max Single Currency Exposure</strong></td>
      <td>Never risk more than 2% total across any pairs involving the same currency (e.g., USD).</td>
    </tr>
    <tr>
      <td><strong>Max Total Portfolio Heat</strong></td>
      <td>Never have more than 5% total account risk open simultaneously across all trades.</td>
    </tr>
    <tr>
      <td><strong>Sector Caps (Equities)</strong></td>
      <td>Limit exposure to a single sector (e.g., Tech) to a maximum of 2.5% risk.</td>
    </tr>
  </tbody>
</table>
<div class="p-6 bg-accent/5 border-l-2 border-accent my-6"><strong>Key Concept:</strong> If you find three perfect setups in highly correlated assets (e.g., AAPL, MSFT, and the QQQ index), do not take 1% risk on all three. Split your standard 1% risk across the three assets (0.33% each) or choose the single best setup.</div>
<h2>Cross-Asset Correlation in Modern Markets</h2>
<p>Be aware that correlation is dynamic, not static. In times of severe market stress or liquidity crises, correlations tend to go to 1.0. During a major panic, equities, crypto, and even precious metals can all sell off simultaneously as institutions rush to raise cash.</p>
<p>A robust risk manager assumes that in a worst-case scenario, all their correlated risk will be realised simultaneously. Do not try to hedge by taking highly correlated positions; true hedging involves non-correlated assets or derivatives. Keep your portfolio heat low, monitor your currency or sector exposure, and survive.</p>
""",
        "key_takeaways": [
            "Trading multiple correlated assets multiplies your total risk exposure.",
            "Correlation is measured from -1.0 to +1.0; both high positive and high negative correlations can double risk.",
            "Implement a 'Portfolio Heat' limit to cap total open risk (e.g., 5% maximum).",
            "Split risk allocations if taking multiple trades in highly correlated assets."
        ],
        "resources": [],
        "quiz": [],
        "is_published": True
    }
]

with open('/tmp/risk-manager-modules.json', 'w') as f:
    json.dump(modules, f, indent=2)

req = urllib.request.Request('https://miiasjbonwlleggiukyf.supabase.co/rest/v1/curriculum_modules')
req.add_header('apikey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1paWFzamJvbndsbGVnZ2l1a3lmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjE1Njc1OCwiZXhwIjoyMDkxNzMyNzU4fQ.FZdZVV4N0JTZ61HAwdxzHP3HrUmDy3UBFcB_OapIzng')
req.add_header('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1paWFzamJvbndsbGVnZ2l1a3lmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjE1Njc1OCwiZXhwIjoyMDkxNzMyNzU4fQ.FZdZVV4N0JTZ61HAwdxzHP3HrUmDy3UBFcB_OapIzng')
req.add_header('Content-Type', 'application/json')
req.add_header('Prefer', 'return=minimal')

data = json.dumps(modules).encode('utf-8')
try:
    response = urllib.request.urlopen(req, data=data)
    print("Status:", response.status)
except Exception as e:
    print("Error:", e)
