import { getAdminStats } from "@/lib/admin-data";
import { AdminIntelligenceClient } from "@/components/admin/AdminIntelligenceClient";

export default async function AdminIntelligencePage() {
  const stats = await getAdminStats();

  return (
    <AdminIntelligenceClient 
      stats={{
        competitors: stats.competitors || [],
        intelligence: stats.intelligence || []
      }} 
    />
  );
}
