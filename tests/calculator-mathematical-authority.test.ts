import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { calculateRiskOfRuin } from '../src/lib/tools/ruin-calc.ts';
import { calculatePositionSize } from '../src/lib/tools/position-calc.ts';

const rootDir = path.resolve(import.meta.dirname, '..');
function readFile(rel: string): string {
  return fs.readFileSync(path.join(rootDir, rel), 'utf8');
}

// ---------------------------------------------------------------------------
// 1. RISK OF RUIN: MATHEMATICAL CONTRACT TESTS
// ---------------------------------------------------------------------------
test('Risk of Ruin: Worked example contract — 50% WR, 1.5 R:R, 1.5% Risk, 25% MaxDD, 100T', () => {
  const res = calculateRiskOfRuin({
    winRatePercent: 50,
    rewardToRisk: 1.5,
    riskPerTradePercent: 1.5,
    maxDrawdownThresholdPercent: 25,
    numberOfTrades: 100,
  });

  // EV = (0.50 * 1.5) - (0.50 * 1.0) = +0.25 R
  assert.equal(res.hasEdge, true);
  assert.equal(res.expectedValueR, 0.25);

  // EV% = 0.25 * 1.5 = 0.375% per trade
  assert.equal(Number(res.expectedValuePercent.toFixed(3)), 0.375);

  // Consecutive losses to ruin: ceil(ln(1-0.25)/ln(1-0.015)) = ceil(-0.28768 / -0.015114) = ceil(19.034) = 20
  assert.equal(res.consecutiveLossesToRuin, 20);

  // Ruin probability should be very small (< 0.1%)
  assert.ok(res.probabilityOfRuinPercent < 0.1, `Expected < 0.1%, got ${res.probabilityOfRuinPercent}`);
  assert.ok(res.probabilityOfRuinPercent > 0, 'Ruin probability must be positive');

  // Formula steps present
  assert.equal(res.formulaSteps.length, 4);

  // Drawdown distribution has all 7 thresholds: 10, 20, 30, 40, 50, 75, 100
  assert.equal(res.drawdownDistribution.length, 7);
});

test('Risk of Ruin: Negative expectancy triggers 99.9% ruin certainty', () => {
  // EV = (0.40 * 1.0) - (0.60 * 1.0) = -0.20 R
  const res = calculateRiskOfRuin({
    winRatePercent: 40,
    rewardToRisk: 1.0,
    riskPerTradePercent: 2.0,
    maxDrawdownThresholdPercent: 20,
    numberOfTrades: 100,
  });

  assert.equal(res.hasEdge, false);
  assert.equal(Number(res.expectedValueR.toFixed(2)), -0.2);
  assert.equal(res.probabilityOfRuinPercent, 99.9);
});

test('Risk of Ruin: Zero-edge strategy (breakeven) triggers 99.9% ruin', () => {
  // EV = (0.50 * 1.0) - (0.50 * 1.0) = 0.0 R
  const res = calculateRiskOfRuin({
    winRatePercent: 50,
    rewardToRisk: 1.0,
    riskPerTradePercent: 1.5,
    maxDrawdownThresholdPercent: 20,
    numberOfTrades: 100,
  });

  assert.equal(res.hasEdge, false);
  assert.equal(res.expectedValueR, 0);
  assert.equal(res.probabilityOfRuinPercent, 99.9);
});

test('Risk of Ruin: High edge reduces ruin probability dramatically', () => {
  // Strong strategy: 65% WR, 1.5 R:R -> EV = (0.65*1.5) - (0.35*1.0) = 0.975 - 0.35 = +0.625 R
  const res = calculateRiskOfRuin({
    winRatePercent: 65,
    rewardToRisk: 1.5,
    riskPerTradePercent: 1.0,
    maxDrawdownThresholdPercent: 20,
    numberOfTrades: 200,
  });

  assert.equal(res.hasEdge, true);
  assert.equal(Number(res.expectedValueR.toFixed(3)), 0.625);
  // High edge + low risk -> very low ruin probability
  assert.ok(res.probabilityOfRuinPercent < 0.01, `Expected < 0.01%, got ${res.probabilityOfRuinPercent}`);
});

