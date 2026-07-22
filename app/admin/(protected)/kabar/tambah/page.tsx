import { NewsForm } from "../NewsForm";

export const dynamic = 'force-dynamic';

export default function TambahKabarPage() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Tambah Kabar</h1>
      <NewsForm />
    </>
  );
}
