import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PropFirmsPage from '@/app/(marketing)/prop-firms/PropFirmsClient';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import { RegionalProvider } from '@/components/layout/RegionalLayout';
import { Region, REGIONS, REGIONS_MAP } from '@/lib/seo/hreflang';

interface Props {
  params: Promise<{ region: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { region: regionParam } = await params;
  const region = regionParam as Region;
  if (!REGIONS.includes(region)) return {};

  const regionName = REGIONS_MAP[region]?.label ?? region.toUpperCase();

  return {
    title: `Prop Firm Reviews & Comparison for ${regionName} Traders | Pass Your Challenge`,
    description: `Honest prop firm reviews and comparison for ${regionName} traders. Ranked by viability, payout reliability, and rule transparency.`,
    alternates: { canonical: `https://drawdown.trading/${region}/prop-firms` },
  };
}

export default async function RegionalPropFirmsPage({ params }: Props) {
  const { region: regionParam } = await params;
  const region = regionParam as Region;

  if (!REGIONS.includes(region)) {
    notFound();
  }

  return (
    <RegionalProvider region={region}>
      <BreadcrumbSchema items={[
        { name: 'Home', url: `https://drawdown.trading/${region}` },
        { name: 'Prop Firms', url: `https://drawdown.trading/${region}/prop-firms` }
      ]} />
      <PropFirmsPage />
    </RegionalProvider>
  );
}
