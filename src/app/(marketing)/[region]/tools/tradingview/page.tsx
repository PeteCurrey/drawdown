import TradingViewReviewPage, { generateMetadata as baseGenerateMetadata } from "../../tools/tradingview/page";
import { Region, REGIONS } from "@/lib/seo/hreflang";
import { Metadata } from "next";

interface Props {
  params: Promise<{ region: string }>;
}

export async function generateStaticParams() {
  return REGIONS.filter(r => r !== 'uk').map((region) => ({
    region,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { region } = await params;
  return baseGenerateMetadata({ params: Promise.resolve({ region }) });
}

export default async function RegionalTradingViewReview({ params }: Props) {
  const { region } = await params;
  return <TradingViewReviewPage params={Promise.resolve({ region })} />;
}
