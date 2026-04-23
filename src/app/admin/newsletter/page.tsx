import { getNewsletterStats } from "@/lib/newsletter/admin-data";
import { NewsletterDashboardClient } from "@/components/admin/newsletter/NewsletterDashboard";

export default async function AdminNewsletterPage() {
  const data = await getNewsletterStats();

  return (
    <NewsletterDashboardClient data={data} />
  );
}
