import { NextResponse } from "next/server";
import { CredentialManager } from "@/lib/data-platform/credentials";

export const revalidate = 7200; // 2 hours

export async function GET() {
  const eiaKey = CredentialManager.getEiaKey();
  const fredKey = CredentialManager.getFredKey();

  let wtiPrice: number | null = null;
  let brentPrice: number | null = null;
  let natGasPrice: number | null = null;
  let source = "UNAVAILABLE";

  // 1. Try EIA v2 API (Official Department of Energy)
  if (eiaKey) {
    try {
      // WTI spot
      const wtiUrl = `https://api.eia.gov/v2/petroleum/pri/spt/data/?api_key=${eiaKey}&frequency=daily&data[0]=value&facets[series][]=RWTC&sort[0][column]=period&sort[0][direction]=desc&length=2`;
      const resWti = await fetch(wtiUrl, { next: { revalidate: 7200 } });
      if (resWti.ok) {
        const data = await resWti.json();
        const rows = data?.response?.data || [];
        if (rows.length > 0 && rows[0].value) {
          wtiPrice = parseFloat(rows[0].value);
          source = "EIA v2 API";
        }
      }

      // Brent spot (series: RBRTE)
      const brentUrl = `https://api.eia.gov/v2/petroleum/pri/spt/data/?api_key=${eiaKey}&frequency=daily&data[0]=value&facets[series][]=RBRTE&sort[0][column]=period&sort[0][direction]=desc&length=2`;
      const resBrent = await fetch(brentUrl, { next: { revalidate: 7200 } });
      if (resBrent.ok) {
        const data = await resBrent.json();
        const rows = data?.response?.data || [];
        if (rows.length > 0 && rows[0].value) {
          brentPrice = parseFloat(rows[0].value);
        }
      }
    } catch (e) {
      console.error("EIA API call failed:", e);
    }
  }

  // 2. Fallback to FRED for WTI & Brent if EIA is unavailable
  if (wtiPrice === null && fredKey) {
    try {
      const fredWtiUrl = `https://api.stlouisfed.org/fred/series/observations?series_id=DCOILWTICO&api_key=${fredKey}&file_type=json&sort_order=desc&limit=1`;
      const res = await fetch(fredWtiUrl, { next: { revalidate: 7200 } });
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

  if (brentPrice === null && fredKey) {
    try {
      const fredBrentUrl = `https://api.stlouisfed.org/fred/series/observations?series_id=DCOILBRENTEU&api_key=${fredKey}&file_type=json&sort_order=desc&limit=1`;
      const res = await fetch(fredBrentUrl, { next: { revalidate: 7200 } });
      if (res.ok) {
        const json = await res.json();
        const val = json.observations?.[0]?.value;
        if (val && val !== ".") {
          brentPrice = parseFloat(val);
        }
      }
    } catch (e) {
      console.error("FRED Brent call failed:", e);
    }
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    source,
    feed_status: wtiPrice !== null ? "LIVE" : "UNAVAILABLE",
    energy: {
      wti_crude: {
        name: "WTI Crude Oil",
        price: wtiPrice,
        unit: "USD/bbl",
        symbol: "USOIL",
        status: wtiPrice !== null ? "LIVE" : "UNAVAILABLE",
      },
      nat_gas: {
        name: "Natural Gas (Henry Hub)",
        price: natGasPrice,
        unit: "USD/MMBtu",
        symbol: "NGAS",
        status: natGasPrice !== null ? "LIVE" : "UNAVAILABLE",
      },
      brent_crude: {
        name: "Brent Crude Oil",
        price: brentPrice,
        unit: "USD/bbl",
        symbol: "UKOIL",
        status: brentPrice !== null ? "LIVE" : "UNAVAILABLE",
      },
    },
  });
}
