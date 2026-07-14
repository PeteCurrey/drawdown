import { createInternalSupabase } from "@/lib/supabase/server";
import { SubscribersClient } from "@/components/admin/subscribers/SubscribersClient";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

export default async function AdminSubscribersPage({ searchParams }: Props) {
  const params = await searchParams;
  const searchQuery = params.search || "";
  const currentPage = parseInt(params.page || "1");
  const limit = 50;
  const from = (currentPage - 1) * limit;
  const to = from + limit - 1;

  const supabase = createInternalSupabase();

  // Build query
  let query = supabase
    .from("email_subscribers")
    .select("*", { count: "exact" })
    .order("subscribed_at", { ascending: false });

  if (searchQuery) {
    query = query.ilike("email", `%${searchQuery}%`);
  }

  const { data: subscribers, count, error } = await query.range(from, to);

  if (error) {
    console.error("Failed to fetch subscribers:", error);
  }

  const totalRecords = count || 0;
  const totalPages = Math.ceil(totalRecords / limit);

  return (
    <SubscribersClient
      subscribers={subscribers || []}
      totalRecords={totalRecords}
      currentPage={currentPage}
      totalPages={totalPages}
      searchQuery={searchQuery}
      from={from}
      to={to}
    />
  );
}
