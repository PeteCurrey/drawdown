import { WorkflowStage } from "./commercial-catalogue";

export interface PlatformCapability {
  id: string;
  name: string;
  description: string;
  workflowStages: WorkflowStage[];
  status: "released" | "in_development" | "planned" | "retired";
  secondaryStatus?: "beta" | "limited_release";
  availableToProducts: string[]; // e.g. "free", "foundation", "edge", "floor"
  productionRoute?: string;
  methodologySlug?: string;
  verifiedAt?: string;
  verificationOwner?: string;
  targetWindow?: string;
  targetWindowApproved: boolean;
  limitations: string[];
  dependencies: string[];
  publicRoadmap: boolean;
}

export const platformCapabilities: PlatformCapability[] = [
  {
    id: "economic-calendar",
    name: "Economic Calendar",
    description: "Real-time calendar tracking macro event risks.",
    workflowStages: ["prepare"],
    status: "released",
    availableToProducts: ["free", "foundation", "edge", "floor"],
    productionRoute: "/dashboard/market-intelligence",
    targetWindowApproved: true,
    limitations: ["Delayed by up to 60 seconds"],
    dependencies: [],
    publicRoadmap: true,
    verifiedAt: "2026-08-01",
    verificationOwner: "Pete"
  },
  {
    id: "risk-policy",
    name: "Personal Risk Policy",
    description: "Define and version your personal risk parameters.",
    workflowStages: ["prepare", "plan"],
    status: "released",
    availableToProducts: ["free", "foundation", "edge", "floor"],
    productionRoute: "/dashboard/prepare",
    targetWindowApproved: true,
    limitations: ["Relies on self-reported balance values"],
    dependencies: [],
    publicRoadmap: true,
    verifiedAt: "2026-08-01",
    verificationOwner: "Pete"
  },
  {
    id: "position-sizer",
    name: "Position Sizer & Calculator",
    description: "Accurate size calculation based on account risk limits.",
    workflowStages: ["plan"],
    status: "released",
    availableToProducts: ["free", "foundation", "edge", "floor"],
    productionRoute: "/dashboard/tools/position-sizer",
    targetWindowApproved: true,
    limitations: [],
    dependencies: [],
    publicRoadmap: true,
    verifiedAt: "2026-08-01",
    verificationOwner: "Pete"
  },
  {
    id: "trade-journal",
    name: "Trade Journal",
    description: "Secure recording of actual trade metrics and emotions.",
    workflowStages: ["record"],
    status: "released",
    availableToProducts: ["foundation", "edge", "floor"],
    productionRoute: "/dashboard/journal",
    targetWindowApproved: true,
    limitations: ["Manual entries and CSV imports only"],
    dependencies: [],
    publicRoadmap: true,
    verifiedAt: "2026-08-01",
    verificationOwner: "Pete"
  },
  {
    id: "ai-trade-review",
    name: "AI Trade Journal Auditor",
    description: "LLM comparison of plan vs. actual compliance metrics.",
    workflowStages: ["review"],
    status: "in_development",
    secondaryStatus: "beta",
    availableToProducts: ["edge", "floor"],
    productionRoute: "/dashboard/journal",
    targetWindowApproved: true,
    limitations: ["Requires prior pre-trade plan creation"],
    dependencies: ["trade-journal"],
    publicRoadmap: true
  },
  {
    id: "backtester",
    name: "Strategy Simulator & Backtester",
    description: "Backtest parameters against sequence expectancy models.",
    workflowStages: ["improve"],
    status: "planned",
    availableToProducts: ["edge", "floor"],
    productionRoute: "/dashboard/tools/backtester",
    targetWindowApproved: false,
    limitations: ["Historical simulated performance only"],
    dependencies: [],
    publicRoadmap: true
  },
  {
    id: "algo-builder",
    name: "Algo Strategy Builder",
    description: "Generate TradingView Pine Script rules directly from strategy logs.",
    workflowStages: ["improve"],
    status: "planned",
    availableToProducts: ["edge", "floor"],
    productionRoute: "/dashboard/tools/algo-builder",
    targetWindowApproved: false,
    limitations: ["Generates compiling scripts; requires external TV compilation"],
    dependencies: [],
    publicRoadmap: true
  }
];
