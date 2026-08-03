import { Shield, Target, Activity, TrendingUp, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Region, REGIONS, REGIONS_MAP } from "@/lib/seo/hreflang";
import { RegionalProvider } from "@/components/layout/RegionalLayout";
import { TrackPageView } from "@/components/admin/TrackPageView";

interface Props {
  params: Promise<{ region: string }>;
}

const REGIONAL_BROKERS: Record<string, Array<{
  slug: string;
  name: string;
  badge?: string;
  regulation: string;
  description: string;
  pros: string[];
  link: string;
}>> = {
  ca: [
    {
      slug: "interactive-brokers-ca",
      name: "Interactive Brokers Canada",
      badge: "Lowest Margin Rates",
      regulation: "CIRO / CIPF REGULATED",
      description: "Direct market access and ultra-low margin borrowing rates for Canadian traders across global exchanges.",
      pros: ["CIRO / CIPF Protected", "Global Market Access", "Low Margin Interest"],
      link: "https://www.interactivebrokers.ca"
    },
    {
      slug: "oanda-ca",
      name: "OANDA Canada",
      badge: "Forex Specialist",
      regulation: "CIRO REGULATED",
      description: "Top-tier forex execution with no minimum deposit requirements for Canadian investors.",
      pros: ["CIRO Regulated", "TradingView Integration", "API Trading"],
      link: "https://www.oanda.com/ca-en/"
    },
    {
      slug: "forex-com-ca",
      name: "FOREX.com Canada",
      badge: "Deep Liquidity",
      regulation: "CIRO REGULATED",
      description: "Advanced charting and competitive spreads on major currency pairs for Canadian clients.",
      pros: ["CIRO Protected", "RAW Spreads", "Advanced TradingView Charts"],
      link: "https://www.forex.com/ca-en/"
    }
  ],
  de: [
    {
      slug: "ig-europe",
      name: "IG Europe GmbH",
      badge: "BaFin Regulated",
      regulation: "BaFin / ESMA REGULATED",
      description: "Germany's leading broker for turbo certificates, CFDs, and forex with local BaFin oversight.",
      pros: ["BaFin Regulated", "Deposit Guarantee (Einlagensicherung)", "Negative Balance Protection"],
      link: "https://www.ig.com/de"
    },
    {
      slug: "interactive-brokers-de",
      name: "Interactive Brokers Ireland / DE",
      badge: "Global DMA",
      regulation: "BaFin / Central Bank Passported",
      description: "Professional-grade access to European and international exchanges with low commission models.",
      pros: ["EU Passported", "Institutional Execution", "Multi-Currency Accounts"],
      link: "https://www.interactivebrokers.ie"
    },
    {
      slug: "xtb-de",
      name: "XTB Germany",
      badge: "xStation 5",
      regulation: "BaFin / KNF REGULATED",
      description: "User-friendly proprietary platform with zero-commission stock trading and tight CFD spreads.",
      pros: ["BaFin Supervised", "0% Stock Commission", "xStation 5 Terminal"],
      link: "https://www.xtb.com/de"
    }
  ],
  ae: [
    {
      slug: "pepperstone-ae",
      name: "Pepperstone UAE",
      badge: "DIFC Regulated",
      regulation: "DFSA REGULATED",
      description: "DIFC-licensed forex and CFD broker offering ultra-fast execution speeds for Middle East traders.",
      pros: ["DFSA Regulated (DIFC)", "cTrader & MT5", "Raw Spreads from 0.0"],
      link: "https://pepperstone.com/en-ae/"
    },
    {
      slug: "ig-ae",
      name: "IG Bank UAE",
      badge: "DIFC Branch",
      regulation: "DFSA REGULATED",
      description: "Premier trading gateway in Dubai providing multi-asset CFD trading and institutional liquidity.",
      pros: ["DFSA Regulated", "DIFC Presence", "Premium Client Management"],
      link: "https://www.ig.com/ae"
    },
    {
      slug: "saxo-ae",
      name: "Saxo Bank UAE",
      badge: "VIP Banking",
      regulation: "DFSA / UAE Central Bank",
      description: "Multi-asset prime brokerage with access to over 40,000 international instruments.",
      pros: ["DFSA Licensed", "70,000+ Instruments", "Institutional Research"],
      link: "https://www.home.saxo/en-mena"
    }
  ],
  in: [
    {
      slug: "zerodha",
      name: "Zerodha",
      badge: "India's #1 Retail Broker",
      regulation: "SEBI REGISTERED",
      description: "Pioneer of discount brokerage in India with the flagship Kite platform for equities, F&O, and currency derivatives.",
      pros: ["SEBI Registered", "Kite Terminal", "Zero Equity Delivery Brokerage"],
      link: "https://zerodha.com"
    },
    {
      slug: "upstox",
      name: "Upstox",
      badge: "RKSV Securities",
      regulation: "SEBI REGISTERED",
      description: "High-speed derivative trading platform backed by marquee investors for Indian market participants.",
      pros: ["SEBI Regulated", "Option Chain Analytics", "Fast API Access"],
      link: "https://upstox.com"
    },
    {
      slug: "angel-one",
      name: "Angel One",
      badge: "Full Service Discount",
      regulation: "SEBI REGISTERED",
      description: "Tech-led stockbroking house offering ARQ AI recommendations and F&O execution.",
      pros: ["SEBI / NSE / BSE", "Smart API Integration", "Advanced Charting"],
      link: "https://www.angelone.in"
    }
  ],
  my: [
    {
      slug: "interactive-brokers-my",
      name: "Interactive Brokers (Malaysia)",
      badge: "Global Access",
      regulation: "SC MALAYSIA COMPLIANT",
      description: "Direct market access to US and global exchanges for Malaysian investors seeking low fees.",
      pros: ["Global Exchanges", "Low FX Conversion Fees", "Multi-Currency Wallet"],
      link: "https://www.interactivebrokers.com"
    },
    {
      slug: "oanda-my",
      name: "OANDA Asia Pacific",
      badge: "Regional FX Leader",
      regulation: "SC / Regional Compliant",
      description: "Transparent pricing and automated trading APIs for Malaysian currency traders.",
      pros: ["Regulated Entity", "TradingView Engine", "No Minimum Deposit"],
      link: "https://www.oanda.com/sg-en/"
    },
    {
      slug: "saxo-my",
      name: "Saxo Capital Markets",
      badge: "Multi-Asset Hub",
      regulation: "SC / MAS Regional",
      description: "Institutional-grade platform with access to global equities, bonds, futures, and forex.",
      pros: ["SaxoTraderGO", "Institutional Liquidity", "Tier-1 Security"],
      link: "https://www.home.saxo/en-sg"
    }
  ],
  ph: [
    {
      slug: "col-financial",
      name: "COL Financial",
      badge: "#1 Online Broker PH",
      regulation: "SEC PH REGISTERED",
      description: "The most trusted online stockbroker in the Philippines for PSE equities and mutual funds.",
      pros: ["SEC Philippines Registered", "PSE Direct Access", "Market Research"],
      link: "https://www.colfinancial.com"
    },
    {
      slug: "first-metro-sec",
      name: "First Metro Sec",
      badge: "Metrobank Group",
      regulation: "SEC PH REGISTERED",
      description: "Advanced Philippine stock market trading powered by Metrobank's investment banking wing.",
      pros: ["SEC / PSE Member", "FirstMetroSec PRO Terminal", "Fundamental Reports"],
      link: "https://www.firstmetrosec.com.ph"
    },
    {
      slug: "bdo-securities",
      name: "BDO Securities",
      badge: "BDO Unibank",
      regulation: "SEC PH REGISTERED",
      description: "Seamless online equities trading integrated directly with BDO Unibank accounts.",
      pros: ["SEC PH Registered", "Direct Bank Integration", "PSE Execution"],
      link: "https://www.bdo.com.ph/securities"
    }
  ]
};

