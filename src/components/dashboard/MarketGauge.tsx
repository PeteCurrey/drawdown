"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

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
    // Animate percentage gauge sweep on load or instrument change
    const start = 0;
    const end = percentage;
    const duration = 800;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quad
      const easedProgress = progress * (2 - progress);
      setAnimatedPct(Math.round(start + easedProgress * (end - start)));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [percentage]);

  // SVG calculations for radial sentiment gauge
  // Bezel/tick positions: 180 degrees arc open at the bottom.
  // standard visual ranges from 180 degrees (left) to 0 degrees (right).
  const rOuter = 220;
  const rInner = 155;
  const rSentiment = 95;
  const center = { x: 240, y: 260 };

  const majorTickLength = 8;
  const minorTickLength = 4;

  // Render ticks for compass gauge bezel
  const ticks = [];
  for (let i = 0; i <= 120; i++) {
    const angle = 180 + (i * 180) / 120; // 180 (left) to 360 (right)
    const rad = (angle * Math.PI) / 180;
    const isMajor = i % 5 === 0;
    const tickLen = isMajor ? majorTickLength : minorTickLength;

    const x1 = center.x + rOuter * Math.cos(rad);
    const y1 = center.y + rOuter * Math.sin(rad);
    const x2 = center.x + (rOuter - tickLen) * Math.cos(rad);
    const y2 = center.y + (rOuter - tickLen) * Math.sin(rad);

    ticks.push(
      <line
        key={`tick-${i}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="var(--color-border-dark)"
        strokeOpacity={0.6}
        strokeWidth={1}
      />
    );
  }

  // Inner ring ticks
  const innerTicks = [];
  for (let i = 0; i <= 80; i++) {
    const angle = 180 + (i * 180) / 80;
    const rad = (angle * Math.PI) / 180;
    const x1 = center.x + rInner * Math.cos(rad);
    const y1 = center.y + rInner * Math.sin(rad);
    const x2 = center.x + (rInner - 3) * Math.cos(rad);
    const y2 = center.y + (rInner - 3) * Math.sin(rad);

    innerTicks.push(
      <line
        key={`itick-${i}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="var(--color-border-dark)"
        strokeOpacity={0.5}
        strokeWidth={0.8}
      />
    );
  }

  // Innermost sentiment filled arc calculation
  // Circ = 2 * PI * r. For semi-circle, length is PI * r.
  const sentimentCircumference = Math.PI * rSentiment;
  const strokeDashoffset = sentimentCircumference - (animatedPct / 100) * sentimentCircumference;
  const isBullish = percentage >= 50;
  const sentimentColor = isBullish ? "var(--color-green)" : "var(--color-red)";

  // Plotted nodes around the outer arc at equal intervals
  const nodes = [
    { name: "RSI", angle: 195 },
    { name: "EMA", angle: 215 },
    { name: "COT", angle: 245, conflict: true },
    { name: "VOL", angle: 270 },
    { name: "NEWS", angle: 295 },
    { name: "ORDER FLOW", angle: 320 },
    { name: "MACRO", angle: 345, conflict: true }
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="relative w-full max-w-[480px] aspect-[480/260]">
        <svg viewBox="0 0 480 260" className="w-full h-full select-none overflow-visible">
          {/* Ticks */}
          {ticks}
          {innerTicks}

          {/* Inner Dial Face Background */}
          <path
            d={`M ${center.x - rSentiment} ${center.y} A ${rSentiment} ${rSentiment} 0 0 1 ${center.x + rSentiment} ${center.y}`}
            fill="var(--color-dark-mid)"
          />

          {/* Sentiment Gauge Sweep Arc */}
          <path
            d={`M ${center.x - rSentiment} ${center.y} A ${rSentiment} ${rSentiment} 0 0 1 ${center.x + rSentiment} ${center.y}`}
            fill="none"
            stroke={sentimentColor}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={sentimentCircumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-300 ease-out"
          />

          {/* Nodes */}
          {nodes.map((node, i) => {
            const rad = (node.angle * Math.PI) / 180;
            const nodeR = rOuter + 14;
            const x = center.x + nodeR * Math.cos(rad);
            const y = center.y + nodeR * Math.sin(rad);

            // Label text anchoring based on position
            let textAnchor: "start" | "middle" | "end" = "middle";
            if (node.angle < 250) textAnchor = "end";
            if (node.angle > 290) textAnchor = "start";

            // Offset label slightly outward
            const labelR = nodeR + 10;
            const lx = center.x + labelR * Math.cos(rad);
            const ly = center.y + labelR * Math.sin(rad);

            return (
              <g key={`node-${i}`}>
                {/* Node connector line */}
                <line
                  x1={center.x + rInner * Math.cos(rad)}
                  y1={center.y + rInner * Math.sin(rad)}
                  x2={x}
                  y2={y}
                  stroke="var(--color-border-dark)"
                  strokeWidth={1}
                  strokeDasharray="2,2"
                />

                {/* Node dot */}
                <circle
                  cx={x}
                  cy={y}
                  r={3}
                  fill="var(--color-text-dim)"
                />

                {/* Node label */}
                <text
                  x={lx}
                  y={ly + 3}
                  fill="var(--color-text-dim)"
                  fontSize={9}
                  fontFamily="Outfit"
                  textAnchor={textAnchor}
                >
                  {node.name}
                </text>

                {/* Warning flag icon if conflict */}
                {node.conflict && (
                  <text
                    x={lx}
                    y={ly - 8}
                    fill="var(--color-orange)"
                    fontSize={10}
                    fontFamily="Outfit"
                    fontWeight="bold"
                    textAnchor={textAnchor}
                  >
                    ▲
                  </text>
                )}
              </g>
            );
          })}

          {/* Gauge Center Text */}
          <text
            x={center.x}
            y={center.y - 45}
            fill="var(--color-text-light)"
            fontSize={36}
            fontWeight="bold"
            fontFamily="Outfit"
            textAnchor="middle"
          >
            {animatedPct}%
          </text>
          <text
            x={center.x}
            y={center.y - 20}
            fill="var(--color-text-dim)"
            fontSize={13}
            fontFamily="Outfit"
            textAnchor="middle"
          >
            {label}
          </text>
        </svg>
      </div>

      {/* Row of stats below the gauge */}
      <div className="flex justify-center items-center gap-12 mt-6">
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
            style={{ color: trend.includes("ABOVE") ? "var(--color-green)" : "var(--color-red)" }}
          >
            {trend}
          </p>
        </div>
      </div>
    </div>
  );
}
