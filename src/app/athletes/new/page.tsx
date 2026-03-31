import { MultiStepForm } from "@/components/forms/MultiStepForm";

export default function NewAthletePage() {
  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          Daftar Atlet Baru / Register New Athlete
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Program Pembangunan Sukan Olimpik — Memanah
        </p>
      </div>
      <MultiStepForm mode="create" />
    </div>
  );
}
