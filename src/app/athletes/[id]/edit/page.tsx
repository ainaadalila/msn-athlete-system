import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { MultiStepForm } from "@/components/forms/MultiStepForm";
import { getAthleteById } from "@/lib/queries/athletes";
import type { FullAthleteForm } from "@/lib/validations/athlete.schema";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAthletePage({ params }: EditPageProps) {
  const { id } = await params;
  const athlete = await getAthleteById(id);

  if (!athlete) notFound();

  const defaultValues: Partial<FullAthleteForm> & { id: string } = {
    id,
    nama_atlet: athlete.nama_atlet,
    no_kp: athlete.no_kp,
    sukan: "MEMANAH",
    acara: athlete.acara,
    gambar_url: athlete.gambar_url,
    negeri: athlete.negeri ?? undefined,
    tarikh_lahir: athlete.tarikh_lahir ?? undefined,
    berat_badan: athlete.berat_badan ?? undefined,
    tinggi: athlete.tinggi ?? undefined,
    sekolah: athlete.sekolah ?? undefined,
    jurulatih: athlete.jurulatih ?? undefined,
    no_perhubungan: athlete.no_perhubungan ?? undefined,
    ulasan_prestasi: athlete.ulasan_prestasi ?? undefined,
    achievements: athlete.achievements.map((a) => ({
      urutan: a.urutan,
      kejohanan: a.kejohanan,
      tarikh_mula: a.tarikh_mula ?? null,
      tarikh_tamat: a.tarikh_tamat ?? null,
      acara: a.acara ?? null,
      catatan: a.catatan ?? null,
    })),
    assessments: athlete.assessments.map((a) => ({
      no: a.no,
      jenis_ujian: a.jenis_ujian,
      keputusan: a.keputusan ?? null,
      status: a.status ?? null,
    })),
  };

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <LinkButton href={`/athletes/${id}`} variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Kembali / Back
        </LinkButton>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Kemaskini Profil / Edit Profile
          </h1>
          <p className="text-sm text-gray-500">{athlete.nama_atlet}</p>
        </div>
      </div>

      <MultiStepForm mode="edit" defaultValues={defaultValues} />
    </div>
  );
}
