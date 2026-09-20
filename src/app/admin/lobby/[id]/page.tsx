import { notFound } from "next/navigation";
import { 
  getLobbyArticleByIdAdmin, 
  getLobbyArticleAuditLogs 
} from "@/lib/lobby-admin";
import { LobbyArticleEditor } from "@/components/admin/lobby/LobbyArticleEditor";

export const metadata = {
  title: "Edit Lobby Article | Admin CMS",
  robots: { index: false, follow: false },
};

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditLobbyArticlePage({ params }: EditPageProps) {
  const { id } = await params;
  const article = await getLobbyArticleByIdAdmin(id);

  if (!article) {
    notFound();
  }

  const auditLogs = await getLobbyArticleAuditLogs(id);

  return (
    <LobbyArticleEditor 
      initialArticle={article} 
      auditLogs={auditLogs} 
    />
  );
}