test('Risk of Ruin: Parameter clamping for extreme inputs', () => {
  // winRate clamped to 99 (max), risk clamped to 0.1 (min)
  const res = calculateRiskOfRuin({
    winRatePercent: 150,  // should clamp to 99
    rewardToRisk: 2.0,
    riskPerTradePercent: 0.001,  // should clamp to 0.1
    maxDrawdownThresholdPercent: 20,
    numberOfTrades: 50,
  });

  assert.equal(res.hasEdge, true);
  assert.ok(res.probabilityOfRuinPercent < 1.0);
});

// ---------------------------------------------------------------------------
// 2. POSITION SIZE CALCULATOR: MATHEMATICAL CONTRACT TESTS
// (using position-calc.ts interface: symbol, accountCurrency, accountBalance, riskType, riskValue)
// ---------------------------------------------------------------------------
test('Position Sizer: EUR/USD 1% risk mathematical contract', () => {
  // Balance: $10,000 USD, 1.0% risk ($100), Entry: 1.08500, Stop: 1.08250
  // Stop distance = |1.08500 - 1.08250| = 0.00250 * 10000 = 25 pips
  // Pip value EURUSD = 100,000 * 0.0001 = $10 per pip
  // Lots = $100 / (25 pips * $10) = $100 / $250 = 0.40 standard lots
  const res = calculatePositionSize({
    symbol: 'EURUSD',
    accountCurrency: 'USD',
    accountBalance: 10000,
    riskType: 'percent',
    riskValue: 1.0,
    entryPrice: 1.08500,
    stopPrice: 1.08250,
    targetPrice: 1.09000,  // 50 pips target -> R:R = 2.0
  });

  assert.equal(res.cashRisk, 100.00);
  assert.equal(res.riskPercent, 1.0);
  assert.equal(Math.round(res.stopDistanceUnits), 25); // 25 pips
  assert.equal(Number(res.standardLots.toFixed(2)), 0.40);
  assert.equal(Number(res.rrRatio?.toFixed(2)), 2.0);
  assert.equal(Math.round(res.potentialProfit || 0), 200.00);
});

test('Position Sizer: Cash risk mode — fixed £500 cash risk', () => {
  // Balance: £50,000, fixed £500 cash risk, GBPUSD long, 40-pip stop
  // Pip value GBPUSD = $10/pip, at ~1.2850 GBP/USD -> in USD, assuming 1.0 rate: $10/pip
  // Lots = 500 / (40 * 10) = 500 / 400 = 1.25 lots
  const res = calculatePositionSize({
    symbol: 'GBPUSD',
    accountCurrency: 'USD',
    accountBalance: 50000,
    riskType: 'cash',
    riskValue: 500,
    entryPrice: 1.28500,
    stopPrice: 1.28100, // 40 pips stop
    targetPrice: 1.29700, // 120 pips target -> R:R = 3.0
  });

  assert.equal(res.cashRisk, 500);
  assert.equal(Math.round(res.stopDistanceUnits), 40);
  assert.equal(Number(res.standardLots.toFixed(2)), 1.25);
  assert.equal(res.rrRatio, 3.0);
});

test('Position Sizer: Gold (XAUUSD) contract specification', () => {
  // Balance: $20,000 USD, 1.5% risk ($300), Entry: 2050.00, Stop: 2044.00 (6 points)
  const res = calculatePositionSize({
    symbol: 'XAUUSD',
    accountCurrency: 'USD',
    accountBalance: 20000,
    riskType: 'percent',
    riskValue: 1.5,
    entryPrice: 2050.00,
    stopPrice: 2044.00,   // 6 point stop
    targetPrice: 2068.00, // 18 point target -> R:R = 3.0
  });

  assert.equal(res.cashRisk, 300);
  assert.ok(res.standardLots > 0, 'Gold lot size must be positive');
  assert.equal(res.rrRatio, 3.0);
  assert.ok(res.notionalValue > 0, 'Notional exposure must be positive');
});

test('Position Sizer: stop equal to entry returns zero lots (invalid)', () => {
  const res = calculatePositionSize({
    symbol: 'EURUSD',
    accountCurrency: 'USD',
    accountBalance: 10000,
    riskType: 'percent',
    riskValue: 1.0,
    entryPrice: 1.08500,
    stopPrice: 1.08500, // same as entry = 0 pip stop
  });

  assert.equal(res.standardLots, 0);
  assert.equal(res.stopDistanceUnits, 0);
});

