const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID;

// Discord Role IDs (Placeholders - should be updated in production)
const ROLES = {
  foundation: "123456789012345678",
  edge: "234567890123456789",
  floor: "345678901234567890",
  partner: "456789012345678901"
};

export async function syncDiscordRole(discordId: string, tier: string, isPartner: boolean) {
  if (!DISCORD_BOT_TOKEN || !DISCORD_GUILD_ID || !discordId) return false;

  try {
    const roleId = ROLES[tier as keyof typeof ROLES] || (isPartner ? ROLES.partner : null);
    if (!roleId) return false;

    // 1. Add Role to Member
    const response = await fetch(
      `https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/members/${discordId}/roles/${roleId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.ok;
  } catch (error) {
    console.error("Discord Sync Error:", error);
    return false;
  }
}

export async function removeDiscordRole(discordId: string, roleId: string) {
  if (!DISCORD_BOT_TOKEN || !DISCORD_GUILD_ID || !discordId) return false;

  try {
    const response = await fetch(
      `https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/members/${discordId}/roles/${roleId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bot ${DISCORD_BOT_TOKEN}`
        }
      }
    );

    return response.ok;
  } catch (error) {
    console.error("Discord Role Removal Error:", error);
    return false;
  }
}

/**
 * Synchronize discipline badge roles for a member.
 * If badgeTier is null, removes all discipline badge roles.
 * Otherwise, assigns the role matching the tier and removes any others.
 */
export async function syncDisciplineBadgeRole(
  discordId: string,
  badgeTier: "bronze" | "silver" | "gold" | null
): Promise<boolean> {
  if (!DISCORD_BOT_TOKEN || !DISCORD_GUILD_ID || !discordId) return false;

  const bronzeRole = process.env.DISCORD_ROLE_DISCIPLINE_BRONZE || process.env.DISCORD_ROLE_DISCIPLINE || "";
  const silverRole = process.env.DISCORD_ROLE_DISCIPLINE_SILVER || process.env.DISCORD_ROLE_DISCIPLINE || "";
  const goldRole   = process.env.DISCORD_ROLE_DISCIPLINE_GOLD   || process.env.DISCORD_ROLE_DISCIPLINE || "";

  const roleMap = {
    bronze: bronzeRole,
    silver: silverRole,
    gold:   goldRole,
  };

  const allDisciplineRoles = Array.from(
    new Set([bronzeRole, silverRole, goldRole])
  ).filter(Boolean);

  const activeRole = badgeTier ? roleMap[badgeTier] : "";

  try {
    // 1. Remove non-matching discipline roles first
    for (const roleId of allDisciplineRoles) {
      if (roleId !== activeRole) {
        await removeDiscordRole(discordId, roleId);
      }
    }

    // 2. Add the correct discipline role if active
    if (activeRole) {
      const response = await fetch(
        `https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/members/${discordId}/roles/${activeRole}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
            "Content-Type": "application/json"
          }
        }
      );
      return response.ok;
    }

    return true;
  } catch (error) {
    console.error("Discord Discipline Role Sync Error:", error);
    return false;
  }
}
