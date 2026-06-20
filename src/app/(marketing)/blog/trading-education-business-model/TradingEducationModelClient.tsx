"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function TradingEducationModelClient() {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Reading progress bar animation
      gsap.to(progressBarRef.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 58px",
          end: "bottom bottom",
          scrub: true,
        },
      });

      // 2. Fade up sections on entry (stagger 0.15s, duration 0.6s)
      const sections = gsap.utils.toArray<HTMLElement>(".reveal-section");
      sections.forEach((sec) => {
        gsap.fromTo(
          sec,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sec,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // 3. Scale pull quote slightly on entry (scale 0.97 -> 1)
      const pullQuote = document.querySelector(".pull-quote-animate");
      if (pullQuote) {
        gsap.fromTo(
          pullQuote,
          { scale: 0.97, opacity: 0.8 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: pullQuote,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // 4. Revenue model three columns stagger in left to right on scroll entry
      const columns = gsap.utils.toArray<HTMLElement>(".revenue-column");
      if (columns.length > 0) {
        gsap.fromTo(
          columns,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".revenue-model-container",
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // 5. Disclosure callout border pulses once on entry (opacity 0.4 -> 1 on border)
      const disclosureCallout = document.querySelector(".disclosure-callout");
      if (disclosureCallout) {
        gsap.fromTo(
          disclosureCallout,
          { borderColor: "rgba(200, 241, 53, 0.4)" },
          {
            borderColor: "rgba(200, 241, 53, 1)",
            duration: 1.0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: disclosureCallout,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // 6. Read next cards stagger on entry
      const cards = gsap.utils.toArray<HTMLElement>(".read-next-card");
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".read-next-container",
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, containerRef);

    // Clean up GSAP timelines and ScrollTriggers on unmount
    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="bg-[#0A0A0A] text-white min-h-screen relative font-sans selection:bg-[#C8F135] selection:text-black">
      {/* 2px Reading Progress Bar */}
      <div 
        ref={progressBarRef}
        className="fixed top-[58px] left-0 h-[2px] bg-[#C8F135] z-[210] w-full origin-left scale-x-0" 
      />

      <div className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-[#A0A0A0] font-mono mb-12">
          <Link href="/" className="hover:text-[#C8F135] transition-colors">Home</Link>
          <span className="opacity-40">&rarr;</span>
          <Link href="/blog" className="hover:text-[#C8F135] transition-colors">Blog</Link>
          <span className="opacity-40">&rarr;</span>
          <span className="text-white/80 truncate">The Trading Education Business Model</span>
        </div>

        {/* Article Header */}
        <header className="space-y-6 pb-12 border-b border-[#1A1A1A]">
          <span className="text-xs font-mono tracking-widest uppercase text-[#C8F135] block">
            // INDUSTRY INSIGHT
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white leading-tight uppercase">
            The Trading Education Business Model: How the Money Is Really Made
          </h1>
          <p className="text-lg sm:text-xl text-[#A0A0A0] leading-relaxed font-sans font-light">
            Courses. Affiliates. Broker referrals. The model is not a secret, it is just rarely explained honestly. Here is exactly how it works, who benefits, and how to use that knowledge to make better decisions.
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
            {/* Author Row */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center font-mono text-xs text-[#C8F135] font-bold">
                P
              </div>
              <div>
                <span className="text-sm font-semibold text-white block">Pete</span>
                <span className="text-xs text-[#A0A0A0] block">Founder, Drawdown</span>
              </div>
            </div>
            {/* Meta Row */}
            <div className="flex items-center gap-4 text-xs font-mono text-[#A0A0A0]">
              <span>20 June 2026</span>
              <span className="opacity-30">•</span>
              <span>8 min read</span>
            </div>
          </div>
        </header>

        {/* Hero Image Placeholder */}
        <div className="my-12 aspect-[16/9] w-full bg-[#111111] border border-[#1A1A1A] flex items-center justify-center p-6 text-center select-none">
          <span className="text-[#C8F135] font-mono text-xs sm:text-sm tracking-widest uppercase">
            [ HERO IMAGE — money flow diagram / dark editorial business visual ]
          </span>
        </div>

        {/* Article Body */}
        <article className="max-w-[720px] mx-auto space-y-16">
          
          {/* Section 1 */}
          <section className="reveal-section space-y-6">
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white border-l-4 border-[#C8F135] pl-4 uppercase tracking-tight">
              The Model Nobody Explains
            </h2>
            <div className="text-[17px] leading-[1.8] text-white/85 space-y-4 font-light">
              <p>
                If you have spent any time in trading communities online you will have noticed something. The most visible trading educators, the ones with the biggest followings, the most content, the loudest presence, are not necessarily the best traders. Some of them are. But the correlation between trading ability and audience size is weaker than most people assume.
              </p>
              <p>
                What the biggest names in trading education share is not always a superior edge in the market. It is a superior understanding of a specific business model. And once you understand that model, everything about how trading content is produced, packaged, and sold starts to make a lot more sense.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="reveal-section space-y-6">
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white border-l-4 border-[#C8F135] pl-4 uppercase tracking-tight">
              Step One: Build an Audience Around Aspiration
            </h2>
            <div className="text-[17px] leading-[1.8] text-white/85 space-y-4 font-light">
              <p>
                The first phase of every successful trading education business is not education. It is aspiration. Cars. Watches. Laptops on beaches. The aesthetic of financial freedom. This works because trading is one of the few skills where the lifestyle upside is genuinely extreme, and where the barrier to entry looks deceptively low.
              </p>
              <p>
                You do not need qualifications. You do not need a network. You just need a screen and capital. That is a powerful story. And the content that tells it most compellingly, the screenshots, the highlight reels, the thumbnail of someone pointing at a number, is designed to make you want to be them. Not to make you better at trading. The aspiration phase builds an audience. The audience is the asset. Everything that follows is monetisation of that asset.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="reveal-section space-y-6">
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white border-l-4 border-[#C8F135] pl-4 uppercase tracking-tight">
              Step Two: Sell Education
            </h2>
            <div className="text-[17px] leading-[1.8] text-white/85 space-y-4 font-light">
              <p>
                Once an audience exists, the natural next move is a course. And here is why courses are so attractive as a product in this space. Trading is genuinely difficult to learn. There is no universally agreed curriculum. There is no qualification that proves competence. The skills are real but they are hard to verify from the outside.
              </p>
              <p>
                Which means the market for trading education is enormous, the barrier to entry for selling it is low, and the perceived value of a shortcut, someone handing you a system that works, is high. A course at £297 or £997 or £2,997 carries implied authority. It implies the person selling it has something worth that much.
              </p>
              <p>
                And unlike trading itself, course revenue is stable. It does not have drawdowns. It does not get stopped out. It does not fluctuate with the dollar index. Every new follower is a potential customer. The economics are dramatically better than trading for most people at most stages of audience building.
              </p>
            </div>
          </section>

          {/* Pull Quote Component */}
          <section className="pull-quote-animate w-full bg-[#111111] border-l-4 border-[#C8F135] p-6 sm:p-8 my-12">
            <p className="text-xl sm:text-2xl font-display font-extrabold text-white italic leading-relaxed">
              Course revenue does not have drawdowns. It does not get stopped out. It does not fluctuate with the dollar index. The economics are dramatically better than trading for most people at most stages of audience building.
            </p>
          </section>

          {/* Section 4 */}
          <section className="reveal-section space-y-6">
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white border-l-4 border-[#C8F135] pl-4 uppercase tracking-tight">
              Step Three: Layer In Affiliate Revenue
            </h2>
            <div className="text-[17px] leading-[1.8] text-white/85 space-y-4 font-light">
              <p>
                The third income stream is affiliate revenue, and it is where the conflicts of interest get interesting. Brokers pay referral commissions. Prop firms pay referral commissions. VPN providers, trading tools, charting platforms, almost everything in a trader's workflow has an affiliate programme attached.
              </p>
              <p>
                The commissions vary. Some broker affiliates pay a flat fee per referred account. Others pay a percentage of spread revenue generated by the referred trader, meaning the affiliate earns more when their referred traders trade more, regardless of whether those trades are profitable. Some prop firm affiliates earn a percentage of challenge fees, meaning they earn every time someone fails a challenge and pays to retry.
              </p>
              <p>
                These are not necessarily corrupt arrangements. But they create incentive structures that are not always aligned with the audience's best interests. A broker recommendation might be genuine. It might also be driven by a commission rate. Without disclosure, you have no way of knowing which it is.
              </p>
            </div>
          </section>

          {/* Revenue Model Visual Block */}
          <section className="reveal-section revenue-model-container space-y-6 my-12">
            <h3 className="text-xl sm:text-2xl font-display font-bold text-white uppercase tracking-tight">
              The Three Income Streams — Laid Out
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#111111] border border-[#1A1A1A] p-6 sm:p-8">
              {/* Col 1 */}
              <div className="revenue-column space-y-4">
                <div className="w-8 h-8 bg-[#C8F135]" />
                <h4 className="text-md font-display font-bold text-white uppercase">
                  Course & Subscription Revenue
                </h4>
                <p className="text-xs sm:text-sm text-[#A0A0A0] font-sans font-light leading-relaxed">
                  Stable, scalable, no drawdowns. Sells the promise of a shortcut. High margin, low overhead once built.
                </p>
              </div>
              {/* Col 2 */}
              <div className="revenue-column space-y-4">
                <div className="w-8 h-8 bg-[#C8F135]" />
                <h4 className="text-md font-display font-bold text-white uppercase">
                  Broker Affiliate Revenue
                </h4>
                <p className="text-xs sm:text-sm text-[#A0A0A0] font-sans font-light leading-relaxed">
                  Commission per referred account or percentage of spread revenue. Incentives may not align with trader profitability.
                </p>
              </div>
              {/* Col 3 */}
              <div className="revenue-column space-y-4">
                <div className="w-8 h-8 bg-[#C8F135]" />
                <h4 className="text-md font-display font-bold text-white uppercase">
                  Prop Firm Affiliate Revenue
                </h4>
                <p className="text-xs sm:text-sm text-[#A0A0A0] font-sans font-light leading-relaxed">
                  Commission per challenge signup. Can earn on failed challenges. Disclosure is rare. Impact on recommendations is real.
                </p>
              </div>
            </div>
            <p className="text-xs text-[#A0A0A0] italic mt-2">
              All three of these apply to Drawdown. Every relationship is disclosed. Every affiliate link is labelled.
            </p>
          </section>

          {/* Section 5 */}
          <section className="reveal-section space-y-6">
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white border-l-4 border-[#C8F135] pl-4 uppercase tracking-tight">
              This Is Also How Drawdown Makes Money — And That's Fine
            </h2>
            <div className="text-[17px] leading-[1.8] text-white/85 space-y-4 font-light">
              <p>
                Here is where full transparency matters. Drawdown uses the same model. Subscriptions. Broker affiliates. Prop firm affiliates. That is stated here, it is on the site, and every affiliate link is labelled. Not because it is legally required, but because the entire premise of Drawdown is that you should be able to see exactly how the incentives work.
              </p>
              <p>
                The difference is not the model. The model is fine. The difference is disclosure. When you click a broker link on Drawdown you know we earn a referral fee. When you see a prop firm recommendation you know there is a commission attached. That context lets you make a more informed decision about how much weight to give the recommendation. That is how it should work. The model itself is not the problem, the opacity is.
              </p>
            </div>
          </section>

          {/* Disclosure Callout Component */}
          <section className="reveal-section my-12">
            <div className="disclosure-callout border p-8 sm:p-10 space-y-4 bg-transparent transition-colors">
              <span className="text-xs font-mono font-bold tracking-widest text-[#C8F135] uppercase block">
                // DRAWDOWN DISCLOSURE
              </span>
              <h4 className="text-lg sm:text-xl font-display font-extrabold text-white uppercase tracking-tight">
                How Drawdown Makes Money
              </h4>
              <p className="text-xs sm:text-sm text-[#A0A0A0] font-sans font-light leading-relaxed">
                Drawdown earns revenue through paid subscriptions, broker referral commissions, and prop firm referral commissions. Every affiliate link on this site is labelled. Referral relationships are disclosed on broker and prop firm review pages. This post contains no affiliate links.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="reveal-section space-y-6">
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white border-l-4 border-[#C8F135] pl-4 uppercase tracking-tight">
              How to Be a Smarter Consumer of Trading Content
            </h2>
            <div className="text-[17px] leading-[1.8] text-white/85 space-y-4 font-light">
              <p>
                Practical framing for anyone navigating this space. Assume every broker and prop firm recommendation you see from a trading educator carries an affiliate relationship, because it almost certainly does. Check whether it is disclosed. If it is not, that tells you something about how that educator thinks about their relationship with their audience.
              </p>
              <p>
                Treat course pricing as a signal, not a quality indicator. A £2,997 course is not necessarily better than a free YouTube series, it might just have a better sales funnel behind it.
              </p>
              <p>
                Look for educators who show process over outcomes. Anyone can screenshot a winning trade. Fewer people will walk you through their full methodology including the losing trades, the edge definition, the position sizing rules. That is where the real signal is. And look for disclosed affiliates, transparent income sources, and a business model that does not require you to keep buying things to access the core education.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="reveal-section space-y-6">
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white border-l-4 border-[#C8F135] pl-4 uppercase tracking-tight">
              What Good Trading Education Actually Looks Like
            </h2>
            <div className="text-[17px] leading-[1.8] text-white/85 space-y-4 font-light">
              <p>
                It teaches you to fish rather than selling you fish. It has a defined, testable curriculum with clear progression. It shows losses as well as wins. It discloses commercial relationships. It does not require an ongoing high-ticket purchase to access the core content.
              </p>
              <p>
                And it treats you as someone capable of making your own decisions given the right information, not as a customer to be retained through aspiration and FOMO. That is the standard Drawdown is building to. Not because it is virtuous, because it is the only model that produces traders who actually improve. And traders who improve stick around.
              </p>
            </div>
          </section>

        </article>

        {/* Related Posts Row */}
        <section className="read-next-container border-t border-[#1A1A1A] mt-24 pt-16 space-y-8">
          <span className="text-xs font-mono tracking-widest text-[#C8F135] uppercase block">
            // READ NEXT
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <Link 
              href="/blog/coffeezilla-alexg-trading-education"
              className="read-next-card group bg-[#111111] border border-transparent hover:border-[#C8F135] transition-all duration-300 flex flex-col justify-between p-5 cursor-pointer"
            >
              <div className="space-y-4">
                <div className="aspect-[16/10] w-full bg-[#0A0A0A] border border-[#1A1A1A] flex items-center justify-center p-4 text-center">
                  <span className="text-white/20 font-mono text-[9px] uppercase tracking-wider">[ Mockup Image ]</span>
                </div>
                <span className="text-[10px] font-mono text-[#C8F135] tracking-widest uppercase block">// EDUCATION</span>
                <h3 className="text-md font-display font-bold text-white uppercase line-clamp-3">
                  The Coffeezilla Video on fxAlexG: What It Actually Tells Us About Trading Education
                </h3>
              </div>
              <span className="text-xs text-[#A0A0A0] font-mono mt-6 block">9 min read</span>
            </Link>

            {/* Card 2 */}
            <Link 
              href="/blog/why-trading-gurus-use-demo-accounts"
              className="read-next-card group bg-[#111111] border border-transparent hover:border-[#C8F135] transition-all duration-300 flex flex-col justify-between p-5 cursor-pointer"
            >
              <div className="space-y-4">
                <div className="aspect-[16/10] w-full bg-[#0A0A0A] border border-[#1A1A1A] flex items-center justify-center p-4 text-center">
                  <span className="text-white/20 font-mono text-[9px] uppercase tracking-wider">[ Mockup Image ]</span>
                </div>
                <span className="text-[10px] font-mono text-[#C8F135] tracking-widest uppercase block">// PSYCHOLOGY</span>
                <h3 className="text-md font-display font-bold text-white uppercase line-clamp-3">
                  Why Trading Gurus Use Demo Accounts — And What It Actually Means
                </h3>
              </div>
              <span className="text-xs text-[#A0A0A0] font-mono mt-6 block">7 min read</span>
            </Link>

            {/* Card 3 */}
            <Link 
              href="/blog/ftmo-demo-account-trading-publicly"
              className="read-next-card group bg-[#111111] border border-transparent hover:border-[#C8F135] transition-all duration-300 flex flex-col justify-between p-5 cursor-pointer"
            >
              <div className="space-y-4">
                <div className="aspect-[16/10] w-full bg-[#0A0A0A] border border-[#1A1A1A] flex items-center justify-center p-4 text-center">
                  <span className="text-white/20 font-mono text-[9px] uppercase tracking-wider">[ Mockup Image ]</span>
                </div>
                <span className="text-[10px] font-mono text-[#C8F135] tracking-widest uppercase block">// JOURNAL</span>
                <h3 className="text-md font-display font-bold text-white uppercase line-clamp-3">
                  FTMO Demo Account: Why I'm Trading Publicly and What You'll See
                </h3>
              </div>
              <span className="text-xs text-[#A0A0A0] font-mono mt-6 block">5 min read</span>
            </Link>
          </div>
        </section>

        {/* CTA Block */}
        <section className="reveal-section bg-[#111111] border border-[#1A1A1A] p-8 lg:p-12 mt-20 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white uppercase leading-tight">
            A Trading Education Platform That Shows You the Receipts
          </h2>
          <p className="text-[#A0A0A0] max-w-2xl mx-auto text-base sm:text-lg leading-relaxed font-sans font-light">
            Every income source disclosed. Every affiliate labelled. Phase one completely free, no card, no catch.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link
              href="/dashboard"
              className="bg-[#C8F135] text-black font-semibold px-8 py-3.5 hover:opacity-90 transition duration-200 font-sans text-center text-sm"
            >
              Start Free &rarr;
            </Link>
            <Link
              href="/disclosures"
              className="border border-white/20 text-white hover:bg-white/5 px-8 py-3.5 transition duration-200 font-sans text-center text-sm"
            >
              Read Our Disclosure &rarr;
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