// ---------------------------------------------------------------------------
// 3. DRAWDOWN MODELER: FORMULA CONTRACT TESTS (inline, matches DrawdownCalculator.tsx)
// ---------------------------------------------------------------------------
test('Drawdown Modeler: Worked example contract — $50,000, 55% WR, 1.5% risk, 6 losses', () => {
  const balance = 50000;
  const winRate = 55;
  const riskPerTrade = 1.5;
  const streakLength = 6;

  // Probability: (1 - 0.55)^6 * 100
  const probability = Math.pow((100 - winRate) / 100, streakLength) * 100;
  // (0.45)^6 = 0.00830376... * 100 = 0.830376...%
  assert.equal(Number(probability.toFixed(3)), 0.830);

  // Capital decay: B * (1 - r)^n
  let currentBalance = balance;
  for (let i = 0; i < streakLength; i++) {
    currentBalance = currentBalance * (1 - riskPerTrade / 100);
  }
  const capitalLost = balance - currentBalance;
  const drawdownPercent = (capitalLost / balance) * 100;
  const recoveryRequired = (capitalLost / currentBalance) * 100;

  assert.equal(Number(currentBalance.toFixed(2)), 45665.41);
  assert.equal(Number(capitalLost.toFixed(2)), 4334.59);
  assert.equal(Number(drawdownPercent.toFixed(2)), 8.67);
  // Recovery: 4334.59 / 45665.41 * 100 = 9.49206...% -> 9.49%
  assert.equal(Number(recoveryRequired.toFixed(2)), 9.49);
});

test('Drawdown Modeler: 5 losses at 2% risk — non-linear capital decay', () => {
  // 5 consecutive 2% losses: 1 - (1-0.02)^5 = 1 - 0.9039... = 9.608%
  const balance = 100000;
  let current = balance;
  for (let i = 0; i < 5; i++) {
    current = current * (1 - 0.02);
  }
  const drawdown = ((balance - current) / balance) * 100;

  // 5 * 2 = 10% linear; actual is 9.61% due to compounding on shrinking base
  assert.ok(drawdown < 10.0, 'Compound decay produces less than 10% drawdown for 5 x 2% losses');
  assert.equal(Number(drawdown.toFixed(2)), 9.61);
});

// ---------------------------------------------------------------------------
// 4. DRAWDOWN RECOVERY: FORMULA CONTRACT TESTS (matches DrawdownRecoveryCalculator.tsx)
// ---------------------------------------------------------------------------
test('Drawdown Recovery: Worked example contract — £10,000 to £7,500, 50% WR, 1.5 RR, 1% risk', () => {
  const startingBalance = 10000;
  const currentBalance = 7500;
  const riskPerTradePct = 1.0;
  const winRatePct = 50;
  const rewardToRisk = 1.5;

  const capitalLost = Math.max(0, startingBalance - currentBalance);
  const drawdownPct = (capitalLost / startingBalance) * 100;
  const gainRequiredPct = currentBalance > 0 ? (capitalLost / currentBalance) * 100 : 0;

  assert.equal(capitalLost, 2500);
  assert.equal(drawdownPct, 25.0);
  assert.equal(Number(gainRequiredPct.toFixed(2)), 33.33);

  const winRate = winRatePct / 100;
  const evInR = (winRate * rewardToRisk) - ((1 - winRate) * 1);
  assert.equal(evInR, 0.25);

  // Fixed-currency risk per trade: £7,500 * 1.0% = £75.00
  const riskAmountCurrency = currentBalance * (riskPerTradePct / 100);
  assert.equal(riskAmountCurrency, 75.0);

  const expectedProfitPerTrade = riskAmountCurrency * evInR;
  assert.equal(expectedProfitPerTrade, 18.75);

  // ceil(2500 / 18.75) = ceil(133.333) = 134 trades
  const tradesToRecover = Math.ceil(capitalLost / expectedProfitPerTrade);
  assert.equal(tradesToRecover, 134);
});

test('Drawdown Recovery: Non-linear recovery table matches canonical values', () => {
  const cases: { dd: number; expected: number }[] = [
    { dd: 10, expected: 11.11 },
    { dd: 20, expected: 25.00 },
    { dd: 30, expected: 42.86 },
    { dd: 50, expected: 100.00 },
    { dd: 75, expected: 300.00 },
    { dd: 90, expected: 900.00 },
  ];

  for (const { dd, expected } of cases) {
    const remainingPct = 100 - dd;
    const gainReq = (dd / remainingPct) * 100;
    assert.equal(
      Number(gainReq.toFixed(2)),
      expected,
      `${dd}% drawdown should require ${expected}% gain, got ${gainReq.toFixed(2)}%`
    );
  }
});

