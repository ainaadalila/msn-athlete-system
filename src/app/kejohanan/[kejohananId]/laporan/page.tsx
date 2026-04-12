import { getReportsByKejohanan, getSquadByKejohanan } from "@/lib/queries/kejohanan";
import { KejohananReportList } from "@/components/kejohanan/KejohananReportList";

interface PageProps {
  params: Promise<{ kejohananId: string }>;
}

export default async function LaporanKejohananPage({ params }: PageProps) {
  const { kejohananId } = await params;

  const [reports, squad] = await Promise.all([
    getReportsByKejohanan(kejohananId),
    getSquadByKejohanan(kejohananId),
  ]);

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-gray-900">Laporan Kejohanan</h2>
      <KejohananReportList
        kejohananId={kejohananId}
        reports={reports}
        squad={squad}
      />
    </div>
  );
}
