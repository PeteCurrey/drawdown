"use client";

import React, { useEffect, useState, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface AnimatedMetricProps {
  value: string | number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedMetric({
  value,
  prefix = "",
  suffix = "",
  className = "",
}: AnimatedMetricProps) {
  const shouldReduce = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(value);
  const [isUpdating, setIsUpdating] = useState(false);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (prevValueRef.current !== value) {
      prevValueRef.current = value;
      if (shouldReduce) {
        setDisplayValue(value);
      } else {
        setIsUpdating(true);
        setDisplayValue(value);
        const timer = setTimeout(() => setIsUpdating(false), 240);
        return () => clearTimeout(timer);
      }
    }
  }, [value, shouldReduce]);

  return (
    <span
      className={`font-mono tabular-nums inline-flex items-baseline transition-opacity duration-200 ${
        isUpdating ? "opacity-70" : "opacity-100"
      } ${className}`}
    >
      {prefix && <span className="mr-0.5">{prefix}</span>}
      <span>{displayValue}</span>
      {suffix && <span className="ml-1 text-[0.65em] font-normal text-inherit opacity-75">{suffix}</span>}
    </span>
  );
}
