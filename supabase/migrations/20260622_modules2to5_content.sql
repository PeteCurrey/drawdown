-- ============================================================
-- DEPLOY YOUR ALGO — Modules 2–5 lesson content
-- Migration: 20260622_modules2to5_content.sql
-- ============================================================

-- ── MODULE 2, LESSON 1 ───────────────────────────────────────
UPDATE course_lessons SET content_mdx = $mdx$
The Strategy Tester has just handed you a page of numbers. Most traders look at net profit, feel something (excitement or disappointment), and move on. That's the wrong approach.

There are five numbers that actually tell you something useful. Everything else is noise until you understand these five.

## 1. Net Profit %

This is the headline. Is the strategy profitable at all over the test period?

Look at the percentage, not the raw currency figure. The raw figure depends on how much capital you started with. The percentage tells you the actual performance.

A positive number means the strategy made money historically. A negative number means it didn't. This is the first filter — but it's only the first.

## 2. Max Drawdown %

This number matters more than profit. Full stop.

Max drawdown is the worst losing streak the strategy experienced — measured from its peak equity to the lowest point before recovering. If a strategy turned £10,000 into £30,000 but had a point where it dropped from £25,000 to £6,000 before recovering, the max drawdown is 76%.

Can you actually live through a 76% drawdown? Most traders cannot. They close the position at the bottom, crystallise the loss, and miss the recovery.

A strategy with 200% profit and 80% drawdown is effectively unrunnable for most people. Target max drawdown below 25%. Below 15% is strong.

## 3. Profit Factor

This is total gross profit divided by total gross loss.

A profit factor below 1.0 means the strategy loses money overall. A profit factor of exactly 1.0 means it breaks even. Above 1.5 is decent. Above 2.0 is strong.

TradingView shows this directly in the Strategy Tester overview. It's one of the most reliable single-number summaries of strategy health.

## 4. Win Rate %

This is the percentage of trades that close in profit. We'll spend the entire next lesson on why this number is almost meaningless on its own. For now, note it and move on.

## 5. Total Trades

This is your sample size, and it's the number most traders ignore.

Fewer than 30 trades is statistically worthless. You could flip a coin 30 times and get a 70% win rate by pure chance. Under 100 trades is weak. Over 200 trades, tested across multiple years, starts to become credible.

If your Strategy Tester shows 12 trades over 6 months with a 90% win rate — that's not a good strategy. That's not enough data.

:::important
A strategy that looks good on 3 months of data is almost certainly curve-fitted. Always test across at least 2–3 years minimum. If your instrument doesn't have that much history on TradingView, extend the chart as far back as it goes.
:::

## The quick sanity check

Before spending more time on any set of results, run this filter:

- Net profit positive? ✓
- Max drawdown under 25%? ✓
- Profit factor above 1.3? ✓
- More than 150 trades? ✓

If any of those fail, the strategy needs more work — regardless of what the win rate says. Which brings us to the next lesson.
$mdx$ WHERE slug = 'five-stats-that-matter';


-- ── MODULE 2, LESSON 2 ───────────────────────────────────────
UPDATE course_lessons SET content_mdx = $mdx$
Win rate is the number trading course sellers lead with. "My system has an 82% win rate!" It sounds extraordinary. It means almost nothing.

Here's why.

## The casino analogy

A casino running a standard roulette wheel wins approximately 51–53% of spins. That's their win rate. By the logic of most trading content, this is a mediocre system.

But casinos do not go broke. They are some of the most consistently profitable businesses on earth.

They win because of the payout ratio, not the win rate. When you win, they pay you slightly less than true odds. When they win, they take your full stake. Compounded across millions of bets, that edge is enormous.

Your trading strategy works the same way.

## A 40% win rate strategy that makes money

Imagine a strategy that wins 40% of trades and loses 60%.

On the face of it, that sounds terrible.

Now add the sizes:
- Average winning trade: **3R** (3 times the risk)
- Average losing trade: **1R** (the amount risked)

Run the maths over 100 trades:
- 40 winners × 3R = **+120R**
- 60 losers × 1R = **−60R**
- **Net result: +60R**

A 40% win rate strategy that wins 3R for every 1R risked is highly profitable. You lose 6 trades out of every 10 and still make money.

## A 70% win rate strategy that loses money

Now imagine a strategy that wins 70% of trades.

That sounds excellent.

Add the sizes:
- Average winning trade: **0.5R**
- Average losing trade: **2R**

Run the same 100 trades:
- 70 winners × 0.5R = **+35R**
- 30 losers × 2R = **−60R**
- **Net result: −25R**

