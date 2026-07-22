import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { PackageForm } from "../../PackageForm";
import type { Database } from "@/types/database";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditPaketPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: raw } = await (supabase
    .from("packages")
    .select("*")
    .eq("id", id)
    .single()) as unknown as { data: Database["public"]["Tables"]["packages"]["Row"] | null };

  if (!raw) notFound();

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Edit Paket</h1>
      <PackageForm pkg={raw} />
    </>
  );
}