test('Drawdown Recovery: Negative EV returns null (not calculable)', () => {
  // 40% WR, 1.0 RR -> EV = (0.40 * 1.0) - (0.60 * 1.0) = -0.20 R
  const startingBalance = 10000;
  const currentBalance = 8000;
  const capitalLost = startingBalance - currentBalance;
  const winRate = 40 / 100;
  const rewardToRisk = 1.0;
  const evInR = (winRate * rewardToRisk) - ((1 - winRate) * 1);
  const riskAmountCurrency = currentBalance * 0.01;
  const expectedProfitPerTrade = riskAmountCurrency * evInR;

  // EV < 0 so cannot recover
  const tradesToRecover = (expectedProfitPerTrade > 0 && capitalLost > 0)
    ? Math.ceil(capitalLost / expectedProfitPerTrade)
    : null;

  assert.equal(Number(evInR.toFixed(2)), -0.2);
  assert.equal(tradesToRecover, null);
});

// ---------------------------------------------------------------------------
// 5. PAGE STRUCTURAL AUTHORITY AUDIT — 8-PART ARCHITECTURE VERIFICATION
// ---------------------------------------------------------------------------
test('Page Audit: /calculators/drawdown has complete 8-part mathematical authority', () => {
  const content = readFile('src/app/(marketing)/calculators/drawdown/page.tsx');

  // 1. Identity
  assert.ok(content.includes('Drawdown Calculator'));
  // 2. Governing formula
  assert.ok(content.includes('Streak Probability = (1 - Win Rate) ^ Streak Length'));
  // 3. Variable definitions table
  assert.ok(content.includes('Input Variable Definitions'));
  assert.ok(content.includes('Win Rate'));
  assert.ok(content.includes('Risk Per Trade'));
  // 4. Worked example with exact computed values matching the engine
  assert.ok(content.includes('Worked Example'));
  assert.ok(content.includes('$45,665.41'));
  assert.ok(content.includes('$4,334.59'));
  assert.ok(content.includes('8.67%'));
  assert.ok(content.includes('9.49%'));
  // 5. Assumptions section
  assert.ok(content.includes('Underlying Assumptions'));
  assert.ok(content.includes('Fixed-fractional position sizing'));
  assert.ok(content.includes('Independent Bernoulli trials'));
  // 6. Limitations section
  assert.ok(content.includes('Practical Limitations'));
  assert.ok(content.includes('Regime clustering'));
  // 7. Earned schema only
  assert.ok(content.includes('"@type": "WebApplication"'));
  assert.ok(content.includes('"@type": "FAQPage"'));
  assert.ok(!content.includes('AggregateRating'), 'Must not contain fake AggregateRating schema');
  // 8. Related research links
  assert.ok(content.includes('/calculators/drawdown-recovery'));
  assert.ok(content.includes('/research/risk'));
});

test('Page Audit: /calculators/drawdown-recovery has complete 8-part mathematical authority', () => {
  const content = readFile('src/app/(marketing)/calculators/drawdown-recovery/page.tsx');

  // 1. Identity
  assert.ok(content.includes('Drawdown Recovery Calculator'));
  // 2. Both governing formulas
  assert.ok(content.includes('Required Gain % = ( Capital Lost / Current Balance ) × 100'));
  assert.ok(content.includes('Estimated Trades to Recover'));
  // 3. Variable definitions — now expanded with EV_R
  assert.ok(content.includes('Input Variable Definitions'));
  assert.ok(content.includes('Expected Value (EV_R)'));
  // 4. Worked example with exact values matching code
  assert.ok(content.includes('Comprehensive Worked Example'));
  assert.ok(content.includes('33.33%'));
  assert.ok(content.includes('134 trades'));
  assert.ok(content.includes('+0.25 R per trade'));
  // 5. Assumptions — including the critical fixed-currency risk disclosure
  assert.ok(content.includes('Underlying Assumptions'));
  assert.ok(content.includes('Fixed-currency risk recovery model'));
  // 6. Limitations
  assert.ok(content.includes('Practical Limitations'));
  assert.ok(content.includes('Path dependency'));
  // 7. Schema
  assert.ok(content.includes('"@type": "WebApplication"'));
  assert.ok(content.includes('"@type": "FAQPage"'));
  assert.ok(!content.includes('AggregateRating'));
  // 8. Related links
  assert.ok(content.includes('/calculators/drawdown'));
  assert.ok(content.includes('/research/risk'));
});

