"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/slug";
import { revalidateNews } from "@/lib/revalidate";
import type { Database } from "@/types/database";

type NewsItem = Database["public"]["Tables"]["news"]["Row"];

export function NewsForm({ item }: { item?: NewsItem }) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = !!item;

  const [titleId, setTitleId] = useState(item ? (item.title as any).id : "");
  const [titleEn, setTitleEn] = useState(item ? (item.title as any).en || "" : "");
  const [slug, setSlug] = useState(item?.slug || "");
  const [contentId, setContentId] = useState(item ? (item.content as any)?.id || "" : "");
  const [contentEn, setContentEn] = useState(item ? (item.content as any)?.en || "" : "");
  const [isPublished, setIsPublished] = useState(item?.is_published || false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const newsData = {
      slug,
      title: { id: titleId, en: titleEn || null },
      content: { id: contentId, en: contentEn || null },
      is_published: isPublished,
      published_at: isPublished ? (item?.published_at || new Date().toISOString()) : null,
    };

    if (isEdit && item) {
      let coverUrl = item.cover_url;
      let coverPath = item.cover_path;

      if (coverFile) {
        if (item.cover_path) {
          await supabase.storage.from("news-images").remove([item.cover_path]);
        }
        const ext = coverFile.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${ext}`;
        const filePath = `news/${fileName}`;

        const { error: uploadErr } = await supabase.storage
          .from("news-images")
          .upload(filePath, coverFile);

        if (!uploadErr) {
          const { data: urlData } = supabase.storage.from("news-images").getPublicUrl(filePath);
          coverUrl = urlData.publicUrl;
          coverPath = filePath;
        } else {
          setError(uploadErr.message);
          setLoading(false);
          return;
        }
      }

      const { error: err } = await (supabase
        .from("news") as any)
        .update({ ...newsData, cover_url: coverUrl, cover_path: coverPath })
        .eq("id", item.id);

      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
    } else {
      let coverUrl = "";
      let coverPath = "";

      if (coverFile) {
        const ext = coverFile.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${ext}`;
        const filePath = `news/${fileName}`;

        const { error: uploadErr } = await supabase.storage
          .from("news-images")
          .upload(filePath, coverFile);

        if (!uploadErr) {
          const { data: urlData } = supabase.storage.from("news-images").getPublicUrl(filePath);
          coverUrl = urlData.publicUrl;
          coverPath = filePath;
        } else {
          setError(uploadErr.message);
          setLoading(false);
          return;
        }
      }

      const { error: err } = await (supabase.from("news") as any).insert({
        ...newsData,
        cover_url: coverUrl || null,
        cover_path: coverPath || null,
      });

      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
    }

    await revalidateNews();
    router.push("/admin/kabar");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      {error && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg">{error}</div>}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Judul (ID) *</label>
          <input
            type="text"
            value={titleId}
            onChange={(e) => setTitleId(e.target.value)}
            className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Judul (EN)</label>
          <input
            type="text"
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
          />
        </div>
      </div>

      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
            required
          />
        </div>
        <button type="button" onClick={() => setSlug(slugify(titleId))} className="btn btn-ghost text-sm px-3 py-2">
          Generate
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Konten (ID)</label>
        <textarea
          value={contentId}
          onChange={(e) => setContentId(e.target.value)}
          rows={10}
          className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-green font-mono text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Konten (EN)</label>
        <textarea
          value={contentEn}
          onChange={(e) => setContentEn(e.target.value)}
          rows={10}
          className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-green font-mono text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Gambar Sampul</label>
        <label className="btn btn-ghost cursor-pointer inline-flex items-center gap-2 text-sm">
          Pilih File
          <input
            type="file"
            accept="image/jpeg,image/webp,image/png"
            onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
            className="hidden"
          />
        </label>
        {coverFile && <span className="text-sm text-muted ml-2">{coverFile.name}</span>}
        {isEdit && item?.cover_url && !coverFile && (
          <img src={item.cover_url} alt="" className="w-32 h-20 object-cover rounded-lg mt-2" />
        )}
      </div>

      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium">Publikasikan</span>
        </label>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Kabar"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn btn-ghost">
          Batal
        </button>
      </div>
    </form>
  );
}
