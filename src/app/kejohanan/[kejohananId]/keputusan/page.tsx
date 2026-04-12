import { getResultsByKejohanan, getSquadByKejohanan } from "@/lib/queries/kejohanan";
import { KejohananResultList } from "@/components/kejohanan/KejohananResultList";

interface PageProps {
  params: Promise<{ kejohananId: string }>;
}

export default async function KeputusanPage({ params }: PageProps) {
  const { kejohananId } = await params;

  const [results, squad] = await Promise.all([
    getResultsByKejohanan(kejohananId),
    getSquadByKejohanan(kejohananId),
  ]);

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-gray-900">Keputusan Kejohanan</h2>
      <KejohananResultList
        kejohananId={kejohananId}
        results={results}
        squad={squad}
      />
    </div>
  );
}
