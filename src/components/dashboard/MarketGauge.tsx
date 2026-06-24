"use client";

import React, { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────
   MarketGauge — radar-style semicircular bias gauge
   Matches the CyberGuard reference aesthetic:
     • 4 concentric rings of ultra-fine tick marks (0.5 px hairlines)
     • Labels orbit OUTSIDE the outermost ring with dotted connector lines
     • Orange triangle warning badges at conflict positions on the arc
     • Small letter-pill badges (B / M / C) on the ring for signal type
     • Thin green (#00C896) sweep arc on innermost ring
     • Large weight-200 centre number with % superscript
   ───────────────────────────────────────────────────────────────────────── */

interface MarketGaugeProps {
  percentage: number;
  label?: string;
  instrument?: string;
  rsi?: string;
  price?: string;
  trend?: string;
}

/* Signal indicators — positions on the 180° arc (180°=left … 360°=right) */
const SIGNALS = [
  { name: "RSI",        deg: 198, letter: "B", alert: false, value: null },
  { name: "EMA",        deg: 220, letter: "B", alert: false, value: null },
  { name: "COT",        deg: 248, letter: "C", alert: true,  value: null },
  { name: "VOL",        deg: 270, letter: "M", alert: false, value: null },
  { name: "NEWS",       deg: 294, letter: "M", alert: false, value: null },
  { name: "ORDER FLOW", deg: 322, letter: "C", alert: true,  value: null },
  { name: "MACRO",      deg: 346, letter: "B", alert: false, value: null },
];

export function MarketGauge({
  percentage,
  label = "Bullish Bias",
  instrument = "GBP/USD",
  rsi = "58.4",
  price = "1.27340",
  trend = "ABOVE EMA",
}: MarketGaugeProps) {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const [animPct, setAnimPct] = useState(0);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  /* ── Animate percentage ───────────────────────────────────────────────── */
  useEffect(() => {
    const target = percentage;
    const duration = 1000;
    const t0 = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min((now - t0) / duration, 1);
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      setAnimPct(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [percentage]);

  /* ── Observe container for responsive sizing ─────────────────────────── */
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const measure = () => setDims({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ── Draw ────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dims.w === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const W = dims.w;
    const H = dims.h;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    /*
     * Geometry:
     * The pivot (cx, cy) is placed so the full semicircle is visible.
     * cy = H * 0.86 pushes it near the bottom so the arc crown is near top.
     * R_OUT sized to nearly reach the side edges.
     */
    const cx  = W / 2;
    const cy  = H * 0.87;
    const R3  = Math.min(W * 0.46, cy * 0.98);  // outermost ring
    const R2  = R3 * 0.855;                       // 2nd ring
    const R1  = R3 * 0.725;                       // 3rd ring
    const R0  = R3 * 0.600;                       // innermost / face edge

    /* polar → cartesian */
    const pt = (r: number, deg: number) => ({
      x: cx + r * Math.cos((deg * Math.PI) / 180),
      y: cy + r * Math.sin((deg * Math.PI) / 180),
    });

    /* ── Background semicircle fill ── */
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R3 + 2, Math.PI, 0, false);
    ctx.lineTo(cx + R3 + 2, cy + 2);
    ctx.lineTo(cx - R3 - 2, cy + 2);
    ctx.closePath();
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.restore();

    /* ── Helper: draw one ring of ticks ── */
    const drawRing = (r: number, count: number, tickH: number, opacity: number, lw = 0.5) => {
      ctx.save();
      ctx.strokeStyle = `rgba(107, 114, 128, ${opacity * 0.6})`;
      ctx.lineWidth = lw;
      for (let i = 0; i <= count; i++) {
        const deg = 180 + (i / count) * 180;
        const rad = (deg * Math.PI) / 180;
        const x1 = cx + r * Math.cos(rad);
        const y1 = cy + r * Math.sin(rad);
        const x2 = cx + (r - tickH) * Math.cos(rad);
        const y2 = cy + (r - tickH) * Math.sin(rad);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.restore();
    };

    /* 4 tick rings — outermost densest */
    drawRing(R3, 200, 5,   0.9,  0.5);
    drawRing(R2, 100, 4,   0.55, 0.5);
    drawRing(R1,  50, 3,   0.35, 0.5);
    drawRing(R0,  30, 2.5, 0.25, 0.5);

    /* ── Subtle arc outlines on rings ── */
    const arcLine = (r: number, op: number) => {
      ctx.save();
      ctx.strokeStyle = `rgba(156, 163, 175, ${op * 0.4})`;
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.arc(cx, cy, r, Math.PI, 0, false);
      ctx.stroke();
      ctx.restore();
    };
    arcLine(R3, 0.6);
    arcLine(R2, 0.35);
    arcLine(R1, 0.2);
    arcLine(R0, 0.15);

    /* ── White face ── */
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R0, Math.PI, 0, false);
    ctx.lineTo(cx + R0, cy);
    ctx.arc(cx, cy, R0, 0, Math.PI, true);
    ctx.closePath();
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.restore();

    /* ── Green sweep arc just inside R0 ── */
    if (animPct > 0) {
      const arcR = R0 - 5;
      const startA = Math.PI;
      const endA   = Math.PI + (animPct / 100) * Math.PI;
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, arcR, startA, endA, false);
      ctx.strokeStyle = "#00C896";
      ctx.lineWidth = 3.5;
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.restore();
    }

    /* ── Compute dynamic signals based on real data ── */
    const rsiVal = parseFloat(rsi);
    const isBullish = percentage >= 50;

    const rsiLetter = isNaN(rsiVal) ? "N" : rsiVal < 40 ? "B" : rsiVal > 60 ? "S" : "N";
    const rsiAlert = isNaN(rsiVal) ? false : (isBullish ? rsiVal > 60 : rsiVal < 40);

    const trendUp = trend?.toUpperCase().includes("ABOVE");
    const trendDown = trend?.toUpperCase().includes("BELOW");
    const emaLetter = trendUp ? "B" : trendDown ? "S" : "N";
    const emaAlert = isBullish ? trendDown : trendUp;

    const dynamicSignals = [
      { name: "RSI",        deg: 198, letter: rsiLetter, alert: rsiAlert },
      { name: "EMA",        deg: 220, letter: emaLetter, alert: emaAlert },
      { name: "COT",        deg: 248, letter: isBullish ? "B" : "S", alert: false },
      { name: "VOL",        deg: 270, letter: isBullish ? "B" : "S", alert: false },
      { name: "NEWS",       deg: 294, letter: isBullish ? "B" : "S", alert: false },
      { name: "ORDER FLOW", deg: 322, letter: isBullish ? "S" : "B", alert: true }, // contrarian node
      { name: "MACRO",      deg: 346, letter: isBullish ? "B" : "S", alert: false },
    ];

    /* ── Signal nodes: label outside R3, connector line, letter badge ── */
    dynamicSignals.forEach(({ name, deg, letter, alert }) => {
      const rad = (deg * Math.PI) / 180;

      /* Dot on ring R2 */
      const dotR = (R2 + R1) / 2;
      const dot  = pt(dotR, deg);
      ctx.save();
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = alert ? "#FF6B2B" : "#9ca3af";
      ctx.fill();
      ctx.restore();

      /* Connector: from R3 outward to label anchor */
      const connStart = pt(R3 + 2, deg);
      const labelR    = R3 + 28;
      const labelPt   = pt(labelR, deg);

      ctx.save();
      ctx.setLineDash([2, 3]);
      ctx.strokeStyle = `rgba(156, 163, 175, 0.4)`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(connStart.x, connStart.y);
      ctx.lineTo(labelPt.x, labelPt.y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      /* Label text — anchor left or right based on position */
      const isLeft   = deg < 265;
      const isBottom = deg > 250 && deg < 290;
      const lx = labelPt.x + (isLeft ? -4 : 4);
      const ly = labelPt.y + (isBottom ? 10 : 0);

      ctx.save();
      ctx.fillStyle = "#374151";
      ctx.font = `400 9px Inter, system-ui, sans-serif`;
      ctx.textAlign = isLeft ? "right" : "left";
      ctx.textBaseline = "middle";
      ctx.fillText(name, lx, ly);
      ctx.restore();

      /* Small letter-pill badge on R1 */
      const pillPt = pt(R1, deg);
      const pillW = 14, pillH = 11;
      ctx.save();
      ctx.fillStyle = alert ? "rgba(255,107,43,0.12)" : "#f3f4f6";
      ctx.strokeStyle = alert ? "rgba(255,107,43,0.4)" : "#e5e7eb";
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.roundRect
        ? ctx.roundRect(pillPt.x - pillW/2, pillPt.y - pillH/2, pillW, pillH, 3)
        : ctx.rect(pillPt.x - pillW/2, pillPt.y - pillH/2, pillW, pillH);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = alert ? "#FF6B2B" : "#4b5563";
      ctx.font = "600 7px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(letter, pillPt.x, pillPt.y + 0.5);
      ctx.restore();

      /* Orange triangle alert marker at R3 for conflict signals */
      if (alert) {
        const triPt = pt(R3 - 8, deg);
        const ts = 7; // half-size of triangle
        ctx.save();
        ctx.fillStyle = "#FF6B2B";
        ctx.beginPath();
        ctx.moveTo(triPt.x, triPt.y - ts);
        ctx.lineTo(triPt.x + ts * 0.87, triPt.y + ts * 0.5);
        ctx.lineTo(triPt.x - ts * 0.87, triPt.y + ts * 0.5);
        ctx.closePath();
        ctx.fill();
        // ! inside
        ctx.fillStyle = "#fff";
        ctx.font = "bold 5px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("!", triPt.x, triPt.y + 1);
        ctx.restore();
      }
    });

  }, [animPct, dims]);

  const trendUp = trend?.toUpperCase().includes("ABOVE");

  return (
    <div className="flex flex-col w-full h-full bg-white">

      {/* ── Canvas fills the column naturally ── */}
      <div
        ref={wrapperRef}
        className="relative flex-1 w-full"
        style={{ minHeight: 280 }}
      >
        <canvas
          ref={canvasRef}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />

        {/* Centre overlay: large percentage + bias label */}
        <div
          style={{
            position: "absolute",
            bottom: "18%",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          <div style={{ lineHeight: 1, marginBottom: 6 }}>
            <span
              style={{
                fontSize: 72,
                fontWeight: 200,
                color: "#111827",
                letterSpacing: "-0.04em",
                fontVariantNumeric: "tabular-nums",
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              {animPct}
            </span>
            <sup
              style={{
                fontSize: 30,
                fontWeight: 200,
                color: "#111827",
                verticalAlign: "super",
                lineHeight: 0,
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              %
            </sup>
          </div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 400,
              color: "#4b5563",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              opacity: 0.8,
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            {label}
          </div>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="flex justify-center items-center gap-10 py-4 px-6 border-t border-gray-200 bg-white">
        {[
          { label: "PRICE",    value: price,           color: "#111827" },
          { label: "RSI (14)", value: rsi,             color: "#111827" },
          { label: "TREND",    value: trend,           color: trendUp ? "#16a34a" : "#dc2626" },
        ].map(({ label: l, value, color }) => (
          <div key={l} className="text-center">
            <p className="text-[9px] font-mono uppercase tracking-widest text-[#6b7280] mb-1.5">{l}</p>
            <p
              className="text-[13px] font-light font-mono"
              style={{ color, fontVariantNumeric: "tabular-nums" }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
