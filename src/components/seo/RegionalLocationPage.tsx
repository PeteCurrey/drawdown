import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, MapPin, Target, ArrowRight, ShieldCheck, AlertTriangle } from "lucide-react";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { RegionalProvider } from "@/components/layout/RegionalLayout";

interface RegionalLocationPageProps {
  region: "au" | "us" | "sg" | "hk";
  topic: string;
  city: string;
  topicDisplay: Record<string, string>;
  cityContext: Record<string, string>;
  regulationLabel: string;
}

export function RegionalLocationPage({
  region,
  topic,
  city,
  topicDisplay,
  cityContext,
  regulationLabel,
}: RegionalLocationPageProps) {
  const topicLabel = topicDisplay[topic];
  const cityLabel = city.replace(/-/g, " ");
  const cityLabelTitled = cityLabel.charAt(0).toUpperCase() + cityLabel.slice(1);
  const context = cityContext[city];

  if (!topicLabel || !context) notFound();

  const regionName =
    region === "au"
      ? "Australia"
      : region === "us"
      ? "USA"
      : region === "sg"
      ? "Singapore"
      : "Hong Kong";

  return (
    <RegionalProvider region={region}>
      <main
        className="min-h-screen pt-32 pb-20 px-6"
        style={{ background: "var(--paper-0)", color: "var(--ink-950)" }}
      >
        <TrackPageView path={`/${region}/learn-to-trade/${topic}/${city}`} />
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumbs */}
          <nav
            className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest mb-12"
            style={{ color: "var(--graphite-600)" }}
          >
            <Link href={`/${region}`} className="hover:opacity-70 transition-opacity">
              {region.toUpperCase()} Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/${region}/learn-to-trade`} className="hover:opacity-70 transition-opacity">
              Learn
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span style={{ color: "var(--ink-950)" }}>{cityLabelTitled}</span>
          </nav>

          {/* Header */}
          <header className="mb-20">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-4 h-4" style={{ color: "var(--signal-navy)" }} />
              <span
                className="font-mono text-xs uppercase tracking-widest"
                style={{ color: "var(--signal-navy)" }}
              >
                {cityLabelTitled} // {regionName}
              </span>
            </div>
            <h1
              className="text-5xl md:text-8xl font-sans font-bold uppercase leading-tight mb-8"
              style={{ color: "var(--ink-950)" }}
            >
              {topicLabel} <br />
              <span style={{ color: "var(--graphite-600)", fontStyle: "italic" }}>in</span>{" "}
              {cityLabelTitled}.
            </h1>
            <p
              className="text-xl leading-relaxed max-w-2xl py-2"
              style={{
                color: "var(--graphite-600)",
                borderLeft: "2px solid var(--line-200)",
                paddingLeft: "2rem",
              }}
            >
              {context} Drawdown provides the professional-grade framework you need to master the
              markets from {cityLabelTitled}.
            </p>
          </header>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <div
              className="p-10 space-y-6 transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: "var(--paper-100)",
                border: "1px solid var(--line-200)",
              }}
            >
              <Target className="w-8 h-8" style={{ color: "var(--signal-navy)" }} />
              <h3
                className="text-2xl font-sans font-bold uppercase"
                style={{ color: "var(--ink-950)" }}
              >
                Localised Edge
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--graphite-600)" }}>
                Specific guidance for {cityLabelTitled}-based traders, including optimisation for
                global session overlaps and localised risk models.
              </p>
            </div>
            <div
              className="p-10 space-y-6 transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: "var(--paper-100)",
                border: "1px solid var(--line-200)",
              }}
            >
              <ShieldCheck className="w-8 h-8" style={{ color: "var(--signal-navy)" }} />
              <h3
                className="text-2xl font-sans font-bold uppercase"
                style={{ color: "var(--ink-950)" }}
              >
                {regulationLabel} Compliance
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--graphite-600)" }}>
                Our curriculum helps {regionName} traders navigate the {regulationLabel}-regulated
                landscape safely, ensuring maximum capital protection.
              </p>
            </div>
          </div>

          {/* Guru warning */}
          <section
            className="mb-16 p-10"
            style={{
              background: "var(--paper-100)",
              border: "1px solid var(--line-200)",
              borderLeft: "4px solid var(--risk-amber)",
            }}
          >
            <div className="flex items-center gap-3 mb-4" style={{ color: "var(--risk-amber)" }}>
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-xs font-mono uppercase font-bold tracking-widest m-0">
                Warning: Avoid the Guru Trap
              </h3>
            </div>
            <p className="text-base leading-relaxed italic" style={{ color: "var(--graphite-600)" }}>
              Most trading courses targeting {cityLabelTitled} are designed to sell you indicators
              or Telegram signal groups. At Drawdown, we teach process and discipline. If a guide
              promises &quot;guaranteed&quot; returns, it is a scam. Period.
            </p>
          </section>

          {/* CTA */}
          <section
            className="p-12 md:p-20 text-center space-y-8"
            style={{ background: "var(--ink-950)" }}
          >
            <h2
              className="text-3xl md:text-5xl font-sans font-bold uppercase"
              style={{ color: "var(--paper-0)" }}
            >
              Ready to Learn Properly in {cityLabelTitled}?
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "var(--paper-0)", opacity: 0.7 }}>
              Join the Drawdown community and access the same tools and education used by
              professional traders across {regionName}.
            </p>
            <div className="pt-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-4 px-10 py-5 text-xs font-bold uppercase tracking-[0.2em] transition-all hover:opacity-80"
                style={{ background: "var(--paper-0)", color: "var(--ink-950)" }}
              >
                <span>Join Drawdown {regionName}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        </div>
      </main>
    </RegionalProvider>
  );
}
