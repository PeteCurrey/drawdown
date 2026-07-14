import { createInternalSupabase } from "@/lib/supabase/server";
import { AdminSettingsClient } from "@/components/admin/settings/AdminSettingsClient";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = createInternalSupabase();

  const { data: profile } = await supabase
    .from("author_profiles")
    .select("id, name, role, bio, avatar_url")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return <AdminSettingsClient profile={profile} />;
}
