import { Suspense } from "react";
import { AthleteTable } from "@/components/athletes/AthleteTable";
import { AthleteFilters } from "@/components/athletes/AthleteFilters";
import { EmptyState } from "@/components/shared/EmptyState";
import { DashboardHeader } from "@/components/athletes/DashboardHeader";
import { StatCards } from "@/components/dashboard/StatCards";
import { getAthletes } from "@/lib/queries/athletes";
import { getDashboardStats } from "@/lib/queries/dashboard";

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
  const [params, stats] = await Promise.all([searchParams, getDashboardStats()]);

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      <DashboardHeader />
      <StatCards {...stats} />

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
