import { Resend } from 'resend';
import { createInternalSupabase } from '@/lib/supabase/server';

const resend = new Resend(process.env.RESEND_API_KEY || "re_mock_key_for_dev_mode");

// Administrative client for listing users/emails
const supabaseAdmin = createInternalSupabase();

interface SendBroadcastOptions {
  subject: string;
  html: string;
  audience: "all" | "foundation" | "edge" | "floor";
  type?: "morning_brief" | "evening_wrap" | "breaking_news" | "marketing";
}

async function getEmailAddressesByTier(audience: string, type?: string): Promise<string[]> {
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
  const query = supabaseAdmin.from('profiles').select('id, subscription_tier, email_preferences');
  
  if (audience !== "all") {
    query.eq('subscription_tier', audience);
  }

  const { data: profiles } = await query;
  
  if (profiles && profiles.length > 0) {
    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    
    // Build a map of valid profile IDs that opted in
    const validProfileIds = new Set();
    profiles.forEach(p => {
      // Default to opted-in for everything except marketing if preferences are missing
      const prefs = p.email_preferences as Record<string, boolean> | null;
      let optedIn = true;
      if (type && prefs && typeof prefs === 'object') {
        optedIn = prefs[type] !== false;
      } else if (type === 'marketing') {
        optedIn = false; // default false for marketing
      }
      
      if (optedIn) validProfileIds.add(p.id);
    });
    
    users.users.forEach(u => {
      if (validProfileIds.has(u.id) && u.email) {
        emails.add(u.email);
      }
    });
  }

  return Array.from(emails);
}

export async function sendNewsletterBroadcast({ subject, html, audience, type }: SendBroadcastOptions) {
  try {
    const bccList = await getEmailAddressesByTier(audience, type);
    
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
