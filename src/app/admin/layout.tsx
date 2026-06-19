import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // 1. Verify User is Authenticated Admin
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const adminEmail = process.env.ADMIN_EMAIL || "petecurrey@gmail.com";

  if (!user || user.email !== adminEmail) {
    redirect("/dashboard");
  }

  return (
    <div className="pt-32 pb-24 bg-mkt-bg min-h-screen text-mkt-ink">
      <div className="container mx-auto px-6 max-w-[1600px]">
        <div className="flex flex-col lg:flex-row gap-12">
          <AdminSidebar />
          <div className="flex-grow min-w-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
