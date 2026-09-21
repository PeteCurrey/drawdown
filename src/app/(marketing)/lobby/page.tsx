import type { Metadata } from "next";
import { getMetadata, siteConfig } from "@/lib/metadata";
import { StructuredData, defaultOrgSchema } from "@/components/StructuredData";
import { LobbyHero } from "@/components/lobby/LobbyHero";
import { LobbyMasthead } from "@/components/lobby/LobbyMasthead";
import { LobbyNav } from "@/components/lobby/LobbyNav";
import { LobbyLeadStory } from "@/components/lobby/LobbyLeadStory";
import { LobbyWhatsHappening } from "@/components/lobby/LobbyWhatsHappening";
import { LobbyComingUp } from "@/components/lobby/LobbyComingUp";
import { LobbyWatchlist } from "@/components/lobby/LobbyWatchlist";
import { LobbyBrokerWatch } from "@/components/lobby/LobbyBrokerWatch";
import { LobbyPropFirmWatch } from "@/components/lobby/LobbyPropFirmWatch";
import { LobbyPlatformSpotlight } from "@/components/lobby/LobbyPlatformSpotlight";
import { LobbyTradeOfTheMonth } from "@/components/lobby/LobbyTradeOfTheMonth";
import { LobbyDrawdownDesk } from "@/components/lobby/LobbyDrawdownDesk";
import { LobbyExplained } from "@/components/lobby/LobbyExplained";
import { LobbyLatestStream } from "@/components/lobby/LobbyLatestStream";
import { 
  getLobbyLeadStory, 
  getLobbyArticles 
} from "@/lib/lobby";
import { createInternalSupabase } from "@/lib/supabase/server";
import { getUserPreferences, buildPersonalLobbyFeed, getDefaultPreferences } from "@/lib/lobby-personalisation";
import { YourLobbyFeed } from "@/components/lobby/YourLobbyFeed";

export const metadata: Metadata = getMetadata({
  title: "The Lobby — Market Intelligence & Trading Industry Publication",
  description: "What's happening in markets, trading and the businesses built around them. Broadsheet reporting, verified broker audits, prop firm surveillance, and Drawdown research.",
  path: "/lobby",
  hasRegionalVariants: false,
});

export const revalidate = 60; // Revalidate every minute for timely market dispatches

