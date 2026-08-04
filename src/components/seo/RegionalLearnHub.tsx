import { RegionalProvider } from "@/components/layout/RegionalLayout";
import { Region } from "@/lib/seo/hreflang";
import { LearnHubClient } from "@/components/learn/LearnHubClient";

interface RegionalLearnHubProps {
  region: Region;
}

export function RegionalLearnHub({ region }: RegionalLearnHubProps) {
  return (
    <RegionalProvider region={region}>
      <LearnHubClient region={region} />
    </RegionalProvider>
  );
}

