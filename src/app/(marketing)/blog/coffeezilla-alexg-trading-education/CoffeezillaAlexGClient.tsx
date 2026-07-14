"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Link2, Check, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function CoffeezillaAlexGClient() {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(
    "The Coffeezilla Video on fxAlexG: What It Actually Tells Us About Trading Education"
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
          <span className="text-white/80 truncate">The Coffeezilla Video on fxAlexG</span>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Article Header */}
          <header className="space-y-6 pb-12 border-b border-[#1A1A1A]">
            <span className="text-xs font-mono tracking-widest uppercase text-[#C8F135] block">
              // TRADING EDUCATION
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white leading-tight uppercase tracking-tight max-w-4xl">
              The Coffeezilla Video on fxAlexG: What It Actually Tells Us About Trading Education
            </h1>
            <p className="text-lg sm:text-xl text-[#A0A0A0] leading-relaxed font-sans font-light max-w-3xl">
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

          {/* Hero Image */}
          <figure className="w-full my-12 relative group shadow-sm">
            <div className="aspect-[16/9] w-full overflow-hidden border border-[#1A1A1A] relative bg-[#111111]">
              <Image 
                src="/images/blog/alexg-bugatti.png" 
                alt="Deep blue and purple Bugatti Chiron"
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
                  First: Be Fair to Alex Gonzalez
                </h2>
                <div className="text-[17px] leading-[1.8] text-white/85 space-y-6 font-light font-sans">
                  <p>
                    Someone sent me the Coffeezilla video on Alex Gonzalez a few weeks back. I watched it twice. And before I say anything else, I want to be clear about something: I don't think Alex is a fraud in the way that word is being thrown around right now.
                  </p>
                  <p>
                    I've watched his content. The guy clearly knows how to trade. He talks about his losses, he explains his reasoning, and his set-and-forget approach to swing trading is a legitimate methodology. I've never met him, but everything I've seen suggests he's a genuine trader who also turned out to be an exceptional businessman. To be honest, I'd love to share a few Coronas with him and talk shop (and Bugatti's), he sounds like a top lad
                  </p>
                  <p>
                    What the Coffeezilla video exposed isn't that Alex can't trade. It's a proportion problem. Seven and a half million pounds in course revenue over three years. Around thirty percent from actual trading. And a significant amount of the content that built that audience? Shot on demo accounts. Which he didn't disclose.
                  </p>
                  <p>
                    The Rocket21 situation is a separate matter entirely, and one I'm not going to comment on here because I don't know enough of the facts. What I do know is that if a prop firm took challenge fees and didn't pay traders out, that has real consequences for real people. But I won't say more than that without knowing more than I do.
                  </p>
                </div>
              </section>

              {/* Section 2 */}
              <section className="reveal-section space-y-6">
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white border-l-4 border-[#C8F135] pl-4 uppercase tracking-tight">
                  The Demo Account Question, And Why Most People Get This Wrong
                </h2>
                <div className="text-[17px] leading-[1.8] text-white/85 space-y-6 font-light font-sans">
                  <p>
                    Here's where most of the commentary on this situation goes wrong. The hate directed at trading gurus for using demo accounts is largely misdirected, and if you're a trader trying to learn, conflating demo use with inability to trade is going to cost you good information.
                  </p>
                  <p>
                    Demo doesn't mean they can't trade. It means they're using bigger position sizes than their real account allows, because larger numbers make better content. A real five thousand pound account making forty quid on a good session isn't a video. A hundred thousand pound demo account making eight hundred in a session is a screenshot, a thumbnail, and a reason to keep watching.
                  </p>
                  <p>
                    Think of it like this. You're more interested in watching someone drive a Ferrari than a Mondeo, even if the person behind the wheel actually owns a Mondeo. The demo account is the Ferrari. It's a production decision as much as a trading decision. The strategy, the entries, the exits, the risk management, all of it is identical to what you'd do on a live account. The only thing that changes is the emotional weight, and the size of the numbers on screen.
                  </p>
                  <p>
                    And here's the thing people miss: the only person not getting paid out at the end of a demo session is the trader themselves. If the strategy doesn't work, they're not losing real money proving it. So give the audience a bit more credit, the problem was never demo accounts. The problem was the omission. Not telling people it was demo when they believed they were watching someone risk real capital. That's where the trust breaks.
                  </p>
                </div>
              </section>

              {/* Pull Quote */}
              <section className="pull-quote-animate w-full bg-[#111111] border-l-4 border-[#C8F135] p-6 sm:p-8 my-12">
                <p className="text-xl sm:text-2xl font-display font-extrabold text-white italic leading-relaxed">
                  Demo does not mean they cannot trade. It means they are using bigger numbers than their real account allows, because larger numbers make better content.
                </p>
              </section>

              {/* Section 3 */}
              <section className="reveal-section space-y-6">
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white border-l-4 border-[#C8F135] pl-4 uppercase tracking-tight">
                  The Business Model of Trading Education, Laid Bare
                </h2>
                <div className="text-[17px] leading-[1.8] text-white/85 space-y-6 font-light font-sans">
                  <p>
                    Once you understand how trading education actually makes money, everything starts to make a lot more sense.
                  </p>
                  <p>
                    The model is simple. Step one: build an audience around lifestyle and aspiration, the cars, the watches, the laptop on a beach, the aesthetic of financial freedom. Step two: sell education, because course revenue doesn't have drawdowns. It doesn't get stopped out. It doesn't fluctuate with the dollar index. Every new follower is a potential customer. Step three: layer in affiliate revenue from brokers and prop firms, earning a commission every time your audience signs up for something you recommend.
                  </p>
                  <p>
                    I want to be completely straight about something here: that is also the Drawdown model. Subscriptions, broker affiliates, prop firm affiliates. I'm not going to pretend otherwise. The difference, the only difference, is that I'm telling you that upfront. Every affiliate link on this site is labelled. The income sources are disclosed. You know exactly how Drawdown makes money before you give us a penny of yours.
                  </p>
                  <p>
                    Transparency isn't a marketing angle here. It's the only defensible position once you understand how the incentives actually work.
                  </p>
                </div>
              </section>

              {/* Section 4 */}
              <section className="reveal-section space-y-6">
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white border-l-4 border-[#C8F135] pl-4 uppercase tracking-tight">
                  What This Means If You're Learning to Trade
                </h2>
                <div className="text-[17px] leading-[1.8] text-white/85 space-y-6 font-light font-sans">
                  <p>
                    Understanding the model makes you a better consumer of trading content. Here's what to do with that.
                  </p>
                  <p>
                    Be sceptical of lifestyle-first content, not because those educators can't trade, but because lifestyle content is marketing, not education. It's designed to make you want to be them, not to make you better at trading.
                  </p>
                  <p>
                    Understand that a significant proportion of the results you see on social media are demo account performance, cherry-picked wins, or in some cases outright fabricated. Not all of them. But enough that asking the question is always worth it.
                  </p>
                  <p>
                    And accept this uncomfortable truth: the things that will actually make you a better trader will never go viral. Position sizing discipline. A documented, testable edge. Emotional control under drawdown. Understanding exactly what kills retail accounts. These things don't make good thumbnails. A video called "The Maths of Revenge Trading Will Destroy Your Account" will never beat "I Made £50k in One Day on Gold" for views. But one of those videos will actually help you. You already know which one.
                  </p>
                </div>
              </section>

              {/* Section 5 */}
              <section className="reveal-section space-y-6">
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white border-l-4 border-[#C8F135] pl-4 uppercase tracking-tight">
                  Where Drawdown Fits In
                </h2>
                <div className="text-[17px] leading-[1.8] text-white/85 space-y-6 font-light font-sans">
                  <p>
                    I built Drawdown out of genuine frustration. Not with Alex specifically, I didn't even know he existed when I started. The frustration was simpler than that. There was nowhere I could point someone who wanted to learn to trade properly without them being immediately buried in lifestyle marketing, overpriced one-time courses, and content built to get views rather than to actually help anyone.
                  </p>
                  <p>
                    Drawdown has structured curriculum, real AI tools, live market data, and broker reviews where I tell you exactly what I earn for a referral before you click the link. Phase one is completely free. No credit card, no gotcha. Come and have a look and make up your own mind.
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
                  style={{ backgroundImage: `url(/images/blog/alexg-bugatti.png)` }} 
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
                    src="/images/blog/alexg-bugatti.png" 
                    alt="Deep blue and purple Bugatti Chiron"
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
