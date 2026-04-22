import { getAdminStats } from "@/lib/admin-data";
import { IntegrationsClient } from "./IntegrationsClient";

export default async function IntegrationsManager() {
  const stats = await getAdminStats();

  return <IntegrationsClient health={stats.health} />;
}
