import { notFound } from "next/navigation";
import { getAthleteById } from "@/lib/queries/athletes";
import { getReportByAthleteAndKejohanan } from "@/lib/queries/kejohanan";
import { KejohananReportForm } from "@/components/kejohanan/KejohananReportForm";

interface PageProps {
  params: Promise<{ kejohananId: string; athleteId: string }>;
}

export default async function AthleteLaporanKejohananPage({ params }: PageProps) {
  const { kejohananId, athleteId } = await params;

  const [athlete, report] = await Promise.all([
    getAthleteById(athleteId),
    getReportByAthleteAndKejohanan(kejohananId, athleteId),
  ]);

  if (!athlete) notFound();

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-gray-900">Laporan Kejohanan</h2>
      <KejohananReportForm
        kejohananId={kejohananId}
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
