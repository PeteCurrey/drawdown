"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { AlgoStrategyBuilder } from "@/components/dashboard/AlgoStrategyBuilder";
import { Loader2 } from "lucide-react";

export default function AlgoBuilderPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function fetchUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profile } = await (supabase as any)
          .from('profiles')
          .select('subscription_tier')
          .eq('id', user.id)
          .single();
        setProfile(profile);
      }
      setLoading(false);
    }
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center text-text-tertiary uppercase tracking-widest font-mono text-sm">
        Unauthorized Access
      </div>
    );
  }

  return (
    <AlgoStrategyBuilder 
      userId={user.id} 
      userTier={profile?.subscription_tier || 'free'} 
    />
  );
}
