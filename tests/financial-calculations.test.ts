import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculatePositionSize,
  resolveInstrumentSpec,
  POSITION_INSTRUMENT_SPECS,
} from '../src/lib/position-sizing.ts';
import type { PositionCalculationInput } from '../src/lib/position-sizing.ts';

test('Financial Calculations: resolveInstrumentSpec correctly classifies asset classes', () => {
  assert.equal(resolveInstrumentSpec('EUR/USD').id, 'forex-major');
  assert.equal(resolveInstrumentSpec('GBPUSD').id, 'forex-major');
  assert.equal(resolveInstrumentSpec('USD/JPY').id, 'forex-minor');
  assert.equal(resolveInstrumentSpec('GBPJPY').id, 'forex-minor');
  assert.equal(resolveInstrumentSpec('XAUUSD').id, 'commodity');
  assert.equal(resolveInstrumentSpec('GOLD').id, 'commodity');
  assert.equal(resolveInstrumentSpec('USOIL').id, 'commodity');
  assert.equal(resolveInstrumentSpec('BTC/USD').id, 'crypto');
  assert.equal(resolveInstrumentSpec('ETHUSDT').id, 'crypto');
  assert.equal(resolveInstrumentSpec('SPX500').id, 'index-pts');
  assert.equal(resolveInstrumentSpec('US30').id, 'index-pts');
  assert.equal(resolveInstrumentSpec('NAS100').id, 'index-pts');
  assert.equal(resolveInstrumentSpec('UK100').id, 'index-pts');
  assert.equal(resolveInstrumentSpec('USD/ZAR').id, 'forex-exotic');
  // Fallback for empty
  assert.equal(resolveInstrumentSpec('').id, 'forex-major');
});

test('Financial Calculations: Long position sizing and R:R calculations are mathematically correct', () => {
  // EUR/USD Long: Balance £10,000, 1% risk (£100)
  // Entry: 1.0800, Stop: 1.0750 (50 pips), Target: 1.0950 (150 pips) -> R:R 3.0
  const input: PositionCalculationInput = {
    instrument: 'EUR/USD',
    direction: 'long',
    entryPrice: 1.0800,
    stopPrice: 1.0750,
    targetPrice: 1.0950,
    accountBalance: 10000,
    riskPct: 1,
  };

  const res = calculatePositionSize(input);
  assert.equal(res.isValid, true);
  assert.equal(res.errors.length, 0);
  assert.equal(res.cashRisk, 100);
  assert.equal(res.rewardRiskRatio, 3.0);
  assert.equal(res.stopPips, 50);
  assert.equal(res.rewardPips, 150);
  // Divisor = 50 pips * £10/pip = £500
  // Lots = 100 / 500 = 0.20 lots
  assert.equal(res.lots, 0.2);
  assert.equal(res.units, 20000);
  assert.equal(res.cashReward, 300);
  assert.equal(res.drawdownImpactPct, 1.0);
});

test('Financial Calculations: Short position sizing and R:R calculations are mathematically correct', () => {
  // GBP/USD Short: Balance £50,000, 0.5% risk (£250)
  // Entry: 1.2600, Stop: 1.2650 (50 pips), Target: 1.2450 (150 pips) -> R:R 3.0
  const input: PositionCalculationInput = {
    instrument: 'GBP/USD',
    direction: 'short',
    entryPrice: 1.2600,
    stopPrice: 1.2650,
    targetPrice: 1.2450,
    accountBalance: 50000,
    riskPct: 0.5,
  };

  const res = calculatePositionSize(input);
  assert.equal(res.isValid, true);
  assert.equal(res.cashRisk, 250);
  assert.equal(res.rewardRiskRatio, 3.0);
  assert.equal(res.stopPips, 50);
  assert.equal(res.lots, 0.5);
  assert.equal(res.cashReward, 750);
});

test('Financial Calculations: JPY pair precision and multiplier calculation', () => {
  // USD/JPY Long: Mult 100, Pip 10
  // Entry: 150.00, Stop: 149.50 (50 pips), Target: 151.00 (100 pips)
  const input: PositionCalculationInput = {
    instrument: 'USD/JPY',
    direction: 'long',
    entryPrice: 150.00,
    stopPrice: 149.50,
    targetPrice: 151.00,
    accountBalance: 20000,
    riskPct: 1, // £200
  };

  const res = calculatePositionSize(input);
  assert.equal(res.isValid, true);
  assert.equal(res.stopPips, 50);
  assert.equal(res.rewardRiskRatio, 2.0);
  assert.equal(res.lots, 0.4);
});

test('Financial Calculations: Commodity / Gold (XAUUSD) position sizing', () => {
  // Gold Long: Mult 10, Pip 1
  // Entry: 2500.00, Stop: 2490.00 ($10 distance = 100 pips), Target: 2530.00
  const input: PositionCalculationInput = {
    instrument: 'XAU/USD',
    direction: 'long',
    entryPrice: 2500.00,
    stopPrice: 2490.00,
    targetPrice: 2530.00,
    accountBalance: 100000,
    riskPct: 1, // £1000
  };

  const res = calculatePositionSize(input);
  assert.equal(res.isValid, true);
  assert.equal(res.stopPips, 100);
  assert.equal(res.rewardRiskRatio, 3.0);
  // Divisor = 100 pips * 1 = 100
  // Lots = 1000 / 100 = 10 lots
  assert.equal(res.lots, 10);
});

