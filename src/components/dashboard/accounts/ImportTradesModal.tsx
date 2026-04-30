"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  ArrowRight,
  Database,
  Loader2
} from "lucide-react";
import { FundedAccount } from "@/types/dashboard";
import { parseTradeCSV, ParseResult } from "@/lib/imports/csv-parser";

interface ImportTradesModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: FundedAccount[];
  onImport: (accountId: string, trades: any[]) => void;
}

export function ImportTradesModal({ isOpen, onClose, accounts, onImport }: ImportTradesModalProps) {
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setIsParsing(true);
      
      const reader = new FileReader();
      reader.onload = async (event) => {
        const content = event.target?.result as string;
        const result = await parseTradeCSV(content);
        setParseResult(result);
        setIsParsing(false);
      };
      reader.readAsText(selectedFile);
    }
  };

  const reset = () => {
    setFile(null);
    setParseResult(null);
    setIsSubmitting(false);
  };

  const handleConfirm = async () => {
    if (!selectedAccountId || !parseResult) return;
    setIsSubmitting(true);
    await onImport(selectedAccountId, parseResult.trades);
    setIsSubmitting(false);
    reset();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background-primary/95 backdrop-blur-xl">
      <div className="relative w-full max-w-2xl bg-background-surface border border-border-slate shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        <div className="p-8 border-b border-border-slate flex justify-between items-center bg-background-elevated">
           <div className="space-y-1">
              <span className="text-[10px] font-mono text-accent uppercase tracking-widest">// DATA SYNCHRONIZATION</span>
              <h2 className="text-xl font-display font-black uppercase">Import Trade Log</h2>
           </div>
           <button onClick={onClose} className="p-2 text-text-tertiary hover:text-text-primary transition-colors">
              <X className="w-6 h-6" />
           </button>
        </div>

        <div className="p-8 space-y-8">
           <div className="space-y-4">
              <label className="text-[10px] font-mono uppercase text-text-tertiary tracking-widest">Target Account</label>
              <select 
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className="w-full bg-background-primary border border-border-slate p-4 text-sm outline-none focus:border-accent"
              >
                <option value="">Select an account...</option>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>{acc.account_name} ({acc.prop_firms?.name})</option>
                ))}
              </select>
           </div>

           {!file ? (
             <div 
               onClick={() => fileInputRef.current?.click()}
               className="border-2 border-dashed border-border-slate p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-accent/40 hover:bg-accent/5 transition-all group"
             >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept=".csv" 
                  className="hidden" 
                />
                <div className="w-12 h-12 rounded-full bg-background-elevated flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                   <Upload className="w-6 h-6 text-text-tertiary group-hover:text-accent" />
                </div>
                <h4 className="text-sm font-bold uppercase mb-1">Click to Upload CSV</h4>
                <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Supports MT4, MT5 and cTrader Reports</p>
             </div>
           ) : (
             <div className="p-6 border border-accent/20 bg-accent/5 space-y-6">
                <div className="flex justify-between items-start">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-background-primary border border-border-slate flex items-center justify-center">
                         <FileText className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                         <h4 className="text-sm font-bold uppercase truncate max-w-[250px]">{file.name}</h4>
                         <p className="text-[10px] font-mono text-text-tertiary uppercase">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                   </div>
                   {!isSubmitting && <button onClick={reset} className="text-[10px] font-bold uppercase text-loss hover:underline">Remove</button>}
                </div>

                {isParsing ? (
                  <div className="flex items-center gap-3 py-2">
                     <Loader2 className="w-4 h-4 text-accent animate-spin" />
                     <span className="text-[10px] font-mono uppercase text-text-tertiary">Parsing data structure...</span>
                  </div>
                ) : parseResult && (
                  <div className="space-y-4">
                     {parseResult.errors.length > 0 ? (
                       <div className="p-4 bg-loss/5 border border-loss/20 flex gap-3">
                          <AlertCircle className="w-4 h-4 text-loss shrink-0" />
                          <p className="text-[10px] text-loss leading-relaxed font-mono uppercase">{parseResult.errors[0]}</p>
                       </div>
                     ) : (
                       <div className="p-4 bg-profit/5 border border-profit/20 flex flex-col gap-3">
                          <div className="flex items-center gap-3">
                             <CheckCircle2 className="w-4 h-4 text-profit shrink-0" />
                             <p className="text-[10px] text-profit font-bold uppercase tracking-widest">
                               Validated: {parseResult.trades.length} Trades Found ({parseResult.platform.toUpperCase()})
                             </p>
                          </div>
                       </div>
                     )}
                  </div>
                )}
             </div>
           )}
        </div>

        <div className="p-8 border-t border-border-slate bg-background-elevated flex justify-between items-center">
           <div className="flex items-center gap-2 text-text-tertiary">
              <Database className="w-4 h-4" />
              <span className="text-[10px] font-mono uppercase tracking-widest">Secure Multi-Platform Import</span>
           </div>
           <button 
             onClick={handleConfirm}
             disabled={!selectedAccountId || !parseResult || parseResult.errors.length > 0 || isSubmitting}
             className="px-10 py-4 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors flex items-center gap-2 disabled:opacity-50"
           >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              Finalize Import
           </button>
        </div>
      </div>
    </div>
  );
}
