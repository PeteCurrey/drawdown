/**
 * /api/cron/check-price-alerts
 *
 * Evaluates all active price_alerts against current market prices and fires
 * notifications when a trigger condition is met.
 *
 * Scheduled in vercel.json: every 5 minutes Mon–Fri 09:00–17:00 UTC.
 * Can also be triggered manually: GET /api/cron/check-price-alerts?secret=CRON_SECRET
 *
 * Data source: getMarketPrices() from @/lib/market — uses TwelveData when
 * TWELVEDATA_API_KEY is set, falling back to Frankfurter (forex) + CoinGecko
 * (crypto). Metal and index alerts require TwelveData; without it the cron will
 * log a warning per symbol it can't price and leave those alerts active.
 *
 * Alert notification channels:
 * - In-app: always — inserts a row into the notifications table
 * - Email: only when the user has emailOnTrigger: true in their alert prefs
 *   (drawdown_alert_prefs localStorage key, mirrored server-side when the
 *    user_alert_settings table is available — not yet implemented)
 */

import { NextRequest, NextResponse } from "next/server";
import { createInternalSupabase } from "@/lib/supabase/server";
import { getMarketPrices } from "@/lib/market";
import { Resend } from "resend";

// ─── Helpers ──────────────────────────────────────────────────────────────

/** Auth check consistent with all other Drawdown cron routes. */
function isAuthorised(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const querySecret = new URL(request.url).searchParams.get("secret");
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return (
    authHeader === `Bearer ${secret}` ||
    querySecret === secret
  );
}

