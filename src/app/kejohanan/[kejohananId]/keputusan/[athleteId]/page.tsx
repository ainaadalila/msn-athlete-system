import { notFound } from "next/navigation";
import { getAthleteById } from "@/lib/queries/athletes";
import { getResultByAthleteAndKejohanan } from "@/lib/queries/kejohanan";
import { KejohananResultForm } from "@/components/kejohanan/KejohananResultForm";

interface PageProps {
  params: Promise<{ kejohananId: string; athleteId: string }>;
}

export default async function AthleteKeputusanPage({ params }: PageProps) {
  const { kejohananId, athleteId } = await params;

  const [athlete, result] = await Promise.all([
    getAthleteById(athleteId),
    getResultByAthleteAndKejohanan(kejohananId, athleteId),
  ]);

  if (!athlete) notFound();

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-gray-900">Keputusan Kejohanan</h2>
      <KejohananResultForm
        kejohananId={kejohananId}
        athleteId={athleteId}
        athleteName={athlete.nama_atlet}
        defaultValues={
          result
            ? {
                placement: result.placement ?? undefined,
                skor: result.skor ?? undefined,
                pingat: result.pingat ?? undefined,
              }
            : undefined
        }
      />
    </div>
  );
}
