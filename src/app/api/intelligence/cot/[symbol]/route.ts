import { NextResponse } from "next/server";

const CFTC_BASE =
  "https://publicreporting.cftc.gov/api/odata/v1/MarketsandFinancialData.MarketsandFinancial.MarketsandFinancialCombined";

/** Scanner slug → CFTC contract market code */
const COT_MAP: Record<string, { code: string; name: string }> = {
  EURUSD:  { code: "099741", name: "EURO FX" },
  GBPUSD:  { code: "096742", name: "BRITISH POUND STERLING" },
  USDJPY:  { code: "097741", name: "JAPANESE YEN" },
  GBPJPY:  { code: "096742", name: "BRITISH POUND STERLING" },
  XAGUSD:  { code: "084691", name: "SILVER" },
  BTCUSDT: { code: "133741", name: "BITCOIN" },
  NDX:     { code: "20974+", name: "NASDAQ-100 STOCK INDEX" },
  SPX:     { code: "13874A", name: "S&P 500 STOCK INDEX" },
  DJI:     { code: "124603", name: "DOW JONES INDUSTRIAL AVERAGE" },
  UKX:     { code: "096742", name: "BRITISH POUND STERLING" },
};

const SELECT = [
  "Report_Date_as_YYYY_MM_DD",
  "Open_Interest_All",
  "NonComm_Positions_Long_All",
  "NonComm_Positions_Short_All",
  "Comm_Positions_Long_All",
  "Comm_Positions_Short_All",
  "NonRept_Positions_Long_All",
  "NonRept_Positions_Short_All",
].join(",");

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const slug = symbol.toUpperCase();
  const mapping = COT_MAP[slug];

  if (!mapping) {
    return NextResponse.json({ error: `No COT mapping for ${slug}` }, { status: 404 });
  }

  try {
    const filterStr = `CFTC_Contract_Market_Code eq '${mapping.code}'`;
    const url = [
      CFTC_BASE,
      `?$top=52`,
      `&$orderby=Report_Date_as_YYYY_MM_DD desc`,
      `&$filter=${encodeURIComponent(filterStr)}`,
      `&$select=${SELECT}`,
    ].join("");

    const res = await fetch(url, { next: { revalidate: 86400 } }); // 24h cache
    if (!res.ok) throw new Error(`CFTC API ${res.status}: ${await res.text()}`);

    const json = await res.json();
    const rows: any[] = json.value ?? [];
    if (rows.length === 0) {
      return NextResponse.json({ error: "CFTC returned no rows" }, { status: 503 });
    }

    const parsed = rows.map((r: any) => ({
      date:          (r.Report_Date_as_YYYY_MM_DD ?? "").substring(0, 10),
      open_interest: +(r.Open_Interest_All               ?? 0),
      noncomm_long:  +(r.NonComm_Positions_Long_All      ?? 0),
      noncomm_short: +(r.NonComm_Positions_Short_All     ?? 0),
      comm_long:     +(r.Comm_Positions_Long_All         ?? 0),
      comm_short:    +(r.Comm_Positions_Short_All        ?? 0),
      retail_long:   +(r.NonRept_Positions_Long_All      ?? 0),
      retail_short:  +(r.NonRept_Positions_Short_All     ?? 0),
    }));

    const latest = parsed[0];
    const prev   = parsed[1] ?? latest;

    const net_speculator = latest.noncomm_long  - latest.noncomm_short;
    const net_commercial = latest.comm_long     - latest.comm_short;
    const net_retail     = latest.retail_long   - latest.retail_short;
    const prev_net_spec  = prev.noncomm_long    - prev.noncomm_short;
    const week_change    = net_speculator - prev_net_spec;

    // COT index: where current net_spec sits in 52-week range (0–100)
    const netSpecs = parsed.map(r => r.noncomm_long - r.noncomm_short);
    const min52    = Math.min(...netSpecs);
    const max52    = Math.max(...netSpecs);
    const range    = max52 - min52;
    const cot_index = range > 0 ? Math.round(((net_speculator - min52) / range) * 100) : 50;

    let signal: "SMART_MONEY_LONG" | "SMART_MONEY_SHORT" | "NEUTRAL" = "NEUTRAL";
    if (net_commercial > 0 && net_speculator < 0) signal = "SMART_MONEY_LONG";
    else if (net_commercial < 0 && net_speculator > 0) signal = "SMART_MONEY_SHORT";

    return NextResponse.json({
      symbol:        slug,
      contract_name: mapping.name,
      report_date:   latest.date,
      open_interest: latest.open_interest,
      net_speculator,
      net_commercial,
      net_retail,
      week_change,
      cot_index,
      signal,
      raw: {
        noncomm_long:  latest.noncomm_long,
        noncomm_short: latest.noncomm_short,
        comm_long:     latest.comm_long,
        comm_short:    latest.comm_short,
        retail_long:   latest.retail_long,
        retail_short:  latest.retail_short,
      },
      history_52w: parsed.map(r => ({
        date:            r.date,
        net_speculator:  r.noncomm_long - r.noncomm_short,
        net_commercial:  r.comm_long    - r.comm_short,
      })),
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch COT data", detail: String(err) },
      { status: 500 }
    );
  }
}
