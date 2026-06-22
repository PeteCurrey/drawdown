-- ============================================================
-- DEPLOY YOUR ALGO — Module 1 lesson content
-- Migration: 20260622_module1_content.sql
-- ============================================================

UPDATE course_lessons SET content_mdx = $mdx$
You've got code. A block of text that was generated in seconds. And now you're staring at it, wondering what you're supposed to do with it.

This is the exact moment where most people give up — not because the code is wrong, but because nobody told them where it goes.

That's what this lesson is.

## Two worlds, one choice

Generated trading code comes in two flavours: **Pine Script** and **Python**.

They live in completely different places and do slightly different things.

**Pine Script** is TradingView's own scripting language. It runs entirely in your browser. There's nothing to install, nothing to configure, no risk of breaking your computer. You open TradingView, paste code, click a button, and your strategy appears on the chart. That's it.

**Python** is more powerful and runs on your machine locally. It needs a working Python environment, libraries installed, and a bit of terminal confidence. We cover that in Module 4.

For now, we're doing Pine Script. If your Algo Builder generated Python code, that's fine — bookmark Module 4 and come back to it. But if it generated Pine Script (which it does by default), you're in exactly the right place.

## What Pine Script actually is

TradingView built Pine Script specifically for traders. It's not a general-purpose programming language — it's designed to describe trading logic and plot it on a chart. This means it handles all the complicated chart-time logic for you. It knows what a candle is. It knows what a moving average is. You don't have to teach it.

Because it runs entirely in TradingView's cloud, there's no local installation. It works the same on your laptop, your phone, and your work computer. It's free to use.

:::important
You do not need to understand a single line of the code to follow this module. You are copy-pasting and clicking buttons. Understanding comes after you can see it working.
:::

## What you'll have by the end of Module 1

Three lessons from now, your strategy will be sitting on a live TradingView chart. The Strategy Tester tab will be active and showing you historical results — entries, exits, profit, drawdown, win rate.

You won't know what those numbers mean yet. That's Module 2.

For now, the goal is to get the code onto the chart and confirm it runs without errors.

Let's start in Lesson 2 by opening the Pine Script Editor.
$mdx$ WHERE slug = 'where-does-the-code-go';


UPDATE course_lessons SET content_mdx = $mdx$
TradingView has a built-in code editor that most traders never find because they're looking in the wrong place. It's not in the menus. It's not obvious on first load. But it's there, and once you know where it is, you'll never lose it.

This lesson gets you to a blank, ready editor.

## Before you start

You need a TradingView account. The free plan is enough for this entire module. Go to [tradingview.com](https://tradingview.com) and create one if you haven't already.

## Step 1: Open a chart

After logging in, click **Chart** in the top navigation. TradingView will open a chart — usually whatever you last viewed, or a default like SPX.

It doesn't matter which instrument you're looking at for this exercise. If you want something familiar, type **EURUSD** or **SPY** in the search bar at the top and select it. Both are liquid, well-known instruments with years of data.

## Step 2: Find the Pine Script Editor

Look at the very bottom of the chart area. There's a toolbar row with several icons. One of them looks like a pair of angled brackets: `< >`. That's the Pine Script Editor button.

Click it.

:::tip
TradingView updates their interface regularly. If the icon description doesn't match exactly what you see, look for any button at the bottom of the chart that opens a code panel. The editor always opens as a panel below the chart.
:::

## Step 3: The editor opens below the chart

A code panel will appear at the bottom of your screen. It will already contain some default starter code — usually a simple indicator or an empty script template.

You do not want this code. It's not your strategy.

## Step 4: Clear the editor

Click anywhere inside the editor panel to make sure it's focused. Then select all the existing code:

- **Mac:** `Cmd + A`
- **Windows:** `Ctrl + A`

All the text will be highlighted. Press **Delete** or **Backspace**. The editor is now blank.

## Step 5: Confirm you have a blank editor

Your editor panel should now show an empty white (or dark) text area with a blinking cursor. Nothing else.

:::warning
If you see a grey "Strategy Tester" tab at the bottom but it's disabled, don't worry — it activates once you add a strategy script. You'll see it come to life in the next lesson.
:::

## You're ready

That's it. A blank Pine Script Editor, open, waiting.

In Lesson 3, you'll paste your generated strategy code into this editor and watch it load onto the chart. That's the moment where it stops being a block of text and becomes a functioning strategy.
$mdx$ WHERE slug = 'opening-pine-editor';


UPDATE course_lessons SET content_mdx = $mdx$
This is the lesson where it becomes real. Your code goes from a text file into an actual working strategy on a live chart.

Let's do it.

## Step 1: Copy your Pine Script code

Go back to the Drawdown Algo Strategy Builder. Find the generated Pine Script code — it'll be in the output panel on the right side of the builder. Click the **Copy** button, or select all the text and copy it manually (`Cmd+A` then `Cmd+C` on Mac, `Ctrl+A` then `Ctrl+C` on Windows).

Make sure you copy the entire script. It starts with `//@version=5` or similar, and ends with a closing line of strategy logic.

## Step 2: Paste it into the TradingView editor

Click inside the blank Pine Script Editor you prepared in Lesson 2. Paste your code:

- **Mac:** `Cmd + V`
- **Windows:** `Ctrl + V`

The editor should fill with code. It'll look like a wall of text. That's correct.

## Step 3: Click "Add to chart"

At the top of the Pine Script Editor panel, there's a blue button labelled **Add to chart** (sometimes just a play icon, depending on your TradingView version). Click it.

TradingView will compile the script. This takes 1–3 seconds.

If there are no errors, two things will happen: coloured markers will appear on your chart (triangles, arrows, or shapes indicating entry and exit signals), and the **Strategy Tester** tab at the bottom will activate.

## Step 4: Open the Strategy Tester

Click the **Strategy Tester** tab at the bottom of the screen. A results panel will load.

You're looking at historical simulation data. TradingView has run your strategy against every bar of data on the chart and recorded every trade it would have taken.

## Step 5: What you're looking at

The overview tab shows:

- **Net Profit** — total profit or loss in currency and percentage terms over the test period
- **Max Drawdown** — the worst losing streak the strategy experienced
- **Total Trades** — how many trades the strategy took
- **Win Rate** — percentage of trades that closed in profit

Don't draw any conclusions yet. These numbers need context before they mean anything — and that's exactly what Module 2 covers.

:::warning
If you see a red error bar at the bottom of the editor instead of markers on the chart, copy the full error text. Go back to the Drawdown Algo Builder and paste it into the **Fix Error** input. The builder will diagnose and correct the issue and give you updated code to try again.
:::

:::important
The Strategy Tester is showing you historical simulation results, not live performance. A strategy that looks good on past data may perform differently going forward. Before you do anything with this data, read Module 2.
:::

## You've done it

Your strategy is on the chart. The Strategy Tester is showing results. This is further than most traders who generate algo code ever get — they generate it, stare at it, and give up.

You didn't.

Module 2 is where you learn to read those results properly. Because right now, you don't know if you're looking at a genuinely good strategy or a statistical illusion. Let's find out.
$mdx$ WHERE slug = 'adding-to-chart';
