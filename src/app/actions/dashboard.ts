"use server";

import { createClient } from "@/lib/supabase/server";
import { FundedAccount, AccountSnapshot, IndividualTrade, DashboardSummary } from "@/types/dashboard";
import { calculateAccountHealth } from "@/lib/dashboard/health";
import { Resend } from "resend";
import { revalidatePath } from "next/cache";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Creates a new funded account in Supabase
 */
export async function createFundedAccount(formData: Partial<FundedAccount>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("funded_accounts")
    .insert([{
      ...formData,
      user_id: user.id,
      updated_at: new Date().toISOString()
    }])
    .select("*, prop_firms(*)")
    .single();

  if (error) {
    console.error("Error creating account:", error);
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/accounts");
  return data;
}

/**
 * Imports a batch of trades and triggers a health recalculation
 */
export async function importTrades(accountId: string, trades: Partial<IndividualTrade>[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const tradesToInsert = trades.map(trade => ({
    ...trade,
    account_id: accountId,
    user_id: user.id
  }));

  const { error: insertError } = await supabase
    .from("individual_trades")
    .insert(tradesToInsert);

  if (insertError) {
    console.error("Error importing trades:", insertError);
    throw new Error(insertError.message);
  }

  // Update account's last sync time
  await supabase
    .from("funded_accounts")
    .update({ last_sync_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", accountId);

  // Recalculate health snapshot
  await recalculateAccountSnapshot(accountId);
  
  revalidatePath("/dashboard/accounts");
  return { success: true };
}

/**
 * Recalculates the latest metrics for an account and saves a snapshot
 */
export async function recalculateAccountSnapshot(accountId: string) {
  const supabase = await createClient();
  
  // Fetch account and all its trades
  const { data: account, error: accError } = await supabase
    .from("funded_accounts")
    .select("*, prop_firms(*)")
    .eq("id", accountId)
    .single();

  if (accError || !account) throw new Error("Account not found");

  const { data: trades, error: tradeError } = await supabase
    .from("individual_trades")
    .select("*")
    .eq("account_id", accountId);

  if (tradeError) throw new Error("Could not fetch trades");

  // Calculate current balance/equity from trades
  const netPnl = trades.reduce((sum, trade) => sum + (trade.net_pnl || 0), 0);
  const currentBalance = Number(account.account_size) + netPnl;

  // Today's PnL
  const today = new Date().toISOString().split('T')[0];
  const todayPnl = trades
    .filter(t => t.exit_time?.startsWith(today))
    .reduce((sum, t) => sum + (t.net_pnl || 0), 0);

  // Use health logic
  const health = calculateAccountHealth(account as any, currentBalance);

  const snapshotData = {
    account_id: accountId,
    balance: currentBalance,
    equity: currentBalance, // Assumption: all trades closed for now
    daily_pnl: todayPnl,
    daily_loss_used_pct: health.dailyLossUsedPct,
    max_drawdown_used_pct: health.maxDrawdownUsedPct,
    drawdown_remaining: health.drawdownRemaining,
    snapshot_date: today,
    snapshot_time: new Date().toISOString()
  };

  const { data: snapshot, error: snapError } = await supabase
    .from("funded_account_snapshots")
    .insert([snapshotData])
    .select()
    .single();

  if (snapError) {
    console.error("Error creating snapshot:", snapError);
    throw new Error(snapError.message);
  }

  // Update account balance
  await supabase
    .from("funded_accounts")
    .update({ current_balance: currentBalance, updated_at: new Date().toISOString() })
    .eq("id", accountId);

  // Check thresholds
  await checkAlertThresholds(accountId, snapshot);

  return snapshot;
}

/**
 * Checks for risk thresholds and sends alerts
 */
export async function checkAlertThresholds(accountId: string, snapshot: any) {
  const supabase = await createClient();
  const { data: account } = await supabase.from("funded_accounts").select("*, prop_firms(*)").eq("id", accountId).single();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!account || !user) return;

  const thresholds = [
    { key: 'daily_loss_used_pct', amber: 50, red: 75, breach: 100 },
    { key: 'max_drawdown_used_pct', amber: 50, red: 75, breach: 100 }
  ];

  for (const t of thresholds) {
    const val = Number(snapshot[t.key]);
    let type: string | null = null;
    let severity = "";

    if (val >= t.breach) {
        type = 'breach';
        severity = "BREACHED";
    } else if (val >= t.red) {
        type = t.key.includes('daily') ? 'daily_loss_red' : 'drawdown_red';
        severity = "CRITICAL (75%+)";
    } else if (val >= t.amber) {
        type = t.key.includes('daily') ? 'daily_loss_amber' : 'drawdown_amber';
        severity = "WARNING (50%+)";
    }

    if (type) {
      // Check if alert already sent today for this type
      const today = new Date().toISOString().split('T')[0];
      const { data: existing } = await supabase
        .from("account_alerts")
        .select("id")
        .eq("account_id", accountId)
        .eq("alert_type", type)
        .gte("triggered_at", today)
        .limit(1);

      if (!existing || existing.length === 0) {
        const message = `${account.account_name} — ${t.key.replace(/_/g, ' ')} has reached ${val.toFixed(1)}% (${severity}).`;
        
        await supabase.from("account_alerts").insert([{
          account_id: accountId,
          user_id: user.id,
          alert_type: type,
          message: message
        }]);

        // Send Email via Resend
        if (process.env.RESEND_API_KEY) {
          await resend.emails.send({
            from: "Pete | Drawdown <alerts@drawdown.trading>",
            to: user.email!,
            subject: `⚠️ ${account.account_name} — ${severity}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
                <h2 style="color: #FF4B4B; text-transform: uppercase;">Risk Alert: ${severity}</h2>
                <p>Hello,</p>
                <p>Your funded account <strong>${account.account_name}</strong> at <strong>${account.prop_firms.name}</strong> has crossed a risk threshold.</p>
                <div style="background: #f9f9f9; padding: 20px; margin: 20px 0;">
                  <p><strong>Metric:</strong> ${t.key.replace(/_/g, ' ').toUpperCase()}</p>
                  <p><strong>Value:</strong> ${val.toFixed(1)}%</p>
                  <p><strong>Remaining Drawdown:</strong> $${Number(snapshot.drawdown_remaining).toFixed(2)}</p>
                </div>
                <a href="https://drawdown.trading/dashboard/accounts" style="display: inline-block; background: #000; color: #fff; padding: 15px 30px; text-decoration: none; font-weight: bold; text-transform: uppercase; font-size: 12px;">Open Dashboard</a>
                <p style="font-size: 10px; color: #999; margin-top: 40px;">This is an automated risk alert from Drawdown. Please manage your positions accordingly.</p>
              </div>
            `
          });
        }
      }
    }
  }
}

/**
 * Fetches all accounts with their latest snapshots for the user
 */
export async function getAccountsWithSnapshots() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("funded_accounts")
    .select(`
      *,
      prop_firms (*),
      funded_account_snapshots (
        *
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching accounts:", error);
    return [];
  }

  // Only keep the latest snapshot for each account
  return data.map(account => ({
    ...account,
    latest_snapshot: account.funded_account_snapshots.sort((a: any, b: any) => 
      new Date(b.snapshot_time).getTime() - new Date(a.snapshot_time).getTime()
    )[0] || null
  }));
}

/**
 * Acknowledges an alert
 */
export async function acknowledgeAlert(alertId: string) {
  const supabase = await createClient();
  await supabase
    .from("account_alerts")
    .update({ acknowledged: true })
    .eq("id", alertId);
  
  revalidatePath("/dashboard");
}
