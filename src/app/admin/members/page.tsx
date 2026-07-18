import { createClient } from "@/lib/supabase/server";
import { createServerClient } from "@supabase/ssr";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{
    tab?: string;
  }>;
}

export default async function AdminMembersPage({ searchParams }: Props) {
  const params = await searchParams;
  const activeTab = params.tab || "roster";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const adminEmail = process.env.ADMIN_EMAIL || "petecurrey@gmail.com";
  if (!user || user.email !== adminEmail) {
    redirect("/dashboard");
  }

  const supabaseAdmin = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll() { return [] }, setAll() {} } }
  );

  let content;

  if (activeTab === "waitlist") {
    const { data: waitlist } = await supabaseAdmin
      .from("floor_waitlist")
      .select("*")
      .order("created_at", { ascending: false });

    content = (
      <div className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-[#e5e7eb]">
            <tr>
              <th className="px-6 py-4 font-mono font-bold text-[10px] text-[#6b7280] uppercase tracking-widest">Email</th>
              <th className="px-6 py-4 font-mono font-bold text-[10px] text-[#6b7280] uppercase tracking-widest">Date Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e7eb]">
            {(waitlist || []).map(w => (
              <tr key={w.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-[#1A1A1A] font-medium">{w.email}</td>
                <td className="px-6 py-4 text-[#6b7280]">{new Date(w.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {(!waitlist || waitlist.length === 0) && (
              <tr>
                <td colSpan={2} className="px-6 py-8 text-center text-[#9ca3af]">No users on the waitlist.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  } else {
    // Roster
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
    
    // Merge
    const merged = (profiles || []).map(p => {
      const authUser = usersData?.users.find(u => u.id === p.id);
      return {
        ...p,
        email: authUser?.email || "Unknown",
      };
    });

    content = (
      <div className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[800px]">
          <thead className="bg-gray-50 border-b border-[#e5e7eb]">
            <tr>
              <th className="px-6 py-4 font-mono font-bold text-[10px] text-[#6b7280] uppercase tracking-widest">User</th>
              <th className="px-6 py-4 font-mono font-bold text-[10px] text-[#6b7280] uppercase tracking-widest">Tier</th>
              <th className="px-6 py-4 font-mono font-bold text-[10px] text-[#6b7280] uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 font-mono font-bold text-[10px] text-[#6b7280] uppercase tracking-widest">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e7eb]">
            {merged.map(m => (
              <tr key={m.id} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-6 py-4">
                  <div className="text-[#1A1A1A] font-bold">{m.display_name || "Unknown"}</div>
                  <div className="text-[#6b7280] text-xs">{m.email}</div>
                  <div className="text-[#9ca3af] text-[10px] font-mono mt-1">{m.stripe_customer_id || "No Stripe ID"}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded ${
                    m.subscription_tier === 'floor' ? 'bg-[#F9771D]/10 text-[#F9771D]' :
                    m.subscription_tier === 'edge' ? 'bg-[#06b6d4]/10 text-[#06b6d4]' :
                    m.subscription_tier === 'foundation' ? 'bg-[#6366f1]/10 text-[#6366f1]' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {m.subscription_tier || "Free"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded ${
                    m.subscription_status === 'active' ? 'bg-green-100 text-green-700' :
                    m.subscription_status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {m.subscription_status || "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 text-[#6b7280] whitespace-nowrap">
                  {new Date(m.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-mkt-ink">Members Roster</h1>
          <p className="text-sm text-mkt-i3 mt-2">Manage your student base, subscriptions, and waitlist.</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#e5e7eb]">
        <Link
          href="?tab=roster"
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "roster"
              ? "border-mkt-ink text-mkt-ink"
              : "border-transparent text-[#6b7280] hover:text-[#1A1A1A]"
          }`}
        >
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Active Roster
          </div>
        </Link>
        <Link
          href="?tab=waitlist"
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "waitlist"
              ? "border-mkt-ink text-mkt-ink"
              : "border-transparent text-[#6b7280] hover:text-[#1A1A1A]"
          }`}
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Floor Waitlist
          </div>
        </Link>
      </div>

      {content}
    </div>
  );
}
