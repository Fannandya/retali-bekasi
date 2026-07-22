import { TestimoniList } from "./TestimoniList";

export const dynamic = 'force-dynamic';

export default function AdminTestimoniPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Testimoni</h1>
      </div>
      <TestimoniList />
    </>
  );
}
