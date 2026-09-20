import { LobbyArticleEditor } from "@/components/admin/lobby/LobbyArticleEditor";

export const metadata = {
  title: "New Lobby Article | Admin CMS",
  robots: { index: false, follow: false },
};

export default function NewLobbyArticlePage() {
  return <LobbyArticleEditor />;
}
