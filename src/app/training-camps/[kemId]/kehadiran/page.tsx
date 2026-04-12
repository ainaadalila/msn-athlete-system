import { getAthletes } from "@/lib/queries/athletes";
import { getAttendanceByCamp } from "@/lib/queries/training-camps";
import { AttendanceTable } from "@/components/training-camps/AttendanceTable";

interface PageProps {
  params: Promise<{ kemId: string }>;
}

export default async function KehadiranPage({ params }: PageProps) {
  const { kemId } = await params;

  const [athletesResult, attendance] = await Promise.all([
    getAthletes(),
    getAttendanceByCamp(kemId),
  ]);

  const athletes = athletesResult.data ?? [];

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-gray-900">Kehadiran Atlet</h2>
      <AttendanceTable
        kemId={kemId}
        athletes={athletes}
        existingAttendance={attendance}
      />
    </div>
  );
}
