import { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: 'Start Free | Join Drawdown Trading',
  description: 'Create your free Drawdown account. Access Phase 1 of the curriculum and two AI trading tools — no card required.',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://drawdown.trading/signup' }
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-6">
      <AuthForm mode="signup" />
    </div>
  );
}
