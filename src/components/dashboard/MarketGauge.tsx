"use client";

import React, { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────
   MarketGauge — canvas-rendered semicircular intelligence gauge
   Used on the dashboard overview hero panel (dark background context).
   ───────────────────────────────────────────────────────────────────────── */

interface MarketGaugeProps {
  percentage: number;
  label?: string;
  instrument?: string;
  rsi?: string;
  price?: string;
  trend?: string;
}

const INDICATOR_NODES = [
  { name: "EMA",        angleDeg: 200, radiusFactor: 0.72, alert: false },
  { name: "RSI",        angleDeg: 222, radiusFactor: 0.64, alert: false },
  { name: "COT",        angleDeg: 248, radiusFactor: 0.56, alert: true  },
  { name: "VOL",        angleDeg: 270, radiusFactor: 0.60, alert: false },
  { name: "NEWS",       angleDeg: 294, radiusFactor: 0.56, alert: false },
  { name: "ORDER FLOW", angleDeg: 318, radiusFactor: 0.66, alert: true  },
  { name: "MACRO",      angleDeg: 342, radiusFactor: 0.72, alert: false },
];

const ALERT_BADGE_ANGLES = [248, 318]; // degrees where orange ! badges appear

export function MarketGauge({
  percentage,
  label = "Bullish Bias",
  instrument = "GBP / USD",
  rsi = "58.4",
  price = "1.27340",
  trend = "ABOVE EMA",
}: MarketGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [animPct, setAnimPct] = useState(0);
  const [size, setSize] = useState({ w: 480, h: 260 });

  /* ── Animate percentage on percentage change ─────────────────────────── */
  useEffect(() => {
    const target = percentage;
    const duration = 900;
    const startTime = performance.now();
    let prev = 0;

    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const next = Math.round(eased * target);
      if (next !== prev) {
        prev = next;
        setAnimPct(next);
      }
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [percentage]);

  /* ── Observe container size for responsive canvas ────────────────────── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setSize({ w: el.offsetWidth, h: el.offsetHeight });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ── Draw canvas ─────────────────────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const W = size.w;
    const H = size.h;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;

    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    /* Pivot sits at 76% of canvas height so the arc fills the space nicely */
    const cx = W / 2;
    const cy = H * 0.78;

    /* Three ring radii — scaled to the narrower of width or 2× height */
    const baseR  = Math.min(W * 0.44, H * 0.92);
    const R_OUT  = baseR;           // outermost bezel
    const R_MID  = baseR * 0.84;   // middle ring
    const R_INN  = baseR * 0.70;   // inner ring
    const R_FACE = baseR * 0.63;   // filled face boundary

    /* Helper: polar to cartesian */
    const p = (r: number, angleDeg: number) => ({
      x: cx + r * Math.cos((angleDeg * Math.PI) / 180),
      y: cy + r * Math.sin((angleDeg * Math.PI) / 180),
    });

    /* ── Draw tick ring ── */
    const drawTicks = (
      r: number,
      count: number,
      tickH: number,
      opacity: number,
    ) => {
      ctx.save();
      ctx.strokeStyle = `rgba(80,80,78,${opacity})`;
      ctx.lineWidth = 0.5;
      ctx.lineCap = "butt";
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

    drawTicks(R_OUT,  160, 4,   0.85); // outer — densest
    drawTicks(R_MID,  80,  3,   0.55); // middle
    drawTicks(R_INN,  40,  2.5, 0.35); // inner — sparsest

    /* ── Subtle arc outlines on each ring ── */
    const drawRingLine = (r: number, opacity: number) => {
      ctx.save();
      ctx.strokeStyle = `rgba(55,55,52,${opacity})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.arc(cx, cy, r, Math.PI, 0, false);
      ctx.stroke();
      ctx.restore();
    };
    drawRingLine(R_OUT, 0.6);
    drawRingLine(R_MID, 0.35);
    drawRingLine(R_INN, 0.25);

    /* ── Dark face fill ── */
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R_FACE, Math.PI, 0, false);
    ctx.lineTo(cx + R_FACE, cy);
    ctx.arc(cx, cy, R_FACE, 0, Math.PI, true);
    ctx.closePath();
    ctx.fillStyle = "#111210";
    ctx.fill();
    ctx.restore();

    /* ── Green sentiment sweep arc (sits just inside R_INN) ── */
    const sweepStart = Math.PI;
    const sweepEnd   = Math.PI + (animPct / 100) * Math.PI;
    if (animPct > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R_INN - 4, sweepStart, sweepEnd, false);
      ctx.strokeStyle = "#00C896";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.restore();
    }

    /* ── Alert badge squares on outer ring ── */
    ALERT_BADGE_ANGLES.forEach((deg) => {
      const rad = (deg * Math.PI) / 180;
      const bx = cx + (R_OUT + 10) * Math.cos(rad);
      const by = cy + (R_OUT + 10) * Math.sin(rad);
      const s = 8;
      ctx.save();
      ctx.fillStyle = "#FF6B2B";
      ctx.beginPath();
      (ctx as any).roundRect
        ? (ctx as any).roundRect(bx - s / 2, by - s / 2, s, s, 2)
        : ctx.rect(bx - s / 2, by - s / 2, s, s);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 7px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("!", bx, by + 0.5);
      ctx.restore();
    });

    /* ── Constellation node labels inside the face ── */
    INDICATOR_NODES.forEach(({ name, angleDeg, radiusFactor, alert }) => {
      const rad = (angleDeg * Math.PI) / 180;
      const r   = R_FACE * radiusFactor;
      const lx  = cx + r * Math.cos(rad);
      const ly  = cy + r * Math.sin(rad);

      /* dot */
      ctx.save();
      ctx.beginPath();
      ctx.arc(lx, ly, 2, 0, Math.PI * 2);
      ctx.fillStyle = alert ? "#FF6B2B" : "#555552";
      ctx.fill();
      ctx.restore();

      /* label */
      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,0.65)";
      ctx.font = "400 8.5px Inter, sans-serif";
      ctx.textAlign = angleDeg < 270 ? "right" : "left";
      ctx.textBaseline = "middle";
      const offset = angleDeg < 270 ? -5 : 5;
      ctx.fillText(name, lx + offset, ly);
      ctx.restore();
    });

  }, [animPct, size]);

  const trendIsAbove = trend?.includes("ABOVE");

  return (
    <div className="flex flex-col items-center w-full gap-5">

      {/* ── Canvas gauge ── */}
      <div
        ref={containerRef}
        className="relative w-full"
        style={{ height: 240 }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "100%", display: "block" }}
        />

        {/* Centre text overlay — percentage + label */}
        <div
          style={{
            position: "absolute",
            bottom: "14%",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          <div style={{ lineHeight: 1, marginBottom: 5 }}>
            <span
              style={{
                fontSize: 64,
                fontWeight: 200,
                color: "#fff",
                letterSpacing: "-0.04em",
                fontVariantNumeric: "tabular-nums",
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              {animPct}
            </span>
            <sup
              style={{
                fontSize: 28,
                fontWeight: 200,
                color: "#fff",
                verticalAlign: "super",
                lineHeight: 0,
                letterSpacing: 0,
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
              color: "#fff",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              opacity: 0.55,
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            {label}
          </div>
        </div>
      </div>

      {/* ── Stats row below gauge ── */}
      <div className="flex justify-center items-center gap-10 pb-1">
        <div className="text-center">
          <p className="text-[9px] font-mono uppercase tracking-widest text-[#8A8A85] mb-1.5">Price</p>
          <p className="text-[13px] font-light text-white font-mono" style={{ fontVariantNumeric: "tabular-nums" }}>{price}</p>
        </div>
        <div className="text-center">
          <p className="text-[9px] font-mono uppercase tracking-widest text-[#8A8A85] mb-1.5">RSI (14)</p>
          <p className="text-[13px] font-light text-white font-mono" style={{ fontVariantNumeric: "tabular-nums" }}>{rsi}</p>
        </div>
        <div className="text-center">
          <p className="text-[9px] font-mono uppercase tracking-widest text-[#8A8A85] mb-1.5">Trend</p>
          <p
            className="text-[13px] font-light font-mono"
            style={{ color: trendIsAbove ? "#00C896" : "#CE6969", fontVariantNumeric: "tabular-nums" }}
          >
            {trend}
          </p>
        </div>
      </div>
    </div>
  );
}
