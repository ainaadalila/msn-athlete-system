import { getSquadByKejohanan, getResultsByKejohanan } from "@/lib/queries/kejohanan";
import { StatistikPanel } from "@/components/kejohanan/StatistikPanel";
import type { KejohananStatistik } from "@/types/kejohanan";

interface PageProps {
  params: Promise<{ kejohananId: string }>;
}

export default async function StatistikPage({ params }: PageProps) {
  const { kejohananId } = await params;

  const [squad, results] = await Promise.all([
    getSquadByKejohanan(kejohananId),
    getResultsByKejohanan(kejohananId),
  ]);

  const statistik: KejohananStatistik = {
    jumlah_atlet: squad.length,
    pingat_emas: results.filter((r) => r.pingat === "EMAS").length,
    pingat_perak: results.filter((r) => r.pingat === "PERAK").length,
    pingat_gangsa: results.filter((r) => r.pingat === "GANGSA").length,
    tiada_pingat: results.filter((r) => r.pingat === "TIADA" || !r.pingat).length,
    keputusan: results,
  };

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-gray-900">Statistik Kejohanan</h2>
      <StatistikPanel statistik={statistik} />
    </div>
  );
}
