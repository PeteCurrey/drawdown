import React from "react";

interface TelemetryGridProps {
  className?: string;
  showCoordinates?: boolean;
  opacity?: number;
}

export function TelemetryGrid({
  className = "",
  opacity = 0.03,
}: { className?: string; opacity?: number; showCoordinates?: boolean }) {
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
              stroke="var(--border-subtle)"
              strokeWidth="0.75"
              strokeDasharray="2 4"
            />
            {/* Small corner crosshair */}
            <path
              d="M 0 0 L 4 0 M 0 0 L 0 4"
              fill="none"
              stroke="var(--border-subtle)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#telemetry-grid-pattern)" />
      </svg>
    </div>
  );
}
