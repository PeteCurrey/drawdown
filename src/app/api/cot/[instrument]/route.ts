import { NextResponse } from "next/server";
import { CFTC_CODES } from "@/data/cftcCodes";

const CACHE = new Map<string, { data: unknown; ts: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000;

export interface COTWeek {
  date: string;
  commercialNet: number; largeSpecNet: number; smallSpecNet: number;
  commercialLong: number; commercialShort: number;
  largeSpecLong: number; largeSpecShort: number;
  smallSpecLong: number; smallSpecShort: number;
}

function parseCOT(csv: string, code: string): COTWeek[] {
  const lines = csv.split("\n");
  const header = lines[0].split(",").map(h => h.replace(/"/g, "").trim());
  const idx = (name: string) => header.indexOf(name);
  const results: COTWeek[] = [];
  for (let i = 1; i < lines.length && results.length < 5; i++) {
    const cols = lines[i].split(",").map(c => c.replace(/"/g, "").trim());
    if (!cols[2] || cols[2].trim() !== code.trim()) continue;
    const g = (name: string) => parseInt(cols[idx(name)] ?? "0", 10) || 0;
    const cL = g("Comm_Positions_Long_All"), cS = g("Comm_Positions_Short_All");
    const lL = g("NonComm_Positions_Long_All"), lS = g("NonComm_Positions_Short_All");
    const sL = g("NonRept_Positions_Long_All"), sS = g("NonRept_Positions_Short_All");
    results.push({ date: cols[2],
      commercialLong: cL, commercialShort: cS, commercialNet: cL - cS,
      largeSpecLong: lL, largeSpecShort: lS, largeSpecNet: lL - lS,
      smallSpecLong: sL, smallSpecShort: sS, smallSpecNet: sL - sS });
  }
  return results;
}

export async function GET(_req: Request, { params }: { params: Promise<{ instrument: string }> }) {
  const { instrument } = await params;
  const contract = CFTC_CODES[instrument.toUpperCase()];
  if (!contract) return NextResponse.json({ error: "Not supported", weeks: [] }, { status: 404 });

  const hit = CACHE.get(instrument);
  if (hit && Date.now() - hit.ts < CACHE_TTL) return NextResponse.json(hit.data);

  try {
    const res = await fetch("https://www.cftc.gov/dea/newcot/f_year.txt", { next: { revalidate: 86400 } });
    if (!res.ok) throw new Error("CFTC unavailable");
    const csv = await res.text();
    const weeks = parseCOT(csv, contract.code);
    const result = { instrument: instrument.toUpperCase(), contract: contract.name, weeks };
    CACHE.set(instrument, { data: result, ts: Date.now() });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed", weeks: [] }, { status: 500 });
  }
}
