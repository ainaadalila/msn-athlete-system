import { getAthletes } from "@/lib/queries/athletes";
import { getSquadByKejohanan } from "@/lib/queries/kejohanan";
import { SquadManager } from "@/components/kejohanan/SquadManager";
import type { AthleteSummary } from "@/types/athlete";

interface PageProps {
  params: Promise<{ kejohananId: string }>;
}

export default async function SquadPage({ params }: PageProps) {
  const { kejohananId } = await params;

  const [athletesResult, squad] = await Promise.all([
    getAthletes(),
    getSquadByKejohanan(kejohananId),
  ]);

  const athletes = (athletesResult.data ?? []) as AthleteSummary[];

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-gray-900">Skuad Kejohanan</h2>
      <SquadManager
        kejohananId={kejohananId}
        athletes={athletes}
        existingSquad={squad}
      />
    </div>
  );
}
