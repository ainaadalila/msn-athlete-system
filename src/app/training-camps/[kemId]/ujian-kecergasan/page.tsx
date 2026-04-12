import { getFitnessTestsByCamp, getAttendanceByCamp } from "@/lib/queries/training-camps";
import { getAthletes } from "@/lib/queries/athletes";
import { FitnessTestsGroupedTable } from "@/components/training-camps/FitnessTestsGroupedTable";
import type { AthleteSummary } from "@/types/athlete";

interface PageProps {
  params: Promise<{ kemId: string }>;
}

export default async function UjianKecergasanPage({ params }: PageProps) {
  const { kemId } = await params;

  const [tests, attendance, athletesResult] = await Promise.all([
    getFitnessTestsByCamp(kemId),
    getAttendanceByCamp(kemId),
    getAthletes(),
  ]);

  const allAthletes = (athletesResult.data ?? []) as AthleteSummary[];

  // Only show athletes who attended (or all athletes if no attendance yet)
  const attendingIds = new Set(attendance.map((a) => a.athlete_id));
  const attendingAthletes =
    attendance.length > 0
      ? allAthletes.filter((a) => attendingIds.has(a.id))
      : allAthletes;

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-gray-900">Ujian Kecergasan</h2>
      <FitnessTestsGroupedTable
        kemId={kemId}
        tests={tests}
        attendingAthletes={attendingAthletes}
      />
    </div>
  );
}
