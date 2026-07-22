import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export function AdminNav() {
  return (
    <header className="bg-white border-b border-line">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-bold text-green">
            Admin Panel
          </Link>
          <nav className="flex gap-4 text-sm font-medium">
            <Link href="/admin">Dashboard</Link>
            <Link href="/admin/paket">Paket</Link>
            <Link href="/admin/kabar">Kabar</Link>
            <Link href="/admin/testimoni">Testimoni</Link>
            <Link href="/admin/pengaturan">Pengaturan</Link>
          </nav>
        </div>
        <form action={handleLogout}>
          <button type="submit" className="btn btn-ghost text-sm">
            Logout
          </button>
        </form>
      </div>
    </header>
  );
}

async function handleLogout() {
  "use server";
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
