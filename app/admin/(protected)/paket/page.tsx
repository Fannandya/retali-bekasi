import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { pickLocale } from "@/lib/pickLocale";
import { formatRupiah } from "@/lib/format";
import { DeleteButton } from "./DeleteButton";

export const dynamic = 'force-dynamic';

export default async function AdminPaketPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const supabase = await createClient();
  const currentPage = page ? parseInt(page, 10) : 1;
  const itemsPerPage = 20;
  const from = (currentPage - 1) * itemsPerPage;

  const result = await (supabase
    .from("packages")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + itemsPerPage - 1)) as unknown as { data: any[] | null; count: number | null };
  const packages = result.data;
  const count = result.count;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Paket</h1>
        <Link href="/admin/paket/tambah" className="btn btn-primary">
          + Tambah Paket
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-line overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-bg border-b border-line">
              <th className="text-left p-3 font-semibold">Nama</th>
              <th className="text-left p-3 font-semibold">Tipe</th>
              <th className="text-left p-3 font-semibold">Harga</th>
              <th className="text-left p-3 font-semibold">Kuota</th>
              <th className="text-left p-3 font-semibold">Status</th>
              <th className="text-right p-3 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {packages?.map((pkg) => (
              <tr key={pkg.id} className="border-b border-line last:border-0">
                <td className="p-3 font-medium">{pickLocale(pkg.name, "id")}</td>
                <td className="p-3">
                  <span className={`badge ${pkg.type === "haji" ? "haji" : ""}`}>
                    {pkg.type}
                  </span>
                </td>
                <td className="p-3">{formatRupiah(pkg.price)}</td>
                <td className="p-3">
                  {pkg.total_quota !== null
                    ? `${pkg.remaining_quota}/${pkg.total_quota}`
                    : "-"}
                </td>
                <td className="p-3">{pkg.status}</td>
                <td className="p-3 text-right">
                  <Link
                    href={`/admin/paket/${pkg.id}/edit`}
                    className="text-green font-medium hover:underline mr-3"
                  >
                    Edit
                  </Link>
                  <DeleteButton id={pkg.id} type="paket" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
