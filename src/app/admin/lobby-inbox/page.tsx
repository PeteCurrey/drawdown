import { Metadata } from "next";
import { LobbyInboxClient } from "./LobbyInboxClient";

export const metadata: Metadata = {
  title: "Lobby Inbox — Monitored Sources Surveillance",
  description: "Ingest and verify external Instagram trading intelligence for The Lobby.",
};

export const dynamic = "force-dynamic";

export default function AdminLobbyInboxPage() {
  return <LobbyInboxClient />;
}
