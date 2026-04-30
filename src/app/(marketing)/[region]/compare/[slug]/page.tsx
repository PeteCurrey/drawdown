import { Metadata } from "next";
import { getMetadata } from "@/lib/metadata";
import { RegionalComparePage } from "@/components/seo/RegionalComparePage";
import { Region, REGIONS } from "@/lib/seo/hreflang";
import { getRegionalCompareData } from "@/lib/seo/data";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ region: string; slug: string }>;
}

export async function generateStaticParams() {
  const regions: Region[] = ["ca", "de", "ae", "in", "my", "ph"];
  const paths: { region: string; slug: string }[] = [];

  regions.forEach((region) => {
    const data = getRegionalCompareData(region);
    data.forEach((page) => {
      paths.push({ region, slug: page.slug });
    });
  });

  return paths;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { region, slug } = await params;
  if (!REGIONS.includes(region as Region)) return {};

  const data = getRegionalCompareData(region as Region);
  const page = data.find((p) => p.slug === slug);

  if (!page) return {};

  return getMetadata({
    title: page.title,
    description: page.metaDescription,
    path: `/${region}/compare/${slug}`,
    hasRegionalVariants: true,
  });
}

export default async function DynamicRegionalComparePage({ params }: Props) {
  const { region: regionParam, slug } = await params;
  const region = regionParam as Region;

  if (!REGIONS.includes(region)) notFound();

  const data = getRegionalCompareData(region);
  
  return <RegionalComparePage region={region} slug={slug} data={data} />;
}
