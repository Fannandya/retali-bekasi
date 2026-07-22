"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex-1 flex items-center justify-center py-32">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-green mb-2">Ada yang Salah</h2>
        <p className="text-muted mb-6">Terjadi kesalahan. Silakan coba lagi.</p>
        <button onClick={reset} className="btn btn-primary">
          Coba Lagi
        </button>
      </div>
    </div>
  );
}
