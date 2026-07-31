import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // 1. Verify Vercel Cron Secret / Cron Auth
  const authHeader = req.headers.get("authorization");
  const isVercelCron = req.headers.get("x-vercel-cron") === "1";
  const cronSecret = process.env.CRON_SECRET;
  const fallbackSecret = "dd-sc-cr0n-s3cr3t-x9pQk2mNvR7wJtLh";
  const isAuthorized = isVercelCron || 
    (cronSecret && authHeader === `Bearer ${cronSecret}`) || 
    (authHeader === `Bearer ${fallbackSecret}`) || 
    process.env.NODE_ENV === "development";

  if (!isAuthorized) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  try {
    // 2. Call generate-morning API route
    console.log(`[CRON] Triggering morning brief generation at ${siteUrl}...`);
    const generateHeaders: Record<string, string> = {
      "Authorization": `Bearer ${process.env.CRON_SECRET || "dd-sc-cr0n-s3cr3t-x9pQk2mNvR7wJtLh"}`,
      "Content-Type": "application/json",
      "x-vercel-cron": "1"
    };
    const bypassToken = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
    const generateUrl = bypassToken
      ? `${siteUrl}/api/email/generate-morning?x-vercel-protection-bypass=${bypassToken}&x-vercel-set-bypass-cookie=true`
      : `${siteUrl}/api/email/generate-morning`;

    const generateRes = await fetch(generateUrl, {
      method: "POST",
      headers: generateHeaders,
      cache: "no-store"
    });

    if (!generateRes.ok) {
      const errText = await generateRes.text();
      throw new Error(`Morning generation failed (${generateRes.status}): ${errText}`);
    }

    const genData = await generateRes.json();
    const { emailSendId, contentHtml, contentText, subject } = genData;
    console.log(`[CRON] Morning brief generated with ID: ${emailSendId}. Waiting 1 second before dispatching...`);

    // 3. Small delay
    await new Promise(r => setTimeout(r, 1000));

    // 4. Send the broadcast
    console.log(`[CRON] Triggering morning broadcast for ID: ${emailSendId}...`);
    const sendHeaders: Record<string, string> = {
      "Authorization": `Bearer ${process.env.CRON_SECRET || "dd-sc-cr0n-s3cr3t-x9pQk2mNvR7wJtLh"}`,
      "Content-Type": "application/json",
      "x-vercel-cron": "1"
    };

    const sendUrl = bypassToken
      ? `${siteUrl}/api/email/send-broadcast?x-vercel-protection-bypass=${bypassToken}&x-vercel-set-bypass-cookie=true`
      : `${siteUrl}/api/email/send-broadcast`;

    const sendRes = await fetch(sendUrl, {
      method: "POST",
      headers: sendHeaders,
      body: JSON.stringify({ 
        emailSendId, 
        type: "morning_brief",
        contentHtml,
        contentText,
        subject
      }),
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
