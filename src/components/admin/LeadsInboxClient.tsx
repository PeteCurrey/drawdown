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
  subject: string;
  message: string;
  created_at: string;
  status: 'unread' | 'read' | 'contacted' | 'deleted';
  priority: 'high' | 'normal';
}

interface Props {
  initialLeads: Lead[];
}

export function LeadsInboxClient({ initialLeads }: Props) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(leads[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedLead = leads.find(l => l.id === selectedLeadId);

  return (
    <div className="flex-grow bg-background-surface border border-border-slate flex overflow-hidden">
      {/* Left Pane: Lead List */}
      <div className="w-1/3 min-w-[320px] flex flex-col border-r border-border-slate bg-background-primary/50">
        <div className="p-4 border-b border-border-slate relative">
          <Search className="w-4 h-4 absolute left-7 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input 
            type="text" 
            placeholder="SEARCH LEADS..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background-surface border border-border-slate pl-10 pr-4 py-2 text-[10px] uppercase font-mono outline-none focus:border-accent"
          />
        </div>
        
        <div className="flex-grow overflow-y-auto">
          {filteredLeads.map((lead) => (
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
                  {new Date(lead.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
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
          {filteredLeads.length === 0 && (
            <div className="p-8 text-center text-text-tertiary text-[10px] font-mono uppercase">
              No leads found
            </div>
          )}
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
                <a 
                  href={`mailto:${selectedLead.email}?subject=RE: ${selectedLead.subject}`}
                  className="flex items-center gap-2 px-6 py-3 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors"
                >
                  <Reply className="w-4 h-4" /> Reply via Email
                </a>
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
  );
}
