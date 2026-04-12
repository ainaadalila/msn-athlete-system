import { Suspense } from "react";
import { Trophy, Plus } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { KejohananTable } from "@/components/kejohanan/KejohananTable";
import { KejohananFilters } from "@/components/kejohanan/KejohananFilters";
import { getKejohananList } from "@/lib/queries/kejohanan";

interface PageProps {
  searchParams: Promise<{ search?: string; status?: string }>;
}

async function KejohananList({
  search,
  status,
}: {
  search?: string;
  status?: string;
}) {
  const kejohananList = await getKejohananList({ search, status });

  if (kejohananList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Trophy className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-600 font-medium">Tiada kejohanan ditemui.</p>
        <p className="text-sm text-gray-400 mt-1 mb-6">
          Daftar kejohanan baharu untuk memulakan.
        </p>
        <LinkButton href="/kejohanan/new">
          <Plus className="w-4 h-4 mr-2" />
          Daftar Kejohanan Baru
        </LinkButton>
      </div>
    );
  }

  return <KejohananTable kejohananList={kejohananList} />;
}

export default async function KejohananPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Senarai Kejohanan</h1>
            <p className="text-xs text-gray-500">
              Program Pembangunan Sukan Olimpik — Memanah
            </p>
          </div>
        </div>
        <LinkButton href="/kejohanan/new" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Daftar Kejohanan Baru</span>
          <span className="sm:hidden">Baru</span>
        </LinkButton>
      </div>

      <Suspense>
        <KejohananFilters />
      </Suspense>

      <Suspense
        fallback={
          <div className="rounded-xl border bg-white p-8 text-center text-gray-400">
            Memuatkan...
          </div>
        }
      >
        <KejohananList search={params.search} status={params.status} />
      </Suspense>
    </div>
  );
}
