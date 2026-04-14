import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  console.warn("RESEND_API_KEY is missing. Email dispatch will fail.");
}

interface NewsletterParams {
  subject: string;
  html: string;
  recipients: string[];
  fromName?: string;
}

export async function sendNewsletter({
  subject,
  html,
  recipients,
  fromName = "Pete | Drawdown",
}: NewsletterParams) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { data, error } = await resend.emails.send({
      from: `${fromName} <news@drawdown.trade>`, // Assumes domain is verified in Resend
      to: "subscribers@drawdown.trade", // Use a placeholder for internal tracking if needed
      bcc: recipients, // Use BCC for privacy and batch sending
      subject: subject,
      html: html,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error("Email Dispatch Exception:", err);
    return { success: false, error: err.message };
  }
}
