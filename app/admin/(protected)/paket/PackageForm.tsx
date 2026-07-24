"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/slug";
import { revalidatePackages } from "@/lib/revalidate";
import { uploadToR2, deleteFromR2 } from "@/lib/r2-upload";
import type { Database } from "@/types/database";

type Package = Database["public"]["Tables"]["packages"]["Row"];

export function PackageForm({ pkg }: { pkg?: Package }) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = !!pkg;

  const [nameId, setNameId] = useState(pkg ? (pkg.name as any).id : "");
  const [nameEn, setNameEn] = useState(pkg ? (pkg.name as any).en || "" : "");
  const [slug, setSlug] = useState(pkg?.slug || "");
  const [type, setType] = useState<"umroh" | "haji">(pkg?.type || "umroh");
  const [departureDate, setDepartureDate] = useState(pkg?.departure_date || "");
  const [returnDate, setReturnDate] = useState(pkg?.return_date || "");
  const [price, setPrice] = useState(pkg ? String(pkg.price) : "");
  const [totalQuota, setTotalQuota] = useState(pkg && pkg.total_quota !== null ? String(pkg.total_quota) : "");
  const [remainingQuota, setRemainingQuota] = useState(pkg && pkg.remaining_quota !== null ? String(pkg.remaining_quota) : "");
  const [status, setStatus] = useState(pkg?.status || "available");
  const [isFeatured, setIsFeatured] = useState(pkg?.is_featured || false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [brochureFile, setBrochureFile] = useState<File | null>(null);
  const [itineraryFile, setItineraryFile] = useState<File | null>(null);
  const brochureInputRef = useRef<HTMLInputElement>(null);
  const itineraryInputRef = useRef<HTMLInputElement>(null);

  const handleSlugGenerate = () => {
    setSlug(slugify(nameId));
  };

  const uploadImage = async (file: File, prefix: string): Promise<{ url: string; path: string } | null> => {
    try {
      return await uploadToR2(file, "brochures");
    } catch (err: any) {
      setError(`${prefix}: ${err.message}`);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (new Date(returnDate) < new Date(departureDate)) {
      setError("Tanggal pulang harus setelah atau sama dengan tanggal berangkat");
      setLoading(false);
      return;
    }

    const q = parseInt(totalQuota);
    const r = parseInt(remainingQuota);
    if (totalQuota && remainingQuota && r > q) {
      setError("Sisa kuota tidak boleh melebihi total kuota");
      setLoading(false);
      return;
    }

    const packageData: Record<string, any> = {
      type,
      slug,
      name: { id: nameId, en: nameEn || null },
      departure_date: departureDate,
      return_date: returnDate,
      price: parseFloat(price),
      total_quota: totalQuota ? parseInt(totalQuota) : null,
      remaining_quota: remainingQuota ? parseInt(remainingQuota) : null,
      status,
      is_featured: isFeatured,
    };

    const sb = supabase as any;

    if (isEdit && pkg) {
      if (brochureFile) {
        const result = await uploadImage(brochureFile, "Brosur");
        if (!result) { setLoading(false); return; }
        if (pkg.brochure_path) await deleteFromR2(pkg.brochure_path).catch(() => {});
        packageData.brochure_url = result.url;
        packageData.brochure_path = result.path;
      }
      if (itineraryFile) {
        const result = await uploadImage(itineraryFile, "Itinerary");
        if (!result) { setLoading(false); return; }
        if (pkg.itinerary_path) await deleteFromR2(pkg.itinerary_path).catch(() => {});
        packageData.itinerary_url = result.url;
        packageData.itinerary_path = result.path;
      }

      const { error: err } = await sb.from("packages").update(packageData).eq("id", pkg.id);

      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
    } else {
      if (brochureFile) {
        const result = await uploadImage(brochureFile, "Brosur");
        if (!result) { setLoading(false); return; }
        packageData.brochure_url = result.url;
        packageData.brochure_path = result.path;
      }
      if (itineraryFile) {
        const result = await uploadImage(itineraryFile, "Itinerary");
        if (!result) { setLoading(false); return; }
        packageData.itinerary_url = result.url;
        packageData.itinerary_path = result.path;
      }

      const { error: err } = await sb.from("packages").insert(packageData);

      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
    }

    await revalidatePackages();
    router.push("/admin/paket");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      {error && (
        <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg">{error}</div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nama (ID) *</label>
          <input
            type="text"
            value={nameId}
            onChange={(e) => setNameId(e.target.value)}
            className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Nama (EN)</label>
          <input
            type="text"
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
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
        <button type="button" onClick={handleSlugGenerate} className="btn btn-ghost text-sm px-3 py-2">
          Generate
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Tipe *</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "umroh" | "haji")}
            className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
          >
            <option value="umroh">Umroh</option>
            <option value="haji">Haji</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "available" | "full" | "closed")}
            className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
          >
            <option value="available">Tersedia</option>
            <option value="full">Penuh</option>
            <option value="closed">Ditutup</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Tanggal Berangkat *</label>
          <input
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tanggal Pulang *</label>
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Harga (Rp) *</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          min="0"
          className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Total Kuota</label>
          <input
            type="number"
            value={totalQuota}
            onChange={(e) => setTotalQuota(e.target.value)}
            min="0"
            className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Sisa Kuota</label>
          <input
            type="number"
            value={remainingQuota}
            onChange={(e) => setRemainingQuota(e.target.value)}
            min="0"
            className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium">Paket Unggulan</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Brosur (JPG/WebP maks 5MB)</label>
        <label className="btn btn-ghost cursor-pointer inline-flex items-center gap-2 text-sm">
          Pilih File
          <input
            ref={brochureInputRef}
            type="file"
            accept="image/jpeg,image/webp,image/png"
            onChange={(e) => setBrochureFile(e.target.files?.[0] || null)}
            className="hidden"
          />
        </label>
        {brochureFile && (
          <span className="text-sm text-muted ml-2 inline-flex items-center gap-1">
            {brochureFile.name}
            <button
              type="button"
              onClick={() => { setBrochureFile(null); if (brochureInputRef.current) brochureInputRef.current.value = ""; }}
              className="text-red-600 hover:text-red-700 font-bold px-1"
              aria-label="Batalkan pilihan file"
            >
              ×
            </button>
          </span>
        )}
        {pkg?.brochure_url && !brochureFile && (
          <img src={pkg.brochure_url} alt="" className="mt-2 w-40 h-auto rounded-lg" />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Itinerary (JPG/WebP maks 5MB)</label>
        <label className="btn btn-ghost cursor-pointer inline-flex items-center gap-2 text-sm">
          Pilih File
          <input
            ref={itineraryInputRef}
            type="file"
            accept="image/jpeg,image/webp,image/png"
            onChange={(e) => setItineraryFile(e.target.files?.[0] || null)}
            className="hidden"
          />
        </label>
        {itineraryFile && (
          <span className="text-sm text-muted ml-2 inline-flex items-center gap-1">
            {itineraryFile.name}
            <button
              type="button"
              onClick={() => { setItineraryFile(null); if (itineraryInputRef.current) itineraryInputRef.current.value = ""; }}
              className="text-red-600 hover:text-red-700 font-bold px-1"
              aria-label="Batalkan pilihan file"
            >
              ×
            </button>
          </span>
        )}
        {pkg?.itinerary_url && !itineraryFile && (
          <img src={pkg.itinerary_url} alt="" className="mt-2 w-40 h-auto rounded-lg" />
        )}
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Paket"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn btn-ghost">
          Batal
        </button>
      </div>
    </form>
  );
}
