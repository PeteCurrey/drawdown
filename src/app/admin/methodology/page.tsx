"use client";

import { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Plus, 
  Search, 
  Download, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  RefreshCw,
  X
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

interface Claim {
  id?: string;
  slug: string;
  title: string;
  short_claim: string;
  original_wording?: string;
  approved_wording: string;
  category: string;
  status: string;
  evidence_strength: string;
  summary: string;
  what_it_means: string;
  what_it_does_not_mean: string;
  methodology: string;
  data_sources?: any;
  calculations?: any;
  limitations?: any;
  assumptions?: any;
  public: boolean;
  last_verified_at?: string;
}

const INITIAL_CLAIMS: Claim[] = [
  {
    slug: "market-prices",
    title: "Market Price Data & Feeds",
    short_claim: "Calculated from third-party price feeds",
    approved_wording: "Drawdown utilizes commercial third-party market data feeds to display historical prices, sessional volatility, and technical indicator values.",
    category: "market-data",
    status: "third_party",
    evidence_strength: "strong",
    summary: "How market pricing is pulled, loaded, and updated in our charting and analysis widgets.",
    what_it_means: "Market-price data supports technical analysis.",
    what_it_does_not_mean: "Does not represent institutional order books.",
    methodology: "Data requested via Twelve Data and Finnhub APIs.",
    public: true,
    last_verified_at: new Date().toISOString()
  },
  {
    slug: "technical-confluence",
    title: "Technical Confluence Grid & DCS",
    short_claim: "Mathematical confluence grid from M15 to D1",
    approved_wording: "The Technical Confluence Grid aggregates moving averages, momentum, and volatility indicators across multiple timeframes.",
    category: "technical-analysis",
    status: "derived",
    evidence_strength: "strong",
    summary: "Calculates confluence levels where multiple independent indicators align.",
    what_it_means: "Highlights indicator agreement across time horizons.",
    what_it_does_not_mean: "Does not guarantee future price action.",
    methodology: "Computed server-side using standard indicator logic.",
    public: true,
    last_verified_at: new Date().toISOString()
  },
  {
    slug: "position-sizing",
    title: "Position Sizing Calculator",
    short_claim: "Mathematical calculator based on user-entered parameters",
    approved_wording: "Position sizes are calculated using standard risk-management formulas based on user-entered parameters.",
    category: "risk-management",
    status: "verified",
    evidence_strength: "strong",
    summary: "Safety calculations to protect capital bases from over-exposure.",
    what_it_means: "Calculates trade sizes in units or lots based on risk limit.",
    what_it_does_not_mean: "Not direct order routing.",
    methodology: "Standard lot size risk formula.",
    public: true,
    last_verified_at: new Date().toISOString()
  },
  {
    slug: "platform-capabilities",
    title: "Drawdown Platform Scope",
    short_claim: "Trading education and risk-management research platform",
    approved_wording: "Drawdown is a trading education and risk-management research platform. We do not execute trades, route orders, or hold funds.",
    category: "platform-capability",
    status: "verified",
    evidence_strength: "strong",
    summary: "Clear definition of Drawdown's operational scope and legal boundaries.",
    what_it_means: "All content is for educational and analytical research.",
    what_it_does_not_mean: "Drawdown is not a broker or execution venue.",
    methodology: "Regular content audits.",
    public: true,
    last_verified_at: new Date().toISOString()
  }
];

export default function AdminMethodologyPage() {
  const [claims, setClaims] = useState<Claim[]>(INITIAL_CLAIMS);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Claim>>({});
  const [notification, setNotification] = useState<string | null>(null);

  const filteredClaims = claims.filter((claim) => {
    const matchesSearch = 
      claim.title.toLowerCase().includes(search.toLowerCase()) ||
      claim.slug.toLowerCase().includes(search.toLowerCase()) ||
      claim.short_claim.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || claim.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const togglePublic = (slug: string) => {
    setClaims((prev) =>
      prev.map((c) => (c.slug === slug ? { ...c, public: !c.public } : c))
    );
    showNotification("Claim visibility updated.");
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(claims, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `drawdown-methodology-claims-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification("Exported Claims Register as JSON.");
  };

  const exportCSV = () => {
    const headers = ["slug", "title", "category", "status", "evidence_strength", "public", "short_claim", "approved_wording"];
    const rows = claims.map((c) => [
      `"${c.slug}"`,
      `"${c.title.replace(/"/g, '""')}"`,
      `"${c.category}"`,
      `"${c.status}"`,
      `"${c.evidence_strength}"`,
      c.public ? "true" : "false",
      `"${c.short_claim.replace(/"/g, '""')}"`,
      `"${c.approved_wording.replace(/"/g, '""')}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `drawdown-claims-register-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showNotification("Exported Claims Register as CSV.");
  };

  const openNewModal = () => {
    setFormData({
      slug: "",
      title: "",
      short_claim: "",
      approved_wording: "",
      category: "market-data",
      status: "verified",
      evidence_strength: "strong",
      summary: "",
      what_it_means: "",
      what_it_does_not_mean: "",
      methodology: "",
      public: true,
    });
    setIsEditing(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.slug || !formData.title || !formData.approved_wording) {
      alert("Please fill in slug, title, and approved wording.");
      return;
    }

    const newClaim: Claim = {
      slug: formData.slug || "new-claim",
      title: formData.title || "",
      short_claim: formData.short_claim || "",
      approved_wording: formData.approved_wording || "",
      category: formData.category || "market-data",
      status: formData.status || "verified",
      evidence_strength: formData.evidence_strength || "strong",
      summary: formData.summary || "",
      what_it_means: formData.what_it_means || "",
      what_it_does_not_mean: formData.what_it_does_not_mean || "",
      methodology: formData.methodology || "",
      public: formData.public ?? true,
      last_verified_at: new Date().toISOString(),
    };

    setClaims((prev) => {
      const exists = prev.some((c) => c.slug === newClaim.slug);
      if (exists) {
        return prev.map((c) => (c.slug === newClaim.slug ? newClaim : c));
      }
      return [newClaim, ...prev];
    });

    setIsEditing(false);
    showNotification("Claim saved successfully!");
  };

  return (
    <div className="space-y-8 select-none">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#0F172A] font-bold uppercase tracking-widest mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Governance Portal</span>
          </div>
          <h1 className="text-3xl font-display font-bold uppercase tracking-tight text-[#0F172A]">
            Claims &amp; Methodology Register
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-1">
            Govern, verify, edit, and audit all evidence-led technical and marketing claims across Drawdown.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            CSV Export
          </button>

          <button
            onClick={exportJSON}
            className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-2 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            JSON Export
          </button>

          <button
            onClick={openNewModal}
            className="px-5 py-2 bg-[#0F172A] text-white rounded-lg text-xs font-mono font-bold hover:bg-slate-800 flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Register Claim
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-mono font-medium flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block">Total Claims</span>
          <span className="text-3xl font-display font-black text-[#0F172A]">{claims.length}</span>
          <span className="text-[10px] font-mono text-slate-400 block">Active evidence cards</span>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 block">Verified Claims</span>
          <span className="text-3xl font-display font-black text-[#0F172A]">
            {claims.filter((c) => c.status === "verified").length}
          </span>
          <span className="text-[10px] font-mono text-emerald-600 block">Strong evidence backing</span>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-blue-600 block">Derived / Modelled</span>
          <span className="text-3xl font-display font-black text-[#0F172A]">
            {claims.filter((c) => c.status === "derived").length}
          </span>
          <span className="text-[10px] font-mono text-blue-600 block">Mathematical calculations</span>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-600 block">Public Visibility</span>
          <span className="text-3xl font-display font-black text-[#0F172A]">
            {claims.filter((c) => c.public).length} / {claims.length}
          </span>
          <span className="text-[10px] font-mono text-amber-600 block">Published on /methodology</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, slug, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans focus:outline-none focus:border-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-500">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="market-data">Market Data</option>
            <option value="technical-analysis">Technical Analysis</option>
            <option value="artificial-intelligence">Artificial Intelligence</option>
            <option value="risk-management">Risk Management</option>
            <option value="backtesting">Backtesting</option>
            <option value="trading-journal">Trading Journal</option>
            <option value="broker-research">Broker Research</option>
            <option value="platform-capability">Platform Scope</option>
          </select>
        </div>
      </div>

      {/* Claims Table */}
      <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-mono uppercase tracking-widest text-slate-500">
              <th className="py-3 px-4">Title &amp; Slug</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Strength</th>
              <th className="py-3 px-4">Public</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs font-sans">
            {filteredClaims.map((claim) => (
              <tr key={claim.slug} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-bold text-[#0F172A]">{claim.title}</div>
                  <div className="font-mono text-[10px] text-slate-400">/methodology/{claim.slug}</div>
                </td>

                <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                  {claim.category}
                </td>

                <td className="py-3.5 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                      claim.status === "verified"
                        ? "bg-emerald-100 text-emerald-800"
                        : claim.status === "derived"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {claim.status}
                  </span>
                </td>

                <td className="py-3.5 px-4 font-mono text-[11px] uppercase text-slate-600">
                  {claim.evidence_strength}
                </td>

                <td className="py-3.5 px-4">
                  <button
                    onClick={() => togglePublic(claim.slug)}
                    className={`p-1.5 rounded transition-colors ${
                      claim.public ? "text-emerald-600 hover:bg-emerald-50" : "text-slate-400 hover:bg-slate-100"
                    }`}
                    title={claim.public ? "Published (click to hide)" : "Hidden (click to publish)"}
                  >
                    {claim.public ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </td>

                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setFormData(claim);
                        setIsEditing(true);
                      }}
                      className="p-1.5 rounded text-slate-600 hover:bg-slate-100 transition-colors"
                      title="Edit Claim"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal / Slide-over for Edit/Register */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="text-xl font-display font-bold uppercase text-[#0F172A]">
                {formData.slug ? "Edit Claim Specification" : "Register New Claim"}
              </h3>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase text-slate-500 mb-1">Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug || ""}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
                    placeholder="market-prices"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase text-slate-500 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title || ""}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    placeholder="Market Price Data & Feeds"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-slate-500 mb-1">Short Claim *</label>
                <input
                  type="text"
                  required
                  value={formData.short_claim || ""}
                  onChange={(e) => setFormData({ ...formData, short_claim: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  placeholder="Calculated from third-party price feeds"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-slate-500 mb-1">Approved Site-Wide Copy Statement *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.approved_wording || ""}
                  onChange={(e) => setFormData({ ...formData, approved_wording: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                  placeholder="Exact statement permitted on marketing and product pages..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase text-slate-500 mb-1">Category</label>
                  <select
                    value={formData.category || "market-data"}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="market-data">Market Data</option>
                    <option value="technical-analysis">Technical Analysis</option>
                    <option value="artificial-intelligence">Artificial Intelligence</option>
                    <option value="risk-management">Risk Management</option>
                    <option value="backtesting">Backtesting</option>
                    <option value="trading-journal">Trading Journal</option>
                    <option value="broker-research">Broker Research</option>
                    <option value="platform-capability">Platform Scope</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase text-slate-500 mb-1">Status</label>
                  <select
                    value={formData.status || "verified"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="verified">Verified</option>
                    <option value="derived">Derived</option>
                    <option value="third_party">Third Party</option>
                    <option value="planned">Planned (Beta)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase text-slate-500 mb-1">Evidence Strength</label>
                  <select
                    value={formData.evidence_strength || "strong"}
                    onChange={(e) => setFormData({ ...formData, evidence_strength: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="strong">Strong</option>
                    <option value="moderate">Moderate</option>
                    <option value="basic">Basic</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-slate-500 mb-1">Summary</label>
                <textarea
                  rows={2}
                  value={formData.summary || ""}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0F172A] text-white rounded-lg text-xs font-mono font-bold hover:bg-slate-800"
                >
                  Save Claim Specification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
