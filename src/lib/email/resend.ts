import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY || "re_mock_key_for_dev_mode");

// Administrative client for listing users/emails
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface SendBroadcastOptions {
  subject: string;
  html: string;
  audience: "all" | "foundation" | "edge" | "floor";
}

async function getEmailAddressesByTier(audience: string): Promise<string[]> {
  const emails = new Set<string>();

  // 1. Fetch from newsletter_subscribers (guests)
  if (audience === "all") {
    const { data: subs } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('email')
      .eq('confirmed', true)
      .is('unsubscribed_at', null);
    
    subs?.forEach(s => emails.add(s.email));
  }

  // 2. Fetch from profiles + auth users
  // Note: We query profiles for the tier, then intersect with auth emails
  const query = supabaseAdmin.from('profiles').select('id, subscription_tier');
  
  if (audience !== "all") {
    query.eq('subscription_tier', audience);
  }

  const { data: profiles } = await query;
  
  if (profiles && profiles.length > 0) {
    // In a real production environment with 10k+ users, we'd use a more efficient join or pagination.
    // For Drawdown's launch scale, fetching the emails for the IDs is sufficient.
    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    const profileIds = new Set(profiles.map(p => p.id));
    
    users.users.forEach(u => {
      if (profileIds.has(u.id) && u.email) {
        emails.add(u.email);
      }
    });
  }

  return Array.from(emails);
}

export async function sendNewsletterBroadcast({ subject, html, audience }: SendBroadcastOptions) {
  try {
    const bccList = await getEmailAddressesByTier(audience);
    
    if (bccList.length === 0) {
      return { success: true, count: 0, message: "No subscribers found for this audience." };
    }

    // Using a verified 'from' address is mandatory for Resend
    const { data, error: sendError } = await resend.emails.send({
      from: 'Pete <pete@updates.drawdown.com>',
      to: 'broadcast@drawdown.com', // Sent to a dead-end list, audience in BCC
      bcc: bccList,
      subject: subject,
      html: html,
      headers: {
        'X-Entity-Ref-ID': Date.now().toString(),
      },
    });

    if (sendError) throw sendError;

    return { success: true, count: bccList.length, id: data?.id };
  } catch (error) {
    console.error("Resend API Error:", error);
    return { success: false, error: (error as Error).message };
  }
}
