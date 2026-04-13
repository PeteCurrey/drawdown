"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Loader2, Mail, Globe } from "lucide-react";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setMessage("Check your email for the confirmation link.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-8 p-8 md:p-12 bg-background-surface border border-border-slate shadow-2xl">
      <div className="text-center">
        <h1 className="text-3xl font-display font-bold uppercase mb-2">
          {mode === "login" ? "Welcome Back" : "Start Your Journey"}
        </h1>
        <p className="text-text-secondary text-sm font-mono tracking-widest uppercase mb-8">
          {mode === "login" ? "// Login to access your edge" : "// Trade the truth"}
        </p>
      </div>

      <form onSubmit={handleAuth} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Email Address</label>
          <input 
            type="email" 
            required 
            placeholder="trader@drawdown.trade"
            className="w-full bg-background-primary border border-border-slate px-4 py-3 text-sm focus:border-accent outline-none transition-colors"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Password</label>
          <input 
            type="password" 
            required 
            placeholder="••••••••"
            className="w-full bg-background-primary border border-border-slate px-4 py-3 text-sm focus:border-accent outline-none transition-colors"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p className="p-3 bg-loss/10 border border-loss/20 text-loss text-xs font-mono">
            {error}
          </p>
        )}

        {message && (
          <p className="p-3 bg-profit/10 border border-profit/20 text-profit text-xs font-mono">
            {message}
          </p>
        )}

        <button 
          disabled={isLoading}
          className="w-full py-4 bg-accent hover:bg-accent-hover text-background-primary font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === "login" ? "Login" : "Create Account"}
        </button>
      </form>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border-slate"></div></div>
        <div className="relative flex justify-center text-[10px] font-mono uppercase tracking-widest"><span className="bg-background-surface px-4 text-text-tertiary">Or continue with</span></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => handleOAuth('google')}
          className="flex items-center justify-center gap-2 py-3 bg-background-elevated border border-border-slate hover:border-text-primary transition-colors text-[10px] font-bold uppercase tracking-widest"
        >
          <Mail className="w-3 h-3" /> Google
        </button>
        <button 
          onClick={() => handleOAuth('github')}
          className="flex items-center justify-center gap-2 py-3 bg-background-elevated border border-border-slate hover:border-text-primary transition-colors text-[10px] font-bold uppercase tracking-widest"
        >
          <Globe className="w-3 h-3" /> GitHub
        </button>
      </div>

      <p className="text-center text-xs text-text-tertiary pt-4">
        {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
        <Link href={mode === "login" ? "/signup" : "/login"} className="text-accent hover:underline">
          {mode === "login" ? "Sign up" : "Log in"}
        </Link>
      </p>
    </div>
  );
}
