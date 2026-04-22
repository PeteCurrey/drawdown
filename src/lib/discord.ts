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