A 70% win rate strategy that cuts winners early and lets losers run will bleed your account dry. It just does it slowly, which makes it harder to spot.

## The metric that combines both: Expectancy

Expectancy is the single number that tells you whether a strategy has edge.

**Formula:**

```
Expectancy = (Win Rate × Avg Win) − (Loss Rate × Avg Loss)
```

If the result is positive, the strategy has positive expectancy — it makes money over time on average. If negative, it doesn't.

Using the 40% win rate example:
```
(0.40 × 3R) − (0.60 × 1R) = 1.2R − 0.6R = +0.6R per trade
```

On average, every trade adds 0.6R to the account. Run 200 trades a year and that compounds significantly.

## Where to find these numbers in TradingView

Open Strategy Tester → **Performance Summary** tab. You'll see:

- **Avg Win Trade** and **Avg Loss Trade** — use these for your expectancy calculation
- **Percent Profitable** — this is your win rate
- **Profit Factor** — a quick proxy for expectancy (above 1.0 is positive)

:::warning
Most trading course sellers lead with win rate because it sounds impressive. "78% accuracy!" means nothing without the risk-to-reward context. This is one of the primary ways retail traders get misled — by sellers who run high-win-rate, low-reward strategies that look great on paper until a few large losses wipe the gains.
:::

## The takeaway

Stop asking "what's the win rate?" Start asking "what's the expectancy?"

A strategy with a 35% win rate and a 3:1 reward-to-risk ratio will outperform a 70% win rate strategy with a 0.4:1 ratio every time, given enough trades.

Check your strategy's numbers now. Calculate the expectancy. If it's positive, keep reading. If it's negative, go back to the builder.
$mdx$ WHERE slug = 'win-rate-is-a-lie';


-- ── MODULE 2, LESSON 3 ───────────────────────────────────────
UPDATE course_lessons SET content_mdx = $mdx$
Your strategy passed the five-number check. The expectancy is positive. The profit factor is above 1.5. The win rate and R:R make sense together.

Now ask yourself an uncomfortable question: did the strategy actually discover a real edge, or did it learn the shape of the specific data it was tested on?

This is curve fitting. It's the most common reason retail algo strategies fail in live trading.

## What curve fitting actually is

Imagine you're asked to draw a line through a set of historical data points. You can draw one smooth curve that roughly fits the trend — or you can draw a wildly complex line that passes through every single point exactly.

The second line fits the past data perfectly. But it has no ability to predict the next data point. It memorised the noise, not the signal.

That's curve fitting. A strategy that's been tuned — intentionally or accidentally — to perform well on historical data it has already seen.

## The warning signs

Look at your results with fresh eyes and ask:

**Is the win rate above 75%?** Real-world strategies rarely achieve this consistently. A very high win rate often means the strategy is holding losers too long or has been optimised to avoid specific losing periods in the test data.

**Is the profit factor above 3.0?** Genuinely strong, but also a red flag if the trade count is low. A small number of trades can produce an artificially high profit factor by chance.

**Fewer than 50 trades in the backtest?** The sample size is too small to distinguish skill from luck. Add more data.

**Test period under 12 months?** Markets go through different regimes — trending, ranging, volatile, quiet. One year might only capture one or two conditions.

## The forward test: the only real cure

Split your data. Test on one period. Then test on a different period the strategy has never "seen."

Practical approach in TradingView:

1. Test your strategy on 2019–2022 data. Note the results.
2. Change the chart date range to 2023–present only.
3. Run Strategy Tester again.
4. Compare.

If the performance is broadly consistent — similar profit factor, similar drawdown characteristics, similar trade frequency — that's encouraging. If the second period shows the strategy falling apart, you have a fitted strategy, not a real one.

:::tip
In TradingView, drag the left edge of the chart to change your start date, or use the date range selector. Run Strategy Tester after each adjustment. A genuinely robust strategy will show degraded but still positive results on out-of-sample data — not a complete collapse.
:::

## Walk Forward Optimisation

For those who want to go further: Walk Forward Optimisation (WFO) is a formal method of testing strategies across rolling time windows. It's what professional quant desks use. QuantConnect and Lean Engine support it natively. It's beyond the scope of this course, but it's the right next step once you've mastered the basics here.

## The honest conclusion

Most retail algo strategies are curve-fitted. That's not a criticism — it's the natural result of optimising parameters without a rigorous methodology. The goal of this course is not to guarantee you a working strategy. It's to get you to the point where you can recognise the difference between one that might work and one that definitely won't.

