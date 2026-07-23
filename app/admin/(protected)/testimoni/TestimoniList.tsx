"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { extractYoutubeId, extractInstagramShortcode, extractTikTokId } from "@/lib/video";
import { revalidateTestimonials } from "@/lib/revalidate";
import { DeleteButton } from "../paket/DeleteButton";

const PLATFORMS = [
  { value: "youtube", label: "YouTube" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
];

export function TestimoniList() {
  const supabase = createClient();
  const [items, setItems] = useState<any[]>([]);
  const [type, setType] = useState<"video" | "image">("video");
  const [form, setForm] = useState({ jamaah_name: "", platform: "youtube", video_url: "", description_id: "", description_en: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [editImage, setEditImage] = useState<{ image_url: string; image_path: string } | null>(null);

  const fetchItems = async () => {
    const result = await (supabase.from("testimonials") as any).select("*").order("order_index");
    if (result.data) setItems(result.data);
  };

  useEffect(() => { fetchItems(); }, []);

  const resetForm = () => {
    setForm({ jamaah_name: "", platform: "youtube", video_url: "", description_id: "", description_en: "" });
    setType("video");
    setFile(null);
    setEditImage(null);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const sb = supabase as any;

    if (type === "video") {
      const id = extractYoutubeId(form.video_url) || extractInstagramShortcode(form.video_url) || extractTikTokId(form.video_url);
      if (!id) {
        alert("URL tidak valid");
        setLoading(false);
        return;
      }

      const data: Record<string, any> = {
        type: "video",
        jamaah_name: form.jamaah_name,
        youtube_url: form.video_url,
        youtube_id: id,
        platform: form.platform,
        description: { id: form.description_id, en: form.description_en || null },
      };

      if (editingId) {
        const { error } = await sb.from("testimonials").update(data).eq("id", editingId);
        if (error) {
          alert("Gagal menyimpan testimoni: " + error.message);
          setLoading(false);
          return;
        }
      } else {
        const allRes = await sb.from("testimonials").select("order_index").order("order_index", { ascending: false }).limit(1);
        const all = allRes.data;
        const maxOrder = (all && all[0]?.order_index) || 0;
        const { error } = await sb.from("testimonials").insert({ ...data, order_index: maxOrder + 1 });
        if (error) {
          alert("Gagal menambah testimoni: " + error.message);
          setLoading(false);
          return;
        }
      }
    } else {
      let imageUrl = editImage?.image_url || "";
      let imagePath = editImage?.image_path || "";

      if (file) {
        setUploading(true);
        const ext = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const filePath = fileName;

        const { error: uploadError } = await supabase.storage.from("testimoni").upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

        if (uploadError) {
          alert("Gagal upload foto: " + uploadError.message);
          setUploading(false);
          setLoading(false);
          return;
        }

        const { data: pubData } = supabase.storage.from("testimoni").getPublicUrl(filePath);
        imageUrl = pubData?.publicUrl || "";
        imagePath = filePath;
        setUploading(false);
      } else if (!editingId) {
        alert("Pilih foto terlebih dahulu");
        setLoading(false);
        return;
      }

      const data: Record<string, any> = {
        type: "image",
        jamaah_name: form.jamaah_name,
        image_url: imageUrl,
        image_path: imagePath,
        description: { id: form.description_id, en: form.description_en || null },
      };

      if (editingId) {
        const { error } = await sb.from("testimonials").update(data).eq("id", editingId);
        if (error) {
          alert("Gagal menyimpan testimoni: " + error.message);
          setLoading(false);
          return;
        }
      } else {
        const allRes = await sb.from("testimonials").select("order_index").order("order_index", { ascending: false }).limit(1);
        const all = allRes.data;
        const maxOrder = (all && all[0]?.order_index) || 0;
        const { error } = await sb.from("testimonials").insert({ ...data, order_index: maxOrder + 1 });
        if (error) {
          alert("Gagal menambah testimoni: " + error.message);
          setLoading(false);
          return;
        }
      }
    }

    await revalidateTestimonials();
    resetForm();
    setLoading(false);
    fetchItems();
  };

  const edit = (item: any) => {
    setType(item.type || "video");
    setForm({
      jamaah_name: item.jamaah_name || "",
      platform: item.platform || "youtube",
      video_url: item.youtube_url || "",
      description_id: (item.description as any)?.id || "",
      description_en: (item.description as any)?.en || "",
    });
    setFile(null);
    setEditImage(item.type === "image" ? { image_url: item.image_url, image_path: item.image_path } : null);
    setEditingId(item.id);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl border border-line space-y-3">
        <h3 className="font-semibold">{editingId ? "Edit Testimoni" : "Tambah Testimoni"}</h3>

        <input
          type="text"
          placeholder="Nama Jamaah"
          value={form.jamaah_name}
          onChange={(e) => setForm({ ...form, jamaah_name: e.target.value })}
          className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
        />

        <div className="flex gap-2">
          <button type="button" onClick={() => { setType("video"); setFile(null); }} className={`px-3 py-2 rounded-lg text-sm font-medium border ${type === "video" ? "bg-green text-white border-green" : "border-line"}`}>
            Video
          </button>
          <button type="button" onClick={() => { setType("image"); setForm({ ...form, video_url: "" }); }} className={`px-3 py-2 rounded-lg text-sm font-medium border ${type === "image" ? "bg-green text-white border-green" : "border-line"}`}>
            Foto
          </button>
        </div>

        {type === "video" ? (
          <>
            <select
              value={form.platform}
              onChange={(e) => setForm({ ...form, platform: e.target.value, video_url: "" })}
              className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-green text-sm"
            >
              {PLATFORMS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>

            <input
              type="url"
              placeholder={form.platform === "youtube" ? "URL YouTube *" : form.platform === "instagram" ? "URL Instagram *" : "URL TikTok *"}
              value={form.video_url}
              onChange={(e) => setForm({ ...form, video_url: e.target.value })}
              className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
              required
            />
          </>
        ) : (
          <div>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              ref={fileRef}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
            />
            {file && <p className="text-xs text-muted mt-1">{file.name} ({(file.size / 1024).toFixed(1)} KB)</p>}
          </div>
        )}

        <textarea
          placeholder="Deskripsi (ID)"
          value={form.description_id}
          onChange={(e) => setForm({ ...form, description_id: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
        />
        <textarea
          placeholder="Deskripsi (EN)"
          value={form.description_en}
          onChange={(e) => setForm({ ...form, description_en: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
        />

        <div className="flex gap-2">
          <button type="submit" disabled={loading || uploading} className="btn btn-primary text-sm">
            {uploading ? "Uploading..." : loading ? "Menyimpan..." : editingId ? "Simpan" : "Tambah"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="btn btn-ghost text-sm">
              Batal
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-xl border border-line overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-bg border-b border-line">
              <th className="text-left p-3 font-semibold">Nama</th>
              <th className="text-left p-3 font-semibold">Tipe</th>
              <th className="text-left p-3 font-semibold">Konten</th>
              <th className="text-right p-3 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-line last:border-0">
                <td className="p-3">{item.jamaah_name || "-"}</td>
                <td className="p-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${item.type === "image" ? "bg-blue-100 text-blue-700" : "bg-bg"}`}>
                    {item.type === "image" ? "Foto" : item.platform || "video"}
                  </span>
                </td>
                <td className="p-3 text-muted truncate max-w-xs">
                  {item.type === "image" ? item.image_url : item.youtube_url}
                </td>
                <td className="p-3 text-right">
                  <button onClick={() => edit(item)} className="text-green font-medium hover:underline mr-3">
                    Edit
                  </button>
                  <DeleteButton id={item.id} type="testimoni" onDeleted={fetchItems} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
