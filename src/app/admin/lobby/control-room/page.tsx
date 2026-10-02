import { LobbyControlRoomService } from "@/lib/data-platform/control-room";
import { ControlRoomClient } from "./ControlRoomClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Data Control Room | The Lobby Admin | Drawdown",
  description: "Operational telemetry, feed health, and pipeline audit control room.",
};

export default async function DataControlRoomPage() {
  const providers = LobbyControlRoomService.getProviderInventory();
  const freshness = LobbyControlRoomService.getDataFreshness();
  const funnel = LobbyControlRoomService.getPipelineFunnel();
  const alerts = LobbyControlRoomService.getSystemAlerts();

  return (
    <ControlRoomClient
      initialProviders={providers}
      initialFreshness={freshness}
      initialFunnel={funnel}
      initialAlerts={alerts}
    />
  );
}