If your strategy passes the out-of-sample test with meaningful (not perfect) results, it's worth taking to the next stage. If it collapses, go back to the builder, loosen the parameters, and retest.

Module 3 is for strategies that have passed this check. Let's talk about what to do with one.
$mdx$ WHERE slug = 'spotting-overfitted-results';


-- ── MODULE 3, LESSON 1 ───────────────────────────────────────
UPDATE course_lessons SET content_mdx = $mdx$
Automating a strategy does not necessarily mean placing orders automatically. For most retail traders starting out, it means getting notified when your conditions are met — and then deciding what to do.

That's semi-automation. And it's a sensible place to start.

## The two types of alert in TradingView

**Indicator alerts** fire when a value crosses a threshold — for example, when RSI crosses above 70. They're simple and don't require a strategy script.

**Strategy alerts** are more powerful. They fire based on the logic inside your Pine Script strategy — when the strategy would enter or exit a position. This is what you're working with.

## How your Pine Script triggers alerts

When QuantCoder generates your strategy, it includes `strategy.entry()` and `strategy.close()` calls. These are the instructions that tell TradingView when to go long, short, or exit.

If you toggled **Include Alerts** in the Algo Builder when generating your code, the script also contains `alertcondition()` calls. These are the hooks that TradingView uses to fire notifications.

If your script doesn't have them, go back to the builder, toggle the alerts option, and regenerate. It adds two or three lines of code automatically.

## What alerts can do

When a condition fires, TradingView can:

- Send a **browser notification** (a popup on your screen)
- Send an **email** to your registered address
- Send a **webhook** — a POST request to a URL you specify

The first two are available on the free plan. Webhooks require a paid plan (Essential tier or above).

## What alerts cannot do

Alerts do not place orders. TradingView is a charting and analysis platform, not a broker. When an alert fires, something still has to act on it — either you, manually, or a separate service that receives the webhook.

## Semi-automation: the sensible starting point

The practical approach for most traders new to algos:

- Set up an alert on your strategy
- Receive a notification when a signal fires
- Review the setup on the chart
- Place the order manually at your broker

This keeps you in control while removing the need to watch the chart all day. The strategy does the scanning. You do the execution.

:::important
TradingView's paid plan (Essential tier or above) is required for webhook alerts. The free plan supports email and browser notifications only. If you want full automation through TradersPost (covered in Lesson 3), you need the paid TradingView plan.
:::

## When to move to full automation

Once you've watched the strategy fire signals manually for a period — and you're satisfied that the signals match your expectations — you can connect a webhook service like TradersPost to execute automatically. That's the next two lessons.
$mdx$ WHERE slug = 'how-alerts-work';


-- ── MODULE 3, LESSON 2 ───────────────────────────────────────
UPDATE course_lessons SET content_mdx = $mdx$
A webhook is a URL that receives data. When your TradingView alert fires, it sends a message to that URL. Whatever is listening at that URL then decides what to do with it.

That's the entire concept. The rest is just setup.

You need a paid TradingView plan (Essential or above) for this lesson. If you're on the free plan, the webhook field won't appear. Upgrade first, then come back.

## Step 1: Make sure your strategy is on the chart

Your Pine Script strategy should already be loaded from Module 1. If not, paste it back in and click Add to chart. The Strategy Tester tab should be active.

## Step 2: Open the Alert dialog

Look at the top toolbar of your TradingView chart. There's a clock icon — that's the Alerts button. Click it. Alternatively, right-click anywhere on the chart and select **Add alert**.

The Alert dialog box opens.

## Step 3: Set the condition

In the **Condition** dropdown, find and select the name of your strategy. It will be listed alongside your indicator names. Select the strategy entry or exit condition you want to alert on.

If you want alerts for both entries and exits, you'll create two separate alerts — one for each.

## Step 4: Enable the Webhook

In the **Alert actions** section, tick the checkbox next to **Webhook URL**. A text field appears below it.

This is where you paste your receiving URL. For now, leave it empty — you'll get the URL from TradersPost in the next lesson. Come back and add it after Lesson 3.

## Step 5: Set the message body

The **Message** field is what TradingView sends in the webhook payload. TradingView supports template variables that fill in dynamically when the alert fires.

The QuantCoder output already generates a compatible message format. If you're writing your own, use:

```
{"action": "{{strategy.order.action}}", "ticker": "{{ticker}}", "price": "{{close}}"}
```

