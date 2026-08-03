import { createInternalSupabase } from "@/lib/supabase/server";
import { EmailsClient } from "@/components/admin/emails/EmailsClient";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{
    type?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function AdminEmailsPage({ searchParams }: Props) {
  const params = await searchParams;
  const typeFilter = params.type || "all";
  const statusFilter = params.status || "all";
  const currentPage = parseInt(params.page || "1");
  const limit = 20;
  const from = (currentPage - 1) * limit;
  const to = from + limit - 1;

  const supabase = createInternalSupabase();

  // Build Query
  let query = supabase
    .from("email_sends")
    .select("*", { count: "exact" })
    .order("generated_at", { ascending: false });

  if (typeFilter !== "all") {
    query = query.eq("type", typeFilter);
  }
  if (statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  const { data: sends, count, error } = await query.range(from, to);

  if (error) {
    console.error("Failed to query email sends:", error);
  }

  const totalRecords = count || 0;
  const totalPages = Math.ceil(totalRecords / limit);

  return (
    <EmailsClient
      sends={sends || []}
      totalRecords={totalRecords}
      currentPage={currentPage}
      totalPages={totalPages}
      typeFilter={typeFilter}
      statusFilter={statusFilter}
      from={from}
      to={to}
    />
  );
}
