"use client";

import { 
  ArrowLeft, 
  Save, 
  Send, 
  Monitor, 
  Smartphone, 
  Moon, 
  Sun,
  RotateCcw,
  Eye,
  Calendar,
  ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState, useEffect } from "react";

interface EditionEditorProps {
  edition: any;
}

export function EditionEditorClient({ edition }: EditionEditorProps) {
  const [sections, setSections] = useState(edition.newsletter_sections || []);
  const [subject, setSubject] = useState(edition.subject_line || "");
  const [previewText, setPreviewText] = useState(edition.preview_text || "");
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdateSection = (id: string, content: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, edited_content: content } : s));
  };

  const handleSave = async (status?: string) => {
    setIsSaving(true);
    try {
      // Logic to save sections and edition status
      const resp = await fetch(`/api/newsletter/editions/${edition.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject_line: subject,
          preview_text: previewText,
          status: status || edition.status,
          sections: sections.map(s => ({ id: s.id, edited_content: s.edited_content }))
        })
      });
      if (resp.ok) {
        alert("Changes saved successfully.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] -mt-8">
      {/* Top Bar */}
      <div className="flex justify-between items-center bg-background-surface border-b border-border-slate px-8 py-4 mb-8">
         <div className="flex items-center gap-6">
            <Link href="/admin/newsletter" className="text-text-tertiary hover:text-text-primary transition-colors">
               <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
               <h2 className="text-sm font-bold uppercase tracking-tight">{edition.edition_type} Edition — Review</h2>
               <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
                  Scheduled for: {new Date(edition.scheduled_send_at).toLocaleString()}
               </p>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <button 
              onClick={() => handleSave()}
              disabled={isSaving}
              className="px-4 py-2 bg-background-elevated border border-border-slate text-[9px] font-bold uppercase tracking-widest hover:border-accent transition-colors flex items-center gap-2"
            >
               <Save className="w-3 h-3" /> Save Draft
            </button>
            <button 
              onClick={() => handleSave('scheduled')}
              disabled={isSaving}
              className="px-4 py-2 bg-accent text-background-primary text-[9px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-premium flex items-center gap-2"
            >
               <Calendar className="w-3 h-3" /> Approve & Schedule
            </button>
         </div>
      </div>

      <div className="flex-grow flex gap-8 min-h-0">
        {/* Left Panel: Editor */}
        <div className="w-[400px] flex-shrink-0 flex flex-col min-h-0">
           <div className="flex-grow overflow-y-auto pr-4 space-y-8 custom-scrollbar">
              <div className="space-y-4">
                 <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Subject Line</label>
                 <input 
                   type="text"
                   value={subject}
                   onChange={(e) => setSubject(e.target.value)}
                   className="w-full bg-background-surface border border-border-slate p-3 text-sm focus:outline-none focus:border-accent transition-colors"
                 />
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Preview Text</label>
                 <textarea 
                   value={previewText}
                   onChange={(e) => setPreviewText(e.target.value)}
                   className="w-full bg-background-surface border border-border-slate p-3 text-xs focus:outline-none focus:border-accent transition-colors h-20 resize-none"
                 />
              </div>

              <div className="space-y-6 pt-8 border-t border-border-slate">
                 <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent">Editorial Sections</h3>
                 {sections.map((section) => (
                   <div key={section.id} className="p-4 bg-background-surface border border-border-slate space-y-4">
                      <div className="flex justify-between items-center">
                         <span className="text-[9px] font-bold uppercase text-text-primary">{section.section_title}</span>
                         <span className="text-[8px] font-mono text-text-tertiary">{section.section_key}</span>
                      </div>
                      <textarea 
                        value={section.edited_content || section.ai_content}
                        onChange={(e) => handleUpdateSection(section.id, e.target.value)}
                        className="w-full bg-background-elevated border border-border-slate p-3 text-xs leading-relaxed focus:outline-none focus:border-accent transition-colors h-40 custom-scrollbar"
                      />
                      <div className="flex justify-between items-center">
                         <span className={cn(
                           "text-[8px] font-mono uppercase px-1",
                           section.edited_content ? "text-accent bg-accent/10" : "text-text-tertiary bg-background-elevated"
                         )}>
                            {section.edited_content ? "Human Edited" : "AI Original"}
                         </span>
                         <button 
                           onClick={() => handleUpdateSection(section.id, "")}
                           className="text-[8px] font-mono uppercase text-text-tertiary hover:text-loss flex items-center gap-1"
                         >
                            <RotateCcw className="w-2.5 h-2.5" /> Reset
                         </button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Right Panel: Live Preview */}
        <div className="flex-grow flex flex-col min-h-0 bg-background-elevated border border-border-slate">
           <div className="flex justify-between items-center px-6 py-3 border-b border-border-slate">
              <div className="flex items-center gap-2">
                 <Eye className="w-4 h-4 text-accent" />
                 <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Live Preview</span>
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex bg-background-surface border border-border-slate rounded-full p-1">
                    <button 
                      onClick={() => setViewMode('desktop')}
                      className={cn("p-1.5 rounded-full transition-colors", viewMode === 'desktop' ? "bg-accent text-background-primary" : "text-text-tertiary")}
                    >
                       <Monitor className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => setViewMode('mobile')}
                      className={cn("p-1.5 rounded-full transition-colors", viewMode === 'mobile' ? "bg-accent text-background-primary" : "text-text-tertiary")}
                    >
                       <Smartphone className="w-3.5 h-3.5" />
                    </button>
                 </div>
                 <div className="flex bg-background-surface border border-border-slate rounded-full p-1">
                    <button 
                      onClick={() => setThemeMode('dark')}
                      className={cn("p-1.5 rounded-full transition-colors", themeMode === 'dark' ? "bg-accent text-background-primary" : "text-text-tertiary")}
                    >
                       <Moon className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => setThemeMode('light')}
                      className={cn("p-1.5 rounded-full transition-colors", themeMode === 'light' ? "bg-accent text-background-primary" : "text-text-tertiary")}
                    >
                       <Sun className="w-3.5 h-3.5" />
                    </button>
                 </div>
              </div>
           </div>
           <div className="flex-grow bg-background-primary flex items-center justify-center p-8 overflow-hidden">
              <div className={cn(
                "h-full bg-white transition-all shadow-2xl",
                viewMode === 'desktop' ? "w-[600px]" : "w-[375px]"
              )}>
                 <iframe 
                   src={`/api/newsletter/preview/${edition.id}?theme=${themeMode}`}
                   className="w-full h-full border-none"
                   title="Newsletter Preview"
                 />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
