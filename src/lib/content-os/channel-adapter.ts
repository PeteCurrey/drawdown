import type { SocialChannel, VisualFamily } from "./types.ts";
import { EditorialPolicyService } from "./editorial-policy.ts";

export interface ChannelAdaptationContract {
  article: {
    title: string;
    slug: string;
    standfirst: string;
    body: string;
    keyFacts: string[];
    analysis: string;
    sources: string[];
    cta: string;
    disclaimer: string;
  };
  instagram: {
    hook: string;
    caption: string;
    slides: Array<{
      slideNumber: number;
      type: 'hook' | 'context' | 'evidence' | 'analysis' | 'takeaway';
      header: string;
      body: string;
    }>;
    hashtags: string[];
    visualFamily: VisualFamily;
    aspectRatio: '1:1' | '4:5';
    cta: string;
    sourceFooter: string;
  };
  x: {
    singlePost: string;
    thread?: string[];
    hashtags: string[];
  };
  linkedin: {
    longFormCommentary: string;
    sourcesSection: string;
    cta: string;
  };
  threads: {
    concisePost: string;
  };
}

export class ChannelAdaptationEngine {
  /**
   * Adapts core content into distinct, channel-tailored representations.
   * Does NOT merely truncate text; generates structured variants per platform standards.
   */
  static adaptContent(params: {
    title: string;
    slug: string;
    rawText: string;
    facts: string[];
    analysis: string;
    sources: string[];
    visualFamily?: VisualFamily;
    relatedSymbol?: string;
    requiresDisclaimer?: boolean;
  }): ChannelAdaptationContract {
    const family: VisualFamily = params.visualFamily || 'MARKET_UPDATE';
    const symbolTag = params.relatedSymbol ? `#${params.relatedSymbol.replace(/[^a-zA-Z0-9]/g, '')}` : '#Markets';
    const baseHashtags = ['#Drawdown', '#QuantitativeTrading', symbolTag, '#RiskManagement'];

    // 1. Article representation
    const articleDisclaimer = EditorialPolicyService.enforceDisclaimer('', !!params.requiresDisclaimer);
    const article = {
      title: params.title,
      slug: params.slug,
      standfirst: params.rawText.slice(0, 160).trim(),
      body: params.rawText,
      keyFacts: params.facts,
      analysis: params.analysis,
      sources: params.sources,
      cta: "Explore real-time data & quantitative signals on Drawdown Trading.",
      disclaimer: articleDisclaimer
    };

    // 2. Instagram representation (Carousel with 4-5 structured slides)
    const slides = [
      {
        slideNumber: 1,
        type: 'hook' as const,
        header: params.title,
        body: "The headline is simple. The interesting part is what happens next."
      },
      {
        slideNumber: 2,
        type: 'context' as const,
        header: "The Baseline Data",
        body: params.facts[0] || "Key economic and quantitative parameters."
      },
      {
        slideNumber: 3,
        type: 'analysis' as const,
        header: "Institutional Perspective",
        body: params.analysis.slice(0, 180)
      },
      {
        slideNumber: 4,
        type: 'takeaway' as const,
        header: "Drawdown Takeaway",
        body: "Protect your capital. The market reaction matters less than the historical pattern underneath it."
      }
    ];

    const instagramCaption = `${params.title}\n\n${params.analysis}\n\nKey Facts:\n${params.facts.map(f => `• ${f}`).join('\n')}\n\nSource: ${params.sources.join(', ') || 'Drawdown Quantitative Terminal'}\n\n${baseHashtags.join(' ')}`;

    const instagram = {
      hook: params.title,
      caption: instagramCaption,
      slides,
      hashtags: baseHashtags,
      visualFamily: family,
      aspectRatio: '4:5' as const,
      cta: "Link in bio for detailed data and signal models.",
      sourceFooter: `Source: ${params.sources[0] || 'Official exchange disclosure'}`
    };

    // 3. X (Twitter) representation (< 280 chars post, or thread)
    const xPost = `${params.title}\n\n${params.facts[0] || params.analysis.slice(0, 100)}\n\nThe interesting part is what happens next.\n\n${baseHashtags.slice(0, 2).join(' ')}`;
    const xThread = [
      xPost,
      `Analysis: ${params.analysis.slice(0, 240)}`,
      `Sources: ${params.sources.join(', ') || 'Primary filings'}. More analysis on drawdown.trading`
    ];

    const x = {
      singlePost: xPost.slice(0, 280),
      thread: xThread,
      hashtags: baseHashtags.slice(0, 2)
    };

    // 4. LinkedIn representation (Institutional long-form)
    const linkedin = {
      longFormCommentary: `${params.title}\n\n${params.facts.map(f => `• ${f}`).join('\n')}\n\nAnalysis & Historical Parallels:\n${params.analysis}\n\nIn trading, market reactions matter far less than the probabilistic patterns underneath them. Risk management first.\n\n${baseHashtags.join(' ')}`,
      sourcesSection: `Primary Sources: ${params.sources.join(', ') || 'Regulatory announcements'}`,
      cta: "Read full analysis on drawdown.trading"
    };

    // 5. Threads representation (Conversational, intelligent)
    const threads = {
      concisePost: `${params.title}\n\n${params.facts[0] || ''}\n\n${params.analysis.slice(0, 200)}`
    };

    return {
      article,
      instagram,
      x,
      linkedin,
      threads
    };
  }
}
