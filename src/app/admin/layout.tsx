import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-32 pb-24 bg-background-primary min-h-screen">
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
