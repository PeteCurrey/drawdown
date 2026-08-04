import { createInternalSupabase, createClient } from "@/lib/supabase/server";
import { ApplicationsInboxClient, AcceleratorApplication } from "@/components/admin/ApplicationsInboxClient";

export default async function ApplicationsInboxPage() {
  const supabase = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createInternalSupabase()
    : await createClient();

  let applications: AcceleratorApplication[] = [];
  let dbError: any = null;

  try {
    const { data, error } = await supabase
      .from('accelerator_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      dbError = error;
      console.error("Database query returned error for accelerator_applications:", error);
    } else {
      applications = data || [];
    }
  } catch (err: any) {
    dbError = err;
    console.error("Database connection exception for accelerator_applications:", err);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] animate-in fade-in duration-700">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold uppercase mb-2 text-mkt-ink">Accelerator Applications</h1>
        <p className="text-xs text-text-tertiary">Evaluate candidates, manage cohort enrollment status, and record private evaluation notes.</p>
      </div>

      {dbError && (
        <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 text-xs px-5 py-4 rounded leading-relaxed font-mono shadow-sm">
          <strong className="text-amber-900 block mb-1">⚠️ Schema Action Required</strong>
          The database table <code className="bg-amber-100/80 px-1 py-0.5 rounded font-bold">accelerator_applications</code> is missing or inaccessible. 
          Please ensure you execute the migration SQL file located at:
          <div className="mt-2 text-neutral-600 bg-white/70 p-2 rounded border border-amber-100 font-mono text-[10px] truncate select-all">
            supabase/migrations/20260804_create_accelerator_applications.sql
          </div>
          <div className="mt-2 text-neutral-500">
            Once executed in your Supabase SQL editor, this warning will resolve and submitted candidate dossiers will synchronize here automatically.
          </div>
        </div>
      )}

      <ApplicationsInboxClient initialApplications={applications} />
    </div>
  );
}