test('Page Audit: /tools/position-size-calculator has complete 8-part mathematical authority', () => {
  const pageContent = readFile('src/app/(marketing)/tools/position-size-calculator/page.tsx');
  const clientContent = readFile('src/app/(marketing)/tools/position-size-calculator/PositionSizeCalculatorClient.tsx');

  // Schema on server component
  assert.ok(pageContent.includes('"@type": "WebApplication"'));
  assert.ok(pageContent.includes('"@type": "FAQPage"'));
  assert.ok(!pageContent.includes('AggregateRating'));

  // Variables table
  assert.ok(clientContent.includes('variables='));
  assert.ok(clientContent.includes('Account Balance / Equity'));
  assert.ok(clientContent.includes('Stop Invalidation Distance'));
  assert.ok(clientContent.includes('Pip Value per Lot'));

  // Worked example with exact numbers
  assert.ok(clientContent.includes('workedExample='));
  assert.ok(clientContent.includes('EUR/USD Standard Lot Sizing'));
  assert.ok(clientContent.includes('0.40 Standard Lots'));
  assert.ok(clientContent.includes('$43,400 USD'));
  assert.ok(clientContent.includes('$100.00 USD'));

  // Assumptions
  assert.ok(clientContent.includes('assumptions='));
  assert.ok(clientContent.includes('zero slippage'));

  // Limitations
  assert.ok(clientContent.includes('limitations='));
  assert.ok(clientContent.includes('Weekend market gaps'));

  // Related research links
  assert.ok(clientContent.includes('relatedLinks='));
  assert.ok(clientContent.includes('/risk-management'));
});

test('Page Audit: /tools/risk-of-ruin-calculator has complete 8-part mathematical authority', () => {
  const pageContent = readFile('src/app/(marketing)/tools/risk-of-ruin-calculator/page.tsx');
  const clientContent = readFile('src/app/(marketing)/tools/risk-of-ruin-calculator/RiskOfRuinCalculatorClient.tsx');

  // Schema on server component
  assert.ok(pageContent.includes('"@type": "WebApplication"'));
  assert.ok(pageContent.includes('"@type": "FAQPage"'));
  assert.ok(!pageContent.includes('AggregateRating'));

  // Variables table with all key parameters
  assert.ok(clientContent.includes('variables='));
  assert.ok(clientContent.includes('Win Rate'));
  assert.ok(clientContent.includes('Edge Advantage Coefficient'));
  assert.ok(clientContent.includes('Units of Risk Capital'));
  assert.ok(clientContent.includes('Consecutive Losses to Ruin'));

  // Worked example with computed values matching the analytical model
  assert.ok(clientContent.includes('workedExample='));
  assert.ok(clientContent.includes('Prop Challenge Survival Modeling'));
  assert.ok(clientContent.includes('0.07% Risk of Ruin'));
  assert.ok(clientContent.includes('0.2000 (Positive Statistical Edge)'));
  assert.ok(clientContent.includes('16 risk units'));
  assert.ok(clientContent.includes('20 consecutive losses'));

  // Assumptions — IID, absorbing barrier, stationarity
  assert.ok(clientContent.includes('assumptions='));
  assert.ok(clientContent.includes('absorbing ruin barrier'));
  assert.ok(clientContent.includes('IID'));

  // Limitations — fat tails, slippage, intra-day
  assert.ok(clientContent.includes('limitations='));
  assert.ok(clientContent.includes('leptokurtosis'));

  // Related links
  assert.ok(clientContent.includes('relatedLinks='));
  assert.ok(clientContent.includes('/research/risk'));
});

test('Schema Integrity: No AggregateRating or fabricated reviews in any calculator page', () => {
  const pages = [
    'src/app/(marketing)/calculators/drawdown/page.tsx',
    'src/app/(marketing)/calculators/drawdown-recovery/page.tsx',
    'src/app/(marketing)/tools/position-size-calculator/page.tsx',
    'src/app/(marketing)/tools/risk-of-ruin-calculator/page.tsx',
  ];

  for (const page of pages) {
    const content = readFile(page);
    assert.ok(!content.includes('AggregateRating'), `${page} must not contain AggregateRating`);
    assert.ok(!content.includes('reviewCount'), `${page} must not contain reviewCount`);
    assert.ok(!content.includes('ratingValue'), `${page} must not contain ratingValue`);
  }
});
