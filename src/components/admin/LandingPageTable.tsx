"use client";
 
 import { useState } from "react";
 import Link from "next/link";
 import { cn } from "@/lib/utils";
 import { 
   Search, 
   MoreVertical,
   ExternalLink,
   Filter,
   Globe,
   ShieldCheck
 } from "lucide-react";
 import { SEOPageInfo } from "@/lib/admin";
 
 interface Props {
   allPages: SEOPageInfo[];
 }
 
 export function LandingPageTable({ allPages }: Props) {
   const [searchQuery, setSearchQuery] = useState("");
   const [activeCategory, setActiveCategory] = useState<string>("All");
   const [activeRegion, setActiveRegion] = useState<string>("All");
   const [showAffiliateOnly, setShowAffiliateOnly] = useState(false);
 
   const categories = ["All", ...Array.from(new Set(allPages.map(p => p.category)))];
   const regions = ["All", ...Array.from(new Set(allPages.map(p => p.region || "Global")))];
 
   const filteredPages = allPages.filter(p => {
     const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.slug.toLowerCase().includes(searchQuery.toLowerCase());
     const matchesCategory = activeCategory === "All" || p.category === activeCategory;
     const matchesRegion = activeRegion === "All" || (p.region || "Global") === activeRegion;
     const matchesAffiliate = !showAffiliateOnly || p.isAffiliate;
     
     return matchesSearch && matchesCategory && matchesRegion && matchesAffiliate;
   });
 
   return (
     <div className="bg-background-surface border border-border-slate flex flex-col">
       {/* Filters Header */}
       <div className="p-6 border-b border-border-slate bg-background-elevated/30 space-y-6">
         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="relative w-full lg:w-1/3">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input 
                type="text" 
                placeholder="SEARCH PROGRAMMATIC ASSETS..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background-primary border border-border-slate pl-10 pr-4 py-3 text-[10px] uppercase font-mono outline-none focus:border-accent"
              />
            </div>
            
            <div className="flex items-center gap-4 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
               <button 
                onClick={() => setShowAffiliateOnly(!showAffiliateOnly)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 border text-[9px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                  showAffiliateOnly ? "bg-profit/10 border-profit text-profit" : "border-border-slate text-text-tertiary hover:border-text-tertiary"
                )}
               >
                 <ShieldCheck className={cn("w-3.5 h-3.5", showAffiliateOnly ? "text-profit" : "text-text-tertiary")} />
                 Premium / Affiliate
               </button>
 
               <div className="h-8 w-[1px] bg-border-slate hidden lg:block" />
 
               <div className="flex items-center gap-2">
                 <Filter className="w-3.5 h-3.5 text-text-tertiary" />
                 <select 
                   value={activeRegion}
                   onChange={(e) => setActiveRegion(e.target.value)}
                   className="bg-background-primary border border-border-slate px-3 py-2 text-[9px] font-bold uppercase tracking-widest outline-none focus:border-accent"
                 >
                   {regions.map(r => <option key={r} value={r}>Region: {r}</option>)}
                 </select>
               </div>
            </div>
         </div>
 
         {/* Category Pills */}
         <div className="flex gap-2 overflow-x-auto no-scrollbar">
           {categories.map(cat => (
             <button 
               key={cat}
               onClick={() => setActiveCategory(cat)}
               className={cn(
                 "px-4 py-2 border text-[8px] font-bold uppercase tracking-[0.2em] transition-all whitespace-nowrap",
                 activeCategory === cat ? "bg-accent border-accent text-background-primary" : "border-border-slate text-text-tertiary hover:bg-background-elevated"
               )}
             >
               {cat}
             </button>
           ))}
         </div>
       </div>
 
       <div className="overflow-x-auto max-h-[700px] overflow-y-auto custom-scrollbar">
         <table className="w-full text-left border-collapse">
           <thead className="bg-background-primary text-[9px] font-mono uppercase tracking-[0.2em] text-text-tertiary border-b border-border-slate sticky top-0 z-10">
             <tr>
               <th className="px-6 py-5">Identity & Path</th>
               <th className="px-6 py-5">Market Context</th>
               <th className="px-6 py-5">Asset Class</th>
               <th className="px-6 py-5 text-right">Utility</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-border-slate/30">
             {filteredPages.slice(0, 150).map((page, i) => (
               <tr key={i} className="hover:bg-background-elevated/20 transition-all group border-b border-border-slate/10">
                 <td className="px-6 py-5">
                   <div className="flex flex-col gap-1">
                     <div className="flex items-center gap-2">
                       <span className="font-display font-bold text-sm tracking-tight text-text-primary">{page.title}</span>
                       {page.isAffiliate && (
                         <span className="px-1.5 py-0.5 bg-profit/10 border border-profit/20 text-profit text-[7px] font-mono uppercase font-bold">Partner</span>
                       )}
                     </div>
                     <span className="text-[10px] font-mono text-text-tertiary flex items-center gap-1">
                       <Link href={page.slug} target="_blank" className="hover:text-accent flex items-center gap-1 transition-colors">
                         {page.slug} <ExternalLink className="w-2.5 h-2.5" />
                       </Link>
                     </span>
                   </div>
                 </td>
                 <td className="px-6 py-5">
                   <div className="flex items-center gap-2">
                     <Globe className="w-3 h-3 text-text-tertiary" />
                     <span className="px-2 py-1 bg-background-elevated border border-border-slate text-[9px] font-mono uppercase tracking-widest text-text-secondary">
                       {page.region || "Global"}
                     </span>
                   </div>
                 </td>
                 <td className="px-6 py-5">
                   <div className="flex flex-col gap-1">
                     <span className="text-[9px] font-bold uppercase tracking-widest text-text-tertiary">{page.type}</span>
                     <span className="text-[10px] text-text-secondary">{page.category}</span>
                   </div>
                 </td>
                 <td className="px-6 py-5 text-right">
                   <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                     <Link 
                       href={`/admin/seo/analytics?path=${page.slug}`}
                       className="flex items-center gap-2 px-3 py-1.5 bg-background-primary border border-border-slate hover:border-accent text-text-tertiary hover:text-accent transition-all text-[9px] font-bold uppercase tracking-widest"
                     >
                       Data Pulse
                     </Link>
                     <button 
                       className="p-1.5 border border-border-slate hover:border-accent text-text-tertiary hover:text-accent transition-colors"
                       title="Edit Configuration"
                     >
                       <MoreVertical className="w-4 h-4" />
                     </button>
                   </div>
                 </td>
               </tr>
             ))}
             
             {filteredPages.length === 0 && (
               <tr>
                 <td colSpan={4} className="px-6 py-20 text-center bg-background-elevated/10">
                   <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-2">No assets found matching current filters</p>
                   <button 
                    onClick={() => { setSearchQuery(""); setActiveCategory("All"); setActiveRegion("All"); setShowAffiliateOnly(false); }}
                    className="text-[9px] font-bold uppercase tracking-widest text-accent hover:underline"
                   >
                     Reset All Filters
                   </button>
                 </td>
               </tr>
             )}
 
             {filteredPages.length > 150 && (
               <tr>
                 <td colSpan={4} className="px-6 py-10 text-center bg-background-elevated/20">
                   <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
                     Optimized view: Showing 150 of {filteredPages.length} active assets.
                   </p>
                 </td>
               </tr>
             )}
           </tbody>
         </table>
       </div>
     </div>
   );
 }
