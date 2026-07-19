import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROP_FIRM_REVIEWS } from "@/data/seo/prop-firms";
import { PropFirmReviewTemplate } from "@/components/prop-firms/PropFirmReviewTemplate";
import { TrackPageView } from "@/components/admin/TrackPageView";

export const dynamicParams = true;
export const revalidate = 3600; // hourly cache revalidation

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PROP_FIRM_REVIEWS.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const review = PROP_FIRM_REVIEWS.find((r) => r.slug === slug);
  if (!review) notFound();

  return {
    title: review.title,
    description: review.metaDescription,
  };
}

export default async function PropFirmReviewPage({ params }: Props) {
  const { slug } = await params;
  const review = PROP_FIRM_REVIEWS.find((r) => r.slug === slug);

  if (!review) {
    notFound();
  }

  return (
    <>
      <TrackPageView path={`/prop-firms/${slug}`} />
      <PropFirmReviewTemplate review={review} />
    </>
  );
}
