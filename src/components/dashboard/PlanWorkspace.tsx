"use client";

import React, { useState } from "react";
import { RunMyTrade } from "@/components/dashboard/RunMyTrade";
import { PlanClient } from "@/components/dashboard/PlanClient";
import { cn } from "@/lib/utils";
import { Zap, ListChecks } from "lucide-react";

export function PlanWorkspace() {
  const [activeTab, setActiveTab] = useState<"run-my-trade" | "checklist">("run-my-trade");

  return (
    <div className="space-y-6">
      {/* Workspace Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EEECE7] pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("run-my-trade")}
          className={cn(
            "flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-[6px] transition-all border",
            activeTab === "run-my-trade"
              ? "bg-white border-[#E6E4DE] text-[#181818] shadow-[0_1px_2px_rgba(14,13,10,0.04)]"
              : "bg-transparent border-transparent text-[#87877F] hover:text-[#181818] hover:bg-[#F3F2EE]"
          )}
        >
          <Zap className={cn("w-3.5 h-3.5", activeTab === "run-my-trade" ? "text-[#F9771D]" : "text-[#87877F]")} />
          Plan My Trade (Quantified Setup)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("checklist")}
          className={cn(
            "flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-[6px] transition-all border",
            activeTab === "checklist"
              ? "bg-white border-[#E6E4DE] text-[#181818] shadow-[0_1px_2px_rgba(14,13,10,0.04)]"
              : "bg-transparent border-transparent text-[#87877F] hover:text-[#181818] hover:bg-[#F3F2EE]"
          )}
        >
          <ListChecks className={cn("w-3.5 h-3.5", activeTab === "checklist" ? "text-[#F9771D]" : "text-[#87877F]")} />
          Advanced Strategy Checklist
        </button>
      </div>

      {/* Active Tab View */}
      {activeTab === "run-my-trade" ? (
        <RunMyTrade />
      ) : (
        <PlanClient />
      )}
    </div>
  );
}
