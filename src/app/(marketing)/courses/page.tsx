import { Metadata } from "next";
import { CoursesPageClient } from "@/components/courses/CoursesPageClient";
import { StructuredData } from "@/components/StructuredData";
import { phases } from "@/data/courses";

export const metadata: Metadata = {
  title: "Structured Trading Courses for UK Traders",
  description: "A structured 13-phase trading curriculum built for UK traders. From chart reading to live execution — no shortcuts, no fluff. Start Phase 1 free.",
  alternates: { canonical: "https://drawdown.trading/courses" }
};

export default function CoursesPage() {
  const courseSchema = {
    "@type": "ItemList",
    "itemListElement": phases.map((phase, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "Course",
        "name": `Phase ${phase.number}: ${phase.name}`,
        "description": phase.description,
        "provider": {
          "@type": "Organization",
          "name": "Drawdown",
          "sameAs": "https://drawdown.trading"
        }
      }
    }))
  };

  return (
    <>
      <StructuredData type="ItemList" data={courseSchema} />
      <CoursesPageClient />
    </>
  );
}
