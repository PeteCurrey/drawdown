import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

export async function POST(request: NextRequest) {
  const { email, firmMatch, tradingStyle } = await request.json();

  if (!email || !firmMatch) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = await createClient();

  try {
    // 1. Upsert into newsletter_subscribers with prop_quiz source tag
    await supabase.from("newsletter_subscribers").upsert({
      email,
      source: "prop_quiz",
      locale: "uk",
      status: "active",
      subscribed_at: new Date().toISOString(),
    });

    // 2. Upsert into Resend audience
    if (process.env.RESEND_AUDIENCE_ID) {
      await resend.contacts.create({
        email,
        audienceId: process.env.RESEND_AUDIENCE_ID,
        unsubscribed: false,
      });
    }

    // 3. Send personalised match email
    const firmNames: Record<string, string> = {
      ftmo: "FTMO",
      "the5ers": "The5%ers",
      "funding-pips": "Funding Pips",
    };
    const firmName = firmNames[firmMatch] ?? firmMatch;
    const firmLinks: Record<string, string> = {
      ftmo: "https://drawdown.trading/api/market/prop-firms/redirect?id=ftmo&source=quiz_email",
      "the5ers": "https://drawdown.trading/api/market/prop-firms/redirect?id=the5ers&source=quiz_email",
      "funding-pips": "https://drawdown.trading/api/market/prop-firms/redirect?id=funding-pips&source=quiz_email",
    };
    const firmLink = firmLinks[firmMatch] ?? "https://drawdown.trading/prop-firms";

    await resend.emails.send({
      from: "Pete @ Drawdown <thewire@drawdown.trading>",
      to: email,
      subject: `Your Prop Firm Match: ${firmName}`,
      html: `
        <div style="font-family: sans-serif; background: #0a0a0a; color: #E4E2DD; padding: 40px; max-width: 600px; margin: 0 auto;">
          <p style="font-family: monospace; color: #888; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 24px;">
            // DRAWDOWN — PROP FIRM MATCH REPORT
          </p>
          <h1 style="font-size: 36px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; margin-bottom: 8px; color: #fff;">
            Your Match:<br/><span style="color: #f59e0b;">${firmName}</span>
          </h1>
          <p style="color: #888; margin-bottom: 32px; font-size: 14px; line-height: 1.6;">
            Based on your trading style assessment, ${firmName} is your optimal evaluation environment.
            Here's why it fits your parameters.
          </p>
          <a href="${firmLink}" style="display: inline-block; padding: 14px 32px; background: #f59e0b; color: #0a0a0a; font-weight: 900; text-transform: uppercase; letter-spacing: 0.15em; text-decoration: none; font-size: 12px; margin-bottom: 32px;">
            Start ${firmName} Challenge →
          </a>
          <div style="border-top: 1px solid #222; padding-top: 24px; margin-top: 24px;">
            <p style="color: #555; font-size: 11px; line-height: 1.6; font-family: monospace; text-transform: uppercase; letter-spacing: 0.1em;">
              Don't start your evaluation without a math-backed risk model.<br/>
              <a href="https://drawdown.trading/store/prop-survival-kit" style="color: #f59e0b;">
                Get the £14 Prop Challenge Survival Kit →
              </a>
            </p>
          </div>
          <p style="color: #333; font-size: 10px; margin-top: 32px; font-family: monospace;">
            You're receiving this because you completed the Drawdown Prop Firm quiz.
            <a href="{{unsubscribeUrl}}" style="color: #555;">Unsubscribe</a>
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Quiz email capture failed:", error);
    return NextResponse.json({ error: "Failed to capture email" }, { status: 500 });
  }
}
