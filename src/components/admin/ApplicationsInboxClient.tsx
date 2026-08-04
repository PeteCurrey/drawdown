"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Mail, 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  FileText,
  User,
  Coins,
  TrendingUp,
  Award,
  Sparkles,
  Save,
  Loader2
} from "lucide-react";
import { updateApplicationStatusAction } from "@/app/actions/accelerator-actions";

export interface AcceleratorApplication {
  id: string;
  full_name: string;
  email: string;
  experience_level: string;
  trading_capital: string;
  motivation: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected' | string;
  admin_notes?: string;
  created_at: string;
  updated_at?: string;
}

interface Props {
  initialApplications: AcceleratorApplication[];
}

export function ApplicationsInboxClient({ initialApplications }: Props) {
  const [apps, setApps] = useState<AcceleratorApplication[]>(initialApplications);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(apps[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [adminNotes, setAdminNotes] = useState(apps[0]?.admin_notes || "");
  const [isUpdating, setIsSubmitting] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const filteredApps = apps.filter(app => 
    app.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.motivation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedApp = apps.find(app => app.id === selectedAppId);

  const handleSelectApp = (id: string) => {
    setSelectedAppId(id);
    const selected = apps.find(app => app.id === id);
    setAdminNotes(selected?.admin_notes || "");
    setUpdateMessage(null);
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedAppId) return;
    setIsSubmitting(true);
    setUpdateMessage(null);

    try {
      const res = await updateApplicationStatusAction(selectedAppId, status, adminNotes);
      if (res.success && res.data) {
        setApps(prev => prev.map(app => app.id === selectedAppId ? { 
          ...app, 
          status, 
          admin_notes: adminNotes,
          updated_at: new Date().toISOString()
        } : app));
        setUpdateMessage({ type: 'success', text: `Application marked as ${status} successfully.` });
      } else {
        setUpdateMessage({ type: 'error', text: res.error || "Failed to update application." });
      }
    } catch (err: any) {
      setUpdateMessage({ type: 'error', text: err.message || "An unexpected error occurred." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedApp) return;
    setIsSubmitting(true);
    setUpdateMessage(null);

    try {
      const res = await updateApplicationStatusAction(selectedApp.id, selectedApp.status, adminNotes);
      if (res.success && res.data) {
        setApps(prev => prev.map(app => app.id === selectedApp.id ? { 
          ...app, 
          admin_notes: adminNotes,
          updated_at: new Date().toISOString()
        } : app));
        setUpdateMessage({ type: 'success', text: "Admin notes updated successfully." });
      } else {
        setUpdateMessage({ type: 'error', text: res.error || "Failed to save notes." });
      }
    } catch (err: any) {
      setUpdateMessage({ type: 'error', text: err.message || "An unexpected error occurred." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-grow bg-white border border-neutral-200 flex overflow-hidden rounded-lg shadow-sm" style={{ height: "calc(100vh - 15rem)" }}>
      
      {/* Left Pane: Applications List */}
      <div className="w-1/3 min-w-[320px] flex flex-col border-r border-neutral-200 bg-neutral-50/50">
        <div className="p-4 border-b border-neutral-200 relative">
          <Search className="w-4 h-4 absolute left-7 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input 
            type="text" 
            placeholder="Search candidates..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-neutral-200 pl-10 pr-4 py-2 text-xs font-mono outline-none focus:border-[#E2B755] focus:ring-1 focus:ring-[#E2B755]"
          />
        </div>
        
        <div className="flex-grow overflow-y-auto divide-y divide-neutral-100">
          {filteredApps.map((app) => (
            <button
              key={app.id}
              onClick={() => handleSelectApp(app.id)}
              className={cn(
                "w-full text-left p-4 hover:bg-neutral-50 transition-all duration-200 relative flex flex-col gap-2 border-l-2",
                selectedAppId === app.id ? "bg-white border-l-[#E2B755]" : "border-l-transparent"
              )}
            >
              <div className="flex justify-between items-start w-full">
                <span className="text-sm font-bold text-neutral-900 truncate">
                  {app.full_name}
                </span>
                <span className="text-[10px] font-mono text-neutral-400 whitespace-nowrap ml-2">
                  {new Date(app.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                </span>
              </div>
              
              <div className="flex items-center justify-between w-full">
                <span className="text-xs text-neutral-500 truncate max-w-[150px]">{app.email}</span>
                <span className={cn(
                  "text-[9px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded border",
                  app.status === 'approved' && "text-emerald-700 bg-emerald-50 border-emerald-200",
                  app.status === 'reviewing' && "text-blue-700 bg-blue-50 border-blue-200",
                  app.status === 'rejected' && "text-rose-700 bg-rose-50 border-rose-200",
                  app.status === 'pending' && "text-amber-700 bg-amber-50 border-amber-200"
                )}>
                  {app.status}
                </span>
              </div>

              <div className="flex gap-3 text-[10px] font-mono text-neutral-400">
                <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3 text-neutral-400" /> {app.experience_level}</span>
                <span className="flex items-center gap-1"><Coins className="w-3 h-3 text-neutral-400" /> {app.trading_capital}</span>
              </div>
            </button>
          ))}
          {filteredApps.length === 0 && (
            <div className="p-8 text-center text-neutral-400 text-xs font-mono uppercase">
              No applications archived
            </div>
          )}
        </div>
      </div>

      {/* Right Pane: Application Dossier Detail */}
      <div className="flex-grow flex flex-col bg-white">
        {selectedApp ? (
          <>
            {/* Top Toolbar bar */}
            <div className="p-6 border-b border-neutral-200 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-neutral-900 tracking-tight">{selectedApp.full_name}</h2>
                  <span className={cn(
                    "text-[10px] font-mono uppercase tracking-wider font-bold px-2.5 py-0.5 rounded border ml-2",
                    selectedApp.status === 'approved' && "text-emerald-700 bg-emerald-50 border-emerald-200",
                    selectedApp.status === 'reviewing' && "text-blue-700 bg-blue-50 border-blue-200",
                    selectedApp.status === 'rejected' && "text-rose-700 bg-rose-50 border-rose-200",
                    selectedApp.status === 'pending' && "text-amber-700 bg-amber-50 border-amber-200"
                  )}>
                    {selectedApp.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-neutral-500">
                  <span className="font-mono">{selectedApp.email}</span>
                  <span>&bull;</span>
                  <span>Submitted {new Date(selectedApp.created_at).toLocaleString('en-GB')}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleUpdateStatus("reviewing")}
                  disabled={isUpdating}
                  className="px-3 py-1.5 border border-neutral-200 hover:border-blue-300 text-blue-700 bg-blue-50/50 hover:bg-blue-50 text-xs font-mono uppercase tracking-wider font-bold rounded flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                  title="Mark as Reviewing"
                >
                  <Clock className="w-3.5 h-3.5" /> Review
                </button>
                <button 
                  onClick={() => handleUpdateStatus("approved")}
                  disabled={isUpdating}
                  className="px-3 py-1.5 border border-neutral-200 hover:border-emerald-300 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-50 text-xs font-mono uppercase tracking-wider font-bold rounded flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                  title="Approve Candidate"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Approve
                </button>
                <button 
                  onClick={() => handleUpdateStatus("rejected")}
                  disabled={isUpdating}
                  className="px-3 py-1.5 border border-neutral-200 hover:border-rose-300 text-rose-700 bg-rose-50/50 hover:bg-rose-50 text-xs font-mono uppercase tracking-wider font-bold rounded flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                  title="Reject Candidate"
                >
                  <XCircle className="w-3.5 h-3.5" /> Reject
                </button>
              </div>
            </div>

            {/* Dossier Body */}
            <div className="p-8 flex-grow overflow-y-auto space-y-6">
              
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-neutral-100 bg-neutral-50/30 p-4 rounded-md">
                  <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 uppercase tracking-widest mb-1">
                    <TrendingUp className="w-3.5 h-3.5 text-neutral-400" /> Experience Tier
                  </div>
                  <span className="text-sm font-bold text-neutral-800">{selectedApp.experience_level}</span>
                </div>
                <div className="border border-neutral-100 bg-neutral-50/30 p-4 rounded-md">
                  <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 uppercase tracking-widest mb-1">
                    <Coins className="w-3.5 h-3.5 text-neutral-400" /> Projected Capital
                  </div>
                  <span className="text-sm font-bold text-neutral-800">{selectedApp.trading_capital}</span>
                </div>
              </div>

              {/* Motivation Section */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-neutral-400" /> Motivation Statement & Objectives
                </h3>
                <div className="bg-neutral-50 border border-neutral-150 p-6 rounded-md text-sm text-neutral-700 whitespace-pre-wrap leading-relaxed italic">
                  &ldquo;{selectedApp.motivation}&rdquo;
                </div>
              </div>

              {/* Status Update Toast banner */}
              {updateMessage && (
                <div className={cn(
                  "p-3 rounded text-xs leading-relaxed font-mono border flex items-center gap-2",
                  updateMessage.type === 'success' ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-rose-50 border-rose-200 text-rose-800"
                )}>
                  {updateMessage.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />}
                  {updateMessage.text}
                </div>
              )}

              {/* Admin Private Journal Notes */}
              <div className="space-y-3 pt-4 border-t border-neutral-100">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-neutral-400" /> Private Admin Journal Notes
                  </h3>
                  <button 
                    onClick={handleSaveNotes}
                    disabled={isUpdating}
                    className="text-[10px] font-mono uppercase font-bold text-[#E2B755] hover:text-[#cfa444] flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                    Save Journal Notes
                  </button>
                </div>
                <textarea 
                  rows={4}
                  placeholder="Record interview logs, qualification indicators, background check notes or general notes here..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full bg-white border border-neutral-200 p-4 text-xs font-sans text-neutral-800 focus:outline-none focus:border-[#E2B755] focus:ring-1 focus:ring-[#E2B755] rounded"
                />
              </div>
            </div>

            {/* Quick Email link panel */}
            <div className="p-4 border-t border-neutral-200 bg-neutral-50/50">
              <div className="flex gap-4">
                <a 
                  href={`mailto:${selectedApp.email}?subject=Drawdown Institutional Accelerator Application &body=Hi ${selectedApp.full_name.split(' ')[0] || 'Trader'},%0D%0A%0D%0AThank you for applying for the Institutional Accelerator.`}
                  className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors rounded"
                >
                  <Mail className="w-4 h-4" /> Initiate Email Contact
                </a>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-neutral-400">
            <Sparkles className="w-12 h-12 mb-4 text-neutral-300 animate-pulse" />
            <p className="text-xs font-mono uppercase tracking-widest">Select an applicant dossier to evaluate</p>
          </div>
        )}
      </div>
    </div>
  );
}
