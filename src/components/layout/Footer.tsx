import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-background-primary border-t border-border-slate py-12 md:py-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link href="/" className="text-xl font-display font-extrabold tracking-widest uppercase">
              Drawdown
            </Link>
            <p className="text-text-secondary text-sm max-w-xs">
              Trading education for people who want to learn properly. No shortcuts. Just edge.
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold uppercase tracking-widest text-sm mb-6">Platform</h4>
            <ul className="space-y-4 text-sm text-text-secondary">
              <li><Link href="/courses" className="hover:text-accent transition-colors">Courses</Link></li>
              <li><Link href="/tools" className="hover:text-accent transition-colors">AI Tools</Link></li>
              <li><Link href="/pricing" className="hover:text-accent transition-colors">Pricing</Link></li>
              <li><Link href="/blog" className="hover:text-accent transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold uppercase tracking-widest text-sm mb-6">Learn</h4>
            <ul className="space-y-4 text-sm text-text-secondary">
              <li><Link href="/courses/foundations" className="hover:text-accent transition-colors">Foundations</Link></li>
              <li><Link href="/courses/technical" className="hover:text-accent transition-colors">Technical analysis</Link></li>
              <li><Link href="/courses/risk" className="hover:text-accent transition-colors">Risk management</Link></li>
              <li><Link href="/courses/psychology" className="hover:text-accent transition-colors">Psychology</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold uppercase tracking-widest text-sm mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-text-secondary">
              <li><Link href="/legal/terms" className="hover:text-accent transition-colors">Terms of Service</Link></li>
              <li><Link href="/legal/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link href="/legal/disclaimer" className="hover:text-accent transition-colors underline decoration-loss/50 underline-offset-4">Risk Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="space-y-8 border-t border-border-slate pt-8">
          <div className="space-y-4">
            <p className="text-[10px] md:text-xs text-text-tertiary font-mono leading-relaxed">
              <span className="text-warning font-bold uppercase block mb-1">Risk Warning:</span>
              Trading financial instruments carries a high level of risk and may not be suitable for all investors. The high degree of leverage can work against you as well as for you. Before deciding to trade, you should carefully consider your investment objectives, level of experience, and risk appetite. The possibility exists that you could sustain a loss of some or all of your initial investment. You should not invest money that you cannot afford to lose. Past performance is not indicative of future results.
            </p>
            <p className="text-[10px] md:text-xs text-text-tertiary font-mono leading-relaxed">
              <span className="text-text-secondary font-bold uppercase block mb-1">Not Financial Advice:</span>
              Drawdown is a trading education platform. We do not provide personalised financial advice, investment recommendations, or portfolio management services. All content is for educational purposes only. You should seek independent financial advice before making any investment decisions.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
            <p>© 2026 DRAWDOWN. TRADE THE TRUTH.</p>
            <p>Built by traders for traders.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
