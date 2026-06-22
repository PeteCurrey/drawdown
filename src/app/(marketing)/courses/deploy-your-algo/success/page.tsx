import { redirect } from "next/navigation";
import Link from "next/link";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { ArrowRight, CheckCircle2, LogIn } from "lucide-react";

const COURSE_SLUG = "deploy-your-algo";

async function getStripeSession(sessionId: string) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2023-10-16" as any });
    return await stripe.checkout.sessions.retrieve(sessionId);
  } catch { return null; }
}

interface PageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function SuccessPage({ searchParams }: PageProps) {
  const { session_id } = await searchParams;

  if (!session_id) redirect(`/courses/${COURSE_SLUG}`);

  const stripeSession = await getStripeSession(session_id);
  if (!stripeSession || stripeSession.payment_status !== "paid") {
    redirect(`/courses/${COURSE_SLUG}?purchase=failed`);
  }

  const customerEmail = stripeSession.customer_details?.email ?? "";

  // Check if user is logged in
  const supabase  = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6">
      <div className="max-w-lg w-full space-y-8 text-center">

        {/* Success icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full border-2 border-[#C8F135] bg-[#C8F135]/10 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-[#C8F135]" />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-mono text-[#C8F135] uppercase tracking-widest">Payment Confirmed</p>
          <h1 className="font-display text-3xl md:text-4xl font-black uppercase text-white leading-tight">
            You're In.
          </h1>
          <p className="text-white/60 leading-relaxed">
            Deploy Your Algo is ready for you. Start with Module 1 — it only takes 15 minutes.
          </p>
        </div>

        {isLoggedIn ? (
          /* ── Logged-in: go straight to the course ── */
          <div className="space-y-4">
            <Link
              href={`/dashboard/courses/${COURSE_SLUG}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#C8F135] text-black font-bold rounded-xl hover:bg-[#b8e020] transition-all text-sm w-full justify-center"
            >
              Start Module 1 <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-[11px] font-mono text-white/30">
              Access is instant — your account has been updated.
            </p>
          </div>
        ) : (
          /* ── Guest checkout: prompt to create account ── */
          <div className="space-y-6">
            <div className="p-6 bg-white/3 border border-white/10 rounded-xl space-y-4 text-left">
              <p className="text-sm font-bold text-white">Create your Drawdown account to access your course</p>
              <p className="text-sm text-white/50 leading-relaxed">
                Your purchase is confirmed. Create a free account with the same email
                you used at checkout and your course access will be linked automatically.
              </p>
              <div className="space-y-2">
                <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Your email</p>
                <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg font-mono text-sm text-white/60">
                  {customerEmail || "Use the email from your Stripe receipt"}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href={`/signup?email=${encodeURIComponent(customerEmail)}&course=${COURSE_SLUG}`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#C8F135] text-black font-bold rounded-xl hover:bg-[#b8e020] transition-all text-sm w-full justify-center"
              >
                Create Account & Access Course <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={`/login?email=${encodeURIComponent(customerEmail)}&next=/dashboard/courses/${COURSE_SLUG}`}
                className="inline-flex items-center gap-2 px-8 py-3 border border-white/20 text-white/60 font-bold rounded-xl hover:border-white/40 hover:text-white transition-all text-sm w-full justify-center"
              >
                <LogIn className="w-4 h-4" /> I already have an account — Log in
              </Link>
            </div>

            <p className="text-[11px] font-mono text-white/20 leading-relaxed">
              Stripe session ID: {session_id.slice(0, 20)}…
              <br />
              Keep this if you need to contact support.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
