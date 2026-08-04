"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrackPageView } from "@/components/admin/TrackPageView";
import Link from "next/link";
import {
  BookOpen,
  Activity,
  Cpu,
  ShieldAlert,
  Users,
  Terminal,
  Layers,
  Compass,
  Zap,
  ArrowRight,
  CheckCircle,
  Calendar,
  Lock,
  Sparkles,
  Inbox,
  Filter
} from "lucide-react";

// Roadmap items structure
interface RoadmapItem {
  id: string;
  phase: string;
  title: string;
  subtitle: string;
  description: string;
  status: "released" | "active" | "planned";
  targetQuarter: string;
  category: "core" | "ai" | "tools" | "institutional";
  icon: React.ComponentType<any>;
  details: string[];
}

const ROADMAP_ITEMS: RoadmapItem[] = [
  {
    id: "curriculum",
    phase: "Phase 1: Educational Core",
    title: "Institutional Video Curriculum",
    subtitle: "Complete platform onboarding modules",
    description: "60+ bite-sized high-fidelity modules covering quantitative edge, market microstructure, and algorithmic risk limits.",
    status: "released",
    targetQuarter: "Q1-Q2 2026",
    category: "core",
    icon: BookOpen,
    details: [
      "Rigorous retail-to-institutional transition blueprints",
      "Interactive knowledge checkmarks at the end of modules",
      "Full video transcript search and keyword parsing"
    ]
  },
  {
    id: "funded-tracker",
    phase: "Phase 1: Educational Core",
    title: "Funded Scaling Tracker",
    subtitle: "Prop firm progress dashboard",
    description: "Interactive tracking for evaluation stages, drawdown targets, and milestones across top prop firms.",
    status: "released",
    targetQuarter: "Q2 2026",
    category: "core",
    icon: Activity,
    details: [
      "Multi-account overview trackers for major firm challenge rules",
      "Real-time evaluation percentage target meters",
      "Historical drawdown cushion calculation"
    ]
  },
  {
    id: "risk-watch",
    phase: "Phase 2: Intelligent Risk Suite",
    title: "News-Day Risk Watch",
    subtitle: "High-impact macro event blocker",
    description: "Real-time calendar checking with dynamic warning filters and sizing recommendations for high-impact macro announcements.",
    status: "released",
    targetQuarter: "Q3 2026",
    category: "tools",
    icon: ShieldAlert,
    details: [
      "Auto-sync of Tier-1 macro alerts directly on trading days",
      "Automated leverage reduction warning before US/UK reports",
      "Historical slippage and spread volatility reports"
    ]
  },
  {
    id: "mentorship-workspace",
    phase: "Phase 2: Intelligent Risk Suite",
    title: "Coaching Session Hub",
    subtitle: "Interactive 1-to-1 mentorship portal",
    description: "Spacious mentorship scheduling hub featuring custom Cal.com booking widgets, preparation guides, and sessional logs archive.",
    status: "released",
    targetQuarter: "Q3 2026",
    category: "core",
    icon: Users,
    details: [
      "Seamless inline integration of sessional booking modules",
      "Archived historical notes from past 1-on-1 calls with Pete",
      "Custom pre-session goal forms to direct coaching focus"
    ]
  },
  {
    id: "ai-journal",
    phase: "Phase 2: Intelligent Risk Suite",
    title: "AI Trade Journal Engine",
    subtitle: "Machine learning behavioral auditor",
    description: "Automatic trade importing with LLM-powered psychological auditing, emotional trigger mapping, and risk-of-ruin analytics.",
    status: "active",
    targetQuarter: "Q3 2026",
    category: "ai",
    icon: Cpu,
    details: [
      "Direct API integrations with MT4/MT5/cTrader terminals",
      "Behavioral leakage analysis (finding trades born from FOMO)",
      "Automated trade logs auditing based on historical metrics"
    ]
  },
  {
    id: "pine-script",
    phase: "Phase 3: Backtesting & Custom Projections",
    title: "Pine Indicator Generator",
    subtitle: "Codify your rules with zero friction",
    description: "Generate robust, rule-abiding TradingView Pine Script indicators using AI models trained on Pete's institutional strategies.",
    status: "planned",
    targetQuarter: "Q4 2026",
    category: "tools",
    icon: Terminal,
    details: [
      "Instant translation of rule parameters into fully compiling script",
      "Auto-integrated webhook syntax for server routing",
      "Built-in error mitigation for Next-Gen Pine compilers"
    ]
  },
  {
    id: "monte-carlo",
    phase: "Phase 3: Backtesting & Custom Projections",
    title: "Simulator & Backtester",
    subtitle: "Expected expectancy calculator",
    description: "Simulate strategy parameters against sequence luck and standard prop firm evaluation conditions to calculate mathematical ruin.",
    status: "planned",
    targetQuarter: "Q4 2026",
    category: "tools",
    icon: Layers,
    details: [
      "10,000x sequence shuffler for statistical expectancy verification",
      "Dynamic daily-drawdown boundary failure calculator",
      "Risk-to-reward ratio stress test graphs"
    ]
  },
  {
    id: "scanner",
    phase: "Phase 4: Institutional Scale",
    title: "Algorithmic Technical Scanner",
    subtitle: "Macro liquidity visualizer",
    description: "Screener scanning 50+ forex pairs and indices for institutional liquidity voids, imbalance blocks, and order-flow footprints.",
    status: "planned",
    targetQuarter: "H1 2027",
    category: "institutional",
    icon: Compass,
    details: [
      "Multi-timeframe void maps and fair-value gap triggers",
      "Systemic imbalance tracking in footstep charts",
      "Real-time alerts via platform push and Telegram integration"
    ]
  },
  {
    id: "webhook-bridge",
    phase: "Phase 4: Institutional Scale",
    title: "Prop Webhook Bridge",
    subtitle: "Server execution routing",
    description: "Direct trading execution path from TradingView alert scripts straight to supported prop firm broker accounts.",
    status: "planned",
    targetQuarter: "H2 2027",
    category: "institutional",
    icon: Zap,
    details: [
      "Sub-100ms ultra-low latency execution routes",
      "Prop firm consistency-rule compliance protector",
      "Encrypted API keys security and multi-terminal sync"
    ]
  }
];

