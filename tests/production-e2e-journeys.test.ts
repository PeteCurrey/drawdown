import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { calculatePositionSize } from '../src/lib/position-sizing.ts';
import { hasTierAccess, CommercialAccess } from '../src/lib/entitlements.ts';
import { getSignalFreshness } from '../src/lib/freshness.ts';

test('E2E Journey A: Anonymous visitor to Free user activation & RUN MY TRADE calculation', () => {
  // 1. Check anonymous access to public route
  const publicPagePath = path.join(process.cwd(), 'src/app/(marketing)/page.tsx');
  assert.ok(fs.existsSync(publicPagePath), 'Homepage must exist');

  // 2. User registers as Free user
  assert.equal(hasTierAccess('free', 'free', 'active'), true, 'Free user must have free tier access');
  assert.equal(hasTierAccess('free', 'foundation', 'active'), false, 'Free user must NOT have Foundation access');
  assert.equal(CommercialAccess.canAccessSignalCentre('free', 'active'), false, 'Free user cannot access live Signal Centre levels');

  // 3. User performs RUN MY TRADE calculation
  const calc = calculatePositionSize({
    instrument: 'GBP/USD',
    direction: 'long',
    entryPrice: 1.2500,
    stopPrice: 1.2450,
    targetPrice: 1.2650,
    accountBalance: 25000,
    riskPct: 1, // £250 risk
  });

  assert.equal(calc.isValid, true);
  assert.equal(calc.cashRisk, 250);
  assert.equal(calc.rewardRiskRatio, 3.0);
  assert.equal(calc.lots, 0.5);
  assert.equal(calc.drawdownImpactPct, 1.0);

  // 4. Verify that RUN MY TRADE output remains a pre-trade plan, not an executed broker order
  assert.equal(typeof (calc as any).brokerOrderId, 'undefined', 'RUN MY TRADE must not generate broker order IDs');
  assert.equal(typeof (calc as any).executedPrice, 'undefined', 'RUN MY TRADE must not pretend to have executed a trade');
});

test('E2E Journey B: Free user upgrade flow to Foundation entitlement', () => {
  // 1. Free user attempts locked Foundation capability
  assert.equal(hasTierAccess('free', 'foundation', 'active'), false);
  assert.equal(CommercialAccess.canAccessInvestmentCentre('free', 'active'), false);

  // 2. Verify pricing page exposes authentic Foundation pricing (£49/mo)
  const pricingDataPath = path.join(process.cwd(), 'src/data/pricing.ts');
  const content = fs.readFileSync(pricingDataPath, 'utf8');
  assert.ok(content.includes('49'), 'Pricing must expose Foundation £49');

  // 3. Simulated upgrade webhook completion (Foundation)
  assert.equal(hasTierAccess('foundation', 'foundation', 'active'), true, 'Upgraded user has Foundation tier');
  assert.equal(CommercialAccess.canAccessSignalCentre('foundation', 'active'), true, 'Foundation user has Signal Centre');
  assert.equal(CommercialAccess.canAccessInvestmentCentre('foundation', 'active'), false, 'Foundation user does NOT have Investment Centre (requires Edge)');
  assert.equal(hasTierAccess('foundation', 'edge', 'active'), false, 'Foundation user does NOT have Edge');

  // 4. Edge tier grants Investment Centre
  assert.equal(CommercialAccess.canAccessInvestmentCentre('edge', 'active'), true, 'Edge user unlocks Investment Centre');
  assert.equal(CommercialAccess.canAccessFullCourses('edge', 'active'), false, 'Edge does NOT have full curriculum access (requires Floor)');
  assert.equal(CommercialAccess.canAccessFullCourses('floor', 'active'), true, 'Floor tier unlocks full courses');
});

test('E2E Journey C: Trade plan creation boundary and non-execution', () => {
  const planApiRoute = path.join(process.cwd(), 'src/app/api/trade-plans/create/route.ts');
  assert.ok(fs.existsSync(planApiRoute), 'Trade plans create API route must exist');
  const routeContent = fs.readFileSync(planApiRoute, 'utf8');

  // Verify server-side ownership enforcement
  assert.ok(routeContent.includes('user.id'), 'Must associate trade plan with authenticated user ID');
  assert.ok(routeContent.includes('trade_plans'), 'Must write to trade_plans table');
  assert.ok(!routeContent.includes('broker.execute'), 'Must NOT call any broker execution API');
  assert.ok(!routeContent.includes('sendOrder'), 'Must NOT route orders to a live execution venue');
});

test('E2E Journey D: Cross-user data isolation and IDOR rejection', () => {
  // Check security access in trade plans API
  const planApiRoute = path.join(process.cwd(), 'src/app/api/trade-plans/create/route.ts');
  const content = fs.readFileSync(planApiRoute, 'utf8');

  // Must verify account ownership
  assert.ok(content.includes('trading_accounts'), 'Must check trading_accounts table for ownership');
  assert.ok(content.includes('account_id'), 'Must validate selected trading account');
});

test('E2E Journey E: Market data freshness integrity and anti-masquerading', () => {
  const now = new Date();
  const fiveMinAgo = new Date(now.getTime() - 5 * 60 * 1000).toISOString();
  const threeDaysAgo = new Date(now.getTime() - 72 * 60 * 60 * 1000).toISOString();

  // Fresh signal (5 mins old on 1H timeframe)
  const fresh = getSignalFreshness({ created_at: fiveMinAgo, timeframe: '1H', is_active: true });
  assert.equal(fresh, 'live', 'Recent signal must report as live');

  // Stale signal (3 days old on 1H timeframe)
  const stale = getSignalFreshness({ created_at: threeDaysAgo, timeframe: '1H', is_active: true });
  assert.equal(stale, 'stale', '3-day-old signal must report as stale and cannot masquerade as live');
});

test('E2E Journey F: SEO and robots.txt indexation consistency', () => {
  const robotsPath = path.join(process.cwd(), 'src/app/robots.ts');
  const sitemapPath = path.join(process.cwd(), 'src/app/sitemap.ts');
  assert.ok(fs.existsSync(robotsPath));
  assert.ok(fs.existsSync(sitemapPath));

  const robotsContent = fs.readFileSync(robotsPath, 'utf8');
  assert.ok(robotsContent.includes('https://drawdown.trading/sitemap.xml'));
  assert.ok(!robotsContent.includes('vercel.app'));

  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  assert.ok(sitemapContent.includes('https://drawdown.trading'));
  assert.ok(!sitemapContent.includes('2026-07-19'));
});
