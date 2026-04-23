import { getAdminStats } from "@/lib/admin-data";
import { AdminMarketingClient } from "@/components/admin/AdminMarketingClient";

export default async function AdminMarketingPage() {
  const stats = await getAdminStats();

  return (
    <AdminMarketingClient 
      stats={{
        totalSEOViews: stats.totalSEOViews,
        pagePerformance: stats.pagePerformance,
        clickPerformance: stats.clickPerformance
      }} 
    />
  );
}
