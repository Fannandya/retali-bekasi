import type { R2Category } from "@/lib/r2/categories";

export async function uploadToR2(file: File, category: R2Category): Promise<{ url: string; path: string }> {
  const presignRes = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category, contentType: file.type, size: file.size }),
  });
  if (!presignRes.ok) {
    const err = await presignRes.json().catch(() => ({}));
    throw new Error(err.error || "Gagal membuat URL upload");
  }
  const { uploadUrl, path, publicUrl } = await presignRes.json();

  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!putRes.ok) {
    throw new Error("Gagal upload file ke storage");
  }

  return { url: publicUrl, path };
}

export async function deleteFromR2(path: string): Promise<void> {
  const res = await fetch("/api/upload", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Gagal menghapus file");
  }
}
