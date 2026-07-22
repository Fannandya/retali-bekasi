import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const { count: pkgCount } = await supabase
    .from("packages").select("*", { count: "exact", head: true }) as unknown as { count: number };
  const { count: newsCount } = await supabase
    .from("news").select("*", { count: "exact", head: true }) as unknown as { count: number };
  const { count: testimoniCount } = await supabase
    .from("testimonials").select("*", { count: "exact", head: true }) as unknown as { count: number };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <Link href="/admin/paket" className="bg-white p-6 rounded-xl border border-line hover:shadow-sm transition block">
          <p className="text-sm text-muted">Paket</p>
          <p className="text-3xl font-bold mt-1">{pkgCount ?? 0}</p>
        </Link>
        <Link href="/admin/kabar" className="bg-white p-6 rounded-xl border border-line hover:shadow-sm transition block">
          <p className="text-sm text-muted">Kabar</p>
          <p className="text-3xl font-bold mt-1">{newsCount ?? 0}</p>
        </Link>
        <Link href="/admin/testimoni" className="bg-white p-6 rounded-xl border border-line hover:shadow-sm transition block">
          <p className="text-sm text-muted">Testimoni</p>
          <p className="text-3xl font-bold mt-1">{testimoniCount ?? 0}</p>
        </Link>
      </div>
    </div>
  );
}
