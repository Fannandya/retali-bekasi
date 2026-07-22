import { PackageForm } from "../PackageForm";

export const dynamic = 'force-dynamic';

export default function TambahPaketPage() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Tambah Paket</h1>
      <PackageForm />
    </>
  );
}
