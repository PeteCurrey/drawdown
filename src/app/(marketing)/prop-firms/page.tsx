import type { Metadata } from 'next'
import PropFirmsPage from './PropFirmsClient'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import JsonLd from '@/components/seo/JsonLd'
import { getMetadata } from '@/lib/metadata'
import { PROP_FIRM_REVIEWS } from '@/data/seo/prop-firms'

export const metadata: Metadata = getMetadata({
  title: 'Prop Firm Reviews 2026 | Drawdown Rules, Fees & Payout Analysis',
  description: 'Evidence-based prop firm reviews ranked by drawdown rules, challenge structure, and verified payout history — not by affiliate commission.',
  path: '/prop-firms',
})

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Prop Firm Reviews 2026",
            "url": "https://drawdown.trading/prop-firms",
            "description": "Evidence-based prop firm reviews ranked by drawdown rules, challenge fees, and payout history.",
            "numberOfItems": PROP_FIRM_REVIEWS.length,
            "itemListElement": PROP_FIRM_REVIEWS.map((r, i) => ({
              "@type": "ListItem",
              "position": i + 1,
              "name": r.name,
              "url": `https://drawdown.trading/prop-firms/${r.slug}`,
              "description": r.metaDescription,
            })),
          },
        ]}
      />
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://drawdown.trading' },
        { name: 'Prop Firms', url: 'https://drawdown.trading/prop-firms' }
      ]} />
      <PropFirmsPage />
    </>
  )
}
