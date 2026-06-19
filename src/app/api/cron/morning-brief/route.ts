import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // 1. Verify Vercel Cron Secret
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || `https://${process.env.VERCEL_URL}` || "http://localhost:3000";

  try {
    // 2. Call generate-morning API route
    console.log(`[CRON] Triggering morning brief generation at ${siteUrl}...`);
    const generateRes = await fetch(`${siteUrl}/api/email/generate-morning`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.CRON_SECRET}`,
        "Content-Type": "application/json"
      },
      cache: "no-store"
    });

    if (!generateRes.ok) {
      const errText = await generateRes.text();
      throw new Error(`Morning generation failed (${generateRes.status}): ${errText}`);
    }

    const { emailSendId } = await generateRes.json();
    console.log(`[CRON] Morning brief generated with ID: ${emailSendId}. Waiting 2 seconds before dispatching...`);

    // 3. Small delay to ensure DB transaction commits and everything is ready
    await new Promise(r => setTimeout(r, 2000));

    // 4. Send the broadcast
    console.log(`[CRON] Triggering morning broadcast for ID: ${emailSendId}...`);
    const sendRes = await fetch(`${siteUrl}/api/email/send-broadcast`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.CRON_SECRET}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ emailSendId, type: "morning_brief" }),
      cache: "no-store"
    });

    if (!sendRes.ok) {
      const errText = await sendRes.text();
      throw new Error(`Morning broadcast failed (${sendRes.status}): ${errText}`);
    }

    const result = await sendRes.json();
    console.log(`[CRON] Morning brief dispatch complete:`, result);

    return NextResponse.json({ success: true, ...result });

  } catch (error: any) {
    console.error("Morning brief cron execution failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