export default async function LobbyHomePage({
  searchParams
}: {
  searchParams?: Promise<{ view?: string }>;
}) {
  const params = await searchParams;
  const isYourLobby = params?.view === "your-lobby";
  // Fetch editorial articles concurrently across sections
  const [
    leadStory,
    whatsHappeningArticles,
    justInArticles,
    brokerWatchArticles,
    propFirmWatchArticles,
    platformArticles,
    drawdownDeskArticles,
    explainedArticles,
    allLatestArticles
  ] = await Promise.all([
    getLobbyLeadStory(),
    getLobbyArticles({ section: "whats_happening", limit: 4 }),
    getLobbyArticles({ section: "just_in", limit: 8 }),
    getLobbyArticles({ section: "broker_watch", limit: 6 }),
    getLobbyArticles({ section: "prop_firm_watch", limit: 6 }),
    getLobbyArticles({ section: "platform_spotlight", limit: 1 }),
    getLobbyArticles({ section: "drawdown_desk", limit: 3 }),
    getLobbyArticles({ section: "explained", limit: 4 }),
    getLobbyArticles({ limit: 15 }),
  ]);

  // Extract structured metadata for specialized sections if present in articles
  const brokerWatchData = brokerWatchArticles.map(a => ({
    broker_name: a.editorial_metadata?.broker_name || a.related_broker_slugs?.[0]?.toUpperCase() || a.category,
    story_headline: a.title,
    what_changed: a.editorial_metadata?.what_changed || a.excerpt,
    effective_date: a.editorial_metadata?.effective_date || (a.published_at ? new Date(a.published_at).toLocaleDateString('en-GB') : "Effective Now"),
    source_citation: a.primary_source_name || "Official Regulatory Filing",
    broker_slug: a.related_broker_slugs?.[0]
  }));

  const propFirmWatchData = propFirmWatchArticles.map(a => ({
    company: a.editorial_metadata?.company || a.related_prop_firm_slugs?.[0]?.toUpperCase() || a.category,
    change_update: a.title,
    effective_date: a.editorial_metadata?.effective_date || (a.published_at ? new Date(a.published_at).toLocaleDateString('en-GB') : "Immediate"),
    previous_state: a.editorial_metadata?.previous_state || "Previous rule parameters",
    current_state: a.editorial_metadata?.current_state || a.excerpt,
    source_citation: a.primary_source_name || "Firm Official Release",
    prop_firm_slug: a.related_prop_firm_slugs?.[0]
  }));

  let personalFeedData = null;
  let userPrefs = getDefaultPreferences("anon");
  if (isYourLobby) {
    const supabase = await createInternalSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      userPrefs = await getUserPreferences(user.id);
      personalFeedData = buildPersonalLobbyFeed({
        userName: user.user_metadata?.full_name || user.email?.split("@")[0] || "Trader",
        preferences: userPrefs,
        allArticles: allLatestArticles,
        allEvents: [],
      });
    } else {
      personalFeedData = buildPersonalLobbyFeed({
        userName: "Guest Trader",
        preferences: userPrefs,
        allArticles: allLatestArticles,
        allEvents: [],
      });
    }
  }

  return (
    <div className="w-full bg-[#FFFFFF] min-h-screen text-[#0B0E12] font-sans selection:bg-[#16213E] selection:text-[#FFFFFF]">
      {/* Structured Data: WebSite & Organization */}
      <StructuredData
        type="WebSite"
        data={{
          name: "The Lobby | Drawdown",
          url: `${siteConfig.url}/lobby`,
          description: "What's happening in markets, trading and the businesses built around them.",
          publisher: defaultOrgSchema,
        }}
      />
      <StructuredData type="Organization" data={defaultOrgSchema} />

      {/* 1. Full-Screen Penthouse Hero Section */}
      <LobbyHero leadStory={leadStory} />

      <div id="lobby-content">
        {/* 2. Secondary Sticky Editorial Navigation */}
        <LobbyNav />

        {/* 3. Broadsheet Masthead */}
        <LobbyMasthead />
      </div>

      {isYourLobby && personalFeedData ? (
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-10">
          <YourLobbyFeed feed={personalFeedData} userPreferences={userPrefs} />
        </div>
      ) : (
        <>
          {/* 3. Dominant Lead Story */}
          <LobbyLeadStory article={leadStory} />

          {/* 4. What's Happening & Just In Newsroom Grid */}
          <LobbyWhatsHappening 
            articles={whatsHappeningArticles} 
            justInArticles={justInArticles} 
          />

          {/* 5. Coming Up Timetable */}
          <LobbyComingUp events={[]} />

          {/* 6. What's Worth Watching Briefs */}
          <LobbyWatchlist items={[]} />

          {/* 7. Broker Watch */}
          <LobbyBrokerWatch entries={brokerWatchData} />

          {/* 8. Prop Firm Watch */}
          <LobbyPropFirmWatch entries={propFirmWatchData} />

          {/* 9. Platform Spotlight */}
          <LobbyPlatformSpotlight article={platformArticles[0] || null} />

          {/* 10. Trade of the Month */}
          <LobbyTradeOfTheMonth trade={null} />

          {/* 11. Drawdown Desk Original Research */}
          <LobbyDrawdownDesk articles={drawdownDeskArticles} />

          {/* 12. Explained Evergreen Education */}
          <LobbyExplained articles={explainedArticles} />

          {/* 13. Latest Chronological Stream with Filters */}
          <LobbyLatestStream initialArticles={allLatestArticles} />
        </>
      )}
    </div>
  );
}
