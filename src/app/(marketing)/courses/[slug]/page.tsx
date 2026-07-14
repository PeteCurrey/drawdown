import { Metadata } from "next";
import { notFound } from "next/navigation";
import { phases } from "@/data/courses";
import { getMetadata } from "@/lib/metadata";
import { CourseLandingPageClient } from "@/components/courses/CourseLandingPageClient";
import { StructuredData } from "@/components/StructuredData";

interface Props {
  params: Promise<{ slug: string }>;
}

const META_DESCRIPTIONS: Record<string, string> = {
  "ground-zero": "Master the fundamentals of trading with Drawdown's 8-module beginner course. Learn risk math, market logic & UK broker models. Free tier.",
  "chart-reader": "Master price action trading with Drawdown's 12-module foundation course. Learn market structure, liquidity zones & geometry. Foundation tier.",
  "strategist": "Build your trading edge with Drawdown's 10-module strategist course. Learn entry models, pullback rules & strategy tracking. Foundation tier.",
  "risk-manager": "Master trading risk management with Drawdown's 6-module foundation course. Sizing formulas, drawdown recovery & math of ruin. Foundation tier.",
  "mind-over-market": "Master trading psychology with Drawdown's 10-module edge course. Overcome FOMO, tilt & emotional traps. Edge tier.",
  "the-edge": "Scale your trading with Drawdown's 14-module floor course. Order flow, footprint charts & portfolio diversification. Floor tier.",
  "fundamental-edge": "Master macroeconomic news trading with Drawdown's 6-module edge course. Central banks, CPI, GDP & COT sentiment analysis. Edge tier.",
  "derivatives-options": "Master derivative trading in the UK with Drawdown's 6-module edge course. CFDs, margin costs, options & spread betting. Edge tier.",
  "portfolio-architect": "Master long-term portfolio allocation with Drawdown's 6-module floor course. Equities, bonds, tax-efficient ISAs & SIPPs. Floor tier.",
  "macro-trader": "Master central bank policies and economic data cycles with Drawdown's 10-module edge course. Learn BoE trading & macro bias. Edge tier.",
  "prop-firm-mastery": "Master prop firm challenges with Drawdown's 8-module edge course. Evaluation rules, risk management, scaling plans & UK tax on funded payouts. Edge tier.",
  "ai-trader": "Master AI trading tools and workflows with Drawdown's 12-module floor course. Pine Script, custom journals, and TV webhooks. Floor tier.",
  "the-backtester": "Master strategy backtesting with Drawdown's 8-module floor course. Monte Carlo simulation, expectancy, profit factor & MAE. Floor tier."
};

export async function generateStaticParams() {
  return phases.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const phase = phases.find((p) => p.slug === slug);
  if (!phase) return {};

  const title = `${phase.name} Trading Course | ${phase.subtitle}`;
  const description = META_DESCRIPTIONS[phase.slug] || `${phase.description.slice(0, 120)}... ${phase.modules_count}-module course. UK context.`;

  return getMetadata({
    title,
    description,
    path: `/courses/${slug}`,
    hasRegionalVariants: true,
  });
}

export default async function CourseLandingPage({ params }: Props) {
  const { slug } = await params;
  const phase = phases.find((p) => p.slug === slug);

  if (!phase) {
    notFound();
  }

  const isoDuration = `PT${phase.duration.replace(" Hours", "H").replace(" Hour", "H").replace(" ", "")}`;

  const courseSchema = {
    "name": `${phase.name} — ${phase.subtitle}`,
    "description": phase.full_description || phase.description,
    "provider": {
      "@type": "Organization",
      "name": "Drawdown",
      "url": "https://drawdown.trading"
    },
    "author": {
      "@type": "Person",
      "name": "Pete Currey"
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "courseWorkload": isoDuration
    },
    "numberOfCredits": `${phase.modules_count} modules`,
    "url": `https://drawdown.trading/courses/${phase.slug}`,
    "inLanguage": "en-GB"
  };

  const itemListSchema = {
    "name": `${phase.name} — Module List`,
    "itemListElement": phase.modules_list.map((modTitle, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "url": `https://drawdown.trading/courses/${phase.slug}/module-${idx + 1}`,
      "name": modTitle
    }))
  };

  return (
    <>
      <StructuredData type="Course" data={courseSchema} />
      <StructuredData type="ItemList" data={itemListSchema} />
      <CourseLandingPageClient params={Promise.resolve({ slug })} />
    </>
  );
}
