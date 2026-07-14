import TradingViewReviewPage, { generateMetadata as baseGenerateMetadata } from "../../tools/tradingview/page";
import { Region, REGIONS } from "@/lib/seo/hreflang";
import { Metadata } from "next";

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
  return baseGenerateMetadata({ params: Promise.resolve({ region }) });
}

export default async function RegionalTradingViewReview({ params }: Props) {
  const { region } = await params;
  return <TradingViewReviewPage params={Promise.resolve({ region })} />;
}
