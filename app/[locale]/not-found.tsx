import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center py-32">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-green mb-2">404</h1>
        <h2 className="text-xl font-bold mb-2">Halaman tidak ditemukan</h2>
        <p className="text-muted mb-6">Maaf, halaman yang Anda cari tidak ada.</p>
        <Link href="/" className="btn btn-primary">
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
