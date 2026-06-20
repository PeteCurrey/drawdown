"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function CoffeezillaAlexGClient() {
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

      // 4. Read next cards stagger on entry
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
          <span className="text-white/80 truncate">The Coffeezilla Video on fxAlexG</span>
        </div>

        {/* Article Header */}
        <header className="space-y-6 pb-12 border-b border-[#1A1A1A]">
          <span className="text-xs font-mono tracking-widest uppercase text-[#C8F135] block">
            // TRADING EDUCATION
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white leading-tight uppercase">
            The Coffeezilla Video on fxAlexG: What It Actually Tells Us About Trading Education
          </h1>
          <p className="text-lg sm:text-xl text-[#A0A0A0] leading-relaxed font-sans font-light">
            Seven and a half million in course revenue. Thirty percent from actual trading. Here's what the numbers really mean, and what every trader should take from it.
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
              <span>9 min read</span>
            </div>
          </div>
        </header>

        {/* Hero Image Placeholder */}
        <div className="my-12 aspect-[16/9] w-full bg-[#111111] border border-[#1A1A1A] flex items-center justify-center p-6 text-center select-none">
          <span className="text-[#C8F135] font-mono text-xs sm:text-sm tracking-widest uppercase">
            [ HERO IMAGE — trading desk / screen glow editorial ]
          </span>
        </div>

        {/* Article Body */}
        <article className="max-w-[720px] mx-auto space-y-16">
          
          {/* Section 1 */}
          <section className="reveal-section space-y-6">
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white border-l-4 border-[#C8F135] pl-4 uppercase tracking-tight">
              First: Be Fair to Alex Gonzalez
            </h2>
            <div className="text-[17px] leading-[1.8] text-white/85 space-y-4 font-light">
              <p>
                The Coffeezilla video exposed a proportion problem, not a fraud. Alex clearly knows how to trade: he talks about losses, explains reasoning, and his set-and-forget swing approach is legitimate. The issue is not that he used demo accounts. It is that he did not tell anyone.
              </p>
              <p>
                Write this section with genuine fairness, acknowledging he built something remarkable from nothing. The kind of guy you would want to have a beer with and talk shop. The Rocket21 situation is noted but not commented on, as the facts are not fully known, so it stays out of scope here.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="reveal-section space-y-6">
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white border-l-4 border-[#C8F135] pl-4 uppercase tracking-tight">
              The Demo Account Question — And Why Most People Get This Wrong
            </h2>
            <div className="text-[17px] leading-[1.8] text-white/85 space-y-4 font-light">
              <p>
                Most of the hate directed at trading gurus for using demo accounts misses the actual point. Demo does not mean they cannot trade. It means they are using bigger position sizes than their real account allows, because larger numbers make better content. A real £5k account making £40 a day is not a video. A £100k demo making £800 a day is.
              </p>
              <p>
                Use the Ferrari and Mondeo analogy: you are more interested in watching someone drive a Ferrari, even if they actually own a Mondeo. The deception is not in the strategy, the mechanics are identical. It is in the omission of context. And ultimately, the only person not getting paid out at the end is them. Give traders credit for understanding this nuance.
              </p>
            </div>
          </section>

          {/* Pull Quote Component */}
          <section className="pull-quote-animate w-full bg-[#111111] border-l-4 border-[#C8F135] p-6 sm:p-8 my-12">
            <p className="text-xl sm:text-2xl font-display font-extrabold text-white italic leading-relaxed">
              Demo does not mean they cannot trade. It means they are using bigger numbers than their real account allows, because larger numbers make better content.
            </p>
          </section>

          {/* Section 3 */}
          <section className="reveal-section space-y-6">
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white border-l-4 border-[#C8F135] pl-4 uppercase tracking-tight">
              The Business Model of Trading Education — Laid Bare
            </h2>
            <div className="text-[17px] leading-[1.8] text-white/85 space-y-4 font-light">
              <p>
                The model is simple once you see it. Build an audience around lifestyle and aspiration. Sell education, because course revenue does not have drawdowns. Layer in affiliate revenue from brokers and prop firms.
              </p>
              <p>
                This is also the Drawdown model: subscriptions, broker affiliates, prop firm affiliates. The difference is it is disclosed upfront. Every affiliate link is labelled. The income sources are on the site. Transparency is not a marketing angle, it is the only defensible position once you understand how the money works.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="reveal-section space-y-6">
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white border-l-4 border-[#C8F135] pl-4 uppercase tracking-tight">
              What This Means If You're Learning to Trade
            </h2>
            <div className="text-[17px] leading-[1.8] text-white/85 space-y-4 font-light">
              <p>
                Be sceptical of lifestyle-first content, not because those educators cannot trade, but because lifestyle content is marketing, not education. Understand that a lot of social media results are demo, cherry-picked, or fabricated.
              </p>
              <p>
                And accept that the things that actually make you a better trader, position sizing discipline, a documented edge, emotional control, will never go viral. A video called "The Maths of Revenge Trading Will Destroy Your Account" will never beat "I Made £50k in One Day on Gold" for views. But one of those actually helps you.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="reveal-section space-y-6">
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white border-l-4 border-[#C8F135] pl-4 uppercase tracking-tight">
              Where Drawdown Fits In
            </h2>
            <div className="text-[17px] leading-[1.8] text-white/85 space-y-4 font-light">
              <p>
                Built out of genuine frustration. Not with Alex specifically, he was not even on the radar when Drawdown started. Frustration that there was nowhere to send someone who wanted to learn properly without being immediately buried in lifestyle marketing and overpriced courses.
              </p>
              <p>
                Drawdown has structured curriculum, AI tools, live market data, honest broker reviews with disclosed referral earnings, and a community built around people who want to actually trade rather than look like they do. Phase one is free. No credit card.
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

            {/* Card 2 */}
            <Link 
              href="/blog/trading-education-business-model"
              className="read-next-card group bg-[#111111] border border-transparent hover:border-[#C8F135] transition-all duration-300 flex flex-col justify-between p-5 cursor-pointer"
            >
              <div className="space-y-4">
                <div className="aspect-[16/10] w-full bg-[#0A0A0A] border border-[#1A1A1A] flex items-center justify-center p-4 text-center">
                  <span className="text-white/20 font-mono text-[9px] uppercase tracking-wider">[ Mockup Image ]</span>
                </div>
                <span className="text-[10px] font-mono text-[#C8F135] tracking-widest uppercase block">// INDUSTRY</span>
                <h3 className="text-md font-display font-bold text-white uppercase line-clamp-3">
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
            Learn to Trade Without the Bullshit
          </h2>
          <p className="text-[#A0A0A0] max-w-2xl mx-auto text-base sm:text-lg leading-relaxed font-sans font-light">
            Phase one of Drawdown is completely free. No credit card. No lifestyle marketing. Just the education.
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
              See What's Inside &rarr;
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
