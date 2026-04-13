import { AuthForm } from "@/components/auth/AuthForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-6">
      <AuthForm mode="signup" />
    </div>
  );
}
