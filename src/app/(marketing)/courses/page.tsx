import { Metadata } from "next";
import { getMetadata } from "@/lib/metadata";
import { CoursesPageClient } from "@/components/courses/CoursesPageClient";
import { StructuredData } from "@/components/StructuredData";
import { phases } from "@/data/courses";

export const metadata: Metadata = getMetadata({
  title: "Trading Courses & Curriculum | 13 Phases | Drawdown — Trade the Truth",
  description: "A complete phase-based trading curriculum. 13 phases, 117+ modules — from zero to institutional-grade edge. Built for UK traders. Phase 1 is always free.",
  path: "/courses",
  hasRegionalVariants: true,
});

export default function CoursesPage() {
  const courseListSchema = {
    "name": "Drawdown Trading Curriculum — 13 Phases",
    "description": "A complete phase-based trading education path from complete beginner to professional-grade edge.",
    "itemListElement": phases.map((phase, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "Course",
        "name": phase.name,
        "url": `https://drawdown.trading/courses/${phase.slug}`,
        "description": `${phase.subtitle} — ${phase.modules_count} modules, ${phase.tier}`
      }
    }))
  };

  const faqSchema = {
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How long does each phase take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Each phase is designed to be studied at your own pace. On average, foundational phases take 1-2 weeks of structured study, while advanced phases (such as The Edge or Macro Trader) require 3-4 weeks of practice, manual backtesting, and forward testing before moving on."
        }
      },
      {
        "@type": "Question",
        "name": "Is Phase 1 really free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Ground Zero (Phase 1) is completely free for all registered users. We believe every trader must understand the mathematical reality of risk and market microstructure before risking capital."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need a coding background for The AI Trader phase?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. The AI Trader phase is structured for non-programmers. We use large language models (like Claude and ChatGPT) as code-generation assistants, showing you exactly how to write Pine Script and configure webhook alerts without writing code from scratch."
        }
      },
      {
        "@type": "Question",
        "name": "What is the difference between Foundation, Edge, and Floor tiers?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Foundation tier covers core chart reading and risk mechanics. Edge tier adds AI-assisted journaling, market scanners, and advanced macro trading modules. Floor tier is for professional scaling, featuring monthly 1-to-1 mentorship and direct desk execution access. Phase 1 is always free with no credit card required."
        }
      },
      {
        "@type": "Question",
        "name": "Can I cancel my subscription at any time?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. There is no minimum term and no cancellation fees. You can cancel directly from your account settings at any time, and your billing will stop at the end of your current cycle."
        }
      },
      {
        "@type": "Question",
        "name": "Are there live trading sessions?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Edge and Floor members get access to live market analysis sessions. The schedule is posted in the community Discord in advance."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide trade signals?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Drawdown is strictly an educational platform, not a signal service. We teach you to identify and trade your own edge. Signal services create dependency, whereas we build independent traders."
        }
      },
      {
        "@type": "Question",
        "name": "Is this suitable for forex, indices, crypto, or all?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The curriculum is asset-class agnostic. The principles of risk management, price action, and trading psychology apply to any liquid market including forex, gold, stock indices, and crypto."
        }
      },
      {
        "@type": "Question",
        "name": "Is the content updated?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Core curriculum modules are reviewed annually, while market intelligence briefs, broker guides, and prop firm data are updated continuously."
        }
      },
      {
        "@type": "Question",
        "name": "What if I get stuck or have questions?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Paid members get access to the Drawdown Discord where Pete and other traders answer questions. Floor members have direct access to Pete for monthly 1-to-1 sessions."
        }
      }
    ]
  };

  return (
    <>
      <StructuredData type="ItemList" data={courseListSchema} />
      <StructuredData type="FAQPage" data={faqSchema} />
      <CoursesPageClient />
    </>
  );
}
