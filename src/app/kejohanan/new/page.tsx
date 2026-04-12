import { KejohananForm } from "@/components/kejohanan/KejohananForm";

export default function NewKejohananPage() {
  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Daftar Kejohanan Baru</h1>
        <p className="text-sm text-gray-500 mt-1">
          Program Pembangunan Sukan Olimpik — Memanah
        </p>
      </div>
      <div className="rounded-xl border bg-white p-6">
        <KejohananForm mode="create" />
      </div>
    </div>
  );
}
