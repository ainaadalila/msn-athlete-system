import { notFound } from "next/navigation";
import { getAthleteById } from "@/lib/queries/athletes";
import { getFitnessTestsByAthleteCamp } from "@/lib/queries/training-camps";
import { FitnessTestsForm } from "@/components/training-camps/FitnessTestsForm";

interface PageProps {
  params: Promise<{ kemId: string; athleteId: string }>;
}

export default async function AthleteUjianPage({ params }: PageProps) {
  const { kemId, athleteId } = await params;

  const [athlete, tests] = await Promise.all([
    getAthleteById(athleteId),
    getFitnessTestsByAthleteCamp(kemId, athleteId),
  ]);

  if (!athlete) notFound();

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-gray-900">Ujian Kecergasan</h2>
      <FitnessTestsForm
        kemId={kemId}
        athleteId={athleteId}
        athleteName={athlete.nama_atlet}
        defaultValues={tests}
      />
    </div>
  );
}
