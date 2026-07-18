import type { Metadata } from 'next'
import PricingPage from './PricingClient'
import JsonLd from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Pricing | Trading Education Subscription Plans',
  description: 'Simple, honest pricing for serious trading education. Foundation, Edge and Floor tiers. Start free with Phase 1 — upgrade when you\'re ready.',
  alternates: { canonical: 'https://drawdown.trading/pricing' }
}

import { createInternalSupabase } from "@/lib/supabase/server";

export default async function Page() {
  const supabase = createInternalSupabase();

  let floorCap = 15;
  try {
    const { data } = await supabase
      .from('platform_settings')
      .select('setting_value')
      .eq('setting_key', 'floor_cap')
      .single();
    if (data?.setting_value) {
      floorCap = parseInt(data.setting_value as string, 10);
    }
  } catch(e) {}

  let activeFloorSubs = 0;
  try {
    const { count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('subscription_tier', 'floor')
      .eq('subscription_status', 'active');
    activeFloorSubs = count || 0;
  } catch(e) {}

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is included in the Foundation plan?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The Foundation plan includes full access to Phases 1-3 of the curriculum, the Risk Calculator, AI Trade Journal and Intelligence Hub tools, and the twice-daily market email briefs."
            }
          },
          {
            "@type": "Question",
            "name": "What is the difference between Foundation and Edge?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Edge adds Phases 4-6, the AI Market Scanner, Strategy Backtester and Algo Strategy Builder tools, plus access to the community and weekly live sessions with Pete."
            }
          },
          {
            "@type": "Question",
            "name": "What is The Floor?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The Floor is Drawdown's premium tier offering monthly 1-to-1 mentorship sessions directly with Pete Currey, unlimited AI tool usage and priority support. Limited seats available."
            }
          },
          {
            "@type": "Question",
            "name": "Is there a free trial?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Phase 1 of the curriculum is permanently free — no trial period, no card required. This gives you a genuine taste of the curriculum quality before committing to a paid plan."
            }
          },
          {
            "@type": "Question",
            "name": "Do you offer refunds?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. If you're not satisfied within 7 days of upgrading to a paid plan, contact us for a full refund — no questions asked."
            }
          }
        ]
      }} />
      <PricingPage floorCap={floorCap} activeFloorSubs={activeFloorSubs} />
    </>
  )
}
