"use client";

import { useEffect, useRef } from "react";
import { createChart, ColorType, IChartApi } from "lightweight-charts";

interface BacktestEquityChartProps {
  data: { time: any; value: number }[];
}

export function BacktestEquityChart({ data }: BacktestEquityChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#94a3b8",
      },
      grid: {
        vertLines: { color: "rgba(30, 41, 59, 0.5)" },
        horzLines: { color: "rgba(30, 41, 59, 0.5)" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        borderColor: "rgba(30, 41, 59, 0.5)",
      },
    });

    const series = chart.addAreaSeries({
      lineColor: "#10b981",
      topColor: "rgba(16, 185, 129, 0.3)",
      bottomColor: "rgba(16, 185, 129, 0)",
      lineWidth: 2,
    });

    series.setData(data);
    chart.timeScale().fitContent();
    chartRef.current = chart;

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data]);

  return <div ref={chartContainerRef} className="w-full h-[400px]" />;
}
