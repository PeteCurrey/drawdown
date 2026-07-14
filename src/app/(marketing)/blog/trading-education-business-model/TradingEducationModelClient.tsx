"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Link2, Check, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function TradingEducationModelClient() {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(
    "The Trading Education Business Model: How the Money Is Really Made"
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy url: ", err);
    }
  };

  useEffect(() => {
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

      // 2. Fade up sections on entry
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

      // 3. Scale pull quote slightly on entry
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

      // 5. Disclosure callout border pulses once on entry
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

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="bg-[#0A0A0A] text-white min-h-screen relative font-sans selection:bg-[#C8F135] selection:text-black">
      {/* Reading Progress Bar */}
      <div 
        ref={progressBarRef}
        className="fixed top-[58px] left-0 h-[2px] bg-[#C8F135] z-[210] w-full origin-left scale-x-0" 
      />

      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-[#A0A0A0] font-mono mb-8 max-w-6xl mx-auto">
          <Link href="/" className="hover:text-[#C8F135] transition-colors">Home</Link>
          <span className="opacity-40">&rarr;</span>
          <Link href="/blog" className="hover:text-[#C8F135] transition-colors">Blog</Link>
          <span className="opacity-40">&rarr;</span>
          <span className="text-white/80 truncate">The Trading Education Business Model</span>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Article Header */}
          <header className="space-y-6 pb-12 border-b border-[#1A1A1A]">
            <span className="text-xs font-mono tracking-widest uppercase text-[#C8F135] block">
              // INDUSTRY INSIGHT
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white leading-tight uppercase tracking-tight max-w-4xl">
              The Trading Education Business Model: How the Money Is Really Made
            </h1>
            <p className="text-lg sm:text-xl text-[#A0A0A0] leading-relaxed font-sans font-light max-w-3xl">
              Courses. Affiliates. Broker referrals. The model isn't a secret, it's just rarely explained honestly. Here's exactly how it works, who benefits, and how to use that knowledge to make better decisions.
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

          {/* Hero Image */}
          <figure className="w-full my-12 relative group shadow-sm">
            <div className="aspect-[16/9] w-full overflow-hidden border border-[#1A1A1A] relative bg-[#111111]">
              <Image 
                src="https://images.unsplash.com/photo-1559526324-593bc073d938?w=1200&q=80" 
                alt="Financial data and market analysis dashboard"
                fill
                priority
                className="w-full h-full object-cover block"
              />
            </div>
          </figure>

          {/* Two-Column Grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Article Body Content */}
            <div className="lg:col-span-8 space-y-16">
              
              {/* Section 1 */}
              <section className="reveal-section space-y-6">
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white border-l-4 border-[#C8F135] pl-4 uppercase tracking-tight">
                  The Model Nobody Explains
                </h2>
                <div className="text-[17px] leading-[1.8] text-white/85 space-y-6 font-light font-sans">
                  <p>
                    If you've spent any time in trading communities online you'll have noticed something. The most visible educators, the ones with the biggest followings, the loudest presence, the most content, aren't necessarily the best traders. Some of them are. But the correlation between trading ability and audience size is weaker than most people assume.
                  </p>
                  <p>
                    What the biggest names in trading education share isn't always a superior edge in the market. It is a superior understanding of a specific business model. And once you understand that model, everything about how trading content is produced, packaged, and sold starts to make considerably more sense.
                  </p>
                </div>
              </section>

              {/* Section 2 */}
              <section className="reveal-section space-y-6">
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white border-l-4 border-[#C8F135] pl-4 uppercase tracking-tight">
                  Step One: Build an Audience Around Aspiration
                </h2>
                <div className="text-[17px] leading-[1.8] text-white/85 space-y-6 font-light font-sans">
                  <p>
                    The first phase of every successful trading education business isn't education. It is aspiration.
                  </p>
                  <p>
                    Cars. Watches. Laptops on beaches. The aesthetic of financial freedom. This works because trading is one of the few skills where the lifestyle upside is genuinely extreme, and where the barrier to entry looks deceptively low. No qualifications. No network. Just a screen and some capital. That is a powerful story.
                  </p>
                  <p>
                    The content that tells it most compellingly, the screenshots, the highlight reels, the thumbnail of someone pointing at a number, is designed to make you want to be them, not to make you better at trading. The aspiration phase builds an audience. The audience is the asset. Everything that follows is monetisation.
                  </p>
                </div>
              </section>

              {/* Section 3 */}
              <section className="reveal-section space-y-6">
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white border-l-4 border-[#C8F135] pl-4 uppercase tracking-tight">
                  Step Two: Sell Education
                </h2>
                <div className="text-[17px] leading-[1.8] text-white/85 space-y-6 font-light font-sans">
                  <p>
                    Once an audience exists, the natural move is a course. And here's why courses are so attractive in this space.
                  </p>
                  <p>
                    Trading is genuinely difficult to learn. There's no agreed curriculum. No qualification that proves competence. The skills are real but hard to verify from the outside. Which means the market for education is enormous, the barrier to selling it is low, and the perceived value of a shortcut, someone handing you a working system, is high.
                  </p>
                  <p>
                    A course at £297 or £997 or £2,997 carries implied authority. It implies the person selling it has something worth that much. And unlike trading itself, course revenue is stable. It doesn't have drawdowns. It doesn't get stopped out. It doesn't fluctuate with the dollar index. Every new follower is a potential customer. The economics are dramatically better than trading for most educators at most stages of audience building.
                  </p>
                </div>
              </section>

              {/* Pull Quote */}
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
                <div className="text-[17px] leading-[1.8] text-white/85 space-y-6 font-light font-sans">
                  <p>
                    The third income stream is affiliate revenue, and this is where the conflicts of interest get interesting.
                  </p>
                  <p>
                    Brokers pay referral commissions. Prop firms pay referral commissions. Charting platforms, trading tools, VPNs, almost everything in a trader's workflow has an affiliate programme attached. Commissions vary. Some broker programmes pay a flat fee per referred account. Others pay a percentage of the spread revenue generated by the referred trader, meaning the affiliate earns more when their audience trades more, regardless of whether those trades are profitable.
                  </p>
                  <p>
                    Some prop firm affiliates earn a percentage of challenge fees. Which means they earn every time someone fails a challenge and pays to retry.
                  </p>
                  <p>
                    These aren't necessarily corrupt arrangements. But they create incentive structures that aren't always aligned with the audience's best interests. A broker recommendation might be genuine. It might also be driven by commission rate. Without disclosure, there's no way to know which it is.
                  </p>
                </div>
              </section>

              {/* Revenue Model Visual Block */}
              <section className="reveal-section revenue-model-container space-y-6 my-12">
                <h3 className="text-xl sm:text-2xl font-display font-bold text-white uppercase tracking-tight">
                  The Three Income Streams, Laid Out
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
                <p className="text-xs text-[#A0A0A0] italic mt-2 font-mono">
                  All three of these apply to Drawdown. Every relationship is disclosed. Every affiliate link is labelled.
                </p>
              </section>

              {/* Section 5 */}
              <section className="reveal-section space-y-6">
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white border-l-4 border-[#C8F135] pl-4 uppercase tracking-tight">
                  This Is Also How Drawdown Makes Money, And That's Fine
                </h2>
                <div className="text-[17px] leading-[1.8] text-white/85 space-y-6 font-light font-sans">
                  <p>
                    Full transparency: Drawdown uses exactly this model. Subscriptions. Broker affiliates. Prop firm affiliates. That's stated here, it's on the site, and every affiliate link is labelled.
                  </p>
                  <p>
                    Not because it's legally required. Because the entire premise of Drawdown is that you should be able to see exactly how the incentives work before you act on any recommendation. When you click a broker link here, you know we earn a referral fee. When you see a prop firm recommended, you know there's a commission attached. That context lets you make a more informed decision about how much weight to give it.
                  </p>
                  <p>
                    The model isn't the problem. The opacity is.
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
                <div className="text-[17px] leading-[1.8] text-white/85 space-y-6 font-light font-sans">
                  <p>
                    Assume every broker and prop firm recommendation you see from a trading educator carries an affiliate relationship, because it almost certainly does. Check whether it's disclosed. If it isn't, that tells you something meaningful about how that educator thinks about their audience.
                  </p>
                  <p>
                    Treat course pricing as a signal of marketing budget, not quality. A £2,997 course isn't necessarily better than a free YouTube series, it might just have a better sales funnel.
                  </p>
                  <p>
                    Look for educators who show process over outcomes. Screenshots of winning trades are easy. Walking through a full methodology, including the losing trades, the edge definition, the position sizing rules, is where the real signal lives.
                  </p>
                  <p>
                    And look for disclosed affiliates, transparent income sources, and a model that doesn't require you to keep buying things to access the core education.
                  </p>
                </div>
              </section>

              {/* Section 7 */}
              <section className="reveal-section space-y-6">
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white border-l-4 border-[#C8F135] pl-4 uppercase tracking-tight">
                  What Good Trading Education Actually Looks Like
                </h2>
                <div className="text-[17px] leading-[1.8] text-white/85 space-y-6 font-light font-sans">
                  <p>
                    It teaches you to fish. It has a defined, testable curriculum with clear progression. It shows losses alongside wins. It discloses commercial relationships. It doesn't lock the core content behind an ongoing high-ticket purchase.
                  </p>
                  <p>
                    And it treats you as someone capable of making your own decisions given the right information, not as a customer to be retained through aspiration and FOMO.
                  </p>
                  <p>
                    That's what Drawdown is building toward. Not because it's virtuous. Because it's the only model that produces traders who actually improve. And traders who improve stick around.
                  </p>
                </div>
              </section>
            </div>

            {/* Right Column: Sticky Sidebar */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-8 flex flex-col">
              {/* Share Buttons */}
              <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-[#A0A0A0]">
                <span className="font-bold">// SHARE:</span>
                <div className="flex items-center border border-[#1A1A1A] rounded-none divide-x divide-[#1A1A1A]">
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Share on X"
                    className="w-8 h-8 flex items-center justify-center hover:bg-[#111111] hover:text-[#C8F135] transition-colors text-[#A0A0A0]"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Share on LinkedIn"
                    className="w-8 h-8 flex items-center justify-center hover:bg-[#111111] hover:text-[#C8F135] transition-colors text-[#A0A0A0]"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.12 20.45H3.56V9h3.56v11.45zM5.34 7.43c-1.14 0-2.06-.92-2.06-2.06 0-1.14.92-2.06 2.06-2.06 1.14 0 2.06.92 2.06 2.06 0 1.14-.92 2.06-2.06 2.06zm15.11 13.02h-3.56v-5.6c0-1.34-.03-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.95v5.7H9.33V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29z"/>
                    </svg>
                  </a>
                  <a
                    href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}
                    title="Share via Email"
                    className="w-8 h-8 flex items-center justify-center hover:bg-[#111111] hover:text-[#C8F135] transition-colors text-[#A0A0A0]"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={handleCopy}
                    title="Copy Link"
                    className="w-8 h-8 flex items-center justify-center hover:bg-[#111111] hover:text-[#C8F135] transition-colors cursor-pointer bg-transparent border-none text-[#A0A0A0]"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#00E676]" /> : <Link2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Author Bio */}
              <div className="p-6 bg-[#111111] border border-[#1A1A1A] rounded-none shadow-sm relative overflow-hidden group">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#1A1A1A] border border-[#1A1A1A] overflow-hidden shrink-0 relative">
                      <Image 
                        src="/images/pete.jpg" 
                        alt="Pete" 
                        fill
                        className="w-full h-full object-cover grayscale"
                      />
                    </div>
                    <div>
                      <h5 className="text-sm font-mono font-bold uppercase text-white leading-tight">
                        Pete
                      </h5>
                      <span className="text-[9px] font-mono uppercase tracking-widest text-[#C8F135] block">
                        Founder, Drawdown
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans font-light">
                    Building Drawdown to be the trading education platform that actually tells you the truth.
                  </p>
                </div>
              </div>

              {/* Drawdown CTA widget */}
              <div className="p-8 bg-[#111111] border border-[#1A1A1A] rounded-none shadow-xl relative overflow-hidden group text-white">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-5 pointer-events-none" 
                  style={{ backgroundImage: `url(https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=400)` }} 
                />
                <div className="relative z-10 space-y-6">
                  <div className="space-y-2">
                    <h5 className="text-xl font-display font-black uppercase leading-tight tracking-tight text-white">
                      STOP GAMBLING.<br />START TRADING.
                    </h5>
                    <p className="text-[#A0A0A0] text-xs leading-relaxed font-sans font-light">
                      Structured education, real AI tools, and zero lifestyle marketing.
                    </p>
                  </div>
                  <Link 
                    href="/register" 
                    className="block w-full py-3 bg-[#C8F135] text-black hover:opacity-90 text-center font-mono font-bold uppercase tracking-wider text-[10px] rounded-none transition-colors shadow-lg"
                  >
                    CREATE FREE ACCOUNT
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

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
                <div className="aspect-[16/10] w-full border border-[#1A1A1A] relative bg-[#0A0A0A]">
                  <Image 
                    src="/images/blog/alexg-bugatti.png" 
                    alt="Deep blue and purple Bugatti Chiron"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-[10px] font-mono text-[#C8F135] tracking-widest uppercase block">// EDUCATION</span>
                <h3 className="font-display text-base lg:text-lg font-semibold text-white line-clamp-2 uppercase group-hover:text-[#C8F135] transition-colors leading-tight">
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
                <div className="aspect-[16/10] w-full border border-[#1A1A1A] relative bg-[#0A0A0A]">
                  <Image 
                    src="https://images.unsplash.com/photo-1642790551116-18e150f248e3?w=400&q=80" 
                    alt="Trader analysing candlestick charts on screen"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-[10px] font-mono text-[#C8F135] tracking-widest uppercase block">// PSYCHOLOGY</span>
                <h3 className="font-display text-base lg:text-lg font-semibold text-white line-clamp-2 uppercase group-hover:text-[#C8F135] transition-colors leading-tight">
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
                <div className="aspect-[16/10] w-full border border-[#1A1A1A] relative bg-[#0A0A0A]">
                  <Image 
                    src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80" 
                    alt="Trading charts on multiple monitors in a dark room"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-[10px] font-mono text-[#C8F135] tracking-widest uppercase block">// JOURNAL</span>
                <h3 className="font-display text-base lg:text-lg font-semibold text-white line-clamp-2 uppercase group-hover:text-[#C8F135] transition-colors leading-tight">
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
              href="/#curriculum"
              className="border border-white/20 text-white hover:bg-white/5 px-8 py-3.5 transition duration-200 font-sans text-center text-sm"
            >
              See the Curriculum &rarr;
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
