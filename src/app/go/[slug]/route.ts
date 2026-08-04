import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { affiliateLinks } from '@/config/affiliates';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  
  // 1. Look up in the database first
  let destinationUrl = '';
  let hasAffiliateLink = false;
  let isFoundInDb = false;

  try {
    const supabase = await createClient();
    const { data: dbLink, error } = await supabase
      .from('affiliate_links')
      .select('destination_url, is_active')
      .eq('slug', slug)
      .single();

    if (!error && dbLink && dbLink.is_active) {
      destinationUrl = dbLink.destination_url;
      hasAffiliateLink = true; // DB-managed links are active affiliate redirects
      isFoundInDb = true;
    }
  } catch (err) {
    console.error('Error querying affiliate_links from database:', err);
  }

  // 2. Fall back to static config if not found in DB
  const affiliateData = affiliateLinks[slug];
  if (!isFoundInDb) {
    if (affiliateData) {
      destinationUrl = affiliateData.url;
      hasAffiliateLink = affiliateData.hasAffiliateLink;
    } else {
      // Fallback based on slug characteristics or defaults
      const isPropFirm = slug.includes('ftmo') || slug.includes('5ers') || slug.includes('funding');
      const fallbackUrl = isPropFirm ? '/prop-firms' : '/brokers';
      return NextResponse.redirect(new URL(fallbackUrl, request.url));
    }
  }

  // Fire-and-forget click log to Supabase
  try {
    const supabase = await createClient();
    const headersList = await headers();
    
    // We intentionally don't await this so it doesn't block the redirect
    supabase.from('affiliate_clicks').insert({
      slug,
      destination_url: destinationUrl,
      has_affiliate_link: hasAffiliateLink,
      referrer: headersList.get('referer') || null,
    }).then(({ error }) => {
      if (error) console.error('Failed to log affiliate click:', error);
    });
  } catch (err) {
    console.error('Error initializing supabase client for click log:', err);
  }

  // Create redirect response with X-Robots-Tag to prevent indexing
  const response = NextResponse.redirect(destinationUrl, { status: 302 });
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  
  return response;
}
