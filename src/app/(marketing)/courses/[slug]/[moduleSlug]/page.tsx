import { Metadata } from "next";
import { notFound } from "next/navigation";
import { phases } from "@/data/courses";
import { courseContent } from "@/data/courseContent";
import { getMetadata } from "@/lib/metadata";
import { ModuleMarketingPageClient } from "@/components/courses/ModuleMarketingPageClient";
import { StructuredData } from "@/components/StructuredData";

interface Props {
  params: Promise<{ slug: string; moduleSlug: string }>;
}

export async function generateStaticParams() {
  const paramsList: { slug: string; moduleSlug: string }[] = [];
  phases.forEach((phase) => {
    phase.modules_list.forEach((_, idx) => {
      paramsList.push({
        slug: phase.slug,
        moduleSlug: `module-${idx + 1}`
      });
    });
  });
  return paramsList;
}

function getModuleDetails(phaseSlug: string, moduleSlug: string) {
  const phaseIndex = phases.findIndex((p) => p.slug === phaseSlug);
  const phase = phases[phaseIndex];
  if (!phase) return null;

  const moduleIndex = parseInt(moduleSlug.replace("module-", "")) - 1;
  const moduleTitle = phase.modules_list[moduleIndex];
  if (moduleIndex < 0 || moduleIndex >= phase.modules_list.length || !moduleTitle) {
    return null;
  }

  const phaseContentObj = courseContent[phaseSlug];
  const moduleContentObj = phaseContentObj ? phaseContentObj[moduleSlug] : null;

  const duration = moduleContentObj?.duration || "25 min read / 15 min video";

  // Formulate a detailed description
  let description = "";
  if (phaseSlug === "ground-zero" && moduleSlug === "module-1") {
    description = "Discover the real reason 90% of retail traders lose money — ESMA-verified data, the four failure behaviours, and the framework to avoid them. Free on Drawdown.";
  } else {
    description = `Master ${moduleTitle} in Phase ${phase.number} (${phase.name}) of the Drawdown curriculum. Learn institutional risk management & execution setups for UK traders.`;
  }

  return {
    phase,
    moduleTitle,
    duration,
    description,
    tier: phase.tier,
    educationalLevel: phase.id <= 1 ? "Beginner" : phase.id <= 4 ? "Intermediate" : "Advanced"
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, moduleSlug } = await params;
  const details = getModuleDetails(slug, moduleSlug);
  if (!details) return {};

  // Formulate <title> as: [Module Title] | [Phase Name] | Drawdown Trading Education
  const title = `${details.moduleTitle} | ${details.phase.name} | Drawdown Trading Education`;

  // Formulate OG Image path as /og/courses/[phase-slug]/[module-slug].png
  const ogImagePath = `/og/courses/${slug}/${moduleSlug}.png`;

  return getMetadata({
    title,
    description: details.description,
    image: ogImagePath,
    path: `/courses/${slug}/${moduleSlug}`,
    hasRegionalVariants: true,
  });
}

export default async function ModuleMarketingPage({ params }: Props) {
  const { slug, moduleSlug } = await params;
  const details = getModuleDetails(slug, moduleSlug);

  if (!details) {
    notFound();
  }

  const priceMap: Record<string, string> = {
    "Free": "0",
    "Foundation": "49",
    "Edge": "149",
    "Floor": "299"
  };

  const teachesOutcome = `Learn how to apply and trade ${details.moduleTitle} in active financial markets with disciplined risk parameters.`;

  const courseSchema = {
    "name": details.moduleTitle,
    "description": details.description,
    "provider": {
      "@type": "Organization",
      "name": "Drawdown",
      "url": "https://drawdown.trading",
      "sameAs": ["https://twitter.com/drawdown"]
    },
    "author": {
      "@type": "Person",
      "name": "Pete Currey",
      "url": "https://drawdown.trading/about"
    },
    "educationalLevel": details.educationalLevel,
    "url": `https://drawdown.trading/courses/${slug}/${moduleSlug}`,
    "isPartOf": {
      "@type": "Course",
      "name": details.phase.name,
      "url": `https://drawdown.trading/courses/${slug}`
    },
    "teaches": teachesOutcome,
    "inLanguage": "en-GB",
    "offers": {
      "@type": "Offer",
      "price": priceMap[details.tier] || "0",
      "priceCurrency": "GBP",
      "availability": "https://schema.org/InStock",
      "category": details.tier
    }
  };

  const breadcrumbSchema = {
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://drawdown.trading"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Courses",
        "item": "https://drawdown.trading/courses"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": details.phase.name,
        "item": `https://drawdown.trading/courses/${slug}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": details.moduleTitle,
        "item": `https://drawdown.trading/courses/${slug}/${moduleSlug}`
      }
    ]
  };

  return (
    <>
      <StructuredData type="Course" data={courseSchema} />
      <StructuredData type="BreadcrumbList" data={breadcrumbSchema} />
      <ModuleMarketingPageClient params={Promise.resolve({ slug, moduleSlug })} />
    </>
  );
}
