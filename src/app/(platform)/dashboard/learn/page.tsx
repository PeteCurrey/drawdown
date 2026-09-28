import { createClient } from "@/lib/supabase/server";
import { LearnArchiveClient, RecordedSession } from "@/components/dashboard/LearnArchiveClient";

export default async function LearnArchivePage() {
  const supabase = await createClient();
  const { data: sessions } = await supabase
    .from("recorded_sessions")
    .select("id, title, description, video_url, duration, category, created_at")
    .order("created_at", { ascending: false });

  return <LearnArchiveClient initialSessions={(sessions as RecordedSession[]) ?? []} />;
}
