import { NextResponse } from "next/server";

export const revalidate = 7200; // 2 hours

export async function GET() {
  const eiaKey = process.env.EIA_API_KEY ?? "";
  const fredKey = process.env.FRED_API_KEY ?? "";

  let wtiPrice = 77.40;
  let natGasPrice = 2.12;
  let source = "Mock";

  if (eiaKey) {
    try {
      const wtiUrl = `https://api.eia.gov/v2/petroleum/pri/spt/data/?api_key=${eiaKey}&frequency=daily&data[0]=value&facets[series][]=RWTC&sort[0][column]=period&sort[0][direction]=desc&length=2`;
      const res = await fetch(wtiUrl, { next: { revalidate: 7200 } });
      if (res.ok) {
        const data = await res.json();
        const rows = data?.response?.data || [];
        if (rows.length > 0 && rows[0].value) {
          wtiPrice = parseFloat(rows[0].value);
          source = "EIA v2 API";
        }
      }
    } catch (e) {
      console.error("EIA API call failed:", e);
    }
  }

  if (source === "Mock" && fredKey) {
    try {
      const fredUrl = `https://api.stlouisfed.org/fred/series/observations?series_id=DCOILWTICO&api_key=${fredKey}&file_type=json&sort_order=desc&limit=1`;
      const res = await fetch(fredUrl, { next: { revalidate: 7200 } });
      if (res.ok) {
        const json = await res.json();
        const val = json.observations?.[0]?.value;
        if (val && val !== ".") {
          wtiPrice = parseFloat(val);
          source = "FRED (DCOILWTICO)";
        }
      }
    } catch (e) {
      console.error("FRED WTI call failed:", e);
    }
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    source,
    energy: {
      wti_crude: { name: "WTI Crude Oil", price: wtiPrice, unit: "USD/bbl", symbol: "USOIL" },
      nat_gas: { name: "Natural Gas (Henry Hub)", price: natGasPrice, unit: "USD/MMBtu", symbol: "NGAS" },
      brent_crude: { name: "Brent Crude Oil", price: parseFloat((wtiPrice + 4.20).toFixed(2)), unit: "USD/bbl", symbol: "UKOIL" }
    }
  });
}
