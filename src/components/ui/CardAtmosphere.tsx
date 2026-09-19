import React from "react";

export type PatternType =
  | "topographic"     // Contour curves (e.g. Prepare / Market mechanics)
  | "dot-matrix"      // Discrete grid of dots (e.g. Plan / Technical foundations)
  | "isobar"          // Pressure/gradient flow waves (e.g. Fragmented / Sizing)
  | "grid-mesh"       // Isometric / geometric cross-lines (e.g. Execute / Broker terminals)
  | "plotted-curve"   // Mathematical distribution / bell-curve / decay (e.g. Review / Risk)
  | "circuit-lines"   // High-frequency trace lines (e.g. Improve / Algo builder)
  | "concentric-rings"// Radial sonar / target rings (e.g. Accelerators / Institutional)
  | "candlestick-wave"; // Modern geometric telemetry wave

interface CardPatternProps {
  type: PatternType;
  className?: string;
}

export function CardPattern({ type, className = "" }: CardPatternProps) {
  switch (type) {
    case "topographic":
      return (
        <svg
          viewBox="0 0 400 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full object-cover select-none pointer-events-none ${className}`}
          preserveAspectRatio="none"
        >
          <path
            d="M-20 60 C80 30, 160 120, 240 70 C320 20, 380 90, 440 60"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />
          <path
            d="M-20 110 C90 80, 170 170, 250 120 C330 70, 390 140, 440 110"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M-20 160 C100 130, 180 220, 260 170 C340 120, 400 190, 440 160"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path
            d="M-20 210 C110 180, 190 270, 270 220 C350 170, 410 240, 440 210"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="2 3"
          />
          <path
            d="M-20 260 C120 230, 200 320, 280 270 C360 220, 420 290, 440 260"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>
      );

    case "dot-matrix":
      return (
        <svg
          viewBox="0 0 400 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full object-cover select-none pointer-events-none ${className}`}
        >
          <defs>
            <pattern id="dot-pat" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.2" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-pat)" />
          {/* Subtle diagonal accent coordinate vectors */}
          <path d="M40 40 L160 160 M240 60 L360 180" stroke="currentColor" strokeWidth="0.8" strokeDasharray="6 6" />
        </svg>
      );

    case "isobar":
      return (
        <svg
          viewBox="0 0 400 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full object-cover select-none pointer-events-none ${className}`}
          preserveAspectRatio="none"
        >
          <path d="M-50 200 Q 100 40, 250 180 T 500 120" stroke="currentColor" strokeWidth="1.2" />
          <path d="M-50 230 Q 100 70, 250 210 T 500 150" stroke="currentColor" strokeWidth="1.4" />
          <path d="M-50 260 Q 100 100, 250 240 T 500 180" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
          <path d="M-50 290 Q 100 130, 250 270 T 500 210" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="320" cy="80" r="45" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />
          <circle cx="320" cy="80" r="20" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );

    case "grid-mesh":
      return (
        <svg
          viewBox="0 0 400 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full object-cover select-none pointer-events-none ${className}`}
        >
          <defs>
            <pattern id="grid-pat" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pat)" />
          {/* Subtle crosshairs */}
          <circle cx="160" cy="96" r="4" stroke="currentColor" strokeWidth="1" />
          <line x1="150" y1="96" x2="170" y2="96" stroke="currentColor" strokeWidth="0.8" />
          <line x1="160" y1="86" x2="160" y2="106" stroke="currentColor" strokeWidth="0.8" />
        </svg>
      );

    case "plotted-curve":
      return (
        <svg
          viewBox="0 0 400 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full object-cover select-none pointer-events-none ${className}`}
          preserveAspectRatio="none"
        >
          {/* Normal distribution curve / risk envelope */}
          <path
            d="M 10 270 C 120 270, 150 50, 200 50 C 250 50, 280 270, 390 270"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M 10 270 C 130 270, 160 110, 200 110 C 240 110, 270 270, 390 270"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />
          <line x1="200" y1="30" x2="200" y2="280" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="20" y1="270" x2="380" y2="270" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );

    case "circuit-lines":
      return (
        <svg
          viewBox="0 0 400 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full object-cover select-none pointer-events-none ${className}`}
          preserveAspectRatio="none"
        >
          <path d="M 0 50 L 120 50 L 160 90 L 300 90 L 340 50 L 400 50" stroke="currentColor" strokeWidth="1.2" />
          <path d="M 0 130 L 80 130 L 120 170 L 220 170 L 260 210 L 400 210" stroke="currentColor" strokeWidth="1.4" />
          <path d="M 40 260 L 180 260 L 210 230 L 350 230" stroke="currentColor" strokeWidth="1.2" strokeDasharray="5 5" />
          <circle cx="160" cy="90" r="3" fill="currentColor" />
          <circle cx="300" cy="90" r="3" fill="currentColor" />
          <circle cx="120" cy="170" r="3" fill="currentColor" />
        </svg>
      );

    case "concentric-rings":
      return (
        <svg
          viewBox="0 0 400 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full object-cover select-none pointer-events-none ${className}`}
        >
          <circle cx="280" cy="120" r="140" stroke="currentColor" strokeWidth="0.8" strokeDasharray="5 5" />
          <circle cx="280" cy="120" r="105" stroke="currentColor" strokeWidth="1.0" />
          <circle cx="280" cy="120" r="70" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="280" cy="120" r="35" stroke="currentColor" strokeWidth="1.4" strokeDasharray="3 3" />
          <circle cx="280" cy="120" r="5" fill="currentColor" />
          <line x1="140" y1="120" x2="380" y2="120" stroke="currentColor" strokeWidth="0.8" />
          <line x1="280" y1="20" x2="280" y2="240" stroke="currentColor" strokeWidth="0.8" />
        </svg>
      );

    case "candlestick-wave":
      return (
        <svg
          viewBox="0 0 400 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full object-cover select-none pointer-events-none ${className}`}
          preserveAspectRatio="none"
        >
          <path
            d="M 0 180 Q 70 240, 140 160 T 280 140 T 420 80"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M 0 200 Q 70 260, 140 180 T 280 160 T 420 100"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          {/* Simulated discrete bars */}
          {[40, 80, 120, 160, 200, 240, 280, 320, 360].map((x, i) => (
            <line
              key={i}
              x1={x}
              y1={130 + (i % 3) * 20}
              x2={x}
              y2={180 + (i % 4) * 15}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ))}
        </svg>
      );

    default:
      return null;
  }
}

