import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ChevronLeft, Share2, Download, Award } from "lucide-react";
import { phases } from "@/data/courses";

export default async function CertificatePage({ params }: { params: { phase: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }

  const phaseConfig = phases.find(p => p.slug === params.phase);
  if (!phaseConfig) redirect("/dashboard/curriculum");

  const { data: certificate } = await supabase
    .from("certificates")
    .select("*")
    .eq("user_id", user.id)
    .eq("phase_slug", params.phase)
    .single();

  if (!certificate) {
    redirect(`/dashboard/curriculum/${params.phase}`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name")
    .eq("id", user.id)
    .single();

  const fullName = profile?.first_name 
    ? `${profile.first_name} ${profile.last_name || ""}`.trim()
    : "Drawdown Trader";

  const dateStr = new Date(certificate.issued_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return (
    <div className="max-w-5xl mx-auto pb-24 animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-8">
        <Link href="/dashboard/curriculum" className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-text-secondary hover:text-white transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Curriculum
        </Link>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-widest rounded border border-[#333] hover:border-[#555] transition-colors">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-accent text-black text-xs font-bold uppercase tracking-widest rounded hover:bg-[#b5e02b] transition-colors">
            <Download className="w-4 h-4" /> PDF
          </button>
        </div>
      </div>

      <div className="bg-[#050505] p-12 md:p-20 border border-[#222] rounded-xl relative overflow-hidden shadow-2xl">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full border-[10px] border-[#111] pointer-events-none" />
        <div className="absolute top-4 left-4 w-[calc(100%-32px)] h-[calc(100%-32px)] border border-[#333] pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#F9771D]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <Award className="w-16 h-16 text-accent mb-6" />
          
          <h4 className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-text-tertiary mb-6">
            Drawdown Trading Academy
          </h4>
          
          <h1 className="text-5xl md:text-7xl font-bold font-syne text-white mb-10 tracking-tight">
            Certificate of Completion
          </h1>
          
          <p className="text-lg text-text-secondary font-mono mb-8">
            This certifies that
          </p>
          
          <div className="text-4xl md:text-5xl font-syne font-bold text-accent mb-8 border-b border-[#333] pb-4 px-12 inline-block">
            {fullName}
          </div>
          
          <p className="text-lg text-text-secondary font-mono max-w-2xl leading-relaxed mb-16">
            has successfully completed the{" "}
            <strong className="text-white">Phase {phaseConfig!.number}: {phaseConfig!.name}</strong>{" "}
            intensive programme, demonstrating a profound understanding of institutional trading mechanics, risk management, and market strategy.
          </p>
          
          <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-8 items-end border-t border-[#222] pt-12">
            <div className="text-left">
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-text-tertiary mb-2">Issued On</div>
              <div className="text-lg text-white">{dateStr}</div>
            </div>
            
            <div className="text-center hidden md:block">
              <div className="font-['Brush_Script_MT',cursive] text-4xl text-white/80 -rotate-3 mb-2">
                P. Currey
              </div>
              <div className="w-32 h-[1px] bg-[#333] mx-auto mb-2" />
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-tertiary">Head of Trading</div>
            </div>
            
            <div className="text-right">
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-text-tertiary mb-2">Credential ID</div>
              <div className="text-sm font-mono text-white">{certificate.certificate_number}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
