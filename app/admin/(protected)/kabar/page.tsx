import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { pickLocale } from "@/lib/pickLocale";
import { DeleteButton } from "../paket/DeleteButton";

export const dynamic = 'force-dynamic';

export default async function AdminKabarPage() {
  const supabase = await createClient();
  const { data: news } = await (supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false })) as unknown as { data: any[] | null };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Kabar</h1>
        <Link href="/admin/kabar/tambah" className="btn btn-primary">
          + Tambah Kabar
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-line overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-bg border-b border-line">
              <th className="text-left p-3 font-semibold">Judul</th>
              <th className="text-left p-3 font-semibold">Status</th>
              <th className="text-left p-3 font-semibold">Tanggal</th>
              <th className="text-right p-3 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {news?.map((item) => (
              <tr key={item.id} className="border-b border-line last:border-0">
                <td className="p-3 font-medium">{pickLocale(item.title, "id")}</td>
                <td className="p-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${item.is_published ? "bg-green/10 text-green" : "bg-muted/10 text-muted"}`}>
                    {item.is_published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="p-3">{item.published_at || "-"}</td>
                <td className="p-3 text-right">
                  <Link href={`/admin/kabar/${item.id}/edit`} className="text-green font-medium hover:underline mr-3">
                    Edit
                  </Link>
                  <DeleteButton id={item.id} type="news" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
