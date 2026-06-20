"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function WhyGurusDemoClient() {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // 1. Reading progress bar animation
    const progressAnim = gsap.to(progressBarRef.current, {
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
    const sectionAnims = sections.map((sec) => {
      return gsap.fromTo(
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
    let pullQuoteAnim: gsap.core.Tween | undefined;
    if (pullQuote) {
      pullQuoteAnim = gsap.fromTo(
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
    const statAnims: gsap.core.Tween[] = [];
    stats.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) {
        const obj = { val: 0 };
        const anim = gsap.to(obj, {
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
        statAnims.push(anim);
      }
    });

    // 5. Read next cards stagger on entry
    const cards = gsap.utils.toArray<HTMLElement>(".read-next-card");
    let cardsAnim: gsap.core.Tween | undefined;
    if (cards.length > 0) {
      cardsAnim = gsap.fromTo(
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

    // Clean up GSAP timelines on unmount
    return () => {
      progressAnim.kill();
      sectionAnims.forEach((anim) => anim.kill());
      if (pullQuoteAnim) pullQuoteAnim.kill();
      statAnims.forEach((anim) => anim.kill());
      if (cardsAnim) cardsAnim.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
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
          <span className="text-white/80 truncate">Why Trading Gurus Use Demo Accounts</span>
        </div>

        {/* Article Header */}
        <header className="space-y-6 pb-12 border-b border-[#1A1A1A]">
          <span className="text-xs font-mono tracking-widest uppercase text-[#C8F135] block">
            // TRADING PSYCHOLOGY
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white leading-tight uppercase">
            Why Trading Gurus Use Demo Accounts — And What It Actually Means
          </h1>
          <p className="text-lg sm:text-xl text-[#A0A0A0] leading-relaxed font-sans font-light">
            The hate is mostly misdirected. Demo trading is not the problem. Here is what the real issue is — and why most traders are arguing about the wrong thing.
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

        {/* Hero Image Placeholder */}
        <div className="my-12 aspect-[16/9] w-full bg-[#111111] border border-[#1A1A1A] flex items-center justify-center p-6 text-center select-none">
          <span className="text-[#C8F135] font-mono text-xs sm:text-sm tracking-widest uppercase">
            [ HERO IMAGE — split screen Ferrari / Mondeo or demo vs live account visual ]
          </span>
        </div>

        {/* Article Body */}
        <article className="max-w-[720px] mx-auto space-y-16">
          
          {/* Section 1 */}
          <section className="reveal-section space-y-6">
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white border-l-4 border-[#C8F135] pl-4 uppercase tracking-tight">
              Everyone's Arguing About the Wrong Thing
            </h2>
            <div className="text-[17px] leading-[1.8] text-white/85 space-y-4 font-light">
              <p>
                Every few months, someone gets exposed for using a demo account on their trading content, and the comments section goes completely nuclear. Fraud. Fake. Scammer. The outcry is predictable, and to a large extent, the anger is entirely justified. Nobody likes being deceived, especially when financial decisions and educational products are involved.
              </p>
              <p>
                However, a lot of the rage is misdirected, conflating the tool with the intent. If you are a trader trying to learn, you need to understand the difference. Conflating "used a demo account" with "cannot trade" is a mistake that will cost you access to good information. 
              </p>
              <p>
                The question is not whether someone used a demo account. The question is whether they told you that they were using one, and why they chose to withhold that information in the first place.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="reveal-section space-y-6">
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white border-l-4 border-[#C8F135] pl-4 uppercase tracking-tight">
              Why Demo Accounts Get Used — The Honest Reason
            </h2>
            <div className="text-[17px] leading-[1.8] text-white/85 space-y-4 font-light">
              <p>
                Here is the reality of the situation. Most trading educators who build a large social media audience do not start with significant capital. Even if they eventually accumulate wealth, their actual live trading account is rarely the size their content implies. A real £5,000 to £10,000 account making consistent, disciplined returns is an impressive feat of trading. However, it produces incredibly boring numbers for social media algorithms: a £40 profit on a good session, or perhaps a couple of hundred pounds on an exceptional day. That does not make for viral content.
              </p>
              <p>
                In contrast, a £100,000 demo account making £800 in a single session creates an instant screenshot. It provides a flashy thumbnail. It is something a viewer can easily project themselves into, triggering the thought: "I want that." 
              </p>
              <p>
                Think of this as the Ferrari and Mondeo framing: you are far more interested in watching someone drive a Ferrari around a track, even if they actually own a Mondeo for their daily commute. In this context, the demo account is the Ferrari. It is a production choice as much as a trading choice. The strategy, the entries, the exits, and the risk management principles are identical to what you would execute on a live account. The only thing that changes is the emotional weight, and the size of the numbers displayed on the screen.
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
              The Emotional Argument — And Why It Cuts Both Ways
            </h2>
            <div className="text-[17px] leading-[1.8] text-white/85 space-y-4 font-light">
              <p>
                The most common defence of live-only trading content is that demo accounts remove all emotion, and that emotion is what ultimately kills most retail traders. This is a valid argument. Trading a £100,000 demo account with no real money at risk is fundamentally different to trading £100,000 of your own capital. The cortisol response, the hesitation on entries, the impulse to move stop-losses: these things are real, and they do not exist when there is no financial consequence. So when an educator says "watch me trade" on a demo account, they are showing you the mechanics of a system without showing you the emotional discipline required to run it.
              </p>
              <p>
                That is a legitimate criticism, but there is a counter-argument to consider: for a trader learning a strategy for the first time, watching clean, mechanical execution without emotional interference is actually useful. You are watching the system operate under ideal conditions, rather than watching someone white-knuckle their way through a position. The issue is transparency, not the demo account itself. If you know it is a demo account, you can calibrate your expectations accordingly. If you do not know, that is where the trust breaks down completely.
              </p>
            </div>
          </section>

          {/* Full-width Pull Quote Component */}
          <section className="pull-quote-animate w-full bg-[#111111] border-l-4 border-[#C8F135] p-6 sm:p-8 my-12">
            <p className="text-xl sm:text-2xl font-display font-extrabold text-white italic leading-relaxed">
              "The strategy might be real. The edge might be real. But if the account is demo and you don't know it — the emotional proof of concept isn't. And in trading, that carries a lot of weight."
            </p>
          </section>

          {/* Section 4 */}
          <section className="reveal-section space-y-6">
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white border-l-4 border-[#C8F135] pl-4 uppercase tracking-tight">
              The Omission Is the Problem — Not the Account Type
            </h2>
            <div className="text-[17px] leading-[1.8] text-white/85 space-y-4 font-light">
              <p>
                This is the actual point of the debate. Using a demo account to create educational content is not inherently dishonest. However, failing to disclose that you are using a demo account, especially when your audience believes you are risking real capital, is a material omission. There is a meaningful difference between these two things, and it matters enormously to the integrity of the education.
              </p>
              <p>
                The audience watching an educator trade believes they are seeing real-stakes decision-making. They are assessing the educator's conviction, their risk tolerance, and their ability to hold a position under pressure. If the account is a demo, none of those signals are real. The strategy might be real, and the edge might be real, but the emotional proof of concept is not. 
              </p>
              <p>
                In trading education, that proof of concept carries a lot of weight. So when someone is exposed for demo trading without disclosure, the anger is legitimate: but aim it at the right target. Do not aim it at the use of a demo account. Aim it at the absence of disclosure.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="reveal-section space-y-6">
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white border-l-4 border-[#C8F135] pl-4 uppercase tracking-tight">
              What to Actually Look For
            </h2>
            <div className="text-[17px] leading-[1.8] text-white/85 space-y-4 font-light">
              <p>
                As a trader consuming content, you need practical guidelines to filter the noise. Ask these questions: Is this person disclosing their account type? Are they showing their losses as well as their wins? Is their strategy explained in terms of rules and process, or just outcomes? Do they have a track record that predates their audience? Are their affiliate relationships disclosed?
              </p>
              <p>
                None of these questions will give you a perfect filter, but they will give you a much better signal than screenshots of P&L and a lifestyle thumbnail. The educators worth following are the ones who show you the methodology, explain the reasoning behind their entries, and are upfront about what they are doing and why. The account size almost does not matter if the education is genuine.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="reveal-section space-y-6">
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white border-l-4 border-[#C8F135] pl-4 uppercase tracking-tight">
              Why Drawdown Is Doing This Differently
            </h2>
            <div className="text-[17px] leading-[1.8] text-white/85 space-y-4 font-light">
              <p>
                The FTMO demo account being traded publicly through the Drawdown platform is a demo. That is stated upfront: it is the entire point of the project. The goal is not to imply live-capital performance. It is to show the methodology in real time, transparently, so that anyone following can see exactly what is happening and why.
              </p>
              <p>
                If it goes wrong, you will see it. If it goes well, you will see it. There is no smoke, no mirrors, and no editing out the bad days. That is the standard Drawdown is holding itself to: and it is the standard worth holding any trading educator to in this industry.
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
            <div className="read-next-card group bg-[#111111] border border-transparent hover:border-[#C8F135] transition-all duration-300 flex flex-col justify-between p-5 cursor-pointer">
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
            </div>

            {/* Card 2 */}
            <div className="read-next-card group bg-[#111111] border border-transparent hover:border-[#C8F135] transition-all duration-300 flex flex-col justify-between p-5 cursor-pointer">
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
            </div>

            {/* Card 3 */}
            <div className="read-next-card group bg-[#111111] border border-transparent hover:border-[#C8F135] transition-all duration-300 flex flex-col justify-between p-5 cursor-pointer">
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
            </div>
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
              Start Free →
            </Link>
            <Link
              href="/#curriculum"
              className="border border-white/20 text-white hover:bg-white/5 px-8 py-3.5 transition duration-200 font-sans text-center text-sm"
            >
              See the Curriculum →
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
