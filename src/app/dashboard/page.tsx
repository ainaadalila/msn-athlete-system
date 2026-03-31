import { Suspense } from "react";
import { UserPlus, Users } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { AthleteTable } from "@/components/athletes/AthleteTable";
import { AthleteFilters } from "@/components/athletes/AthleteFilters";
import { EmptyState } from "@/components/shared/EmptyState";
import { getAthletes } from "@/lib/queries/athletes";

interface DashboardPageProps {
  searchParams: Promise<{ search?: string; negeri?: string; acara?: string }>;
}

async function AthleteList({
  search,
  negeri,
  acara,
}: {
  search?: string;
  negeri?: string;
  acara?: string;
}) {
  const { data: athletes, error } = await getAthletes({ search, negeri, acara });

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        Ralat memuatkan data. Sila cuba semula.
      </div>
    );
  }

  if (!athletes || athletes.length === 0) {
    return <EmptyState />;
  }

  return <AthleteTable athletes={athletes} />;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Senarai Atlet / Athlete List
            </h1>
            <p className="text-xs text-gray-500">
              Program Pembangunan Sukan Olimpik — Memanah
            </p>
          </div>
        </div>
        <LinkButton href="/athletes/new" size="sm">
          <UserPlus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Daftar Atlet Baru</span>
          <span className="sm:hidden">Daftar</span>
        </LinkButton>
      </div>

      {/* Filters */}
      <Suspense>
        <AthleteFilters />
      </Suspense>

      {/* Table */}
      <Suspense
        fallback={
          <div className="rounded-xl border bg-white p-8 text-center text-gray-400">
            Memuatkan...
          </div>
        }
      >
        <AthleteList
          search={params.search}
          negeri={params.negeri}
          acara={params.acara}
        />
      </Suspense>
    </div>
  );
}
