import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = await createClient();
  const headersList = await headers();

  // Resolve affiliate link from DB
  const { data: link } = await supabase
    .from('affiliate_links')
    .select('id, destination_url')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (!link) {
    return NextResponse.redirect(new URL('/brokers', request.url));
  }

  // Grab session user (optional – anon clicks are fine)
  const { data: { user } } = await supabase.auth.getUser();

  // GDPR-safe IP hash
  const forwardedFor = headersList.get('x-forwarded-for') || '';
  const ip = forwardedFor.split(',')[0].trim();
  const ipHash = ip
    ? createHash('sha256').update(ip + process.env.IP_HASH_SALT || 'drawdown').digest('hex').slice(0, 16)
    : null;

  // Fire-and-forget click log
  supabase
    .from('affiliate_clicks')
    .insert({
      affiliate_id: link.id,
      user_id: user?.id ?? null,
      source_url: headersList.get('referer') ?? '',
      region: headersList.get('x-vercel-ip-country') ?? 'unknown',
      ip_hash: ipHash,
    })
    .then(() => {});

  return NextResponse.redirect(link.destination_url, { status: 302 });
}
