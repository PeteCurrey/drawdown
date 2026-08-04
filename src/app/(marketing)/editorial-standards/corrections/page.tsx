import { getMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata = getMetadata({
  title: "Corrections Log | Drawdown",
  description: "A transparent, running log of all corrections, clarifications, and amendments made to Drawdown articles, guides, and published analyses.",
  path: "/editorial-standards/corrections",
});

export default function CorrectionsLogPage() {
  return (
    <div className="pt-28 pb-24 min-h-screen" style={{ backgroundColor: "var(--paper-0)", color: "var(--ink-950)" }}>
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Header Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <Breadcrumbs 
            items={[
              { label: 'Legal', href: '/terms' },
              { label: 'Editorial Standards', href: '/editorial-standards' },
              { label: 'Corrections Log', href: '/editorial-standards/corrections' }
            ]} 
          />
          
          <div className="mt-8 space-y-4 border-b pb-12" style={{ borderColor: "var(--line-200)" }}>
            <h1 className="font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05] tracking-[-0.02em] font-semibold">
              Corrections <span style={{ color: "var(--graphite-600)" }}>Log</span>
            </h1>
            
            <p className="text-[13px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--graphite-600)" }}>
              When we get something wrong, we fix it. This page maintains a running log of corrections and factual amendments made to our articles after publication.
            </p>
          </div>
        </div>

        {/* Corrections Table */}
        <div className="max-w-4xl mx-auto">
          <div className="w-full overflow-x-auto border" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}>
            <table className="w-full text-left border-collapse font-sans text-[14px]">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--line-200)", backgroundColor: "var(--paper-0)" }}>
                  <th className="p-4 text-xs font-mono uppercase tracking-widest" style={{ color: "var(--graphite-600)" }}>Date</th>
                  <th className="p-4 text-xs font-mono uppercase tracking-widest" style={{ color: "var(--graphite-600)" }}>Article</th>
                  <th className="p-4 text-xs font-mono uppercase tracking-widest" style={{ color: "var(--graphite-600)" }}>Original claim</th>
                  <th className="p-4 text-xs font-mono uppercase tracking-widest" style={{ color: "var(--graphite-600)" }}>Correction</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "var(--line-200)" }}>
                <tr>
                  <td colSpan={4} className="p-12 text-center italic" style={{ color: "var(--graphite-600)" }}>
                    No corrections have been logged yet. This log will be updated whenever an article is amended after publication.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