`{{strategy.order.action}}` becomes `buy` or `sell` automatically. `{{ticker}}` becomes the instrument symbol. `{{close}}` is the closing price at the time of the signal.

## Step 6: Name the alert and set expiry

Give the alert a clear name — include the strategy name and the instrument so you can identify it later.

Set the **Expiration** to **Open-ended** or the maximum option available. TradingView alerts expire by default.

:::tip
Set your alert expiry to the maximum allowed — or open-ended if available. Alerts expire silently. You won't get a notification that they stopped working. Check your active alerts periodically to confirm they're still running.
:::

## Step 7: Click Create

The alert is now active. It will fire the next time your strategy conditions are met on that chart.

## Testing without waiting for a live signal

TradingView's **Bar Replay** feature (available on paid plans) lets you step through historical bars one at a time. You can use this to trigger alerts in a controlled environment and verify the webhook is receiving data before you go live.

The next lesson covers where to send the webhook — your TradersPost account.
$mdx$ WHERE slug = 'setting-up-webhook';


-- ── MODULE 3, LESSON 3 ───────────────────────────────────────
UPDATE course_lessons SET content_mdx = $mdx$
TradingView fires the alert. Something has to receive it and place the order. TradersPost is that something.

It sits between your TradingView alert and your broker, translating a webhook message into an actual order. No code required on your end.

## What TradersPost actually does

TradersPost receives the JSON payload from TradingView (`buy`, `sell`, ticker, price), looks up your configured strategy, and sends the corresponding order to your connected broker account.

The order goes in automatically. You don't need to be at your computer.

## Supported brokers

TradersPost currently supports (check traderspost.io for the current list as this changes):

- **Alpaca** — US stocks and crypto, commission-free (US residents)
- **Interactive Brokers (IBKR)** — stocks, options, futures, forex (global)
- **TD Ameritrade / Schwab** — US stocks and options
- **TradeStation** — US equities and futures
- **Tradovate** — futures
- **Webull** — US stocks

If your broker isn't listed, TradersPost can't connect to it directly. In that case, the webhook approach from Lesson 2 still works for notifications — you'll place orders manually.

## Setup in 4 steps

**Step 1: Create your TradersPost account**

