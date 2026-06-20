"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Link2, Check, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function WhyGurusDemoClient() {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(
    "Why Trading Gurus Use Demo Accounts — And What It Actually Means"
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

      // 4. Stat block numbers count up
      const stats = [
        { id: "stat-1", target: 5000, prefix: "£", suffix: "" },
        { id: "stat-2", target: 100000, prefix: "£", suffix: "" },
        { id: "stat-3", target: 20, prefix: "", suffix: "x" },
      ];
      stats.forEach((s) => {
        const el = document.getElementById(s.id);
        if (el) {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: s.target,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: `#${s.id}`,
              start: "top 90%",
              toggleActions: "play none none none",
            },
            onUpdate: () => {
              if (s.id === "stat-3") {
                el.innerText = Math.floor(obj.val) + s.suffix;
              } else {
                el.innerText = s.prefix + Math.floor(obj.val).toLocaleString();
              }
            },
          });
        }
      });

      // 5. Read next cards stagger on entry
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
          <span className="text-white/80 truncate">Why Trading Gurus Use Demo Accounts</span>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Article Header */}
          <header className="space-y-6 pb-12 border-b border-[#1A1A1A]">
            <span className="text-xs font-mono tracking-widest uppercase text-[#C8F135] block">
              // TRADING PSYCHOLOGY
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white leading-tight uppercase tracking-tight max-w-4xl">
              Why Trading Gurus Use Demo Accounts — And What It Actually Means
            </h1>
            <p className="text-lg sm:text-xl text-[#A0A0A0] leading-relaxed font-sans font-light max-w-3xl">
              The hate is mostly misdirected. Demo trading isn't the problem. Here's what the real issue is, and why most traders are arguing about the wrong thing.
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
                <span>7 min read</span>
              </div>
            </div>
          </header>

          {/* Hero Image */}
          <figure className="w-full my-12 relative group shadow-sm">
            <div className="aspect-[16/9] w-full overflow-hidden border border-[#1A1A1A] relative bg-[#111111]">
              <Image 
                src="https://images.unsplash.com/photo-1642790551116-18e150f248e3?w=1200&q=80" 
                alt="Trader analysing candlestick charts on screen"
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
                  Everyone's Arguing About the Wrong Thing
                </h2>
                <div className="text-[17px] leading-[1.8] text-white/85 space-y-6 font-light font-sans">
                  <p>
                    Every few months someone in the trading space gets exposed for using a demo account on their content and the comments go nuclear. Fraud. Fake. Can't trade. And look, sometimes that anger is deserved. But a lot of the time it isn't. And if you're a trader trying to learn, understanding the difference matters more than joining the pile-on.
                  </p>
                  <p>
                    The question was never whether someone used demo. The question is whether they told you, and what they were actually trying to show you by not doing so.
                  </p>
                </div>
              </section>

              {/* Section 2 */}
              <section className="reveal-section space-y-6">
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white border-l-4 border-[#C8F135] pl-4 uppercase tracking-tight">
                  Why Demo Accounts Get Used, The Honest Reason
                </h2>
                <div className="text-[17px] leading-[1.8] text-white/85 space-y-6 font-light font-sans">
                  <p>
                    Most trading educators who build an audience don't start with significant capital. Or if they do, their real trading account is nowhere near the size their content implies.
                  </p>
                  <p>
                    A five to ten thousand pound account making consistent returns is genuinely impressive trading. But it produces unimpressive numbers. Forty pounds on a good session. Maybe two hundred on an exceptional one. That doesn't make a thumbnail. A hundred thousand pound demo making eight hundred in a session does.
                  </p>
                  <p>
                    Think of the Ferrari and the Mondeo. You're more interested in watching someone drive a Ferrari, even if they actually own a Mondeo. The demo account is the Ferrari. It's a production decision as much as a trading one. The strategy, the entries, the exits, the risk management, all of it is identical. The only things that change are the emotional stakes and the size of the numbers on screen.
                  </p>
                </div>
              </section>

              {/* Stat Block Component */}
              <section className="reveal-section py-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#111111] border border-[#1A1A1A] p-6 lg:p-8">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-[#C8F135] uppercase block">// RETAIL ACC</span>
                    <span id="stat-1" className="text-3xl font-display font-extrabold text-white block">£0</span>
                    <p className="text-xs text-[#A0A0A0] font-sans">Typical starting retail account</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-[#C8F135] uppercase block">// DEMO ACC</span>
                    <span id="stat-2" className="text-3xl font-display font-extrabold text-white block">£0</span>
                    <p className="text-xs text-[#A0A0A0] font-sans">Typical demo account used for content</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-[#C8F135] uppercase block">// MULTIPLIER</span>
                    <span id="stat-3" className="text-3xl font-display font-extrabold text-white block">0x</span>
                    <p className="text-xs text-[#A0A0A0] font-sans">The difference in visible numbers</p>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section className="reveal-section space-y-6">
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white border-l-4 border-[#C8F135] pl-4 uppercase tracking-tight">
                  The Emotional Argument, And Why It Cuts Both Ways
                </h2>
                <div className="text-[17px] leading-[1.8] text-white/85 space-y-6 font-light font-sans">
                  <p>
                    The most common defence of live-only trading content is that demo removes the emotional weight, and that emotion is precisely what destroys most retail traders. This is true. Trading a hundred thousand pound demo with nothing at risk is genuinely different from trading that same size with your own capital. The cortisol, the hesitation on entries, the impulse to move a stop loss: none of that exists on demo.
                  </p>
                  <p>
                    So when an educator trades demo without telling you, they're showing you mechanics without consequence. That's a legitimate criticism.
                  </p>
                  <p>
                    But here's the counter. For a trader learning a strategy, watching clean mechanical execution without emotional interference can actually be useful. You're watching the system work, not watching someone white-knuckle their way through a position. The issue isn't the demo. It's the missing context. If you know it's demo, you calibrate accordingly. If you don't know, that's where trust breaks down.
                  </p>
                </div>
              </section>

              {/* Pull Quote */}
              <section className="pull-quote-animate w-full bg-[#111111] border-l-4 border-[#C8F135] p-6 sm:p-8 my-12">
                <p className="text-xl sm:text-2xl font-display font-extrabold text-white italic leading-relaxed">
                  The strategy might be real. The edge might be real. But if the account is demo and you don't know it, the emotional proof of concept isn't. And in trading, that carries a lot of weight.
                </p>
              </section>

              {/* Section 4 */}
              <section className="reveal-section space-y-6">
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white border-l-4 border-[#C8F135] pl-4 uppercase tracking-tight">
                  The Omission Is the Problem, Not the Account Type
                </h2>
                <div className="text-[17px] leading-[1.8] text-white/85 space-y-6 font-light font-sans">
                  <p>
                    This is the actual point, and it's worth being precise about.
                  </p>
                  <p>
                    Using demo to create content is not inherently dishonest. Not disclosing that you're on demo, when your audience believes they're watching someone risk real capital, is a material omission. Those are two meaningfully different things.
                  </p>
                  <p>
                    When someone watches a guru trade, they're assessing conviction, risk tolerance, and the ability to hold a position under pressure. If the account is demo, none of those signals are real. The strategy might be genuine. The edge might be real. But the emotional proof of concept, the thing the audience is actually using to evaluate the educator, isn't there.
                  </p>
                  <p>
                    So when someone gets exposed for undisclosed demo trading, the anger is legitimate. Just aim it at the right target. Not at demo. At the absence of disclosure.
                  </p>
                </div>
              </section>

              {/* Section 5 */}
              <section className="reveal-section space-y-6">
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white border-l-4 border-[#C8F135] pl-4 uppercase tracking-tight">
                  What to Actually Look For
                </h2>
                <div className="text-[17px] leading-[1.8] text-white/85 space-y-6 font-light font-sans">
                  <p>
                    Ask these questions of any trading educator you're considering following. Are they disclosing their account type? Are they showing losses alongside wins? Is their strategy explained in terms of rules and process, or just in terms of outcomes? Do they have a track record that predates their audience? Are their affiliate relationships disclosed?
                  </p>
                  <p>
                    None of these give you a perfect filter. But they give you a much stronger signal than screenshots of P&L and a lifestyle thumbnail. The educators worth following show you the methodology, explain the reasoning, and are upfront about what they're doing and why.
                  </p>
                  <p>
                    The account size almost doesn't matter if the education is genuine. What matters is whether you're learning something that makes you a better trader, or just something that makes you want to be them.
                  </p>
                </div>
              </section>

              {/* Section 6 */}
              <section className="reveal-section space-y-6">
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white border-l-4 border-[#C8F135] pl-4 uppercase tracking-tight">
                  Why Drawdown Is Doing This Differently
                </h2>
                <div className="text-[17px] leading-[1.8] text-white/85 space-y-6 font-light font-sans">
                  <p>
                    The FTMO account being traded through Drawdown is a demo account. That's stated upfront, it's the whole point. The goal isn't to imply live capital performance. It's to show methodology in real time, transparently, so anyone following can see exactly what's happening and why. If it goes wrong you'll see it. If it goes well you'll see it.
                  </p>
                  <p>
                    No smoke. No editing out the losing days. That's the standard Drawdown holds itself to, and the standard worth holding any trading educator to.
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
              href="/blog/trading-education-business-model"
              className="read-next-card group bg-[#111111] border border-transparent hover:border-[#C8F135] transition-all duration-300 flex flex-col justify-between p-5 cursor-pointer"
            >
              <div className="space-y-4">
                <div className="aspect-[16/10] w-full border border-[#1A1A1A] relative bg-[#0A0A0A]">
                  <Image 
                    src="https://images.unsplash.com/photo-1559526324-593bc073d938?w=400&q=80" 
                    alt="Financial data and market analysis dashboard"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-[10px] font-mono text-[#C8F135] tracking-widest uppercase block">// INDUSTRY</span>
                <h3 className="font-display text-base lg:text-lg font-semibold text-white line-clamp-2 uppercase group-hover:text-[#C8F135] transition-colors leading-tight">
                  The Trading Education Business Model: How the Money Is Really Made
                </h3>
              </div>
              <span className="text-xs text-[#A0A0A0] font-mono mt-6 block">8 min read</span>
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
            Trading Education Without the Smoke and Mirrors
          </h2>
          <p className="text-[#A0A0A0] max-w-2xl mx-auto text-base sm:text-lg leading-relaxed font-sans font-light">
            Everything on Drawdown is disclosed. Every affiliate link labelled. Every account type stated. Phase one is free — no card required.
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
