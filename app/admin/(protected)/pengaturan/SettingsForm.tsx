"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { revalidateSettings } from "@/lib/revalidate";
import { uploadToR2, deleteFromR2 } from "@/lib/r2-upload";

const TABS = ["Branding", "Profil", "Statistik", "Judul Section", "Tentang", "Banner Ajakan", "Kontak & Sosial", "Footer"];

export function SettingsForm({ initialData }: { initialData: Record<string, any> }) {
  const router = useRouter();
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState(0);
  const [saving, setSaving] = useState(false);
  const [notif, setNotif] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [data, setData] = useState(initialData);

  const updateField = (key: string, path: string[], value: any) => {
    setData((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      let obj = clone[key] ?? {};
      if (!clone[key]) clone[key] = {};
      let current = clone[key];
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return clone;
    });
  };

  const [aboutFile, setAboutFile] = useState<File | null>(null);
  const [removeAboutImage, setRemoveAboutImage] = useState(false);
  const [aboutPreview, setAboutPreview] = useState<string | null>(
    initialData.about_content?.image_url || null
  );
  const aboutInputRef = useRef<HTMLInputElement>(null);
  const [heroNewFiles, setHeroNewFiles] = useState<File[]>([]);
  const [heroRemovePaths, setHeroRemovePaths] = useState<string[]>([]);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [removeLogo, setRemoveLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    setSaving(true);
    setNotif(null);
    const sb = supabase as any;

    if (removeAboutImage) {
      const oldPath = data.about_content?.image_path;
      if (oldPath) await deleteFromR2(oldPath).catch(() => {});
      data.about_content = { ...(data.about_content || {}), image_url: null, image_path: null };
      setRemoveAboutImage(false);
      setAboutPreview(null);
    }

    if (aboutFile) {
      try {
        const oldPath = data.about_content?.image_path;
        const result = await uploadToR2(aboutFile, "about");
        if (oldPath) await deleteFromR2(oldPath).catch(() => {});
        data.about_content = {
          ...(data.about_content || {}),
          image_url: result.url,
          image_path: result.path,
        };
      } catch (err: any) {
        setNotif({ type: "error", text: `Gagal upload gambar: ${err.message}` });
        setSaving(false);
        return;
      }
    }

    const currentImages: Array<{ url: string; path: string }> = [...(data.hero?.images || [])];

    if (heroRemovePaths.length > 0) {
      await Promise.all(heroRemovePaths.map((p) => deleteFromR2(p).catch(() => {})));
      const remaining = currentImages.filter((img) => !heroRemovePaths.includes(img.path));
      data.hero = { ...(data.hero || {}), images: remaining };
      setHeroRemovePaths([]);
    }

    if (heroNewFiles.length > 0) {
      const uploaded: Array<{ url: string; path: string }> = [];
      for (const file of heroNewFiles) {
        try {
          uploaded.push(await uploadToR2(file, "hero"));
        } catch (err: any) {
          setNotif({ type: "error", text: `Gagal upload ${file.name}: ${err.message}` });
          setSaving(false);
          return;
        }
      }
      data.hero = { ...(data.hero || {}), images: [...(data.hero?.images || []), ...uploaded] };
      setHeroNewFiles([]);
    }

    if (removeLogo) {
      const oldLogoPath = data.branding?.logo_path;
      if (oldLogoPath) await deleteFromR2(oldLogoPath).catch(() => {});
      data.branding = { ...(data.branding || {}), logo_url: "", logo_path: "" };
      setRemoveLogo(false);
    }

    if (logoFile) {
      try {
        const oldLogoPath = data.branding?.logo_path;
        const result = await uploadToR2(logoFile, "logos");
        if (oldLogoPath) await deleteFromR2(oldLogoPath).catch(() => {});
        data.branding = {
          ...(data.branding || {}),
          logo_url: result.url,
          logo_path: result.path,
        };
        setLogoFile(null);
        if (logoInputRef.current) logoInputRef.current.value = "";
      } catch (err: any) {
        setNotif({ type: "error", text: `Gagal upload logo: ${err.message}` });
        setSaving(false);
        return;
      }
    }

    const failedKeys: string[] = [];
    for (const [key, value] of Object.entries(data)) {
      const { error } = await sb.from("site_settings").upsert({ key, value }, { onConflict: "key" });
      if (error) failedKeys.push(key);
    }
    await revalidateSettings();
    setSaving(false);

    if (failedKeys.length > 0) {
      setNotif({ type: "error", text: `Gagal menyimpan bagian: ${failedKeys.join(", ")}. Coba simpan ulang.` });
    } else {
      setNotif({ type: "success", text: "Pengaturan berhasil disimpan" });
      setTimeout(() => setNotif(null), 3000);
    }
    router.refresh();
  };

  return (
    <div>
      <div className="flex gap-2 flex-wrap mb-6">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === i ? "bg-green text-white" : "bg-white border border-line"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-line p-6 space-y-4">
        {activeTab === 0 && (
          <>
            <h3 className="font-bold text-lg">Branding</h3>
            <Field label="Nama Travel" value={data.branding?.brand_name || ""} onChange={(v) => updateField("branding", ["brand_name"], v)} />
            <Field label="Tagline (ID)" value={data.branding?.tagline?.id || ""} onChange={(v) => updateField("branding", ["tagline", "id"], v)} />
            <Field label="Tagline (EN)" value={data.branding?.tagline?.en || ""} onChange={(v) => updateField("branding", ["tagline", "en"], v)} />
            <div>
              <label className="block text-sm font-medium mb-1">Logo</label>
              <div className="flex items-center gap-2">
                <label className="btn btn-ghost cursor-pointer inline-flex items-center gap-2 text-sm">
                  Pilih File
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/png,image/svg+xml,image/webp"
                    onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
                {logoFile && (
                  <button
                    type="button"
                    onClick={() => { setLogoFile(null); if (logoInputRef.current) logoInputRef.current.value = ""; }}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    × Batalkan pilihan
                  </button>
                )}
                {!logoFile && data.branding?.logo_url && (
                  <button
                    type="button"
                    onClick={() => { setRemoveLogo(true); if (logoInputRef.current) logoInputRef.current.value = ""; }}
                    className="btn btn-ghost text-sm"
                    style={{ color: "#e40014", borderColor: "#e40014" }}
                  >
                    Hapus Logo
                  </button>
                )}
              </div>
              {data.branding?.logo_url && !logoFile && !removeLogo && (
                <img src={data.branding.logo_url} alt="" className="mt-2 h-12 w-auto object-contain" />
              )}
              {logoFile && (
                <img src={URL.createObjectURL(logoFile)} alt="" className="mt-2 h-12 w-auto object-contain" />
              )}
            </div>
          </>
        )}

        {activeTab === 1 && (
          <>
            <h3 className="font-bold text-lg">Profil</h3>
            <Field label="Label Atas Judul (ID)" value={data.hero?.eyebrow?.id || ""} onChange={(v) => updateField("hero", ["eyebrow", "id"], v)} />
            <Field label="Label Atas Judul (EN)" value={data.hero?.eyebrow?.en || ""} onChange={(v) => updateField("hero", ["eyebrow", "en"], v)} />
            <Field label="Judul (ID)" value={data.hero?.title?.id || ""} onChange={(v) => updateField("hero", ["title", "id"], v)} />
            <Field label="Judul (EN)" value={data.hero?.title?.en || ""} onChange={(v) => updateField("hero", ["title", "en"], v)} />
            <Field label="Subjudul (ID)" value={data.hero?.subtitle?.id || ""} onChange={(v) => updateField("hero", ["subtitle", "id"], v)} />
            <Field label="Subjudul (EN)" value={data.hero?.subtitle?.en || ""} onChange={(v) => updateField("hero", ["subtitle", "en"], v)} />
            <div>
              <label className="block text-sm font-medium mb-1">Gambar Profil</label>
              <p className="text-xs text-muted mb-2">Upload beberapa gambar untuk slideshow di profil</p>

              {(data.hero?.images?.length > 0 || heroNewFiles.length > 0) && (
                <div className="flex flex-wrap gap-3 mb-3">
                  {data.hero?.images
                    ?.filter((img: any) => !heroRemovePaths.includes(img.path))
                    .map((img: any, i: number) => (
                      <div key={i} className="relative">
                        <img src={img.url} alt="" className="w-28 h-20 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => setHeroRemovePaths((p) => [...p, img.path])}
                          className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow hover:bg-red-700 transition"
                        >
                          x
                        </button>
                      </div>
                    ))}
                  {heroNewFiles.map((f, i) => (
                    <div key={`new-${i}`} className="relative w-28 h-20 rounded-lg bg-bg flex items-center justify-center text-xs text-muted p-1 text-center overflow-hidden">
                      <span className="truncate">{f.name}</span>
                      <button
                        type="button"
                        onClick={() => setHeroNewFiles((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow hover:bg-red-700 transition"
                        aria-label="Batalkan pilihan file"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <label className="btn btn-ghost cursor-pointer inline-flex items-center gap-2 text-sm">
                + Tambah Gambar
                <input
                  ref={heroInputRef}
                  type="file"
                  accept="image/jpeg,image/webp,image/png"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setHeroNewFiles((prev) => [...prev, ...files]);
                    if (heroInputRef.current) heroInputRef.current.value = "";
                  }}
                  className="hidden"
                />
              </label>
            </div>

            <hr className="my-4" />
            <h4 className="font-semibold">Tombol Galeri (Google Drive / link eksternal)</h4>
            <p className="text-xs text-muted mb-2">Tombol di section Galeri (homepage) yang membuka link di tab baru — misalnya link Google Drive brosur/dokumen.</p>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.gallery_link?.enabled || false}
                onChange={(e) => updateField("gallery_link", ["enabled"], e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">Tampilkan tombol di section Galeri</span>
            </label>
            <Field label="Label Tombol (ID)" value={data.gallery_link?.label?.id || ""} onChange={(v) => updateField("gallery_link", ["label", "id"], v)} />
            <Field label="Label Tombol (EN)" value={data.gallery_link?.label?.en || ""} onChange={(v) => updateField("gallery_link", ["label", "en"], v)} />
            <Field label="Link Google Drive" value={data.gallery_link?.url || ""} onChange={(v) => updateField("gallery_link", ["url"], v)} />
          </>
        )}

        {activeTab === 2 && (
          <>
            <h3 className="font-bold text-lg">Statistik / Trust</h3>
            <p className="text-sm text-muted mb-2">Setiap statistik: nilai + label (ID/EN)</p>
            {(data.hero_stats || []).map((stat: any, i: number) => (
              <div key={i} className="grid grid-cols-3 gap-2 p-3 bg-bg rounded-lg">
                <Field label="Nilai" value={stat.value || ""} onChange={(v) => {
                  const arr = [...(data.hero_stats || [])];
                  arr[i] = { ...arr[i], value: v };
                  setData((prev) => ({ ...prev, hero_stats: arr }));
                }} />
                <Field label="Label (ID)" value={stat.label?.id || ""} onChange={(v) => {
                  const arr = [...(data.hero_stats || [])];
                  arr[i] = { ...arr[i], label: { ...arr[i].label, id: v } };
                  setData((prev) => ({ ...prev, hero_stats: arr }));
                }} />
                <Field label="Label (EN)" value={stat.label?.en || ""} onChange={(v) => {
                  const arr = [...(data.hero_stats || [])];
                  arr[i] = { ...arr[i], label: { ...arr[i].label, en: v } };
                  setData((prev) => ({ ...prev, hero_stats: arr }));
                }} />
                <button
                  onClick={() => {
                    const arr = (data.hero_stats || []).filter((_: any, j: number) => j !== i);
                    setData((prev) => ({ ...prev, hero_stats: arr }));
                  }}
                  className="text-red-600 text-sm font-medium"
                >
                  Hapus
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const arr = [...(data.hero_stats || []), { value: "", label: { id: "", en: "" }, order: (data.hero_stats?.length || 0) + 1 }];
                setData((prev) => ({ ...prev, hero_stats: arr }));
              }}
              className="btn btn-ghost text-sm"
            >
              + Tambah Statistik
            </button>
          </>
        )}

        {activeTab === 3 && (
          <>
            <h3 className="font-bold text-lg">Judul Section</h3>
            {["paket", "kabar", "testimoni", "galeri", "about"].map((section) => (
              <div key={section} className="p-3 bg-bg rounded-lg space-y-2">
                <h4 className="font-semibold capitalize">{section}</h4>
                <Field label="Label Atas Judul (ID)" value={data.section_headings?.[section]?.eyebrow?.id || ""} onChange={(v) => updateField("section_headings", [section, "eyebrow", "id"], v)} />
                <Field label="Label Atas Judul (EN)" value={data.section_headings?.[section]?.eyebrow?.en || ""} onChange={(v) => updateField("section_headings", [section, "eyebrow", "en"], v)} />
                <Field label="Judul (ID)" value={data.section_headings?.[section]?.title?.id || ""} onChange={(v) => updateField("section_headings", [section, "title", "id"], v)} />
                <Field label="Judul (EN)" value={data.section_headings?.[section]?.title?.en || ""} onChange={(v) => updateField("section_headings", [section, "title", "en"], v)} />
              </div>
            ))}
          </>
        )}

        {activeTab === 4 && (
          <>
            <h3 className="font-bold text-lg">Tentang</h3>
            <Field label="Cuplikan (ID)" value={data.about_content?.snippet?.id || ""} onChange={(v) => updateField("about_content", ["snippet", "id"], v)} isTextarea />
            <Field label="Cuplikan (EN)" value={data.about_content?.snippet?.en || ""} onChange={(v) => updateField("about_content", ["snippet", "en"], v)} isTextarea />
            <Field label="Konten Penuh (ID)" value={data.about_content?.full?.id || ""} onChange={(v) => updateField("about_content", ["full", "id"], v)} isTextarea />
            <Field label="Konten Penuh (EN)" value={data.about_content?.full?.en || ""} onChange={(v) => updateField("about_content", ["full", "en"], v)} isTextarea />
            <div>
              <label className="block text-sm font-medium mb-1">Gambar Tentang</label>
              <div className="flex items-center gap-2">
                <label className="btn btn-ghost cursor-pointer inline-flex items-center gap-2 text-sm">
                  Pilih File
                  <input
                    ref={aboutInputRef}
                    type="file"
                    accept="image/jpeg,image/webp,image/png"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setAboutFile(file);
                      if (file) setAboutPreview(URL.createObjectURL(file));
                      setRemoveAboutImage(false);
                    }}
                    className="hidden"
                  />
                </label>
                {aboutFile && (
                  <button
                    type="button"
                    onClick={() => {
                      setAboutFile(null);
                      setAboutPreview(data.about_content?.image_url || null);
                      if (aboutInputRef.current) aboutInputRef.current.value = "";
                    }}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    × Batalkan pilihan
                  </button>
                )}
                {!aboutFile && aboutPreview && (
                  <button
                    type="button"
                    onClick={() => { setRemoveAboutImage(true); setAboutPreview(null); }}
                    className="btn btn-ghost text-sm"
                    style={{ color: "#e40014", borderColor: "#e40014" }}
                  >
                    Hapus Gambar
                  </button>
                )}
              </div>
              {aboutPreview && !removeAboutImage && (
                <img src={aboutPreview} alt="" className="mt-2 w-48 h-auto rounded-lg object-cover" />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Legal / Izin Resmi</label>
              <p className="text-xs text-muted mb-2">Ditampilkan sebagai chip ✔ <b>Label</b> No. Nomor</p>
              {(data.about_content?.legal || []).map((item: any, i: number) => (
                <div key={i} className="flex gap-2 items-end mb-2">
                  <Field label="Label" value={item.label || ""} onChange={(v) => {
                    const arr = [...(data.about_content?.legal || [])];
                    arr[i] = { ...arr[i], label: v };
                    setData((prev) => ({ ...prev, about_content: { ...prev.about_content, legal: arr } }));
                  }} />
                  <Field label="Nomor" value={item.number || ""} onChange={(v) => {
                    const arr = [...(data.about_content?.legal || [])];
                    arr[i] = { ...arr[i], number: v };
                    setData((prev) => ({ ...prev, about_content: { ...prev.about_content, legal: arr } }));
                  }} />
                  <button
                    type="button"
                    onClick={() => {
                      const arr = (data.about_content?.legal || []).filter((_: any, j: number) => j !== i);
                      setData((prev) => ({ ...prev, about_content: { ...prev.about_content, legal: arr } }));
                    }}
                    className="text-red-600 text-sm font-medium mb-1 whitespace-nowrap"
                  >
                    Hapus
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const arr = [...(data.about_content?.legal || []), { label: "", number: "" }];
                  setData((prev) => ({ ...prev, about_content: { ...prev.about_content, legal: arr } }));
                }}
                className="btn btn-ghost text-sm"
              >
                + Tambah Legal
              </button>
            </div>

            <hr className="my-4" />
            <h4 className="font-semibold">Visi & Misi</h4>
            <Field label="Visi (ID)" value={data.visi_misi?.visi?.id || ""} onChange={(v) => updateField("visi_misi", ["visi", "id"], v)} isTextarea />
            <Field label="Visi (EN)" value={data.visi_misi?.visi?.en || ""} onChange={(v) => updateField("visi_misi", ["visi", "en"], v)} isTextarea />
            <Field label="Misi (ID) — satu item per baris" value={data.visi_misi?.misi?.id || ""} onChange={(v) => updateField("visi_misi", ["misi", "id"], v)} isTextarea />
            <Field label="Misi (EN) — satu item per baris" value={data.visi_misi?.misi?.en || ""} onChange={(v) => updateField("visi_misi", ["misi", "en"], v)} isTextarea />
          </>
        )}

        {activeTab === 5 && (
          <>
            <h3 className="font-bold text-lg">Banner Ajakan</h3>
            <p className="text-xs text-muted mb-2">Banner yang muncul di bagian bawah halaman utama, sebelum footer — isinya judul, subjudul, dan tombol WhatsApp untuk mendorong pengunjung menghubungi Anda.</p>
            <Field label="Judul (ID)" value={data.cta_band?.title?.id || ""} onChange={(v) => updateField("cta_band", ["title", "id"], v)} />
            <Field label="Judul (EN)" value={data.cta_band?.title?.en || ""} onChange={(v) => updateField("cta_band", ["title", "en"], v)} />
            <Field label="Subjudul (ID)" value={data.cta_band?.subtitle?.id || ""} onChange={(v) => updateField("cta_band", ["subtitle", "id"], v)} />
            <Field label="Subjudul (EN)" value={data.cta_band?.subtitle?.en || ""} onChange={(v) => updateField("cta_band", ["subtitle", "en"], v)} />
            <Field label="Label Tombol (ID)" value={data.cta_band?.cta_label?.id || ""} onChange={(v) => updateField("cta_band", ["cta_label", "id"], v)} />
            <Field label="Label Tombol (EN)" value={data.cta_band?.cta_label?.en || ""} onChange={(v) => updateField("cta_band", ["cta_label", "en"], v)} />
          </>
        )}

        {activeTab === 6 && (
          <>
            <h3 className="font-bold text-lg">Kontak & Sosial</h3>
            <Field label="Nomor WhatsApp" value={data.contact?.whatsapp_number || ""} onChange={(v) => updateField("contact", ["whatsapp_number"], v)} />
            <Field label="Telepon" value={data.contact?.phone || ""} onChange={(v) => updateField("contact", ["phone"], v)} />
            <Field label="Email" value={data.contact?.email || ""} onChange={(v) => updateField("contact", ["email"], v)} />
            <Field label="Alamat (ID)" value={data.contact?.address?.id || ""} onChange={(v) => updateField("contact", ["address", "id"], v)} />
            <Field label="Alamat (EN)" value={data.contact?.address?.en || ""} onChange={(v) => updateField("contact", ["address", "en"], v)} />
            <Field label="Link Google Maps" value={data.contact?.map_embed_url || ""} onChange={(v) => updateField("contact", ["map_embed_url"], v)} />
            <p className="text-xs text-muted -mt-2">Tempel link berbagi dari Google Maps (klik "Bagikan" di lokasi Anda lalu salin link-nya). Dipakai untuk tombol "Alamat" dan peta di halaman Kontak & Tentang.</p>
            <hr />
            <Field label="Instagram" value={data.socials?.instagram || ""} onChange={(v) => updateField("socials", ["instagram"], v)} />
            <Field label="Facebook" value={data.socials?.facebook || ""} onChange={(v) => updateField("socials", ["facebook"], v)} />
            <Field label="TikTok" value={data.socials?.tiktok || ""} onChange={(v) => updateField("socials", ["tiktok"], v)} />
            <Field label="YouTube" value={data.socials?.youtube || ""} onChange={(v) => updateField("socials", ["youtube"], v)} />
          </>
        )}

        {activeTab === 7 && (
          <>
            <h3 className="font-bold text-lg">Footer</h3>
            <Field label="Teks About (ID)" value={data.footer?.about_text?.id || ""} onChange={(v) => updateField("footer", ["about_text", "id"], v)} isTextarea />
            <Field label="Teks About (EN)" value={data.footer?.about_text?.en || ""} onChange={(v) => updateField("footer", ["about_text", "en"], v)} isTextarea />
            <Field label="Copyright (ID)" value={data.footer?.copyright?.id || ""} onChange={(v) => updateField("footer", ["copyright", "id"], v)} />
            <Field label="Copyright (EN)" value={data.footer?.copyright?.en || ""} onChange={(v) => updateField("footer", ["copyright", "en"], v)} />
          </>
        )}

        {notif && (
          <p className={`text-sm font-medium ${notif.type === "success" ? "text-green-700" : "text-red-600"}`}>
            {notif.text}
          </p>
        )}
        <button onClick={handleSave} disabled={saving} className="btn btn-primary">
          {saving ? "Menyimpan..." : "Simpan Semua Pengaturan"}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  isTextarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  isTextarea?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      {isTextarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-green text-sm"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-green text-sm"
        />
      )}
    </div>
  );
}