Go to [traderspost.io](https://traderspost.io) and sign up. They offer a free trial period.

**Step 2: Connect your broker**

In TradersPost, go to **Brokers** → **Connect Broker**. Select your broker from the list and follow the authentication flow. This typically involves logging into your broker account and granting API access.

Always connect a **paper trading / demo account first**. Every broker on the TradersPost list offers paper mode. Use it for at least 30 days before touching real money.

**Step 3: Create a Strategy in TradersPost**

Go to **Strategies** → **New Strategy**. Name it to match your TradingView strategy. Set your position size — either a fixed dollar amount or a percentage of your account. Set your maximum position limits.

This is your safety net. TradersPost will not place an order larger than the limits you define here.

**Step 4: Copy your webhook URL**

TradersPost generates a unique webhook URL for each strategy. Copy it. Go back to your TradingView alert (from Lesson 2), paste it into the Webhook URL field, and save the alert.

## What happens when a signal fires

1. Your Pine Script strategy fires an `alertcondition()` trigger
2. TradingView sends a JSON POST to your TradersPost webhook URL
3. TradersPost parses the action (`buy` or `sell`) and your instrument
4. TradersPost places the order at your connected broker
5. Your broker executes the trade

The whole chain takes 1–3 seconds in normal conditions.

:::warning
Start with a paper trading account before connecting real money. Every broker supported by TradersPost offers paper/demo mode. Run your strategy on paper for a minimum of 30 days. Watch every trade. Compare the fills to what the Strategy Tester predicted. Only then consider live capital.
:::

## You now have a working semi-automated system

TradingView strategy → alert → webhook → TradersPost → broker order.

That's the full chain. Module 4 covers what to do if your strategy was generated as Python rather than Pine Script — and how to run proper backtests locally with more control over the data.
$mdx$ WHERE slug = 'connecting-traderspost';


-- ── MODULE 4, LESSON 1 ───────────────────────────────────────
UPDATE course_lessons SET content_mdx = $mdx$
Python gives you more control than Pine Script. More data sources, more flexibility in how you structure your backtest, and the ability to connect directly to broker APIs without going through TradingView. The trade-off is that it runs on your computer, not in a browser, so there's a setup step.

This lesson gets Python installed and the required libraries ready. It takes about 10 minutes if nothing goes wrong.

## Why Python and not just Pine Script?

Pine Script is excellent for TradingView-based strategies. But it has limits:

- You can only test on data TradingView has
- You can't import external data sources
- You can't run portfolio-level simulations across multiple instruments
- Connecting directly to broker APIs requires a different tool

Python removes all of those constraints. If you want to run serious backtests, Python is where you end up.

## Step 1: Download Python

Go to [python.org/downloads](https://python.org/downloads). The site will detect your operating system and show the latest stable version (3.11 or above). Click **Download Python 3.x.x**.

Do not download Python 2. It is outdated and incompatible with the libraries you need.

## Step 2: Install Python

**Windows:**
Run the installer. On the first screen, tick the checkbox that says **"Add Python to PATH"** before clicking Install. This is the step most people miss. Without it, your terminal won't know where Python is.

**Mac:**
Open the downloaded `.pkg` file and follow the prompts. Python on Mac is straightforward.

## Step 3: Open your terminal

**Mac:** Press `Cmd + Space`, type `Terminal`, press Enter.

**Windows:** Press the Windows key, type `Command Prompt`, press Enter. (Or search for `PowerShell` if you prefer.)

## Step 4: Verify the installation

Type the following and press Enter:

```
python --version
```

You should see something like `Python 3.11.4`. If you see a version number, Python is installed correctly.

:::tip
If you're on Mac and see `Python 2.7.x`, your system is using the old default Python. Type `python3 --version` instead — and use `pip3` everywhere you see `pip` in this course.
:::

## Step 5: Install the required libraries

Paste this entire line into your terminal and press Enter:

```
pip install backtrader pandas numpy pandas_ta yfinance
```

This installs five libraries:
- **backtrader** — the backtesting engine
- **pandas** — data manipulation
- **numpy** — numerical operations
- **pandas_ta** — technical indicators
- **yfinance** — Yahoo Finance data downloader

The installation will take 30–90 seconds and print a lot of output. This is normal.

## Step 6: Verify the libraries installed

Type this and press Enter:

```
python -c "import backtrader; print('ready')"
```

If you see `ready` printed in the terminal, everything is installed correctly.

:::warning
If you're on Windows and the terminal says `pip is not recognised`, close the Command Prompt completely and open a new one. The PATH update from Step 2 requires a fresh terminal session to take effect. If it still doesn't work after reopening, re-run the Python installer and make sure the PATH checkbox is ticked.
:::

## Install VS Code (recommended)

For running and editing Python scripts, VS Code is the best free option. Download it from [code.visualstudio.com](https://code.visualstudio.com). Once installed, add the Python extension from the Extensions marketplace (search "Python" by Microsoft).

VS Code gives you syntax highlighting, error highlighting, and a one-click run button. You'll use all three.

Python is ready. Lesson 2 covers how to run the backtest script that QuantCoder generated.
$mdx$ WHERE slug = 'installing-python';


-- ── MODULE 4, LESSON 2 ───────────────────────────────────────
UPDATE course_lessons SET content_mdx = $mdx$
The Python file from QuantCoder is a complete, runnable backtest script. You don't need to write any code. You need to point it at the right instrument and date range, then run it.

## What's inside the script

Open the file in VS Code and you'll see roughly four sections:

1. **Imports** — the libraries the script needs (`backtrader`, `pandas`, `yfinance`, etc.)
2. **Strategy class** — the trading logic: your entry conditions, exit conditions, and indicators
3. **Cerebro setup** — `cerebro` is backtrader's engine. This section configures starting capital, commission, and data feed
4. **Run block** — the `cerebro.run()` call that executes the backtest and prints results

You do not need to modify the strategy class. All the logic is already there.

## Step 1: Save the file somewhere sensible

Create a folder called `drawdown-algos` in your Documents or on your Desktop. Save the `.py` file there. Keep it organised — if you run multiple strategies, you'll want to find them later.

## Step 2: Check the data configuration

Near the top of the cerebro setup section, look for lines that reference your data feed. You'll see something like:

```python
data = yf.download("AAPL", start="2020-01-01", end="2024-01-01")
```

Two things to check:

**The ticker symbol** — Change `"AAPL"` to the instrument you want to test. For US stocks, use the standard ticker. For forex, yfinance uses pairs like `"EURUSD=X"`. For indices, `"^GSPC"` is S&P 500, `"^IXIC"` is NASDAQ.

**The date range** — Set a start date at least 3 years back. A wider window gives you more meaningful results.

## Step 3: Open the folder in VS Code

In VS Code, go to **File → Open Folder** and select your `drawdown-algos` folder. The file appears in the left sidebar. Click it to open.

## Step 4: Run the script

Click the green **play button** in the top right of VS Code. Alternatively, open the integrated terminal in VS Code (View → Terminal) and type:

```
python your_strategy_filename.py
```

The terminal will show the backtest running. For larger date ranges, it may take 5–15 seconds.

## Step 5: Read the output

The terminal prints your results. We cover how to interpret them fully in Lesson 3.

## If the script throws an error

Python errors are printed in red. The most important part is the last line — it tells you exactly what went wrong.

Common issues:
- `ModuleNotFoundError: No module named 'backtrader'` — the libraries didn't install correctly. Re-run the pip install command from Lesson 1.
- `KeyError: 'Close'` — yfinance returned data in a different column format. This is a known intermittent issue. Try running the script again.
- Any other error — copy the full error message (from the red text to the bottom) and paste it into the **Fix Error** input in the Drawdown Algo Builder. It will diagnose and correct the script.

:::important
yfinance data quality varies by instrument. It's reliable for US stocks and major indices. For forex pairs, the free tier has limitations — data may be missing for some periods. For serious forex backtesting, a paid data source (Quandl, Norgate, or similar) gives better results. The Python output is most reliable for equities.
:::

Lesson 3 covers what the output actually means.
$mdx$ WHERE slug = 'running-backtest';


-- ── MODULE 4, LESSON 3 ───────────────────────────────────────
UPDATE course_lessons SET content_mdx = $mdx$
The backtest ran. The terminal printed a block of numbers. Here's what they mean and what you can change.

## The core output

**Final Portfolio Value**

This is what your starting capital grew (or shrank) to over the test period. If you started with £10,000 and the final value is £14,320, the strategy returned £4,320 in nominal terms.

**Total Return %**

The percentage gain or loss from starting capital to final value. This is the number to compare across strategies — it normalises for different starting capital amounts.

**Max Drawdown %**

The same concept as in Module 2 — the worst peak-to-trough drop in equity during the backtest. Everything we covered about why this matters more than profit applies here too.

**Sharpe Ratio**

This is risk-adjusted return. It measures how much return the strategy generates per unit of risk (volatility).

- **Above 1.0** — acceptable. The strategy earns more than it risks.
- **Above 2.0** — strong.
- **Below 1.0** — the return doesn't justify the volatility.
- **Negative** — the strategy underperformed a risk-free cash position.

A strategy with a 40% return but a Sharpe of 0.3 is not as good as a strategy with a 15% return and a Sharpe of 1.8.

**Number of Trades**

Same rule as Module 2. Under 100 trades is a weak sample. Over 200 is credible. The more the better, within reason.

## What you can adjust

**Starting capital** — find the `cerebro.broker.setcash()` line and change the value:

```python
cerebro.broker.setcash(10000.0)
```

**Test date range** — find the `yf.download()` line and change the dates:

```python
data = yf.download("SPY", start="2019-01-01", end="2024-01-01")
```

**Commission** — find `cerebro.broker.setcommission()` and adjust:

```python
cerebro.broker.setcommission(commission=0.001)  # 0.1% per trade
```

For equities, 0.1% is realistic for most retail brokers. For CFDs and forex, check your broker's actual spread and commission structure and model it accurately — optimistic commission assumptions are one of the most common reasons backtests don't translate to live performance.

## Out-of-sample testing in Python

Apply the same principle from Module 2. Test on one date range. Then change the dates to a period the strategy hasn't been optimised for. Compare the Sharpe ratios and drawdown figures. If they collapse, the strategy is fitted to the original period.

## Bridging to Module 5

You can now backtest in both TradingView and Python. You know what the results mean, and you know the questions to ask before trusting them.

The only question left is whether to go live. Module 5 covers that — and it starts with the honest answer to whether most traders should.
$mdx$ WHERE slug = 'reading-terminal-output';


-- ── MODULE 5, LESSON 1 ───────────────────────────────────────
UPDATE course_lessons SET content_mdx = $mdx$
You've backtested the strategy. The numbers look reasonable. The out-of-sample test held up. You want to run it live.

Before that, you need to hear the honest version of what live algo trading actually involves. Not the version from YouTube thumbnails. The real one.

## The gap between backtest and live

A backtest assumes perfect execution. Your orders fill at exactly the price shown on the chart. In live trading, this is rarely true.

**Slippage** — the difference between the price when your signal fires and the price you actually get filled at. In fast markets, this can be several ticks. For high-frequency strategies that depend on precise entries, slippage alone can turn a profitable backtest into a losing live strategy.

**Spread** — your backtest commission setting may not have accounted for the bid-ask spread accurately. A 1-pip spread on EURUSD costs you 10 basis points round-trip. Compounded across hundreds of trades a year, this matters.

**Overnight swaps** — holding positions overnight incurs swap fees (or earns swap income) depending on your broker and direction. Most backtests ignore this. Check whether your strategy holds overnight and what the swap costs are at your broker.

**API downtime** — broker APIs go offline. TradingView alerts miss signals during outages. No system is 100% reliable. If your strategy depends on capturing every single signal, you need redundancy — monitoring, alerts when the connection drops, a way to check manually.

**Latency** — the time between your signal firing and your order reaching the exchange. For most retail strategies operating on 1-hour or daily timeframes, this is irrelevant. For anything on minute charts or below, it starts to matter.

## The psychological element

Watching an algorithm take losses in real time is harder than reading the same losses on a backtest report.

When the backtest shows a 15% drawdown, it's an abstract number. When your live account drops 15% over three weeks while the strategy keeps taking trades that lose, the urge to intervene is overwhelming. Traders turn the algo off at exactly the wrong moment — at the bottom of the drawdown, before the recovery.

Decide now, in advance, what your maximum drawdown tolerance is. Write it down. If the strategy hits that number, you stop it. Not before. Not after. At that number.

## Who is actually ready to run a live algo

Be honest with yourself. You're ready when:

- You've backtested across multiple market conditions and the strategy holds up
- You've forward-tested on a paper account for at least 60 days
- The paper results broadly match the backtest expectations (not perfectly — broadly)
- You've defined your kill switch: the max drawdown or max daily loss at which you stop the algo
- The capital allocated to this strategy is money you can genuinely afford to lose entirely

If any of those aren't true yet, live trading will cost you money and teach you the lesson the expensive way.

:::important
The Drawdown platform does not provide financial advice. This module is educational. Past backtest performance is not indicative of future results. You are solely responsible for your trading decisions and any losses incurred from running any strategy generated or discussed within this course.
:::

## The Drawdown position

Systematic trading is not a shortcut. It takes as long to develop a genuinely working algo strategy as it takes to develop a working discretionary approach. The advantage is that once it works, it runs without you watching the screen all day. That advantage is real. But it's earned, not given.

The next two lessons cover the practical elements: choosing a broker with an API and the pre-live checklist you should complete before going live.
$mdx$ WHERE slug = 'honest-truth-live-trading';


-- ── MODULE 5, LESSON 2 ───────────────────────────────────────
UPDATE course_lessons SET content_mdx = $mdx$
Not every broker offers an API. Of those that do, not all of them support the kind of programmatic trading you're building. This lesson covers the three realistic options for retail traders and helps you choose the right one.

## What you actually need from a broker API

At minimum:
- The ability to place market and limit orders via code
- Account balance and position data accessible programmatically
- Paper/demo mode for testing without real money
- Regulatory protection (FCA for UK, FINRA/SEC for US, ASIC for Australia)

Nice to have:
- Python library or SDK (so you don't have to write raw HTTP requests)
- Reliable uptime and documented error handling
- Active developer community

## Option 1: Interactive Brokers (IBKR)

IBKR is the institutional standard for serious retail algo traders. If you're based in the UK and want to trade equities, ETFs, or futures algorithmically, this is the practical choice.

**The API:** IBKR uses the TWS (Trader Workstation) API. The most usable Python wrapper is `ib_insync` — well-documented and actively maintained. The official IBKR Python client also works.

**Regulated:** FCA (UK), SEC/FINRA (US), and multiple other regulators globally.

**Minimum deposit:** Technically $0, but you need $2,000+ for meaningful margin and to avoid inactivity fees.

**The downsides:** The TWS software is dated and needs to be running on your machine for the API to work. Setup takes time. The interface is not beginner-friendly. But the documentation is thorough and the community is large.

**Best for:** UK-based traders. Equities, ETFs, options, futures, forex.

## Option 2: Alpaca

Alpaca is a commission-free broker built specifically for algorithmic traders. Their Python SDK is clean, modern, and genuinely enjoyable to work with.

**The limitation:** Alpaca is available for live trading to US residents only. UK and EU traders can use the paper trading environment but cannot open live accounts.

**Best for:** US-based Drawdown members. Equities and crypto.

## Option 3: cTrader / IC Markets

For forex and CFD trading, cTrader is a popular platform with FCA-regulated brokers (IC Markets EU, Pepperstone, and others). It has a programmatic API — **cAlgo** — but it uses **C#**, not Python.

This means the code QuantCoder generates (Python or Pine Script) won't run directly on cAlgo. You'd need to rewrite the strategy logic in C# or use a different bridge.

**Best for:** Forex and CFD traders who are comfortable with or willing to learn C#.

:::tip
Drawdown has a full broker comparison guide at [/brokers](/brokers) with commission structures, regulatory status, and minimum deposits for all major brokers. Check it before opening an account — spreads and overnight swap rates vary significantly and will affect your live P&L.
:::

## The practical recommendation

For most UK-based traders starting with algorithmic equities or futures: **IBKR**. It's the serious choice and the learning curve is worth it.

For US-based traders: **Alpaca** for equities. **IBKR** if you need options or futures.

For forex specifically: understand that the TradersPost route from Module 3 is often more practical than direct API connections for retail account sizes.

Open a paper account with your chosen broker before touching live capital. The next lesson tells you what to verify before you do.
$mdx$ WHERE slug = 'choosing-broker-api';


-- ── MODULE 5, LESSON 3 ───────────────────────────────────────
UPDATE course_lessons SET content_mdx = $mdx$
This is the final lesson. Before you run any strategy with real money, you should be able to tick every item on this list.

Print it. Work through it. Don't skip items because they feel administrative.

---

## Strategy Validation

- [ ] **Backtested on minimum 3 years of data.** Not 6 months. Not 1 year. Three years minimum, covering different market conditions.

- [ ] **Tested across at least one bear market AND one volatile period.** A strategy that only ran during a bull trend is untested in the conditions that will hurt you.

- [ ] **Profit factor above 1.3.** Below this, the margin for real-world friction (spread, slippage, commission) is too thin.

- [ ] **More than 150 trades in the backtest.** Sample size matters. Under 100 trades is statistically weak.

- [ ] **Forward-tested on paper for minimum 60 days.** Not 7 days. Not 2 weeks. Two months of live market conditions, on a demo account, watching every signal.

- [ ] **Paper trading results broadly consistent with backtest.** Not identical — broader. If the paper results look dramatically different from the backtest, investigate why before going live.

---

## Risk Management

- [ ] **Maximum position size defined and hard-coded (or broker-enforced).** The strategy should not be able to take a position larger than you've defined as acceptable.

- [ ] **Daily loss limit defined.** Decide in advance: if the strategy loses X% in a single day, you stop it. Write this number down before you go live.

- [ ] **Kill switch tested.** You know exactly how to stop the algo immediately — whether that's turning off an alert in TradingView, disabling an API key, or closing a position manually. Have done it at least once in paper mode.

- [ ] **Position sizing verified at your actual account size.** A backtest run with £100,000 capital will produce different position sizes than a live account with £5,000. Recheck the maths at your real capital level.

---

## Technical Readiness

- [ ] **Script runs without errors on 3 consecutive days of paper trading.** Not one day. Three. Minor bugs often only appear under specific market conditions.

- [ ] **Broker API connection tested with a small dummy order.** Place a real (small) order via the API in paper mode and confirm it goes through correctly before automating.

- [ ] **Monitoring in place.** You will receive an alert if the script crashes or the API connection drops. Do not run an unmonitored live algo.

- [ ] **Always-on machine available if required.** If your strategy needs to be running continuously (not just on TradingView alert), you need a machine that doesn't sleep — a VPS or dedicated computer.

---

## Mental Readiness

- [ ] **You can afford to lose the capital allocated to this strategy.** Every pound at risk in an algo is genuinely at risk. If losing it would affect your financial situation or your sleep, reduce the size until it wouldn't.

- [ ] **You have defined in advance what drawdown percentage will cause you to stop the algo.** Write this number on a piece of paper. Stick it near your computer. Commit to honouring it.

- [ ] **You are not counting on this money for anything in the next 12 months.** Algorithmic strategies go through losing periods that can last weeks or months. Capital you need short-term should not be in a live algo.

---

## You're done.

If you can tick everything above, you are better prepared than the vast majority of retail traders who attempt algorithmic trading. That's not a boast — it's just true. Most people run live algos on the back of a three-month backtest and a feeling. You've done the work.

The Drawdown Algo Strategy Builder is in your dashboard. Go generate something worth running.

And if you want to go further — QuantConnect, Walk Forward Optimisation, portfolio-level testing, direct broker API integration — the advanced content will be here when you're ready.

Good luck. Do the work.
$mdx$ WHERE slug = 'pre-live-checklist';
