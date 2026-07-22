export default function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center py-32">
      <div className="text-center">
        <div className="animate-spin w-10 h-10 border-4 border-green border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-muted">Loading...</p>
      </div>
    </div>
  );
}
