"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ShieldAlert, Download, Lock, Zap } from "lucide-react";

export default function PropSurvivalKitPage() {
  const [includeBump, setIncludeBump] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/store/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: "prop-survival-kit", includeBump }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Checkout failed. Please try again.");
      }
    } catch {
      alert("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  const mockupVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: 0.3,
        ease: "easeOut" as const,
      },
    },
  };

  const backgroundCandles = [
    { x: 40, open: 220, close: 200, high: 230, low: 190 },
    { x: 80, open: 200, close: 210, high: 215, low: 195 },
    { x: 120, open: 210, close: 190, high: 220, low: 180 },
    { x: 160, open: 190, close: 170, high: 200, low: 160 },
    { x: 200, open: 170, close: 180, high: 185, low: 165 },
    { x: 240, open: 180, close: 150, high: 190, low: 140 },
    { x: 280, open: 150, close: 130, high: 160, low: 120 },
    { x: 320, open: 130, close: 140, high: 145, low: 125 },
    { x: 360, open: 140, close: 110, high: 150, low: 100 },
    { x: 400, open: 110, close: 90, high: 120, low: 80 },
    { x: 440, open: 90, close: 100, high: 105, low: 85 },
    { x: 480, open: 100, close: 80, high: 110, low: 70 },
    { x: 520, open: 80, close: 70, high: 90, low: 60 },
    { x: 560, open: 70, close: 95, high: 105, low: 65 },
    { x: 600, open: 95, close: 85, high: 100, low: 80 },
    { x: 640, open: 85, close: 110, high: 120, low: 80 },
    { x: 680, open: 110, close: 100, high: 115, low: 95 },
    { x: 720, open: 100, close: 125, high: 135, low: 95 },
    { x: 760, open: 125, close: 115, high: 130, low: 110 },
    { x: 800, open: 115, close: 140, high: 150, low: 110 },
    { x: 840, open: 140, close: 130, high: 145, low: 125 },
    { x: 880, open: 130, close: 160, high: 170, low: 125 },
    { x: 920, open: 160, close: 150, high: 165, low: 145 },
    { x: 960, open: 150, close: 180, high: 190, low: 140 },
    { x: 1000, open: 180, close: 170, high: 185, low: 165 },
    { x: 1040, open: 170, close: 200, high: 210, low: 160 },
    { x: 1080, open: 200, close: 190, high: 205, low: 185 },
    { x: 1120, open: 190, close: 220, high: 230, low: 180 },
    { x: 1160, open: 220, close: 210, high: 225, low: 200 }
  ];

  const maPeriod = 5;
  const longMaPeriod = 12;

  const maPathPoints = backgroundCandles.map((c, idx) => {
    const start = Math.max(0, idx - maPeriod + 1);
    const subset = backgroundCandles.slice(start, idx + 1);
    const sum = subset.reduce((acc, curr) => acc + (curr.open + curr.close) / 2, 0);
    const avg = sum / subset.length;
    return `${c.x},${avg}`;
  });

  const longMaPathPoints = backgroundCandles.map((c, idx) => {
    const start = Math.max(0, idx - longMaPeriod + 1);
    const subset = backgroundCandles.slice(start, idx + 1);
    const sum = subset.reduce((acc, curr) => acc + (curr.open + curr.close) / 2, 0);
    const avg = sum / subset.length;
    return `${c.x},${avg}`;
  });

  const maPathD = `M ${maPathPoints.join(" L ")}`;
  const longMaPathD = `M ${longMaPathPoints.join(" L ")}`;

  return (
    <div className="flex flex-col bg-mkt-bg text-mkt-ink">
      
      {/* Full Screen Hero Section */}
      <section className="relative w-full min-h-[calc(100vh-58px)] flex flex-col justify-center overflow-hidden bg-white py-12 md:py-20 border-b border-mkt-bd z-20">
        
        {/* Background candle chart pattern mirroring Home page */}
        <div className="absolute inset-0 z-0 opacity-[0.035] pointer-events-none select-none flex items-center justify-center overflow-hidden">
          <svg className="w-full h-[70%] min-h-[350px]" viewBox="0 0 1200 300" fill="none" preserveAspectRatio="none">
            <path 
              d={maPathD} 
              fill="none" 
              stroke="#9ca3af" 
              strokeWidth="1.5" 
              strokeDasharray="4 4" 
            />
            <path 
              d={longMaPathD} 
              fill="none" 
              stroke="#6b7280" 
              strokeWidth="1.5" 
            />
            {backgroundCandles.map((c, i) => {
              const isBullish = c.close < c.open;
              const color = isBullish ? "#22c55e" : "#ef4444";
              const bodyY = Math.min(c.open, c.close);
              const bodyHeight = Math.max(Math.abs(c.open - c.close), 2);
              return (
                <g key={i}>
                  <line 
                    x1={c.x} 
                    y1={c.high} 
                    x2={c.x} 
                    y2={c.low} 
                    stroke={color} 
                    strokeWidth="1.5" 
                  />
                  <rect 
                    x={c.x - 5} 
                    y={bodyY} 
                    width="10" 
                    height={bodyHeight} 
                    fill={color} 
                    rx="1"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Fade masks for visual blending */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent pointer-events-none z-0" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent pointer-events-none z-0" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Column Content */}
            <motion.div 
              className="max-w-2xl space-y-6 md:space-y-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Eyebrow Pill with blinking green dot */}
              <motion.div 
                variants={itemVariants} 
                className="flex items-center gap-2 px-3 py-1 border border-mkt-bd rounded-full w-fit bg-white shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-mkt-grn inline-block animate-pulse" />
                <span className="text-[11px] font-semibold tracking-wider text-mkt-i3 uppercase font-sans">
                  DIGITAL DOWNLOAD • INSTANT ACCESS
                </span>
              </motion.div>
              
              {/* Headline aligned with homepage style */}
              <motion.h1 
                variants={itemVariants}
                className="text-[clamp(38px,5.5vw,72px)] font-sans font-extrabold text-mkt-ink leading-[1.05] tracking-tight uppercase"
                style={{ fontWeight: 800 }}
              >
                The Architecture <br />
                of a <span className="text-mkt-grn italic">Passed</span> <br />
                Challenge.
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="text-lg md:text-xl font-sans text-mkt-i3 leading-relaxed font-medium"
              >
                Most traders blow their accounts on day three due to mathematical ignorance. Get the exact risk-sizing sheets, daily routines, and drawdown recovery models required to secure funding.
              </motion.p>

              <motion.div 
                variants={itemVariants}
                className="pt-4 space-y-4"
              >
                <button 
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full md:w-auto px-10 py-4.5 bg-mkt-ink text-white font-sans font-black uppercase tracking-[0.2em] text-sm hover:bg-mkt-i2 transition-premium flex items-center justify-center gap-3 disabled:opacity-60 cursor-pointer shadow-lg shadow-black/10 rounded-lg"
                >
                  <Download className="w-5 h-5" /> {loading ? "Redirecting..." : "Download The Kit — £14"}
                </button>
                <p className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4 flex items-center gap-2">
                  <Lock className="w-3 h-3 text-mkt-grn" /> Secure Checkout via Stripe
                </p>
              </motion.div>
            </motion.div>

            {/* Right Column Premium Mockup Box */}
            <motion.div 
              variants={mockupVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ 
                rotateX: 4, 
                rotateY: -4,
                y: -6,
                transition: { duration: 0.4, ease: "easeOut" }
              }}
              className="relative p-1 bg-white border border-mkt-bd shadow-2xl transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] rounded-2xl transform-gpu max-w-lg mx-auto lg:max-w-none w-full"
            >
              <div className="absolute -inset-1 bg-gradient-to-tr from-mkt-grn to-white opacity-10 blur-xl pointer-events-none rounded-2xl" />
              <div className="relative bg-[#F7F7F7] p-8 aspect-square flex flex-col justify-between border border-mkt-bd rounded-xl">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4">// DRAWDOWN INTEL</span>
                  <ShieldAlert className="w-8 h-8 text-mkt-red" />
                </div>
                
                <div className="space-y-4 my-auto py-8">
                  <h3 className="text-3xl font-sans font-black uppercase text-mkt-ink leading-tight">
                    Stop Donating <br /> Evaluation Fees.
                  </h3>
                  <p className="text-mkt-i2 text-sm leading-relaxed">
                    You are trading against a mathematical formula designed to force mistakes. It's time to deploy professional risk parameters to protect your capital.
                  </p>
                </div>

                <div className="border-t border-mkt-bd pt-4 flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-mkt-i4">
                  <span>Google Sheet + PDF Guides</span>
                  <span className="text-mkt-ink font-bold">V1.4 Active</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* The Agitation Section */}
      <section className="py-24 border-b border-mkt-bd bg-[#F7F7F7] relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,194,255,0.02)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-8">
          <h2 className="text-3xl md:text-5xl font-sans font-black uppercase leading-tight text-mkt-ink">
            Another $500 fee gone. <br />
            <span className="text-mkt-i4">Another revenge trade spiral.</span>
          </h2>
          <p className="text-lg text-mkt-i2 leading-relaxed text-left md:text-center">
            The prop firms are banking on your lack of structure. They know that after one bad loss, you will over-leverage to &quot;make it back&quot; and violate the daily drawdown limit. They rely on your emotional tilt to keep their business model highly profitable.
          </p>
          <p className="text-lg text-mkt-ink font-black uppercase tracking-tight text-left md:text-center border-t border-b border-mkt-bd/50 py-4 max-w-xl mx-auto">
            You don&apos;t need a better strategy. You need a better defense.
          </p>
        </div>
      </section>

      {/* What's Inside Grid */}
      <section className="py-24 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="mb-16 text-center">
            <span className="text-[10px] font-mono tracking-widest uppercase text-mkt-grn font-bold block mb-4">
              // THE ARSENAL
            </span>
            <h2 className="text-4xl font-sans font-black uppercase text-mkt-ink">
              What You Get Instantly.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Card 1 */}
            <div className="p-8 border border-mkt-bd bg-[#F7F7F7]/50 hover:border-mkt-ink hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="text-mkt-grn mb-6 font-sans font-black text-4xl">01</div>
                <h3 className="text-xl font-sans font-black uppercase mb-4 text-mkt-ink">The Max-Drawdown Calculator</h3>
                <p className="text-sm text-mkt-i2 leading-relaxed mb-8">
                  A plug-and-play Google Sheet that calculates your exact lot size based on your current equity and the firm&apos;s specific trailing drawdown rules. Never accidentally breach a limit again.
                </p>
              </div>
              <ul className="space-y-2 border-t border-mkt-bd/50 pt-4">
                <li className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-mkt-i3">
                  <CheckCircle2 className="w-3.5 h-3.5 text-mkt-grn" /> FTMO Logic Included
                </li>
                <li className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-mkt-i3">
                  <CheckCircle2 className="w-3.5 h-3.5 text-mkt-grn" /> The5%ers Logic Included
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="p-8 border border-mkt-bd bg-[#F7F7F7]/50 hover:border-mkt-ink hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="text-mkt-grn mb-6 font-sans font-black text-4xl">02</div>
                <h3 className="text-xl font-sans font-black uppercase mb-4 text-mkt-ink">30-Day Evaluation Checklist</h3>
                <p className="text-sm text-mkt-i2 leading-relaxed mb-8">
                  A daily protocol to follow before you execute a single trade. It forces you to check news events, verify your bias, and confirm your risk parameters.
                </p>
              </div>
              <ul className="space-y-2 border-t border-mkt-bd/50 pt-4">
                <li className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-mkt-i3">
                  <CheckCircle2 className="w-3.5 h-3.5 text-mkt-grn" /> Pre-Market Routine
                </li>
                <li className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-mkt-i3">
                  <CheckCircle2 className="w-3.5 h-3.5 text-mkt-grn" /> End-of-Day Debrief
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="p-8 border border-mkt-bd bg-[#F7F7F7]/50 hover:border-mkt-ink hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="text-mkt-grn mb-6 font-sans font-black text-4xl">03</div>
                <h3 className="text-xl font-sans font-black uppercase mb-4 text-mkt-ink">&quot;The Tilt Protocol&quot;</h3>
                <p className="text-sm text-mkt-i2 leading-relaxed mb-8">
                  The exact psychological framework our desk uses to stop a drawdown spiral. Step-by-step instructions on what to do immediately after a loss to prevent emotional contagion.
                </p>
              </div>
              <ul className="space-y-2 border-t border-mkt-bd/50 pt-4">
                <li className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-mkt-i3">
                  <CheckCircle2 className="w-3.5 h-3.5 text-mkt-grn" /> Hard-Stop Rules
                </li>
                <li className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-mkt-i3">
                  <CheckCircle2 className="w-3.5 h-3.5 text-mkt-grn" /> Recovery Math
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Checkout Section */}
      <section className="py-24 border-t border-mkt-bd relative bg-[#F7F7F7]">
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10 space-y-8">
          <h2 className="text-4xl md:text-6xl font-sans font-black uppercase tracking-tight leading-none text-mkt-ink">
            Secure Your Edge.
          </h2>
          
          <div className="bg-white border border-mkt-bd p-8 text-left shadow-[0_8px_30px_rgba(0,0,0,0.02)] rounded-xl">
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-mkt-bd/50">
              <div>
                <h4 className="text-lg font-bold uppercase text-mkt-ink">Prop Challenge Survival Kit</h4>
                <p className="text-xs text-mkt-i3">Digital PDF & Google Sheets Templates</p>
              </div>
              <div className="text-2xl font-sans font-black text-mkt-ink">£14</div>
            </div>

            {/* Bump Offer */}
            <label className="bg-[#F7F7F7] border border-mkt-bd p-6 flex gap-4 items-start cursor-pointer hover:bg-mkt-bd/20 transition-all duration-300 rounded-lg">
              <input
                type="checkbox"
                checked={includeBump}
                onChange={(e) => setIncludeBump(e.target.checked)}
                className="mt-1 w-5 h-5 accent-mkt-grn cursor-pointer"
              />
              <div>
                <p className="text-sm font-bold uppercase text-mkt-grn flex items-center gap-2">
                  <Zap className="w-4 h-4 fill-mkt-grn" /> Add 30 Days of Drawdown Edge
                </p>
                <p className="text-xs text-mkt-i2 mt-1 leading-relaxed">
                  Yes! Give me 30 days full access to the AI Trade Journal and Market Scanner to execute my challenge flawlessly. (Normally £29/mo, add today for just £19).
                </p>
              </div>
            </label>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full py-5 bg-mkt-ink text-white font-sans font-black uppercase tracking-[0.2em] text-lg hover:bg-mkt-i2 transition-premium disabled:opacity-60 cursor-pointer shadow-xl rounded-lg"
          >
            {loading ? "Redirecting to Checkout..." : `Complete Purchase — £${includeBump ? '33' : '14'}`}
          </button>
          
          <p className="text-xs text-mkt-i3 leading-relaxed max-w-lg mx-auto">
            <strong className="text-mkt-ink">100% No-BS 14-Day Guarantee.</strong> If you apply these frameworks and still feel unprepared for your challenge, email us. We will refund your £14 immediately. No questions asked.
          </p>
        </div>
      </section>

    </div>
  );
}
