"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Mail, ArrowRight, Eye, EyeOff } from "lucide-react";

interface AuthFormProps {
  mode: "login" | "signup" | "forgot-password";
}

export function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!supabaseUrl || supabaseUrl.includes("placeholder")) {
        throw new Error("Supabase is not configured. Please update your .env with valid credentials.");
      }

      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) throw error;
        setMessage("Check your email for the confirmation link.");
      } else if (mode === "forgot-password") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/profile`,
        });
        if (error) throw error;
        setMessage("Password reset link sent! Please check your email.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      setError(err.message.includes("fetch")
        ? "Network error: Failed to reach auth server. Check your Supabase URL in .env."
        : err.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branded */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-16"
        style={{ background: "#0A0A0A" }}
      >
        {/* Background image — faint trading floor */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.08]"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200&auto=format&fit=crop)",
          }}
        />
        {/* Green gradient accent bottom-left */}
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: "#16A34A" }} />

        {/* Content */}
        <div className="relative z-10">
          <Link href="/" className="text-2xl font-sans font-extrabold tracking-[-0.04em] text-white">
            Drawdown<span style={{ color: "#16A34A" }}>.</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6">
          <blockquote className="text-2xl font-sans font-bold text-white leading-snug tracking-tight">
            "The market rewards discipline and punishes emotion. Learn which one you are."
          </blockquote>
          <p className="text-sm font-sans" style={{ color: "#666666" }}>
            Pete Currey, Founder — Drawdown Trading
          </p>

          <div className="grid grid-cols-3 gap-4 pt-8 border-t" style={{ borderColor: "#1A1A1A" }}>
            {[
              { value: "60+", label: "Modules" },
              { value: "6", label: "Phases" },
              { value: "24/7", label: "AI Tools" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-sans font-extrabold text-white tracking-tight">{stat.value}</div>
                <div className="text-[10px] font-sans uppercase tracking-widest" style={{ color: "#666666" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-20 bg-white">
        <div className="w-full max-w-sm space-y-8">

          {/* Mobile logo */}
          <div className="lg:hidden mb-4">
            <Link href="/" className="text-xl font-sans font-extrabold tracking-[-0.04em] text-mkt-ink">
              Drawdown<span className="text-mkt-grn">.</span>
            </Link>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-3xl font-sans font-extrabold tracking-tight text-mkt-ink">
              {mode === "login"
                ? "Welcome back"
                : mode === "forgot-password"
                ? "Reset your password"
                : "Create your account"}
            </h1>
            <p className="text-sm text-mkt-i3 font-sans">
              {mode === "login"
                ? "Sign in to access your dashboard and tools."
                : mode === "forgot-password"
                ? "Enter your email and we'll send you a password recovery link."
                : "Start with Phase 1 — completely free. No card required."}
            </p>
          </div>

          {/* OAuth & Divider (conditionally hidden for reset) */}
          {mode !== "forgot-password" && (
            <>
              {/* OAuth Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleOAuth("google")}
                  className="flex items-center justify-center gap-2 py-2.5 bg-white border border-mkt-bd rounded-lg text-[11px] font-sans font-semibold text-mkt-ink hover:bg-[#F7F7F7] transition-colors duration-150"
                >
                  <Mail className="w-3.5 h-3.5" /> Google
                </button>
                <button
                  onClick={() => handleOAuth("github")}
                  className="flex items-center justify-center gap-2 py-2.5 bg-white border border-mkt-bd rounded-lg text-[11px] font-sans font-semibold text-mkt-ink hover:bg-[#F7F7F7] transition-colors duration-150"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  GitHub
                </button>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-mkt-bd" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-[10px] font-sans text-mkt-i4 uppercase tracking-widest">
                    or with email
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-sans font-semibold text-mkt-i2 uppercase tracking-wider block">
                Email
              </label>
              <input
                type="email"
                required
                placeholder="trader@drawdown.trading"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F7F7F7] border border-mkt-bd focus:border-mkt-bds rounded-lg px-4 py-3 text-sm text-mkt-ink font-sans outline-none transition-colors placeholder:text-mkt-i4"
              />
            </div>

            {mode !== "forgot-password" && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-sans font-semibold text-mkt-i2 uppercase tracking-wider block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#F7F7F7] border border-mkt-bd focus:border-mkt-bds rounded-lg px-4 py-3 pr-10 text-sm text-mkt-ink font-sans outline-none transition-colors placeholder:text-mkt-i4"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-mkt-i4 hover:text-mkt-i3 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {mode === "login" && (
              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-[11px] font-sans text-mkt-i3 hover:text-mkt-ink transition-colors">
                  Forgot password?
                </Link>
              </div>
            )}

            {error && (
              <p className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-sans rounded-lg">
                {error}
              </p>
            )}

            {message && (
              <p className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs font-sans rounded-lg">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg font-sans font-semibold text-sm text-white flex items-center justify-center gap-2 transition-colors duration-150 disabled:opacity-60"
              style={{ backgroundColor: "#0A0A0A" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#3A3A3A")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0A0A0A")}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {mode === "login"
                    ? "Sign in"
                    : mode === "forgot-password"
                    ? "Send recovery link"
                    : "Create account"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch mode link */}
          <p className="text-center text-xs text-mkt-i3 font-sans pt-2">
            {mode === "forgot-password" ? (
              <>
                Remembered your password?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-mkt-ink hover:underline underline-offset-2"
                >
                  Log in
                </Link>
              </>
            ) : (
              <>
                {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                <Link
                  href={mode === "login" ? "/signup" : "/login"}
                  className="font-semibold text-mkt-ink hover:underline underline-offset-2"
                >
                  {mode === "login" ? "Sign up free" : "Log in"}
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
