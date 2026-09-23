import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { TrackPageView } from '@/components/admin/TrackPageView';
import { LEGAL_CONFIG } from '@/config/legal';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About Pete Currey & Drawdown Authority',
  description: 'The honest origin of Drawdown. Pete Currey has been trading live markets since 2016. Discover our founder journey, risk philosophy, and what we do and do not claim.',
  alternates: { canonical: 'https://drawdown.trading/about' },
};

export default function AboutPage() {
  return (
    <>
      <TrackPageView path="/about" />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "name": "About Pete Currey & Drawdown Authority",
        "url": "https://drawdown.trading/about",
        "description": "Discover the founder journey, risk philosophy, and the honest record behind Drawdown.",
        "mainEntity": {
          "@type": "Person",
          "name": "Pete Currey",
          "url": "https://drawdown.trading/about",
          "jobTitle": "Founder & Head of Research",
          "description": "Founder of Drawdown, trading live financial markets since 2016.",
          "worksFor": {
            "@type": "Organization",
            "name": "Drawdown",
            "url": "https://drawdown.trading"
          },
          "sameAs": [
            "https://linkedin.com/in/petercurrey"
          ],
          "knowsAbout": [
            "Trading Risk",
            "Drawdown",
            "Position Sizing",
            "Financial Markets"
          ],
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Chesterfield",
            "addressRegion": "Derbyshire",
            "addressCountry": "GB"
          }
        }
      }} />
      <AboutClient />
    </>
  );
}
