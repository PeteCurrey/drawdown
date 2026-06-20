import { Metadata } from "next";
import { CoursesPageClient } from "@/components/courses/CoursesPageClient";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: 'Trading Courses UK | 6-Phase Curriculum | Structured Learning',
  description: 'A structured 6-phase trading curriculum built for UK traders. From chart reading to live execution — no shortcuts, no fluff. Start Phase 1 free.',
  alternates: { canonical: 'https://drawdown.trading/courses' }
}

export default function CoursesPage() {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Drawdown Trading Curriculum",
        "description": "A 6-phase structured trading curriculum for UK traders",
        "url": "https://drawdown.trading/courses",
        "numberOfItems": 6,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "item": {
              "@type": "Course",
              "name": "Phase 1 — Foundation",
              "description": "The fundamentals of financial markets, trading psychology and risk management. Free for all Drawdown members.",
              "provider": {
                "@type": "Organization",
                "name": "Drawdown Trading",
                "url": "https://drawdown.trading"
              },
              "url": "https://drawdown.trading/courses",
              "isAccessibleForFree": true,
              "inLanguage": "en-GB",
              "educationalLevel": "Beginner",
              "teaches": [
                "Financial markets fundamentals",
                "Trading psychology",
                "Risk management basics"
              ]
            }
          },
          {
            "@type": "ListItem",
            "position": 2,
            "item": {
              "@type": "Course",
              "name": "Phase 2 — Chart Reader",
              "description": "Technical analysis, price action and chart structure. Learn to read markets the way institutions do.",
              "provider": {
                "@type": "Organization",
                "name": "Drawdown Trading",
                "url": "https://drawdown.trading"
              },
              "url": "https://drawdown.trading/courses",
              "isAccessibleForFree": false,
              "inLanguage": "en-GB",
              "educationalLevel": "Beginner to Intermediate",
              "teaches": [
                "Technical analysis",
                "Price action",
                "Chart structure",
                "Support and resistance"
              ]
            }
          },
          {
            "@type": "ListItem",
            "position": 3,
            "item": {
              "@type": "Course",
              "name": "Phase 3 — Strategist",
              "description": "Building and refining a trading strategy. Entry criteria, exit rules and trade management across multiple instruments.",
              "provider": {
                "@type": "Organization",
                "name": "Drawdown Trading",
                "url": "https://drawdown.trading"
              },
              "url": "https://drawdown.trading/courses",
              "isAccessibleForFree": false,
              "inLanguage": "en-GB",
              "educationalLevel": "Intermediate",
              "teaches": [
                "Strategy development",
                "Entry and exit criteria",
                "Trade management",
                "Multi-instrument trading"
              ]
            }
          },
          {
            "@type": "ListItem",
            "position": 4,
            "item": {
              "@type": "Course",
              "name": "Phase 4 — Risk Manager",
              "description": "Advanced risk management, position sizing and capital allocation. The phase that separates profitable traders from the rest.",
              "provider": {
                "@type": "Organization",
                "name": "Drawdown Trading",
                "url": "https://drawdown.trading"
              },
              "url": "https://drawdown.trading/courses",
              "isAccessibleForFree": false,
              "inLanguage": "en-GB",
              "educationalLevel": "Intermediate to Advanced",
              "teaches": [
                "Advanced risk management",
                "Position sizing",
                "Capital allocation",
                "Portfolio management"
              ]
            }
          },
          {
            "@type": "ListItem",
            "position": 5,
            "item": {
              "@type": "Course",
              "name": "Phase 5 — Execution",
              "description": "Live market execution, broker integration and trading infrastructure. Building the setup that works in real conditions.",
              "provider": {
                "@type": "Organization",
                "name": "Drawdown Trading",
                "url": "https://drawdown.trading"
              },
              "url": "https://drawdown.trading/courses",
              "isAccessibleForFree": false,
              "inLanguage": "en-GB",
              "educationalLevel": "Advanced",
              "teaches": [
                "Live execution",
                "Broker integration",
                "Trading infrastructure",
                "Order types and management"
              ]
            }
          },
          {
            "@type": "ListItem",
            "position": 6,
            "item": {
              "@type": "Course",
              "name": "Phase 6 — The Edge",
              "description": "Advanced instruments including crypto, algorithmic approaches and systematic trading. For traders who have mastered the fundamentals.",
              "provider": {
                "@type": "Organization",
                "name": "Drawdown Trading",
                "url": "https://drawdown.trading"
              },
              "url": "https://drawdown.trading/courses",
              "isAccessibleForFree": false,
              "inLanguage": "en-GB",
              "educationalLevel": "Advanced",
              "teaches": [
                "Cryptocurrency trading",
                "Algorithmic trading",
                "Systematic approaches",
                "Advanced instruments"
              ]
            }
          }
        ]
      }} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Is Phase 1 really free?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Phase 1 of the Drawdown curriculum is completely free with no card required. You get access to the Foundation modules and two AI tools — the Risk Calculator and Intelligence Hub — at no cost."
            }
          },
          {
            "@type": "Question",
            "name": "How long does the curriculum take to complete?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The full 6-phase curriculum takes most traders 6-12 months to work through properly. Phase 1 alone is typically 4-6 hours. The pace is self-directed — there are no deadlines."
            }
          },
          {
            "@type": "Question",
            "name": "Do I need any prior trading experience?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. Phase 1 starts from absolute zero — what financial markets are, how they work, and what trading actually involves. Complete beginners are the intended starting point."
            }
          },
          {
            "@type": "Question",
            "name": "What broker do I need?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You don't need a funded broker account to start. Phase 1 and 2 can be completed entirely on paper or demo. When you're ready, the Drawdown curriculum recommends Pepperstone for UK traders."
            }
          },
          {
            "@type": "Question",
            "name": "Can I cancel my subscription at any time?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. All Drawdown subscriptions can be cancelled at any time with no penalty. You retain access until the end of your current billing period."
            }
          }
        ]
      }} />
      <CoursesPageClient />
    </>
  );
}
