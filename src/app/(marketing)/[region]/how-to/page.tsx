import { Metadata } from "next";
import { getMetadata } from "@/lib/metadata";
import { Region, REGIONS, REGIONS_MAP } from "@/lib/seo/hreflang";
import { getRegionalHowToData } from "@/lib/seo/data";
import { RegionalHowToIndex } from "@/components/seo/RegionalHowToIndex";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ region: string }>;
}

export async function generateStaticParams() {
  return ["ca", "de", "ae", "in", "my", "ph"].map((region) => ({
    region,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { region } = await params;
  if (!REGIONS.includes(region as Region)) return {};

  const regionName = REGIONS_MAP[region as Region].label;

  return getMetadata({
    title: `Trading How-To Guides ${regionName} | Drawdown`,
    description: `Learn how to trade from ${regionName}. Step-by-step tutorials on platform setups, risk configurations, and execution techniques.`,
    path: `/${region}/how-to`,
    hasRegionalVariants: true,
  });
}

export default async function DynamicRegionalHowToIndexPage({ params }: Props) {
  const { region: regionParam } = await params;
  const region = regionParam as Region;

  if (!REGIONS.includes(region)) {
    notFound();
  }

  const data = getRegionalHowToData(region);

  return <RegionalHowToIndex region={region} data={data} />;
}