test('Financial Calculations: Rejects invalid geometry (Long: stop >= entry, target <= entry)', () => {
  const invalidLongStop = calculatePositionSize({
    instrument: 'EUR/USD',
    direction: 'long',
    entryPrice: 1.0800,
    stopPrice: 1.0850, // Invalid: Stop above entry on long
    targetPrice: 1.0950,
    accountBalance: 10000,
  });
  assert.equal(invalidLongStop.isValid, false);
  assert.ok(invalidLongStop.errors.some((e) => e.includes('stop loss must be placed strictly below')));

  const invalidLongTarget = calculatePositionSize({
    instrument: 'EUR/USD',
    direction: 'long',
    entryPrice: 1.0800,
    stopPrice: 1.0750,
    targetPrice: 1.0790, // Invalid: Target below entry on long
    accountBalance: 10000,
  });
  assert.equal(invalidLongTarget.isValid, false);
  assert.ok(invalidLongTarget.errors.some((e) => e.includes('target must be placed strictly above')));
});

test('Financial Calculations: Rejects invalid geometry (Short: stop <= entry, target >= entry)', () => {
  const invalidShortStop = calculatePositionSize({
    instrument: 'EUR/USD',
    direction: 'short',
    entryPrice: 1.0800,
    stopPrice: 1.0750, // Invalid: Stop below entry on short
    targetPrice: 1.0700,
    accountBalance: 10000,
  });
  assert.equal(invalidShortStop.isValid, false);
  assert.ok(invalidShortStop.errors.some((e) => e.includes('stop loss must be placed strictly above')));

  const invalidShortTarget = calculatePositionSize({
    instrument: 'EUR/USD',
    direction: 'short',
    entryPrice: 1.0800,
    stopPrice: 1.0850,
    targetPrice: 1.0820, // Invalid: Target above entry on short
    accountBalance: 10000,
  });
  assert.equal(invalidShortTarget.isValid, false);
  assert.ok(invalidShortTarget.errors.some((e) => e.includes('target must be placed strictly below')));
});

test('Financial Calculations: Handles boundary and non-finite edge cases gracefully', () => {
  // Zero balance
  const zeroBalance = calculatePositionSize({
    instrument: 'EUR/USD',
    direction: 'long',
    entryPrice: 1.0800,
    stopPrice: 1.0750,
    targetPrice: 1.0950,
    accountBalance: 0,
  });
  assert.equal(zeroBalance.isValid, false);
  assert.ok(zeroBalance.errors.some((e) => e.includes('balance must be greater than zero')));

  // Negative prices
  const negativePrice = calculatePositionSize({
    instrument: 'EUR/USD',
    direction: 'long',
    entryPrice: -1.0800,
    stopPrice: 1.0750,
    targetPrice: 1.0950,
    accountBalance: 10000,
  });
  assert.equal(negativePrice.isValid, false);

  // NaN values
  const nanPrice = calculatePositionSize({
    instrument: 'EUR/USD',
    direction: 'long',
    entryPrice: NaN,
    stopPrice: 1.0750,
    targetPrice: 1.0950,
    accountBalance: 10000,
  });
  assert.equal(nanPrice.isValid, false);

  // Infinity values
  const infPrice = calculatePositionSize({
    instrument: 'EUR/USD',
    direction: 'long',
    entryPrice: 1.0800,
    stopPrice: Infinity,
    targetPrice: 1.0950,
    accountBalance: 10000,
  });
  assert.equal(infPrice.isValid, false);

  // Excessive risk (> 100%)
  const highRisk = calculatePositionSize({
    instrument: 'EUR/USD',
    direction: 'long',
    entryPrice: 1.0800,
    stopPrice: 1.0750,
    targetPrice: 1.0950,
    accountBalance: 10000,
    riskPct: 150,
  });
  assert.equal(highRisk.isValid, false);
  assert.ok(highRisk.errors.some((e) => e.includes('cannot exceed 100%')));

  // Negative / zero risk defaults safely to 1% fallback
  const zeroRisk = calculatePositionSize({
    instrument: 'EUR/USD',
    direction: 'long',
    entryPrice: 1.0800,
    stopPrice: 1.0750,
    targetPrice: 1.0950,
    accountBalance: 10000,
    riskPct: -5,
  });
  // Safe default UX fallback to 1%
  assert.equal(zeroRisk.isValid, true);
  assert.equal(zeroRisk.riskPct, 1.0);
});

test('Financial Calculations: Prop firm account limit & drawdown safeguard checks', () => {
  // Balance £100,000, Daily loss limit 4% (£4,000), Max drawdown limit 8% (£8,000)
  // Already lost today £3,500
  // Planning a trade with 1% risk (£1,000) -> Total today risk = £4,500 > £4,000 limit -> warning/limit triggered
  const res = calculatePositionSize({
    instrument: 'EUR/USD',
    direction: 'long',
    entryPrice: 1.0800,
    stopPrice: 1.0750,
    targetPrice: 1.0950,
    accountBalance: 100000,
    riskPct: 1,
    accountLimits: {
      dailyLossLimitPct: 4,
      maxDrawdownLimitPct: 8,
      todayLoss: 3500,
    },
  });

  assert.equal(res.isValid, true);
  assert.equal(res.isWithinDailyLimit, false);
  assert.ok(res.warnings.some((w) => w.includes('beyond account daily loss limit')));
});
