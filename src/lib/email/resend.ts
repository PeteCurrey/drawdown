import { Resend } from 'resend';

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY || "re_mock_key_for_dev_mode");

interface SendBroadcastOptions {
  subject: string;
  html: string;
  audience: "all" | "foundation" | "edge" | "floor";
}

/**
 * Mocks fetching addresses by tier. 
 * In a real app this would query Supabase for user.email where tier = audience.
 */
async function getEmailAddressesByTier(audience: string): Promise<string[]> {
  // Mock data for development
  if (audience === "all") return ["test1@example.com", "test2@example.com", "test3@example.com"];
  if (audience === "edge") return ["edge_user@example.com"];
  return ["dev@example.com"];
}

export async function sendNewsletterBroadcast({ subject, html, audience }: SendBroadcastOptions) {
  try {
    const bccList = await getEmailAddressesByTier(audience);
    
    // Resend broadcast limits usually require batching for large lists (e.g. 50 per send)
    // We mock the send here for the demonstration.
    
    const { data, error: sendError } = await resend.emails.send({
      from: 'Pete <pete@drawdown.com>', // Replace with verified domain
      to: 'update@drawdown.com', // Sending to self, BCC the audience
      bcc: bccList,
      subject: subject,
      html: html,
    });

    if (sendError) throw sendError;

    return { success: true, count: bccList.length, id: data?.id };
  } catch (error) {
    console.error("Resend API Error:", error);
    return { success: false, error: (error as Error).message };
  }
}
