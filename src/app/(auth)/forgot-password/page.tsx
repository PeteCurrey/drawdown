import { AuthForm } from "@/components/auth/AuthForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Your Password | Drawdown",
  description: "Recover your Drawdown trading account password safely. Verify your registered email address to instantly receive a secure password reset link.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-6">
      <AuthForm mode="forgot-password" />
    </div>
  );
}
