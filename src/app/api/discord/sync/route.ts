import { NextResponse } from "next/server";

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID;

const TIER_ROLE_MAP: Record<string, string> = {
  foundation: process.env.DISCORD_ROLE_FOUNDATION || "",
  edge: process.env.DISCORD_ROLE_EDGE || "",
  floor: process.env.DISCORD_ROLE_FLOOR || "",
};

/**
 * POST /api/discord/sync
 * Syncs a user's subscription tier to Discord roles.
 * Called by Stripe webhook handler after subscription changes.
 */
export async function POST(req: Request) {
  try {
    const { discordUserId, tier, action } = await req.json();

    if (!discordUserId || !tier) {
      return NextResponse.json(
        { error: "discordUserId and tier are required." },
        { status: 400 }
      );
    }

    if (!DISCORD_BOT_TOKEN || !DISCORD_GUILD_ID) {
      console.warn("[Discord] Bot token or Guild ID not configured.");
      return NextResponse.json(
        { error: "Discord integration not configured." },
        { status: 503 }
      );
    }

    const roleId = TIER_ROLE_MAP[tier];
    if (!roleId) {
      return NextResponse.json(
        { error: `No Discord role mapped for tier: ${tier}` },
        { status: 400 }
      );
    }

    const endpoint = `https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/members/${discordUserId}/roles/${roleId}`;

    const method = action === "remove" ? "DELETE" : "PUT";

    const response = await fetch(endpoint, {
      method,
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Discord] Role sync failed: ${response.status}`, errorText);
      return NextResponse.json(
        { error: "Failed to sync Discord role.", details: errorText },
        { status: response.status }
      );
    }

    // If upgrading, remove old tier roles
    if (action !== "remove") {
      const otherRoles = Object.entries(TIER_ROLE_MAP)
        .filter(([key]) => key !== tier && TIER_ROLE_MAP[key])
        .map(([, id]) => id);

      await Promise.allSettled(
        otherRoles.map((oldRoleId) =>
          fetch(
            `https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/members/${discordUserId}/roles/${oldRoleId}`,
            {
              method: "DELETE",
              headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` },
            }
          )
        )
      );
    }

    return NextResponse.json({
      success: true,
      message: `${action === "remove" ? "Removed" : "Applied"} ${tier} role for user ${discordUserId}`,
    });
  } catch (error) {
    console.error("[Discord] Sync error:", error);
    return NextResponse.json(
      { error: "Internal server error during Discord sync." },
      { status: 500 }
    );
  }
}