interface CardAtmosphereProps {
  pattern: PatternType;
  accentColor?: string; // Optional CSS color string, defaults to var(--text-primary)
}

/**
 * CardAtmosphere creates the required subtle, premium, monochromatic atmosphere:
 * - At rest: opacity 0.05, heavily desaturated, with a pure white gradient overlay from the bottom so text sits on clean ground.
 * - On card hover: image animates to opacity 0.16 over 400ms with ease-out, plus a 1.03 scale on the image only (never the card).
 * - Reduced motion: static rest opacity, zero transition.
 * - Mobile: pure rest state, no hover transitions.
 */
export function CardAtmosphere({ pattern, accentColor = "var(--text-primary)" }: CardAtmosphereProps) {
  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none rounded-[inherit]"
      aria-hidden="true"
    >
      {/* Pattern Layer with smooth hover transitions */}
      <div
        className="w-full h-full transition-all duration-400 ease-out transform-gpu group-hover:scale-[1.03] opacity-[0.05] group-hover:opacity-[0.16] motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:opacity-[0.05]"
        style={{ color: accentColor }}
      >
        <CardPattern type={pattern} />
      </div>

      {/* Pure White Vertical Gradient Overlay ensuring 4.5:1+ text contrast */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to top, #FFFFFF 30%, rgba(255,255,255,0.7) 65%, rgba(255,255,255,0.2) 100%)",
        }}
      />
    </div>
  );
}
