"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Mail, 
  Star, 
  Trash2, 
  Search, 
  Reply, 
  CheckCircle2, 
  Clock,
  MoreVertical
} from "lucide-react";

interface Lead {
  id: string;
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
  date: string;
  status: 'unread' | 'read' | 'contacted';
  priority: 'high' | 'normal';
}

const MOCK_LEADS: Lead[] = [
  {
    id: "1",
    name: "Sarah Jenkins",
    email: "s.jenkins@institutional-alpha.com",
    company: "Institutional Alpha",
    subject: "Enterprise API Integration Request",
    message: "Hi Pete,\n\nWe're looking to integrate the Drawdown indicator suite into our proprietary trading terminals. We have about 45 active traders on our desk. Can we schedule a demo to discuss enterprise pricing and API limits?\n\nBest,\nSarah",
    date: "10:42 AM",
    status: 'unread',
    priority: 'high'
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "mchen@gmail.com",
    subject: "Question about Phase 2 requirements",
    message: "Hello, I just finished the Phase 1 course and I'm looking at the Phase 2 requirements. Does the mechanical integrity badge apply to forex trades as well as indices? Thanks.",
    date: "Yesterday",
    status: 'read',
    priority: 'normal'
  },
  {
    id: "3",
    name: "David Ross",
    email: "david.r@prop-capital.io",
    company: "Prop Capital",
    subject: "Partnership Opportunity",
    message: "We love what you're doing with the Drawdown community. We are launching a new prop firm challenge specifically for algorithmic traders and would love to sponsor a newsletter issue. Let me know if you are open to a call.",
    date: "Apr 18",
    status: 'contacted',
    priority: 'high'
  }
];

export default function LeadsInboxPage() {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(leads[0].id);

  const selectedLead = leads.find(l => l.id === selectedLeadId);

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] animate-in fade-in duration-700">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold uppercase mb-2">Lead Inbox</h1>
        <p className="text-xs text-text-tertiary">Manage enterprise inquiries and priority communications.</p>
      </div>

      <div className="flex-grow bg-background-surface border border-border-slate flex overflow-hidden">
        {/* Left Pane: Lead List */}
        <div className="w-1/3 min-w-[320px] flex flex-col border-r border-border-slate bg-background-primary/50">
          <div className="p-4 border-b border-border-slate relative">
            <Search className="w-4 h-4 absolute left-7 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input 
              type="text" 
              placeholder="SEARCH LEADS..." 
              className="w-full bg-background-surface border border-border-slate pl-10 pr-4 py-2 text-[10px] uppercase font-mono outline-none focus:border-accent"
            />
          </div>
          
          <div className="flex-grow overflow-y-auto">
            {leads.map((lead) => (
              <button
                key={lead.id}
                onClick={() => setSelectedLeadId(lead.id)}
                className={cn(
                  "w-full text-left p-4 border-b border-border-slate/50 hover:bg-background-elevated transition-colors relative flex flex-col gap-2",
                  selectedLeadId === lead.id && "bg-background-elevated border-l-2 border-l-accent"
                )}
              >
                <div className="flex justify-between items-start w-full">
                  <span className={cn(
                    "text-sm font-display font-bold truncate",
                    lead.status === 'unread' ? "text-text-primary" : "text-text-secondary"
                  )}>
                    {lead.name}
                  </span>
                  <span className="text-[9px] font-mono text-text-tertiary whitespace-nowrap ml-2">
                    {lead.date}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {lead.priority === 'high' && <Star className="w-3 h-3 text-accent fill-accent" />}
                  <span className="text-[11px] font-bold truncate text-text-secondary">
                    {lead.subject}
                  </span>
                </div>
                <p className="text-[10px] text-text-tertiary line-clamp-1">
                  {lead.message}
                </p>
                {lead.status === 'unread' && (
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-accent" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right Pane: Lead Detail */}
        <div className="flex-grow flex flex-col bg-background-primary">
          {selectedLead ? (
            <>
              <div className="p-6 border-b border-border-slate flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-display font-bold uppercase mb-2">{selectedLead.subject}</h2>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="font-bold text-text-primary">{selectedLead.name}</span>
                    <span className="text-text-tertiary">&lt;{selectedLead.email}&gt;</span>
                    {selectedLead.company && (
                      <span className="px-2 py-0.5 bg-background-elevated border border-border-slate text-[9px] font-mono uppercase tracking-widest text-text-secondary">
                        {selectedLead.company}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 border border-border-slate hover:border-accent hover:text-accent transition-colors" title="Mark as Contacted">
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 border border-border-slate hover:border-loss hover:text-loss transition-colors" title="Delete Lead">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 border border-border-slate hover:border-text-primary transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-8 flex-grow overflow-y-auto">
                <div className="prose prose-invert max-w-none text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">
                  {selectedLead.message}
                </div>
              </div>

              <div className="p-4 border-t border-border-slate bg-background-surface">
                <div className="flex gap-4">
                  <button className="flex items-center gap-2 px-6 py-3 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors">
                    <Reply className="w-4 h-4" /> Reply via Email
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 border border-border-slate text-text-primary text-[10px] font-bold uppercase tracking-widest hover:bg-background-elevated transition-colors">
                    <Clock className="w-4 h-4" /> Remind Me Later
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-text-tertiary">
              <Mail className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-[10px] font-mono uppercase tracking-widest">Select a lead to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