const CATEGORIES = [
  { id: "all", label: "All Sectors" },
  { id: "core", label: "Core Hub" },
  { id: "ai", label: "AI Engine" },
  { id: "tools", label: "Risk Tools" },
  { id: "institutional", label: "Institutional" }
];

const STATUSES = [
  { id: "all", label: "All Statuses" },
  { id: "released", label: "Released", color: "text-emerald-500" },
  { id: "active", label: "In Progress", color: "text-amber-500" },
  { id: "planned", label: "Planned", color: "text-slate-400" }
];

export default function RoadmapClient() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredItems = useMemo(() => {
    return ROADMAP_ITEMS.filter((item) => {
      const matchCat = selectedCategory === "all" || item.category === selectedCategory;
      const matchStat = selectedStatus === "all" || item.status === selectedStatus;
      return matchCat && matchStat;
    });
  }, [selectedCategory, selectedStatus]);

  const stats = useMemo(() => {
    const counts = { released: 0, active: 0, planned: 0 };
    ROADMAP_ITEMS.forEach((item) => {
      counts[item.status]++;
    });
    return counts;
  }, []);

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <TrackPageView path="/roadmap" />
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Hero Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-[11px] font-sans font-bold text-text-tertiary uppercase tracking-widest block mb-4">
            // DRAWDOWN SYSTEM ROADMAP
          </span>
          <h1 className="text-4xl md:text-6xl font-sans font-extrabold tracking-tight text-text-primary leading-tight mb-6">
            Building the Infrastructure <br />
            of <span className="text-accent">Sustained Trading.</span>
          </h1>
          <p className="text-base text-text-tertiary leading-relaxed font-sans max-w-2xl">
            We systematically replace retail hype with institutional mathematical expectation. 
            Track our progress below as we deploy next-generation AI trade journaling, 
            automated risk controllers, and prop firm scaling bridges.
          </p>
        </div>

        {/* System Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12 p-6 bg-background-elevated/40 border border-border-slate/50 rounded-[14px]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] font-mono text-text-tertiary uppercase tracking-wider">Released Features</span>
              <span className="text-xl font-bold text-text-primary">{stats.released} Live Engines</span>
            </div>
          </div>
          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-border-slate/50 pt-4 md:pt-0 md:pl-6">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0 animate-pulse">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] font-mono text-text-tertiary uppercase tracking-wider">In Active Code Development</span>
              <span className="text-xl font-bold text-text-primary">{stats.active} Core System</span>
            </div>
          </div>
          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-border-slate/50 pt-4 md:pt-0 md:pl-6">
            <div className="w-10 h-10 rounded-lg bg-slate-500/10 border border-slate-500/20 flex items-center justify-center text-text-tertiary shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] font-mono text-text-tertiary uppercase tracking-wider">Planned Integrations</span>
              <span className="text-xl font-bold text-text-primary">{stats.planned} Upcoming Engines</span>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-10 pb-6 border-b border-border-slate/40">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    active
                      ? "bg-text-primary text-background-primary shadow-sm"
                      : "bg-background-elevated/40 border border-border-slate/30 text-text-tertiary hover:text-text-primary hover:bg-background-elevated/80"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Status selector */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <Filter className="w-3.5 h-3.5 text-text-tertiary shrink-0" />
            <span className="text-xs text-text-tertiary font-bold">Status:</span>
            <div className="flex gap-1.5">
              {STATUSES.map((stat) => {
                const active = selectedStatus === stat.id;
                return (
                  <button
                    key={stat.id}
                    onClick={() => setSelectedStatus(stat.id)}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase transition-all ${
                      active
                        ? "bg-background-elevated text-text-primary border border-border-slate"
                        : "text-text-tertiary hover:text-text-primary"
                    }`}
                  >
                    {stat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <AnimatePresence mode="popLayout">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, i) => {
                const IconComponent = item.icon;
                
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -12 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="flex flex-col h-full bg-white border border-border-slate/50 rounded-[14px] p-6 relative group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] overflow-hidden"
                  >
                    {/* Corner Tag/Status */}
                    <div className="flex items-center justify-between mb-5 relative z-10">
                      <span className="text-[10px] font-mono text-text-tertiary tracking-wider uppercase">
                        {item.targetQuarter}
                      </span>
                      
                      {item.status === "released" && (
                        <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 shrink-0" /> Released
                        </span>
                      )}
                      {item.status === "active" && (
                        <span className="bg-amber-500/10 text-amber-600 border border-amber-500/20 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase flex items-center gap-1 animate-pulse">
                          <Sparkles className="w-3 h-3 shrink-0" /> Active Code
                        </span>
                      )}
                      {item.status === "planned" && (
                        <span className="bg-slate-500/10 text-text-tertiary border border-border-slate/80 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5 shrink-0" /> Planned
                        </span>
                      )}
                    </div>

                    {/* Title and Icon */}
                    <div className="flex items-start gap-4 mb-4 relative z-10">
                      <div className={`p-3 rounded-lg shrink-0 border ${
                        item.status === "released" 
                          ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-500" 
                          : item.status === "active"
                            ? "bg-amber-500/5 border-amber-500/10 text-amber-500"
                            : "bg-slate-500/5 border-border-slate/60 text-text-tertiary"
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block text-[8px] font-sans font-bold tracking-widest text-text-tertiary uppercase mb-1">
                          {item.phase}
                        </span>
                        <h3 className="text-md font-sans font-extrabold tracking-tight text-text-primary group-hover:text-accent transition-colors">
                          {item.title}
                        </h3>
                        <span className="block text-[11px] text-text-tertiary mt-0.5">{item.subtitle}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-text-tertiary leading-relaxed font-sans mb-6 flex-grow relative z-10">
                      {item.description}
                    </p>

                    {/* Checkmarks / Details */}
                    <ul className="space-y-2 pt-5 border-t border-border-slate/30 mt-auto relative z-10">
                      {item.details.map((detail, idx) => (
                        <li key={idx} className="flex gap-2 items-start text-[11px] text-text-tertiary font-sans leading-relaxed">
                          <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            item.status === "released"
                              ? "bg-emerald-500/10 text-emerald-500 font-mono text-[9px]"
                              : "bg-background-elevated text-text-tertiary font-mono text-[9px]"
                          }`}>
                            ✓
                          </span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Subtle micro-animation glow layer */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,var(--accent-glow),transparent_60%)] opacity-0 group-hover:opacity-4 transition-opacity duration-500 pointer-events-none" />
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-16 text-center text-text-tertiary"
              >
                <Inbox className="w-8 h-8 mx-auto text-text-tertiary opacity-40 mb-4" />
                <h3 className="font-bold text-text-primary mb-1">No matching modules found</h3>
                <p className="text-xs">Adjust your active sector filters or statuses to see other items.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Feature Suggestion CTA */}
        <div className="bg-background-surface border border-border-slate/50 p-8 md:p-16 rounded-[14px] text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[#06070A]/5 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] opacity-10 pointer-events-none" />
          <div className="max-w-2xl mx-auto relative z-10">
            <h2 className="text-2xl md:text-3xl font-sans font-extrabold tracking-tight text-text-primary mb-4 uppercase">
              Have a Specific Feature Request?
            </h2>
            <p className="text-sm text-text-tertiary leading-relaxed mb-8 max-w-lg mx-auto">
              We shape our development directly around actual sessional feedback from our funded traders. 
              Let us know what indicators, integrations, or calculations you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="bg-text-primary text-background-primary px-5 py-3 rounded-lg text-xs font-bold hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
              >
                Submit Feature Request
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/courses"
                className="bg-background-elevated/40 border border-border-slate/50 text-text-primary px-5 py-3 rounded-lg text-xs font-bold hover:bg-background-elevated transition-colors flex items-center justify-center"
              >
                Explore Current Platform
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
