import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

export async function sendTradeSignalEmail(email: string, signal: { title: string; content: string; related_symbols: string[] }) {
  if (!process.env.RESEND_API_KEY) return;

  try {
    await resend.emails.send({
      from: "Drawdown Intelligence <signals@drawdown.trading>",
      to: email,
      subject: `🚨 NEW SIGNAL: ${signal.title}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px; border: 1px solid #333;">
          <h1 style="color: #00C2FF; text-transform: uppercase; letter-spacing: 2px;">Intelligence Signal</h1>
          <p style="font-size: 14px; color: #aaa; text-transform: uppercase;">Time: ${new Date().toUTCString()}</p>
          <hr style="border: 0; border-top: 1px solid #333; margin: 20px 0;">
          <h2 style="font-size: 24px;">${signal.title}</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #ddd;">${signal.content}</p>
          <div style="margin-top: 30px;">
            <p style="font-size: 12px; color: #00C2FF; font-weight: bold; text-transform: uppercase;">Related Symbols:</p>
            <div style="display: flex; gap: 10px;">
              ${signal.related_symbols.map(s => `<span style="background: #111; border: 1px solid #333; padding: 5px 10px; font-size: 12px;">${s}</span>`).join('')}
            </div>
          </div>
          <div style="margin-top: 40px; border-top: 1px solid #333; padding-top: 20px;">
            <a href="https://drawdown.trading/dashboard/intelligence" style="background: #00C2FF; color: #000; padding: 15px 25px; text-decoration: none; font-weight: bold; font-size: 12px; display: inline-block; text-transform: uppercase;">View Analysis in Dashboard</a>
          </div>
          <p style="font-size: 10px; color: #555; margin-top: 40px;">
            This is an automated institutional signal. Please verify with your own technical analysis before execution.
          </p>
        </div>
      `
    });
  } catch (error) {
    console.error("Resend Error:", error);
  }
}
