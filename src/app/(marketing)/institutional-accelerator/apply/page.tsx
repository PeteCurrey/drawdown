"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Shield, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle, 
  Mail, 
  User, 
  TrendingUp, 
  Coins, 
  Award, 
  Briefcase,
  ChevronRight,
  Sparkles,
  Loader2
} from "lucide-react";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { submitAcceleratorApplicationAction } from "@/app/actions/accelerator-actions";

export default function InstitutionalAcceleratorApply() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    warning?: string;
    error?: string;
  } | null>(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [tradingCapital, setTradingCapital] = useState("");
  const [motivation, setMotivation] = useState("");

  const handleNextStep = () => {
    if (step === 1 && (!fullName.trim() || !email.trim() || !email.includes("@"))) return;
    if (step === 2 && !experienceLevel) return;
    if (step === 3 && !tradingCapital) return;
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !experienceLevel || !tradingCapital || !motivation.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await submitAcceleratorApplicationAction({
        fullName,
        email,
        experienceLevel,
        tradingCapital,
        motivation
      });

      if (res.success) {
        setSubmitResult({
          success: true,
          warning: res.warning
        });
        setStep(5); // Success step
      } else {
        setSubmitResult({
          success: false,
          error: res.error || "Submission failed. Please try again."
        });
      }
    } catch (err: any) {
      setSubmitResult({
        success: false,
        error: err.message || "An unexpected error occurred during submission."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Character limit calculation
  const charLimit = 500;
  const charsLeft = charLimit - motivation.length;

  return (
    <div className="min-h-screen bg-[#0B0E12] text-[#F3F4F6] font-display antialiased selection:bg-[#E2B755] selection:text-[#0B0E12] py-20 flex flex-col justify-center relative overflow-hidden">
      <TrackPageView path="/institutional-accelerator/apply" />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Decorative gold background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[350px] rounded-full bg-[#E2B755]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] rounded-full bg-orange-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-xl mx-auto px-6 w-full relative z-10">
        
        {/* Upper Brand Info */}
        <div className="text-center mb-8">
          <Link href="/institutional-accelerator" className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#E2B755] uppercase hover:underline mb-3">
            <ArrowLeft className="w-3 h-3" /> Back to Curriculum Details
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
            Institutional Accelerator<span className="text-[#E2B755]">.</span>
          </h1>
          <p className="text-sm font-mono text-gray-400">Cohort Candidate Application Dossier</p>
        </div>

        {/* Form Container Card with Premium Glassmorphism */}
        <div className="bg-[#11161d]/85 backdrop-blur-xl border border-[#333330]/60 rounded-xl p-8 shadow-2xl relative">
          
          {/* Top Progress bar */}
          {step <= 4 && (
            <div className="mb-8">
              <div className="flex justify-between items-center text-xs font-mono text-gray-400 mb-2">
                <span>SECTION 0{step} OF 04</span>
                <span className="text-[#E2B755] font-semibold">{step * 25}% COMPLETE</span>
              </div>
              <div className="h-[2px] w-full bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#E2B755] to-orange-500 transition-all duration-500 ease-out"
                  style={{ width: `${step * 25}%` }}
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-[#E2B755]" /> Candidate Identity
                </h2>
                <p className="text-xs text-gray-400 mb-4">Please provide your legal contact details to initiate your application dossier.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-2">Full Name</label>
                  <div className="relative">
                    <input 
                      id="fullName"
                      type="text"
                      placeholder="e.g. Alexander Sterling"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#0B0E12] border border-[#333330] rounded px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#E2B755] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-2">Primary Email Address</label>
                  <div className="relative">
                    <input 
                      id="email"
                      type="email"
                      placeholder="e.g. alex@sterlingcapital.co.uk"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#0B0E12] border border-[#333330] rounded px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#E2B755] transition-all"
                    />
                  </div>
                </div>
              </div>

              <button 
                type="button"
                onClick={handleNextStep}
                disabled={!fullName.trim() || !email.trim() || !email.includes("@")}
                className="w-full mt-6 bg-[#E2B755] hover:bg-[#E2B755]/90 disabled:bg-gray-800 disabled:text-gray-500 text-[#0B0E12] text-xs font-mono tracking-widest uppercase py-4 rounded font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#E2B755]/10"
              >
                Proceed to Experience <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-[#E2B755]" /> Practical Experience
                </h2>
                <p className="text-xs text-gray-400 mb-4">Select your current trading proficiency. We accommodate serious traders across all tiers.</p>
              </div>

              <div className="space-y-3">
                {[
                  { value: "Beginner", label: "Beginner / Emerging Practitioner", desc: "Solid conceptual grasp but limited practical experience in live markets." },
                  { value: "Intermediate", label: "Intermediate Consistent Trader", desc: "Experience executing live trades or managing small prop accounts under risk parameters." },
                  { value: "Advanced / Funded", label: "Advanced / Funded Portfolio Manager", desc: "Currently managing funded accounts or institutional scale portfolio allocations." }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setExperienceLevel(option.value)}
                    className={`w-full text-left bg-[#0B0E12] hover:bg-[#11161d] border rounded p-4 transition-all duration-300 relative group flex flex-col cursor-pointer ${
                      experienceLevel === option.value ? "border-[#E2B755] ring-1 ring-[#E2B755]/50 bg-[#11161d]" : "border-[#333330]"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-semibold text-white group-hover:text-[#E2B755] transition-colors">{option.label}</span>
                      <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${experienceLevel === option.value ? "border-[#E2B755] bg-[#E2B755]" : "border-gray-600"}`}>
                        {experienceLevel === option.value && <div className="w-1 h-1 bg-[#0B0E12] rounded-full" />}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 font-normal leading-relaxed">{option.desc}</span>
                  </button>
                ))}
              </div>

              <div className="flex gap-4 mt-6">
                <button 
                  type="button"
                  onClick={handlePrevStep}
                  className="w-1/3 border border-gray-800 hover:border-gray-600 text-gray-300 text-xs font-mono tracking-widest uppercase py-4 rounded font-bold transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-3 h-3" /> Back
                </button>
                <button 
                  type="button"
                  onClick={handleNextStep}
                  disabled={!experienceLevel}
                  className="w-2/3 bg-[#E2B755] hover:bg-[#E2B755]/90 disabled:bg-gray-800 disabled:text-gray-500 text-[#0B0E12] text-xs font-mono tracking-widest uppercase py-4 rounded font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Continue <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                  <Coins className="w-4 h-4 text-[#E2B755]" /> Projected Capital Scale
                </h2>
                <p className="text-xs text-gray-400 mb-4">What target capital scale are you looking to allocate or leverage over the next 12 months?</p>
              </div>

              <div className="space-y-3">
                {[
                  { value: "< £10,000", label: "Emerging Scale (< £10k)", desc: "Trading personal seed accounts or starting prop challenges." },
                  { value: "£10,000 - £100,000", label: "Professional Scale (£10k - £100k)", desc: "Deploying intermediate capital size across multiple platforms and funded challenges." },
                  { value: "£100,000+", label: "Institutional Scale (£100k+)", desc: "Scaling larger allocations, running automated webhook loops or managing private portfolios." }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTradingCapital(option.value)}
                    className={`w-full text-left bg-[#0B0E12] hover:bg-[#11161d] border rounded p-4 transition-all duration-300 relative group flex flex-col cursor-pointer ${
                      tradingCapital === option.value ? "border-[#E2B755] ring-1 ring-[#E2B755]/50 bg-[#11161d]" : "border-[#333330]"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-semibold text-white group-hover:text-[#E2B755] transition-colors">{option.label}</span>
                      <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${tradingCapital === option.value ? "border-[#E2B755] bg-[#E2B755]" : "border-gray-600"}`}>
                        {tradingCapital === option.value && <div className="w-1 h-1 bg-[#0B0E12] rounded-full" />}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 font-normal leading-relaxed">{option.desc}</span>
                  </button>
                ))}
              </div>

              <div className="flex gap-4 mt-6">
                <button 
                  type="button"
                  onClick={handlePrevStep}
                  className="w-1/3 border border-gray-800 hover:border-gray-600 text-gray-300 text-xs font-mono tracking-widest uppercase py-4 rounded font-bold transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-3 h-3" /> Back
                </button>
                <button 
                  type="button"
                  onClick={handleNextStep}
                  disabled={!tradingCapital}
                  className="w-2/3 bg-[#E2B755] hover:bg-[#E2B755]/90 disabled:bg-gray-800 disabled:text-gray-500 text-[#0B0E12] text-xs font-mono tracking-widest uppercase py-4 rounded font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Continue <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                  <Award className="w-4 h-4 text-[#E2B755]" /> Motivation & Objectives
                </h2>
                <p className="text-xs text-gray-400 mb-4">The Accelerator cohort is capped strictly at 15 spots. Detail what you seek to achieve and why we should approve your dossier.</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="motivation" className="block text-xs font-mono text-gray-300 uppercase tracking-wider">Candidate Motivation</label>
                  <span className={`text-[10px] font-mono ${charsLeft < 50 ? "text-red-400 font-bold" : "text-gray-400"}`}>
                    {charsLeft} CHARACTERS LEFT
                  </span>
                </div>
                <textarea 
                  id="motivation"
                  rows={5}
                  maxLength={charLimit}
                  placeholder="Detail your professional trading objectives, prop capital targets, and structural expectations..."
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  className="w-full bg-[#0B0E12] border border-[#333330] rounded p-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#E2B755] transition-all resize-none leading-relaxed"
                />
              </div>

              {submitResult?.error && (
                <div className="bg-red-950/40 border border-red-900 text-red-300 text-xs px-4 py-3 rounded leading-relaxed">
                  {submitResult.error}
                </div>
              )}

              <div className="flex gap-4 mt-6">
                <button 
                  type="button"
                  onClick={handlePrevStep}
                  disabled={isSubmitting}
                  className="w-1/3 border border-gray-800 hover:border-gray-600 disabled:border-gray-900 disabled:text-gray-600 text-gray-300 text-xs font-mono tracking-widest uppercase py-4 rounded font-bold transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-3 h-3" /> Back
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting || !motivation.trim()}
                  className="w-2/3 bg-[#E2B755] hover:bg-[#E2B755]/90 disabled:bg-gray-800 disabled:text-gray-500 text-[#0B0E12] text-xs font-mono tracking-widest uppercase py-4 rounded font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#E2B755]/10"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing Dossier...
                    </>
                  ) : (
                    <>
                      Submit Application <Sparkles className="w-3 h-3 text-[#0B0E12]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 5 && (
            <div className="text-center py-6 space-y-6 animate-fadeIn">
              
              {/* Premium Gold Gilded Success Banner */}
              <div className="w-16 h-16 bg-[#E2B755]/10 border border-[#E2B755]/30 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Sparkles className="w-8 h-8 text-[#E2B755] animate-pulse" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-white">Application Dispatched</h2>
                <p className="text-xs font-mono text-[#E2B755] uppercase tracking-wider">Candidate Dossier successfully archived</p>
              </div>

              {submitResult?.warning && (
                <div className="bg-amber-950/20 border border-amber-900/50 text-amber-300 text-xs px-4 py-3 rounded max-w-sm mx-auto leading-relaxed text-left font-mono">
                  ⚠️ {submitResult.warning}
                </div>
              )}

              <div className="max-w-md mx-auto text-sm text-gray-400 space-y-3 leading-relaxed">
                <p>
                  Welcome to the queue, <span className="text-white font-semibold">{fullName}</span>. 
                  Your submission has been catalogued in our master Supabase instance.
                </p>
                <p className="text-xs">
                  We have dispatched a rich HTML onboarding syllabus & learning documentation packet directly to 
                  <span className="text-white ml-1 font-mono">{email.toLowerCase().trim()}</span> via Resend.
                </p>
                <p className="text-xs">
                  Your email has also been authorized & appended to our standard active subscriber distribution list. 
                  Our admissions board manually audits candidate profiles every 24 hours.
                </p>
              </div>

              <div className="border-t border-[#333330]/50 pt-6 mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link 
                  href="/dashboard" 
                  className="bg-[#0B0E12] hover:bg-[#11161d] border border-[#333330] text-gray-200 text-xs font-mono tracking-widest uppercase px-6 py-4 rounded font-bold transition-all text-center"
                >
                  Access Client Dashboard
                </Link>
                <Link 
                  href="/institutional-accelerator" 
                  className="bg-[#E2B755] hover:bg-[#E2B755]/90 text-[#0B0E12] text-xs font-mono tracking-widest uppercase px-6 py-4 rounded font-bold transition-all text-center shadow-lg shadow-[#E2B755]/10"
                >
                  Return to Accelerator Page
                </Link>
              </div>
            </div>
          )}

        </div>

        {/* Footer Guarantee details */}
        <div className="mt-8 flex items-center justify-center gap-2 text-gray-500 text-xs font-mono text-center">
          <Shield className="w-3.5 h-3.5 text-gray-600" />
          <span>AES-256 client encryption & bull; SSL Secure submission funnel</span>
        </div>
      </div>
    </div>
  );
}
