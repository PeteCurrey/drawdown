import type { Metadata } from 'next'
import AboutPage from './AboutClient'
import JsonLd from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'About | Pete Currey | Drawdown Trading',
  description: 'Drawdown was built by Pete Currey — a UK-based trader and entrepreneur who got tired of the trading education industry selling expensive nonsense. Here\'s the honest version.',
  alternates: { canonical: 'https://drawdown.trading/about' }
}

export default function Page() {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Pete Currey",
        "jobTitle": "Founder, Drawdown Trading",
        "url": "https://drawdown.trading/about",
        "worksFor": {
          "@type": "Organization",
          "name": "Drawdown Trading",
          "url": "https://drawdown.trading"
        },
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Chesterfield",
          "addressRegion": "Derbyshire",
          "addressCountry": "GB"
        },
        "knowsAbout": [
          "Forex Trading",
          "Technical Analysis",
          "Risk Management",
          "Prop Firm Trading",
          "Trading Psychology",
          "GBP/USD",
          "UK Spread Betting"
        ],
        "description": "Pete Currey is a UK-based trader and entrepreneur who founded Drawdown Trading — a structured trading education platform built to replace the hype-driven trading education industry with honest, phase-based learning."
      }} />
      <AboutPage />
    </>
  )
}
