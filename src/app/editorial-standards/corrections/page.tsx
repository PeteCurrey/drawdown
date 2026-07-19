import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Corrections Log | Drawdown",
  description: "A transparent, running log of all corrections, clarifications, and amendments made to Drawdown articles, guides, and published analyses.",
};

export default function CorrectionsLogPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl space-y-12 animate-in fade-in duration-1000">
      
      {/* Header */}
      <section className="space-y-6">
        <h1 className="text-4xl md:text-5xl font-display font-black uppercase text-text-primary">
          Corrections Log
        </h1>
        <p className="text-xl text-text-secondary leading-relaxed max-w-3xl">
          When we get something wrong, we fix it. This page maintains a running log of corrections and factual amendments made to our articles after publication.
        </p>
      </section>

      {/* Corrections Table */}
      <section className="w-full overflow-x-auto border border-border-slate/50 rounded-xl bg-background-surface">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-slate bg-background-elevated/50">
              <th className="p-4 text-xs font-mono uppercase tracking-widest text-text-tertiary">Date</th>
              <th className="p-4 text-xs font-mono uppercase tracking-widest text-text-tertiary">Article</th>
              <th className="p-4 text-xs font-mono uppercase tracking-widest text-text-tertiary">Original claim</th>
              <th className="p-4 text-xs font-mono uppercase tracking-widest text-text-tertiary">Correction</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-slate/50">
            <tr>
              <td colSpan={4} className="p-12 text-center text-text-secondary italic">
                No corrections have been logged yet. This log will be updated whenever an article is amended after publication.
              </td>
            </tr>
          </tbody>
        </table>
      </section>

    </div>
  );
}
