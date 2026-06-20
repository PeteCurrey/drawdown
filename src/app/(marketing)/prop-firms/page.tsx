import type { Metadata } from 'next'
import PropFirmsPage from './PropFirmsClient'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'

export const metadata: Metadata = {
  title: 'Prop Firm Reviews & Comparison | Pass Your Challenge',
  description: 'Honest prop firm reviews and comparison for UK traders. FTMO, MyFundedFX and more — ranked by viability, not affiliate payouts.',
  alternates: { canonical: 'https://drawdown.trading/prop-firms' }
}

export default function Page() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://drawdown.trading' },
        { name: 'Prop Firms', url: 'https://drawdown.trading/prop-firms' }
      ]} />
      <PropFirmsPage />
    </>
  )
}
