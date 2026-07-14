import { AuthForm } from "@/components/auth/AuthForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Your Password | Drawdown",
  description: "Recover your Drawdown account password to resume access to your trading dashboard and metrics.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-6">
      <AuthForm mode="forgot-password" />
    </div>
  );
}
