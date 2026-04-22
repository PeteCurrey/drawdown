import { createClient } from "@/lib/supabase/server";
import { LeadsInboxClient } from "@/components/admin/LeadsInboxClient";

export default async function LeadsInboxPage() {
  const supabase = await createClient();
  
  const { data: leads, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] animate-in fade-in duration-700">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold uppercase mb-2">Lead Inbox</h1>
        <p className="text-xs text-text-tertiary">Manage enterprise inquiries and priority communications.</p>
      </div>

      <LeadsInboxClient initialLeads={leads || []} />
    </div>
  );
}
