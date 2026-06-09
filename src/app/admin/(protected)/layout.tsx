import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminSessionProvider from "@/components/admin/AdminSessionProvider";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  // Si no hay sesión y no está en login, redirigir
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <AdminSessionProvider session={session}>
      <div className="flex min-h-screen bg-neutro-50">
        <AdminSidebar />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </AdminSessionProvider>
  );
}
