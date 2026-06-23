"use client";

import React, { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────────────────────
   Drawdown — Market Intelligence Panel
   Spec: semicircular gauge + signal card + sources card
   ───────────────────────────────────────────────────────────── */

interface Signal {
  direction: "BUY" | "SELL";
  instrument: string;
  timeframe: string;
  entryLow: string;
  entryHigh: string;
  tp1: string;
  tp2: string;
  sl: string;
}

interface MarketIntelligencePanelProps {
  percentage?: number;
  signal?: Signal;
}

const DEFAULT_SIGNAL: Signal = {
  direction: "BUY",
  instrument: "XAU/USD",
  timeframe: "1H",
  entryLow: "2,341.20",
  entryHigh: "2,350.80",
  tp1: "2,368.00",
  tp2: "2,389.50",
  sl: "2,328.40",
};

const INDICATOR_NODES = [
  { name: "EMA",        angleDeg: 200, radius: 0.72, alert: false },
  { name: "RSI",        angleDeg: 222, radius: 0.66, alert: false },
  { name: "COT",        angleDeg: 248, radius: 0.58, alert: true  },
  { name: "VOL",        angleDeg: 270, radius: 0.62, alert: false },
  { name: "NEWS",       angleDeg: 294, radius: 0.58, alert: false },
  { name: "ORDER FLOW", angleDeg: 318, radius: 0.68, alert: true  },
  { name: "MACRO",      angleDeg: 342, radius: 0.74, alert: false },
];

/* Alert badge positions on the outer arc */
const ALERT_BADGES = [248, 318];

export function MarketIntelligencePanel({
  percentage = 81,
  signal = DEFAULT_SIGNAL,
}: MarketIntelligencePanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animPct, setAnimPct] = useState(0);

  /* Animate percentage on mount */
  useEffect(() => {
    const target = percentage;
    const duration = 1000;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      setAnimPct(Math.round(eased * target));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [percentage]);

  /* Draw gauge to canvas */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    const cx = W / 2;
    const cy = H * 0.72; // pivot sits at 72% down

    /* Three concentric ring radii */
    const R_OUT  = Math.min(W, H * 1.8) * 0.44;   // outermost
    const R_MID  = R_OUT * 0.84;
    const R_INN  = R_OUT * 0.70;
    const R_FACE = R_OUT * 0.64;                    // face fill boundary

    /* ── Background fill under arc ── */
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R_OUT + 2, Math.PI, 0, false);
    ctx.lineTo(cx + R_OUT + 2, cy);
    ctx.lineTo(cx - R_OUT - 2, cy);
    ctx.closePath();
    ctx.fillStyle = "#111210";
    ctx.fill();
    ctx.restore();

    /* ── Draw tick rings ── */
    const drawTicks = (
      r: number,
      count: number,
      height: number,
      opacity: number,
    ) => {
      ctx.save();
      ctx.strokeStyle = `rgba(80,80,78,${opacity})`;
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= count; i++) {
        const angle = Math.PI + (i / count) * Math.PI;
        const x1 = cx + r * Math.cos(angle);
        const y1 = cy + r * Math.sin(angle);
        const x2 = cx + (r - height) * Math.cos(angle);
        const y2 = cy + (r - height) * Math.sin(angle);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.restore();
    };

    drawTicks(R_OUT,  160, 3,  0.85);  // outer — densest
    drawTicks(R_MID,  80,  2.5, 0.60); // middle
    drawTicks(R_INN,  40,  2,  0.40);  // inner — sparsest

    /* ── Subtle ring lines ── */
    const drawArcLine = (r: number, opacity: number) => {
      ctx.save();
      ctx.strokeStyle = `rgba(60,60,58,${opacity})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.arc(cx, cy, r, Math.PI, 0, false);
      ctx.stroke();
      ctx.restore();
    };
    drawArcLine(R_OUT, 0.5);
    drawArcLine(R_MID, 0.3);
    drawArcLine(R_INN, 0.25);

    /* ── Dark filled face ── */
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R_FACE, Math.PI, 0, false);
    ctx.lineTo(cx + R_FACE, cy);
    ctx.arc(cx, cy, R_FACE, 0, Math.PI, true);
    ctx.closePath();
    ctx.fillStyle = "#111210";
    ctx.fill();
    ctx.restore();

    /* ── Green sentiment arc (animPct drives it) ── */
    const arcStartAngle = Math.PI;                             // leftmost
    const arcEndAngle   = Math.PI + (animPct / 100) * Math.PI; // sweeps right
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R_INN + 6, arcStartAngle, arcEndAngle, false);
    ctx.strokeStyle = "#00C896";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.restore();

    /* ── Alert badges on outer ring ── */
    ALERT_BADGES.forEach((deg) => {
      const rad = (deg * Math.PI) / 180;
      const bx = cx + (R_OUT + 8) * Math.cos(rad);
      const by = cy + (R_OUT + 8) * Math.sin(rad);
      const size = 8;
      ctx.save();
      ctx.fillStyle = "#FF6B2B";
      ctx.beginPath();
      ctx.roundRect(bx - size / 2, by - size / 2, size, size, 2);
      ctx.fill();
      /* tiny triangle */
      ctx.fillStyle = "#fff";
      ctx.font = "bold 6px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("!", bx, by + 0.5);
      ctx.restore();
    });

    /* ── Indicator node labels inside arc ── */
    INDICATOR_NODES.forEach(({ name, angleDeg, radius, alert }) => {
      const rad = (angleDeg * Math.PI) / 180;
      const r   = R_FACE * radius;
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
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.font = "400 9px 'Inter', sans-serif";
      ctx.letterSpacing = "0.06em";
      // Anchor: left side = "end", right side = "start"
      ctx.textAlign = angleDeg < 270 ? "right" : "left";
      ctx.textBaseline = "middle";
      const labelOffset = angleDeg < 270 ? -5 : 5;
      ctx.fillText(name, lx + labelOffset, ly);
      ctx.restore();
    });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animPct]);

  const isBuy = signal.direction === "BUY";

  return (
    <div
      style={{
        background: "#FAFAF8",
        fontFamily: "'Inter', 'Geist', system-ui, sans-serif",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        minWidth: 340,
        maxWidth: 560,
        borderRadius: 20,
      }}
    >
      {/* ── GAUGE HERO ─────────────────────────────────────── */}
      <div
        style={{
          background: "#111210",
          borderRadius: 16,
          overflow: "hidden",
          position: "relative",
          padding: "0 0 20px",
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px 0",
          }}
        >
          <span style={{ fontSize: 10, letterSpacing: "0.18em", color: "#666663", fontWeight: 500, textTransform: "uppercase" }}>
            Market Intelligence
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00C896", display: "inline-block", boxShadow: "0 0 6px #00C896" }} />
            <span style={{ fontSize: 10, color: "#666663", letterSpacing: "0.1em" }}>LIVE</span>
          </div>
        </div>

        {/* Canvas gauge */}
        <div style={{ position: "relative", width: "100%", height: 240 }}>
          <canvas
            ref={canvasRef}
            style={{ width: "100%", height: "100%", display: "block" }}
          />
          {/* Overlaid centre text */}
          <div
            style={{
              position: "absolute",
              bottom: "18%",
              left: "50%",
              transform: "translateX(-50%)",
              textAlign: "center",
              pointerEvents: "none",
            }}
          >
            <div style={{ lineHeight: 1, marginBottom: 4 }}>
              <span
                style={{
                  fontSize: 72,
                  fontWeight: 200,
                  color: "#fff",
                  letterSpacing: "-0.04em",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {animPct}
              </span>
              <sup
                style={{
                  fontSize: 32,
                  fontWeight: 200,
                  color: "#fff",
                  verticalAlign: "super",
                  lineHeight: 0,
                  letterSpacing: 0,
                }}
              >
                %
              </sup>
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 400,
                color: "#fff",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                opacity: 0.65,
              }}
            >
              Bullish Bias
            </div>
          </div>
        </div>

        {/* Bottom stats row */}
        <div
          style={{
            display: "flex",
            gap: 28,
            padding: "0 24px",
            marginTop: 4,
          }}
        >
          {[
            { label: "PRICE",    value: "2,350.80" },
            { label: "RSI (14)", value: "68.7" },
            { label: "TREND",    value: "ABOVE EMA" },
          ].map(({ label, value }) => (
            <div key={label}>
              <div style={{ fontSize: 9, color: "#555552", letterSpacing: "0.1em", marginBottom: 3, textTransform: "uppercase" }}>
                {label}
              </div>
              <div style={{ fontSize: 13, color: "#fff", fontWeight: 400, fontVariantNumeric: "tabular-nums", letterSpacing: "0.01em" }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SIGNAL CARD ────────────────────────────────────── */}
      <div
        style={{
          background: isBuy ? "#F0FBF4" : "#FEF2F2",
          borderRadius: 12,
          borderLeft: `3px solid ${isBuy ? "#22C55E" : "#EF4444"}`,
          padding: 20,
          position: "relative",
          overflow: "hidden",
          boxShadow: isBuy
            ? "inset 40px 0 80px rgba(34,197,94,0.08)"
            : "inset 40px 0 80px rgba(239,68,68,0.08)",
        }}
      >
        {/* Diagonal texture overlay */}
        <div
          style={{
            position: "absolute", inset: 0, pointerEvents: "none", borderRadius: 12,
            backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 6px, rgba(0,0,0,0.018) 6px, rgba(0,0,0,0.018) 7px)",
          }}
        />

        {/* Instrument + timeframe */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, position: "relative" }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: "#111210", letterSpacing: "-0.01em" }}>
            {signal.instrument}
          </span>
          <span
            style={{
              fontSize: 11, fontWeight: 500, color: "#666663",
              border: "1px solid #D1D1CE", borderRadius: 6,
              padding: "2px 8px", letterSpacing: "0.04em",
            }}
          >
            {signal.timeframe}
          </span>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: isBuy ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", marginBottom: 14 }} />

        {/* Signal data row */}
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap", position: "relative" }}>
          {/* Direction badge */}
          <div>
            <div style={{ fontSize: 9, color: "#999996", letterSpacing: "0.1em", marginBottom: 6, textTransform: "uppercase" }}>Signal</div>
            <span
              style={{
                fontSize: 12, fontWeight: 700, letterSpacing: "0.08em",
                padding: "4px 10px", borderRadius: 6,
                background: isBuy ? "#22C55E" : "#EF4444",
                color: "#fff",
              }}
            >
              {signal.direction}
            </span>
          </div>

          {/* Entry */}
          <div>
            <div style={{ fontSize: 9, color: "#999996", letterSpacing: "0.1em", marginBottom: 6, textTransform: "uppercase" }}>Entry Zone</div>
            <div style={{ fontSize: 13, fontWeight: 400, color: "#111210", fontVariantNumeric: "tabular-nums" }}>
              {signal.entryLow} – {signal.entryHigh}
            </div>
          </div>

          {/* TP1 */}
          <div>
            <div style={{ fontSize: 9, color: "#999996", letterSpacing: "0.1em", marginBottom: 6, textTransform: "uppercase" }}>TP 1</div>
            <div style={{ fontSize: 13, fontWeight: 400, color: "#22C55E", fontVariantNumeric: "tabular-nums" }}>
              {signal.tp1}
            </div>
          </div>

          {/* TP2 */}
          <div>
            <div style={{ fontSize: 9, color: "#999996", letterSpacing: "0.1em", marginBottom: 6, textTransform: "uppercase" }}>TP 2</div>
            <div style={{ fontSize: 13, fontWeight: 400, color: "#22C55E", fontVariantNumeric: "tabular-nums" }}>
              {signal.tp2}
            </div>
          </div>

          {/* SL */}
          <div>
            <div style={{ fontSize: 9, color: "#999996", letterSpacing: "0.1em", marginBottom: 6, textTransform: "uppercase" }}>Stop Loss</div>
            <div style={{ fontSize: 13, fontWeight: 400, color: "#EF4444", fontVariantNumeric: "tabular-nums" }}>
              {signal.sl}
            </div>
          </div>
        </div>
      </div>

      {/* ── SOURCES CARD ───────────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(135deg, #F5C4B3 0%, #E8A898 100%)",
          borderRadius: 16,
          padding: 20,
        }}
      >
        <div style={{ fontSize: 10, fontWeight: 500, color: "#7A3E2E", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14, opacity: 0.8 }}>
          Data Sources
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { icon: "⬡", name: "Bloomberg Terminal",     count: 1842 },
            { icon: "◈", name: "COT Report (CFTC)",       count: 307  },
            { icon: "◉", name: "Order Flow Aggregator",   count: 924  },
            { icon: "▣", name: "Macro Calendar Feed",     count: 56   },
          ].map(({ icon, name, count }) => (
            <div
              key={name}
              style={{ display: "flex", alignItems: "center", gap: 10 }}
            >
              <span style={{ fontSize: 13, color: "#9B6358", width: 18, textAlign: "center", flexShrink: 0 }}>
                {icon}
              </span>
              <span style={{ fontSize: 12, color: "#3D2A22", fontWeight: 400, flex: 1 }}>
                {name}
              </span>
              <span style={{ fontSize: 12, color: "#3D2A22", fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>
                {count.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* Pagination dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 5, marginTop: 16 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: i === 0 ? 16 : 5,
                height: 5,
                borderRadius: 3,
                background: i === 0 ? "#3D2A22" : "rgba(61,42,34,0.25)",
                transition: "width 0.2s",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
