import { notFound } from "next/navigation";
import { getKejohananById } from "@/lib/queries/kejohanan";
import { KejohananForm } from "@/components/kejohanan/KejohananForm";

interface PageProps {
  params: Promise<{ kejohananId: string }>;
}

export default async function EditKejohananPage({ params }: PageProps) {
  const { kejohananId } = await params;
  const kejohanan = await getKejohananById(kejohananId);

  if (!kejohanan) notFound();

  return (
    <div className="rounded-xl border bg-white p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-5">
        Kemaskini Kejohanan
      </h2>
      <KejohananForm
        mode="edit"
        kejohananId={kejohananId}
        defaultValues={{
          nama_kejohanan: kejohanan.nama_kejohanan,
          lokasi: kejohanan.lokasi,
          tarikh_mula: kejohanan.tarikh_mula,
          tarikh_tamat: kejohanan.tarikh_tamat,
          penerangan: kejohanan.penerangan ?? undefined,
          status: kejohanan.status,
        }}
      />
    </div>
  );
}
