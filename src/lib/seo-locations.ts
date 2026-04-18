import locationsData from "@/data/seo/locations.json";
import topicsData from "@/data/seo/topics.json";

export const UK_LOCATIONS = locationsData.locations.map(l => ({
  id: l.slug,
  name: l.name,
  region: l.region
}));

export const TRADING_TOPICS = topicsData.topics.map(t => ({
  id: t.slug,
  title: t.title,
  short: t.title // Using title as short for consistency in this scale-up
}));
