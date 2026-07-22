import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminNav } from "./AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const profileRes = await (supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()) as unknown as { data: { role: string } | null };
  const profile = profileRes.data;

  if (!profile || profile.role !== "admin") {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-bg">
      <AdminNav />
      <div className="max-w-6xl mx-auto px-4 py-8">{children}</div>
    </div>
  );
}
