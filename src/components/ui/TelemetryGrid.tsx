import React from "react";

interface TelemetryGridProps {
  className?: string;
  showCoordinates?: boolean;
  opacity?: number;
}

export function TelemetryGrid({
  className = "",
  showCoordinates = false,
  opacity = 0.04,
}: TelemetryGridProps) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden ${className}`}
      style={{ opacity }}
    >
      {/* 56px Precision Grid */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="telemetry-grid-pattern"
            width="56"
            height="56"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 56 0 L 0 0 0 56"
              fill="none"
              stroke="var(--ink-950)"
              strokeWidth="0.75"
              strokeDasharray="2 4"
            />
            {/* Small corner crosshair */}
            <path
              d="M 0 0 L 4 0 M 0 0 L 0 4"
              fill="none"
              stroke="var(--ink-950)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#telemetry-grid-pattern)" />
      </svg>

      {/* Coordinate & Telemetry Labels */}
      {showCoordinates && (
        <div className="absolute inset-0 p-6 flex flex-col justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--graphite-600)]">
          <div className="flex justify-between items-center">
            <span>SYS // DECISION_ENGINE</span>
            <span className="tabular">1.2850 · 1.0820 · 2920.0</span>
          </div>
          <div className="flex justify-between items-center">
            <span>LATENCY: 12ms · DETERMINISTIC</span>
            <span>COORD: 53.2350° N, 1.4210° W</span>
          </div>
        </div>
      )}
    </div>
  );
}
