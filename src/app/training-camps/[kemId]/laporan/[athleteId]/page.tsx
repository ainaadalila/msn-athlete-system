import { notFound } from "next/navigation";
import { getAthleteById } from "@/lib/queries/athletes";
import { getReportByAthleteAndCamp } from "@/lib/queries/training-camps";
import { CampReportForm } from "@/components/training-camps/CampReportForm";

interface PageProps {
  params: Promise<{ kemId: string; athleteId: string }>;
}

export default async function AthleteLaporanPage({ params }: PageProps) {
  const { kemId, athleteId } = await params;

  const [athlete, report] = await Promise.all([
    getAthleteById(athleteId),
    getReportByAthleteAndCamp(kemId, athleteId),
  ]);

  if (!athlete) notFound();

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-gray-900">Laporan Kem</h2>
      <CampReportForm
        kemId={kemId}
        athleteId={athleteId}
        athleteName={athlete.nama_atlet}
        defaultValues={
          report
            ? { ringkasan: report.ringkasan, catatan: report.catatan }
            : undefined
        }
      />
    </div>
  );
}
