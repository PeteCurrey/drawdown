import { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: 'Sign In | Drawdown',
  description: 'Sign in to your Drawdown account to access your dashboard, courses and AI trading tools.',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://drawdown.trading/login' }
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-6">
      <AuthForm mode="login" />
    </div>
  );
}
