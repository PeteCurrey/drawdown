"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function SignalCentreError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log digest for operational tracing — do not expose internal details
    console.error("[signal-centre] Server render error digest:", error?.digest);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 text-center">
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
        <AlertTriangle className="w-6 h-6 text-red-500" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Signal Centre Unavailable
        </h2>
        <p className="text-sm text-gray-500 max-w-sm">
          Signal Centre could not be loaded. This is usually a temporary
          condition. Please try again.
        </p>
        {error?.digest && (
          <p className="text-xs text-gray-400 mt-2 font-mono">
            ref: {error.digest}
          </p>
        )}
      </div>
      <button
        onClick={reset}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