// ─── Handler ──────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  if (!isAuthorised(request)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createInternalSupabase();
  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

  console.log("[check-price-alerts] Starting price check —", new Date().toISOString());

  // ── 1. Fetch all active, untriggered alerts ──────────────────────────────
  const { data: activeAlerts, error: alertsError } = await supabase
    .from("price_alerts")
    .select("id, user_id, symbol, trigger_price, trigger_condition")
    .eq("is_active", true)
    .is("triggered_at", null);

  if (alertsError) {
    console.error("[check-price-alerts] Failed to fetch alerts:", alertsError.message);
    return NextResponse.json({ error: alertsError.message }, { status: 500 });
  }

  if (!activeAlerts || activeAlerts.length === 0) {
    console.log("[check-price-alerts] No active alerts. Done.");
    return NextResponse.json({ message: "No active alerts", triggered: 0 });
  }

  console.log(`[check-price-alerts] ${activeAlerts.length} active alert(s) to check.`);

  // ── 2. Deduplicate symbols and fetch prices ──────────────────────────────
  const uniqueSymbols = [...new Set(activeAlerts.map((a) => a.symbol))];

  let prices: { symbol: string; price: number }[] = [];
  try {
    const raw = await getMarketPrices(uniqueSymbols);
    prices = raw
      .filter((p) => typeof p.price === "number" && !isNaN(p.price))
      .map((p) => ({ symbol: p.symbol, price: p.price }));
  } catch (err: any) {
    console.error("[check-price-alerts] getMarketPrices failed:", err.message);
    // Don't hard-fail — log and continue with whatever prices we have
  }

  const priceMap = new Map(prices.map((p) => [p.symbol, p.price]));

  // Log any symbols we couldn't price
  for (const sym of uniqueSymbols) {
    if (!priceMap.has(sym)) {
      console.warn(
        `[check-price-alerts] No price for ${sym} — alert(s) left active. ` +
        "(Metals/indices require TWELVEDATA_API_KEY.)"
      );
    }
  }

  // ── 3. Evaluate each alert ───────────────────────────────────────────────
  let triggered = 0;
  const triggeredAt = new Date().toISOString();

  for (const alert of activeAlerts) {
    const currentPrice = priceMap.get(alert.symbol);

    if (currentPrice === undefined) {
      // Can't evaluate — skip, leave alert active for next run
      continue;
    }

    const triggerPrice = Number(alert.trigger_price);
    const shouldFire =
      (alert.trigger_condition === "above" && currentPrice >= triggerPrice) ||
      (alert.trigger_condition === "below" && currentPrice <= triggerPrice);

    if (!shouldFire) continue;

    console.log(
      `[check-price-alerts] TRIGGERED: ${alert.symbol} ` +
      `${alert.trigger_condition} ${triggerPrice} — current: ${currentPrice}`
    );

    // ── 3a. Mark alert as triggered ────────────────────────────────────────
    const { error: updateError } = await supabase
      .from("price_alerts")
      .update({ triggered_at: triggeredAt, is_active: false })
      .eq("id", alert.id);

    if (updateError) {
      console.error(
        `[check-price-alerts] Failed to update alert ${alert.id}:`,
        updateError.message
      );
      continue;
    }

    // ── 3b. Insert in-app notification ────────────────────────────────────
    const directionWord = alert.trigger_condition === "above" ? "risen above" : "fallen below";
    const notifTitle = `Price Alert: ${alert.symbol}`;
    const notifMessage =
      `${alert.symbol} has ${directionWord} your alert level of ` +
      `${Number(triggerPrice).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 5 })}.`;

    const { error: notifError } = await supabase
      .from("notifications")
      .insert({
        user_id: alert.user_id,
        type: "price_alert",
        title: notifTitle,
        message: notifMessage,
        action_url: "/dashboard",
      });

    if (notifError) {
      // Non-fatal — alert is already marked triggered, notification is cosmetic
      console.warn(
        `[check-price-alerts] notification insert failed for alert ${alert.id}:`,
        notifError.message
      );
    }

    // ── 3c. Email — only if the user's email pref is enabled ──────────────
    // Phase 5: email preference is stored client-side in localStorage.
    // Server-side email sending is opt-in at the route level and currently
    // defaults to off. When a user_alert_settings table is added, this block
    // should query it before sending.
    //
    // For now: skip email unless ALERT_EMAIL_DEFAULT_ON is explicitly set to "true"
    // in environment variables (allowing platform-wide override for testing).
    const emailDefaultOn = process.env.ALERT_EMAIL_DEFAULT_ON === "true";
    if (emailDefaultOn && resend) {
      // Fetch the user's email from auth.users (service role required)
      const { data: authUser } = await supabase.auth.admin.getUserById(alert.user_id);
      const email = authUser?.user?.email;

      if (email) {
        try {
          await resend.emails.send({
            from: "Drawdown Alerts <alerts@drawdown.trading>",
            to: email,
            subject: notifTitle,
            html: `
              <div style="font-family: monospace; max-width: 480px; margin: 0 auto; padding: 32px; background: #0A0A0A; color: #FFFFFF; border: 1px solid #1A1A1A;">
                <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #6B7280; margin-bottom: 24px;">
                  Signal_Centre_v2 // Drawdown
                </p>
                <h1 style="font-size: 20px; text-transform: uppercase; margin-bottom: 8px;">${notifTitle}</h1>
                <p style="font-size: 13px; color: #D1D5DB; line-height: 1.6; margin-bottom: 24px;">${notifMessage}</p>
                <p style="font-size: 10px; color: #6B7280;">
                  Current price: <strong style="color: #FFFFFF;">${currentPrice.toLocaleString("en-GB", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 5,
                  })}</strong>
                </p>
                <p style="font-size: 9px; color: #4B5563; margin-top: 32px; border-top: 1px solid #1A1A1A; padding-top: 16px;">
                  This alert was set on your Drawdown dashboard. You can manage alerts at drawdown.trading/dashboard.
                  Not financial advice.
                </p>
              </div>
            `,
          });
          console.log(`[check-price-alerts] Email sent to ${email} for alert ${alert.id}`);
        } catch (emailErr: any) {
          console.error(`[check-price-alerts] Email failed for alert ${alert.id}:`, emailErr.message);
        }
      }
    }

    triggered++;
  }

  console.log(
    `[check-price-alerts] Done. Triggered: ${triggered}/${activeAlerts.length} alerts.`
  );

  return NextResponse.json({
    message: "Price alert check complete",
    checked: activeAlerts.length,
    triggered,
    priced: prices.length,
    unpriceable: uniqueSymbols.length - prices.length,
    timestamp: triggeredAt,
  });
}
