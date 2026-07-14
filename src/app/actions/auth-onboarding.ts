"use server";

export async function handleSignupOnboarding({
  email,
  userId,
  firstName = "Trader"
}: {
  email: string;
  userId: string;
  firstName?: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || `https://${process.env.VERCEL_URL}` || "http://localhost:3000";
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.warn("CRON_SECRET is missing. Onboarding welcome email cannot be secure-triggered.");
    return { success: false, error: "CRON_SECRET missing" };
  }

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${cronSecret}`
    };
    const bypassToken = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
    const url = bypassToken
      ? `${siteUrl}/api/email/welcome?x-vercel-protection-bypass=${bypassToken}&x-vercel-set-bypass-cookie=true`
      : `${siteUrl}/api/email/welcome`;

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ email, userId, firstName }),
      cache: "no-store"
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`Welcome API returned status ${res.status}:`, errText);
      return { success: false, error: `API status ${res.status}` };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Failed to trigger welcome onboarding action:", error);
    return { success: false, error: error.message };
  }
}

export async function checkIsAdmin(email: string): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || "petecurrey@gmail.com";
  return email === adminEmail;
}
