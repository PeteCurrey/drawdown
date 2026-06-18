import { Check, X, ChevronDown, AlertTriangle, Lightbulb, Compass, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRegion } from "@/components/layout/RegionalLayout";

export function SectionA() {
  return (
    <section className="py-24 border-b border-border-slate/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-[11px] font-sans font-bold text-text-tertiary uppercase tracking-widest block mb-4">
              // THE BASICS
            </span>
            <h2 className="text-3xl md:text-5xl font-sans font-extrabold tracking-tight text-text-primary leading-tight">
              What is a Prop Trading Firm?
            </h2>
            <div className="space-y-4 font-sans text-lg text-text-secondary leading-relaxed">
              <p>
                A proprietary trading firm — prop firm — provides capital to traders who demonstrate they can trade profitably within defined risk parameters. You don't risk your own money. You trade the firm's capital and keep a percentage of the profits, typically between 70% and 90%.
              </p>
              <p>
                The modern retail prop firm model works like this: you pay a one-time evaluation fee (typically £100-£500 depending on account size), pass a 1 or 2-phase challenge where you hit a profit target without breaching drawdown limits, and then receive a funded account.
              </p>
              <p>
                It sounds like a cheat code, but the rules are strict. If you hit the daily or maximum drawdown limit, you lose the account. This forces discipline, which is why most retail traders fail — they don't have risk management rules embedded in their psychology.
              </p>
            </div>
          </div>
          <div className="bg-background-surface border border-border-slate/50 rounded-[14px] p-8 space-y-6">
            <h3 className="font-sans font-bold text-xl text-text-primary">How the math actually works:</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-mkt-ink text-white flex items-center justify-center font-bold text-xs shrink-0 mt-1">1</div>
                <div>
                  <p className="font-bold text-text-primary font-sans text-sm">You pay $500 for a $100k Evaluation</p>
                  <p className="text-xs text-text-tertiary font-sans mt-1">This fee filters out unserious traders and covers the firm's operational costs.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-mkt-ink text-white flex items-center justify-center font-bold text-xs shrink-0 mt-1">2</div>
                <div>
                  <p className="font-bold text-text-primary font-sans text-sm">You have $10,000 of actual risk</p>
                  <p className="text-xs text-text-tertiary font-sans mt-1">The account size is $100k, but max drawdown is usually 10%. Your real trading capital is $10k.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-mkt-ink text-white flex items-center justify-center font-bold text-xs shrink-0 mt-1">3</div>
                <div>
                  <p className="font-bold text-text-primary font-sans text-sm">You make $5,000 profit</p>
                  <p className="text-xs text-text-tertiary font-sans mt-1">On an 80/20 split, you keep $4,000. Your original $500 fee is refunded.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SectionB() {
  return (
    <section className="py-24 border-t border-border-slate/50 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <ShieldAlert className="w-12 h-12 text-loss mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-sans font-extrabold tracking-tight text-white mb-6">
            Red Flags We Filter For.
          </h2>
          <p className="text-neutral-400 font-sans text-lg">
            The prop firm industry is completely unregulated. Firms can and do shut down overnight, taking trader payouts with them. Here is how we separate the legitimate firms from the scams.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-8 border border-white/10 rounded-[14px] bg-white/5">
            <h3 className="text-white font-sans font-bold mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> Hidden Drawdown Rules</h3>
            <p className="text-neutral-400 text-sm font-sans leading-relaxed">
              If a firm uses trailing drawdowns that lock at high-water marks intraday, they want you to fail. We only recommend firms with static or end-of-day drawdowns.
            </p>
          </div>
          <div className="p-8 border border-white/10 rounded-[14px] bg-white/5">
            <h3 className="text-white font-sans font-bold mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> Payout Denial Clauses</h3>
            <p className="text-neutral-400 text-sm font-sans leading-relaxed">
              Some firms hide "gambling" or "inconsistent lot size" rules in their terms to deny payouts when you actually win. We read the fine print so you don't have to.
            </p>
          </div>
          <div className="p-8 border border-white/10 rounded-[14px] bg-white/5">
            <h3 className="text-white font-sans font-bold mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> Simulated Slippage</h3>
            <p className="text-neutral-400 text-sm font-sans leading-relaxed">
              Since all evaluations are on demo environments, unethical firms program artificial slippage to ensure stop losses trigger earlier than they should.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SectionD() {
  return (
    <section className="py-24 border-t border-border-slate/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <span className="text-[11px] font-sans font-bold text-text-tertiary uppercase tracking-widest block mb-4">
            // STRATEGY ALIGNMENT
          </span>
          <h2 className="text-3xl md:text-5xl font-sans font-extrabold tracking-tight text-text-primary">
            How to Choose Your Firm.
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 border border-border-slate/50 rounded-[14px] bg-background-surface group hover:border-mkt-ink transition-colors">
            <Lightbulb className="w-8 h-8 text-profit mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-sans font-bold mb-4 text-text-primary">If you are a Day Trader</h3>
            <p className="text-sm font-sans text-text-secondary leading-relaxed mb-6">
              You need tight spreads, no restrictions on holding during news, and fast execution. You probably don't hold over the weekend.
            </p>
            <p className="text-xs font-bold font-sans uppercase tracking-widest text-text-primary">
              Top Pick: <span className="text-profit">FTMO</span>
            </p>
          </div>
          <div className="p-8 border border-border-slate/50 rounded-[14px] bg-background-surface group hover:border-mkt-ink transition-colors">
            <Lightbulb className="w-8 h-8 text-accent mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-sans font-bold mb-4 text-text-primary">If you are a Swing Trader</h3>
            <p className="text-sm font-sans text-text-secondary leading-relaxed mb-6">
              You hold trades for days or weeks. You need a firm that allows weekend holding and doesn't penalise you for inactivity over a few days.
            </p>
            <p className="text-xs font-bold font-sans uppercase tracking-widest text-text-primary">
              Top Pick: <span className="text-accent">The5%ers</span>
            </p>
          </div>
          <div className="p-8 border border-border-slate/50 rounded-[14px] bg-background-surface group hover:border-mkt-ink transition-colors">
            <Lightbulb className="w-8 h-8 text-indigo-500 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-sans font-bold mb-4 text-text-primary">If you trade News Breakouts</h3>
            <p className="text-sm font-sans text-text-secondary leading-relaxed mb-6">
              Many firms outright ban trading 2 minutes before and after high-impact news. If this is your edge, you need a firm with zero news restrictions.
            </p>
            <p className="text-xs font-bold font-sans uppercase tracking-widest text-text-primary">
              Top Pick: <span className="text-indigo-500">FTMO (Swing Account)</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SectionE() {
  return (
    <section className="py-24 border-t border-border-slate/50 bg-background-surface/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="w-full md:w-1/2">
            <Compass className="w-12 h-12 text-profit mb-6" />
            <h2 className="text-3xl md:text-4xl font-sans font-extrabold tracking-tight text-text-primary mb-6">
              The 30-Day Preparation Framework.
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed font-sans mb-8">
              Do not buy an evaluation until you can check all three of these boxes. Buying a challenge out of boredom or revenge is a guaranteed donation to the firm.
            </p>
          </div>
          <div className="w-full md:w-1/2 space-y-6">
            <div className="flex gap-4 p-6 bg-white border border-border-slate/50 rounded-[14px] shadow-sm">
              <CheckCircle2 className="w-6 h-6 text-profit shrink-0" />
              <div>
                <h4 className="font-bold font-sans text-text-primary">You have 3 months of positive data</h4>
                <p className="text-sm font-sans text-text-tertiary mt-1">You must have a journal showing a profitable edge over at least 100 trades on a personal or demo account.</p>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-white border border-border-slate/50 rounded-[14px] shadow-sm">
              <CheckCircle2 className="w-6 h-6 text-profit shrink-0" />
              <div>
                <h4 className="font-bold font-sans text-text-primary">You know your max drawdown stats</h4>
                <p className="text-sm font-sans text-text-tertiary mt-1">If your historical max drawdown is 12%, you will fail a prop firm challenge with a 10% limit. Adjust your risk.</p>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-white border border-border-slate/50 rounded-[14px] shadow-sm">
              <CheckCircle2 className="w-6 h-6 text-profit shrink-0" />
              <div>
                <h4 className="font-bold font-sans text-text-primary">The fee is disposable income</h4>
                <p className="text-sm font-sans text-text-tertiary mt-1">If losing the $500 evaluation fee will impact your life, you will trade with fear. Fear causes mistakes. Only risk what you can lose.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SectionF() {
  const { region, demonym } = useRegion();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const getBestFirmAnswer = (r: string) => {
    switch (r) {
      case "uk":
        return "FTMO and The5%ers are highly regarded globally. Note that prop firm payouts are generally treated as income, not gambling winnings, so they are subject to Income Tax, unlike UK Spread Betting. Consult a tax professional.";
      case "au":
        return "FTMO and The5%ers are highly regarded globally. Note that prop firm payouts are generally treated as ordinary taxable income in Australia. Consult a tax professional.";
      case "us":
        return "FTMO and The5%ers are highly regarded globally. Note that prop firm payouts are generally treated as ordinary taxable income in the US. Consult a tax professional.";
      case "sg":
        return "FTMO and The5%ers are highly regarded globally. Note that prop firm payouts are generally treated as ordinary income or capital gains depending on whether it is classified as professional trading in Singapore. Consult a tax professional.";
      case "hk":
        return "FTMO and The5%ers are highly regarded globally. Note that prop firm payouts are generally treated as ordinary income or tax-free depending on your professional trading classification in Hong Kong. Consult a tax professional.";
      default:
        return `FTMO and The5%ers are highly regarded globally. Note that prop firm payouts are generally treated as taxable income. Consult a local tax professional.`;
    }
  };

  const faqs = [
    {
      q: "Are prop firms legal?",
      a: "Yes. Because you are trading simulated capital on a demo environment, and the firm pays you a 'performance fee' as an independent contractor, they circumvent traditional broker regulations. However, this means you don't have the regulatory protections of a standard broker."
    },
    {
      q: "Do I actually get real money?",
      a: "Yes, but indirectly. When you pass the evaluation, you are usually trading a simulated account. The prop firm copies your trades onto their real capital via algorithmic copy trading software. When you request a payout, they pay you your share of the profits generated by your copied trades."
    },
    {
      q: "What is a trailing drawdown?",
      a: "A trailing drawdown follows your highest account balance. If your account goes from $100k to $105k, a 5% trailing drawdown moves up from $95k to $100k. If you then lose $5k, you fail the challenge, even though you are back at your starting balance. Avoid firms with intraday trailing drawdowns."
    },
    {
      q: "Can I use an Expert Advisor (EA) or trading bot?",
      a: "It depends on the firm. FTMO allows EAs as long as they aren't High Frequency Trading (HFT) bots, arbitrage bots, or tick scalping. If multiple people use the exact same commercially bought EA, firms will often flag it for 'copy trading' and deny payouts."
    },
    {
      q: "Which firm is best for " + (region === "uk" ? "UK" : demonym) + " traders?",
      a: getBestFirmAnswer(region)
    }
  ];


  return (
    <section className="py-24 border-t border-border-slate/50">
      <div className="max-w-7xl mx-auto px-6">
        <span className="text-[11px] font-sans font-bold text-text-tertiary uppercase tracking-widest block mb-4">
          // FAQ
        </span>
        <h2 className="text-3xl font-sans font-extrabold tracking-tight text-text-primary mb-10">Frequently Asked Questions</h2>
        <div className="border-t border-border-slate/50">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-border-slate/50">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full text-left py-6 flex items-center justify-between group"
              >
                <span className="font-sans font-bold text-text-primary group-hover:text-accent transition-colors pr-8">
                  {faq.q}
                </span>
                <ChevronDown 
                  className={cn("w-5 h-5 text-text-tertiary transition-transform duration-300 shrink-0", openIdx === i ? "rotate-180" : "")} 
                />
              </button>
              <div 
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  openIdx === i ? "max-h-96 opacity-100 pb-6" : "max-h-0 opacity-0"
                )}
              >
                <p className="font-sans text-sm text-text-secondary leading-relaxed pr-12">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
