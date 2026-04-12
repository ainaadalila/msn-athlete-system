import { CampForm } from "@/components/training-camps/CampForm";

export default function NewCampPage() {
  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Daftar Kem Latihan Baru</h1>
        <p className="text-sm text-gray-500 mt-1">
          Program Pembangunan Sukan Olimpik — Memanah
        </p>
      </div>
      <div className="rounded-xl border bg-white p-6">
        <CampForm mode="create" />
      </div>
    </div>
  );
}
