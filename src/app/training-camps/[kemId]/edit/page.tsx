import { notFound } from "next/navigation";
import { getCampById } from "@/lib/queries/training-camps";
import { CampForm } from "@/components/training-camps/CampForm";

interface PageProps {
  params: Promise<{ kemId: string }>;
}

export default async function EditCampPage({ params }: PageProps) {
  const { kemId } = await params;
  const camp = await getCampById(kemId);

  if (!camp) notFound();

  return (
    <div className="rounded-xl border bg-white p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-5">
        Kemaskini Kem Latihan
      </h2>
      <CampForm
        mode="edit"
        kemId={kemId}
        defaultValues={{
          nama_kem: camp.nama_kem,
          lokasi: camp.lokasi,
          tarikh_mula: camp.tarikh_mula,
          tarikh_tamat: camp.tarikh_tamat,
          penerangan: camp.penerangan ?? undefined,
          status: camp.status,
        }}
      />
    </div>
  );
}
