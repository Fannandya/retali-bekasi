"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { revalidatePackages, revalidateNews, revalidateTestimonials } from "@/lib/revalidate";

export function DeleteButton({ id, type }: { id: string; type: string }) {
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus?")) return;

    if (type === "paket") {
      const result = await (supabase as any)
        .from("packages")
        .select("brochure_path, itinerary_path")
        .eq("id", id)
        .single();
      const pkg: { brochure_path: string | null; itinerary_path: string | null } | null = result.data;
      const paths = [pkg?.brochure_path, pkg?.itinerary_path].filter(Boolean) as string[];
      for (const path of paths) {
        await supabase.storage.from("brochures").remove([path]);
      }
      await (supabase as any).from("packages").delete().eq("id", id);
      await revalidatePackages();
    } else if (type === "news") {
      const result = await (supabase as any).from("news").select("cover_path").eq("id", id).single();
      const item: { cover_path: string | null } | null = result.data;
      if (item?.cover_path) {
        await supabase.storage.from("news-images").remove([item.cover_path]);
      }
      await (supabase as any).from("news").delete().eq("id", id);
      await revalidateNews();
    } else if (type === "testimoni") {
      const result = await (supabase as any).from("testimonials").select("image_path, type").eq("id", id).single();
      const item: { image_path: string | null; type: string } | null = result.data;
      if (item?.type === "image" && item?.image_path) {
        await supabase.storage.from("testimoni").remove([item.image_path]);
      }
      await (supabase as any).from("testimonials").delete().eq("id", id);
      await revalidateTestimonials();
    }

    router.refresh();
  };

  return (
    <button onClick={handleDelete} className="text-red-600 font-medium hover:underline">
      Hapus
    </button>
  );
}