export default async function DynamicRegionalBrokerHub({ params }: Props) {
  const { region: regionParam } = await params;
  const region = regionParam as Region;

  if (!REGIONS.includes(region)) {
    notFound();
  }

  const regionData = REGIONS_MAP[region];
  const regionName = regionData.label;
  const brokers = REGIONAL_BROKERS[region] ?? REGIONAL_BROKERS.ca;

  return (
    <RegionalProvider region={region}>
      <div className="flex flex-col min-h-screen">
        <TrackPageView path={`/${region}/brokers`} />

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 border-b border-border-slate/50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="max-w-4xl space-y-8">
              <div className="flex items-center gap-3 text-accent transition-all duration-700">
                <div className="w-8 h-[1px] bg-accent" />
                <span className="text-[10px] font-mono uppercase tracking-[0.3em]">
                  {regionName.toUpperCase()} REGULATED DIRECTORY
                </span>
              </div>

              <h1 className="text-4xl md:text-7xl font-sans font-black uppercase leading-[0.95] tracking-tight">
                Best Brokers for <br />
                <span className="text-accent underline decoration-accent/20">{regionName} Traders.</span>
              </h1>

              <p className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl font-medium">
                We rank regulated brokers serving {regionName} by execution quality, regulatory transparency, and capital safety.
              </p>
            </div>
          </div>
        </section>

        {/* Broker List */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="space-y-8">
              {brokers.map((broker, index) => (
                <div key={broker.slug} className="bg-background-surface/40 backdrop-blur-md border border-border-slate/50 p-8 md:p-12 relative overflow-hidden group">
                  <div className="absolute -top-4 -left-4 text-9xl font-sans font-black text-white/5 select-none italic group-hover:text-profit transition-colors">
                    0{index + 1}
                  </div>

                  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-4 space-y-4">
                      <div className="flex items-center gap-3">
                        <h3 className="text-3xl md:text-4xl font-sans font-black uppercase text-text-primary">{broker.name}</h3>
                        {broker.badge && (
                          <span className="px-3 py-1 bg-accent/10 border border-border-slate/50/20 text-accent text-[8px] font-mono uppercase tracking-widest font-bold">
                            {broker.badge}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-text-tertiary tracking-widest">
                        <Shield className="w-3 h-3 text-accent" />
                        {broker.regulation}
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {broker.description}
                      </p>
                    </div>

                    <div className="lg:col-span-4 grid grid-cols-1 gap-4">
                      {broker.pros.map((pro, i) => (
                        <div key={i} className="flex items-center gap-3 py-2 px-4 border border-border-slate/30">
                          <div className="w-1.5 h-1.5 rounded-full bg-profit" />
                          <span className="text-[10px] font-mono uppercase tracking-widest text-text-secondary">{pro}</span>
                        </div>
                      ))}
                    </div>

                    <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
                      <a
                        href={broker.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-4 bg-accent text-[#08090D] hover:bg-accent-hover text-center text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                      >
                        Visit Official Site <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </RegionalProvider>
  );
}
