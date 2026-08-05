import React from "react";
import Metadata from "next";
import Link from "next/link";
import { Activity, ShieldCheck, Download, AlertCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { BROKER_TEST_RECORDS } from "@/lib/data/research";

export const metadata = {
  title: "Broker Execution & Spread Evidence Centre | Drawdown Research",
  description:
    "Empirical execution speed, spread measurement, and withdrawal friction test records across major regulated forex and CFD brokers.",
};

export default function BrokerTestingPage() {
  return (
    <div className="min-h-screen bg-background-primary text-text-primary pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Research Centre", href: "/research" },
            { label: "Broker Testing", href: "/research/broker-testing" },
          ]}
        />

        <div className="my-8 border-b border-border-primary/60 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <Activity className="w-3.5 h-3.5" />
            Broker Testing Evidence
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
            Empirical Broker Test Records
          </h1>
          <p className="text-base text-text-secondary leading-relaxed">
            Tested latency, live session spreads, order slippage distributions, and withdrawal processing times. Marketing claims are explicitly separated from verified empirical test data.
          </p>
        </div>

        <div className="space-y-6">
          {BROKER_TEST_RECORDS.map((record) => (
            <div
              key={record.id}
              className="bg-background-secondary border border-border-primary/70 rounded-2xl p-6 hover:border-accent/50 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-border-primary/40">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {record.verificationStatus}
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-mono font-bold bg-accent/10 text-accent">
                      {record.evidenceClassification.replace("_", " ")}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-text-primary">{record.brokerName}</h2>
                  <p className="text-xs text-text-tertiary">
                    Legal Entity: <strong className="text-text-secondary">{record.legalEntity}</strong> • Regulator: <strong className="text-text-secondary">{record.regulator} (Licence #{record.licenseNumber})</strong>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-text-tertiary block">Test Date</span>
                  <span className="text-xs font-mono font-semibold text-text-primary">{record.testDate}</span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <div className="bg-background-primary/50 border border-border-primary/40 rounded-xl p-3 text-center">
                  <span className="text-[11px] text-text-tertiary block mb-0.5">Tested Instruments</span>
                  <span className="text-xs font-mono font-semibold text-text-primary">
                    {record.instrumentsTested.join(", ")}
                  </span>
                </div>
                <div className="bg-background-primary/50 border border-border-primary/40 rounded-xl p-3 text-center">
                  <span className="text-[11px] text-text-tertiary block mb-0.5">Average EUR/USD Spread</span>
                  <span className="text-xs font-mono font-bold text-accent">
                    {record.avgSpreadPips} pips
                  </span>
                </div>
                <div className="bg-background-primary/50 border border-border-primary/40 rounded-xl p-3 text-center">
                  <span className="text-[11px] text-text-tertiary block mb-0.5">Average Execution Time</span>
                  <span className="text-xs font-mono font-semibold text-emerald-400">
                    {record.avgExecutionTimeMs} ms
                  </span>
                </div>
                <div className="bg-background-primary/50 border border-border-primary/40 rounded-xl p-3 text-center">
                  <span className="text-[11px] text-text-tertiary block mb-0.5">Withdrawal Processing</span>
                  <span className="text-xs font-mono font-semibold text-text-primary">
                    ~{record.withdrawalProcessingHours} hrs
                  </span>
                </div>
              </div>

              <p className="text-xs text-text-tertiary italic">
                Notes: {record.notes}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
