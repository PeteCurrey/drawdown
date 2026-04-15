import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

const DISCORD_API_BASE = "https://discord.com/api/v10";
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const GUILD_ID = process.env.DISCORD_GUILD_ID;

const TIER_ROLES: Record<string, string> = {
  "foundation": process.env.DISCORD_ROLE_FOUNDATION || "",
  "edge": process.env.DISCORD_ROLE_EDGE || "",
  "floor": process.env.DISCORD_ROLE_FLOOR || "",
};

export async function POST(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return [] },
        setAll() {},
      },
    }
  );

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const discordId = user.user_metadata?.discord_id;
    if (!discordId) {
      return NextResponse.json({ error: "Discord not linked" }, { status: 400 });
    }

    // 1. Get user's tier from Stripe/Supabase
    const { data: profile } = await supabase
      .from('profiles')
      .select('tier')
      .eq('id', user.id)
      .single();

    const tier = profile?.tier || "free";
    const roleId = TIER_ROLES[tier.toLowerCase()];

    if (!roleId || !BOT_TOKEN || !GUILD_ID) {
      return NextResponse.json({ 
        message: "Sync logic prepared. Awaiting Discord credentials.", 
        tier 
      });
    }

    // 2. Add role via Discord API
    const res = await fetch(`${DISCORD_API_BASE}/guilds/${GUILD_ID}/members/${discordId}/roles/${roleId}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bot ${BOT_TOKEN}`,
        "Content-Type": "application/json",
      }
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Discord API failure");
    }

    return NextResponse.json({ success: true, tier });

  } catch (error: any) {
    console.error("Discord Sync Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
