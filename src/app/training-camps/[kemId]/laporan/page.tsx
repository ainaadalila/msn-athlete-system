import { getReportsByCamp, getAttendanceByCamp } from "@/lib/queries/training-camps";
import { getAthletes } from "@/lib/queries/athletes";
import { CampReportList } from "@/components/training-camps/CampReportList";
import type { AthleteSummary } from "@/types/athlete";

interface PageProps {
  params: Promise<{ kemId: string }>;
}

export default async function LaporanPage({ params }: PageProps) {
  const { kemId } = await params;

  const [reports, attendance, athletesResult] = await Promise.all([
    getReportsByCamp(kemId),
    getAttendanceByCamp(kemId),
    getAthletes(),
  ]);

  const allAthletes = (athletesResult.data ?? []) as AthleteSummary[];

  // Show athletes who attended (or all if no attendance yet)
  const attendingIds = new Set(attendance.map((a) => a.athlete_id));
  const attendingAthletes =
    attendance.length > 0
      ? allAthletes.filter((a) => attendingIds.has(a.id))
      : allAthletes;

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-gray-900">Laporan Kem</h2>
      <CampReportList
        kemId={kemId}
        reports={reports}
        attendingAthletes={attendingAthletes}
      />
    </div>
  );
}
