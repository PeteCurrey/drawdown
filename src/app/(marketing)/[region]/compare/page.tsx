import { Metadata } from "next";
import { getMetadata } from "@/lib/metadata";
import { Region, REGIONS, REGIONS_MAP } from "@/lib/seo/hreflang";
import { getRegionalCompareData } from "@/lib/seo/data";
import { RegionalCompareIndex } from "@/components/seo/RegionalCompareIndex";
import { notFound } from "next/navigation";

export const dynamicParams = true;
export const revalidate = 3600; // hourly cache revalidation

interface Props {
  params: Promise<{ region: string }>;
}

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { region } = await params;
  if (!REGIONS.includes(region as Region)) return {};

  const regionName = REGIONS_MAP[region as Region].label;

  return getMetadata({
    title: `Broker & Platform Comparisons ${regionName} | Drawdown`,
    description: `Technical side-by-side comparisons of leading trading tools and platforms for traders in ${regionName}.`,
    path: `/${region}/compare`,
    hasRegionalVariants: true,
  });
}

export default async function DynamicRegionalCompareIndexPage({ params }: Props) {
  const { region: regionParam } = await params;
  const region = regionParam as Region;

  if (!REGIONS.includes(region)) {
    notFound();
  }

  const data = getRegionalCompareData(region);

  return <RegionalCompareIndex region={region} data={data} />;
}
