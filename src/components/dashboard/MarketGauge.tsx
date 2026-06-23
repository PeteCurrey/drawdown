"use client";

import React, { useEffect, useState } from "react";

interface MarketGaugeProps {
  percentage: number;
  label?: string;
  instrument?: string;
  rsi?: string;
  price?: string;
  trend?: string;
  onNavigateToAnalysis?: () => void;
}

export function MarketGauge({
  percentage,
  label = "Bullish Bias",
  instrument = "GBP / USD",
  rsi = "58.4",
  price = "1.27340",
  trend = "ABOVE EMA",
  onNavigateToAnalysis,
}: MarketGaugeProps) {
  const [animatedPct, setAnimatedPct] = useState(0);

  useEffect(() => {
    const start = 0;
    const end = percentage;
    const duration = 900;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = progress * (2 - progress);
      setAnimatedPct(Math.round(start + easedProgress * (end - start)));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [percentage]);

  // ── Geometry ─────────────────────────────────────────────────────────────
  const cx = 240;
  const cy = 268;      // centre Y (slightly below mid so arc opens downward)
  const rOuter = 210;  // bezel outer edge
  const rZone  = 195;  // coloured zone bands
  const rInner = 162;  // inside edge of zone / face boundary
  const rFace  = 158;  // filled dark face
  const rNeedle = 148; // needle tip reaches just inside face
  const rPivot  = 10;  // pivot dot radius

  // Semi-circle arc: 180° (left) → 0° (right) = 180° sweep
  // angle(pct) = 180 - pct * 180 / 100   [in degrees, standard SVG rotation]
  const pctToAngle = (pct: number) => 180 - (pct * 180) / 100; // 0°=right, 180°=left

  // Helper: polar → cartesian
  const polar = (r: number, angleDeg: number) => ({
    x: cx + r * Math.cos((angleDeg * Math.PI) / 180),
    y: cy + r * Math.sin((angleDeg * Math.PI) / 180),
  });

  // ── Zone arcs (Bear 0-33 / Neutral 33-66 / Bull 66-100) ─────────────────
  const makeArc = (r: number, pctStart: number, pctEnd: number) => {
    const a1 = pctToAngle(pctStart);
    const a2 = pctToAngle(pctEnd);
    const p1 = polar(r, a1);
    const p2 = polar(r, a2);
    // Note: pctEnd > pctStart means a2 < a1 (angles decrease as pct rises)
    return `M ${p1.x} ${p1.y} A ${r} ${r} 0 0 0 ${p2.x} ${p2.y}`;
  };

  const makeZonePath = (rOuter: number, rInner: number, pctStart: number, pctEnd: number) => {
    const a1 = pctToAngle(pctStart);
    const a2 = pctToAngle(pctEnd);
    const o1 = polar(rOuter, a1);
    const o2 = polar(rOuter, a2);
    const i2 = polar(rInner, a2);
    const i1 = polar(rInner, a1);
    return `M ${o1.x} ${o1.y} A ${rOuter} ${rOuter} 0 0 0 ${o2.x} ${o2.y} L ${i2.x} ${i2.y} A ${rInner} ${rInner} 0 0 1 ${i1.x} ${i1.y} Z`;
  };

  // ── Ticks ─────────────────────────────────────────────────────────────────
  const ticks: React.ReactNode[] = [];
  for (let i = 0; i <= 100; i++) {
    const angle = 180 - (i * 180) / 100;
    const isMajor = i % 10 === 0;
    const isMid   = i % 5 === 0;
    const tickLen = isMajor ? 11 : isMid ? 6 : 3;
    const p1 = polar(rOuter, angle);
    const p2 = polar(rOuter - tickLen, angle);
    ticks.push(
      <line
        key={`tick-${i}`}
        x1={p1.x} y1={p1.y}
        x2={p2.x} y2={p2.y}
        stroke="#444"
        strokeWidth={isMajor ? 1.5 : 0.8}
        strokeOpacity={isMajor ? 0.9 : 0.5}
      />
    );
  }

  // ── Scale labels at 0 / 25 / 50 / 75 / 100 ───────────────────────────────
  const scaleLabels = [0, 25, 50, 75, 100].map((pct) => {
    const angle = pctToAngle(pct);
    const pos = polar(rOuter + 18, angle);
    return (
      <text
        key={`label-${pct}`}
        x={pos.x}
        y={pos.y + 4}
        fill="#8A8A85"
        fontSize={9}
        fontFamily="Outfit, sans-serif"
        textAnchor="middle"
      >
        {pct}
      </text>
    );
  });

  // ── Needle ────────────────────────────────────────────────────────────────
  const needleAngle = pctToAngle(animatedPct);
  const needleTip   = polar(rNeedle, needleAngle);
  const needleBaseL = polar(rPivot * 0.5, needleAngle + 90);
  const needleBaseR = polar(rPivot * 0.5, needleAngle - 90);

  const isBullish = percentage >= 50;
  const sentimentColor = isBullish ? "#18B880" : "#CE6969";

  // ── Nodes around outer arc ────────────────────────────────────────────────
  const nodes = [
    { name: "RSI",        angle: 197, value: rsi,     color: "#8A8A85" },
    { name: "EMA",        angle: 215, value: trend,    color: trend?.includes("ABOVE") ? "#18B880" : "#CE6969" },
    { name: "COT",        angle: 243, value: "Conf",   color: "#F9771D", conflict: true },
    { name: "VOL",        angle: 270, value: "High",   color: "#8A8A85" },
    { name: "NEWS",       angle: 297, value: "Neut",   color: "#8A8A85" },
    { name: "ORDER FLOW", angle: 325, value: "Bull",   color: "#18B880" },
    { name: "MACRO",      angle: 343, value: "Conf",   color: "#F9771D", conflict: true },
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="relative w-full max-w-[500px]" style={{ aspectRatio: "500 / 300" }}>
        <svg viewBox="0 0 480 300" className="w-full h-full select-none overflow-visible">

          {/* ── Outer Bezel Ring ──────────────────────────────────────────── */}
          <path
            d={`M ${polar(rOuter, 180).x} ${polar(rOuter, 180).y} A ${rOuter} ${rOuter} 0 0 1 ${polar(rOuter, 0).x} ${polar(rOuter, 0).y}`}
            fill="none"
            stroke="#2E2E2E"
            strokeWidth={2}
          />
          {ticks}

          {/* ── Coloured Zone Bands ───────────────────────────────────────── */}
          {/* Bear zone: 0–33 → red */}
          <path d={makeZonePath(rZone, rInner, 0, 33)} fill="#CE6969" fillOpacity={0.18} />
          {/* Neutral zone: 33–66 → amber */}
          <path d={makeZonePath(rZone, rInner, 33, 66)} fill="#F9771D" fillOpacity={0.14} />
          {/* Bull zone: 66–100 → green */}
          <path d={makeZonePath(rZone, rInner, 66, 100)} fill="#18B880" fillOpacity={0.18} />

          {/* Zone border arcs */}
          <path d={makeArc(rZone, 0, 100)} fill="none" stroke="#333330" strokeWidth={0.8} strokeOpacity={0.6} />
          <path d={makeArc(rInner, 0, 100)} fill="none" stroke="#333330" strokeWidth={0.8} strokeOpacity={0.6} />

          {/* Zone division lines at 33% and 66% */}
          {[33, 66].map((pct) => {
            const a = pctToAngle(pct);
            const inner = polar(rInner, a);
            const outer = polar(rZone, a);
            return (
              <line
                key={`div-${pct}`}
                x1={inner.x} y1={inner.y}
                x2={outer.x} y2={outer.y}
                stroke="#333330"
                strokeWidth={1}
                strokeOpacity={0.8}
              />
            );
          })}

          {/* Zone labels */}
          {[
            { pct: 16, label: "BEAR" },
            { pct: 50, label: "NEUTRAL" },
            { pct: 83, label: "BULL" },
          ].map(({ pct, label: zLabel }) => {
            const mid = (rZone + rInner) / 2;
            const angle = pctToAngle(pct);
            const pos = polar(mid, angle);
            return (
              <text
                key={`zone-${pct}`}
                x={pos.x}
                y={pos.y + 3}
                fill="#8A8A85"
                fontSize={7}
                fontFamily="Outfit, monospace"
                textAnchor="middle"
                letterSpacing={1}
              >
                {zLabel}
              </text>
            );
          })}

          {/* ── Dial Face ────────────────────────────────────────────────── */}
          <path
            d={`M ${polar(rFace, 180).x} ${polar(rFace, 180).y} A ${rFace} ${rFace} 0 0 1 ${polar(rFace, 0).x} ${polar(rFace, 0).y} Z`}
            fill="#1C1C1C"
          />

          {/* ── Needle ───────────────────────────────────────────────────── */}
          <polygon
            points={`${needleTip.x},${needleTip.y} ${needleBaseL.x},${needleBaseL.y} ${needleBaseR.x},${needleBaseR.y}`}
            fill={sentimentColor}
            fillOpacity={0.95}
          />
          {/* Pivot cap */}
          <circle cx={cx} cy={cy} r={rPivot} fill="#2A2A2A" stroke={sentimentColor} strokeWidth={2} />
          <circle cx={cx} cy={cy} r={3} fill={sentimentColor} />

          {/* ── Centre Text ───────────────────────────────────────────────── */}
          <text x={cx} y={cy - 56} fill="white" fontSize={38} fontWeight="900" fontFamily="Outfit, sans-serif" textAnchor="middle">
            {animatedPct}%
          </text>
          <text x={cx} y={cy - 28} fill="#8A8A85" fontSize={10} fontFamily="Outfit, sans-serif" textAnchor="middle" letterSpacing={2}>
            {label.toUpperCase()}
          </text>
          <text x={cx} y={cy - 12} fill="#F9771D" fontSize={9} fontFamily="Outfit, monospace" textAnchor="middle" letterSpacing={1}>
            {instrument}
          </text>

          {/* ── Scale Labels ──────────────────────────────────────────────── */}
          {scaleLabels}

          {/* ── Outer Nodes ───────────────────────────────────────────────── */}
          {nodes.map((node, i) => {
            const rad = (node.angle * Math.PI) / 180;
            const nodeR = rOuter + 16;
            const nx = cx + nodeR * Math.cos(rad);
            const ny = cy + nodeR * Math.sin(rad);

            let textAnchor: "start" | "middle" | "end" = "middle";
            if (node.angle < 250) textAnchor = "end";
            if (node.angle > 290) textAnchor = "start";

            const labelR = nodeR + 12;
            const lx = cx + labelR * Math.cos(rad);
            const ly = cy + labelR * Math.sin(rad);

            const innerEdge = polar(rInner - 2, node.angle);

            return (
              <g key={`node-${i}`}>
                {/* Connector */}
                <line
                  x1={innerEdge.x} y1={innerEdge.y}
                  x2={nx} y2={ny}
                  stroke="#444"
                  strokeWidth={0.8}
                  strokeDasharray="2,3"
                  strokeOpacity={0.7}
                />
                {/* Dot */}
                <circle cx={nx} cy={ny} r={3.5} fill={node.color} fillOpacity={0.9} />
                {/* Label */}
                <text x={lx} y={ly + 3} fill="#8A8A85" fontSize={8} fontFamily="Outfit, sans-serif" textAnchor={textAnchor}>
                  {node.name}
                </text>
                {/* Conflict marker */}
                {node.conflict && (
                  <text x={lx} y={ly - 9} fill="#F9771D" fontSize={9} fontFamily="Outfit" textAnchor={textAnchor}>▲</text>
                )}
              </g>
            );
          })}

        </svg>
      </div>

      {/* ── Stats Row ──────────────────────────────────────────────────────── */}
      <div className="flex justify-center items-center gap-12 -mt-2">
        <div className="text-center">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#8A8A85] mb-1">Price</p>
          <p className="text-lg font-bold text-white font-mono">{price}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#8A8A85] mb-1">RSI (14)</p>
          <p className="text-lg font-bold text-white font-mono">{rsi}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#8A8A85] mb-1">Trend</p>
          <p
            className="text-lg font-bold font-mono"
            style={{ color: trend?.includes("ABOVE") ? "#18B880" : "#CE6969" }}
          >
            {trend}
          </p>
        </div>
      </div>
    </div>
  );
}
