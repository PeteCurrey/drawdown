import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface ImportedTrade {
  symbol: string;
  direction: "BUY" | "SELL";
  entry_price: number;
  stop_loss: number;
  position_size_lots: number;
  entry_time: string;
  trading_day: string;
  [key: string]: any;
}

const REQUIRED_FIELDS: (keyof ImportedTrade)[] = [
  "symbol",
  "direction",
  "entry_price",
  "stop_loss",
  "position_size_lots",
  "entry_time",
  "trading_day",
];

const BATCH_SIZE = 20;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { trades = [] } = body as { trades: ImportedTrade[] };

    if (!Array.isArray(trades) || trades.length === 0) {
      return NextResponse.json({ error: "trades array is required" }, { status: 400 });
    }

    let imported = 0;
    let failed = 0;
    const errors: string[] = [];
    const insertedIds: string[] = [];

    // Process in batches of 20
    for (let batchStart = 0; batchStart < trades.length; batchStart += BATCH_SIZE) {
      const batch = trades.slice(batchStart, batchStart + BATCH_SIZE);

      // Validate and sanitise each row in the batch
      const validRows: any[] = [];
      for (let i = 0; i < batch.length; i++) {
        const trade = batch[i];
        const globalIndex = batchStart + i;

        // Check required fields
        const missing = REQUIRED_FIELDS.filter(
          (f) => trade[f] === undefined || trade[f] === null || trade[f] === ""
        );
        if (missing.length > 0) {
          failed++;
          errors.push(`Row ${globalIndex + 1}: missing ${missing.join(", ")}`);
          continue;
        }

        // Validate direction
        if (!["BUY", "SELL"].includes(trade.direction)) {
          failed++;
          errors.push(`Row ${globalIndex + 1}: direction must be BUY or SELL`);
          continue;
        }

        // Strip any incoming user_id and force auth user
        const { user_id: _uid, id: _id, created_at: _ca, ...rest } = trade;
        validRows.push({ ...rest, user_id: user.id });
      }

      if (validRows.length === 0) continue;

      const { data: inserted, error: insertError } = await (supabase as any)
        .from("trade_entries")
        .insert(validRows)
        .select("id");

      if (insertError) {
        failed += validRows.length;
        errors.push(`Batch ${Math.floor(batchStart / BATCH_SIZE) + 1} insert error: ${insertError.message}`);
      } else {
        imported += validRows.length;
        for (const row of inserted ?? []) {
          if (row?.id) insertedIds.push(row.id);
        }
      }
    }

    // Fire-and-forget AI verdict for first 10 imported trades
    const verdictIds = insertedIds.slice(0, 10);
    if (verdictIds.length > 0) {
      // Fetch the actual trade rows to pass to the verdict endpoint
      (async () => {
        try {
          const { data: tradeRows } = await (supabase as any)
            .from("trade_entries")
            .select("*")
            .in("id", verdictIds);

          for (const trade of tradeRows ?? []) {
            try {
              await fetch(
                `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/journal/ai-verdict`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    trade_id: trade.id,
                    trade,
                    recent_trades: [],
                  }),
                }
              );
            } catch {
              // fire-and-forget — ignore individual failures
            }
          }
        } catch {
          // fire-and-forget — ignore
        }
      })();
    }

    return NextResponse.json({ imported, failed, errors });
  } catch (e: any) {
    console.error("POST /api/journal/import-csv error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
