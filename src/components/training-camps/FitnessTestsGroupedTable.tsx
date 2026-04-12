"use client";

import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";
import type { FitnessTestWithAthlete } from "@/types/training-camp";
import type { AthleteSummary } from "@/types/athlete";

interface FitnessTestsGroupedTableProps {
  kemId: string;
  tests: FitnessTestWithAthlete[];
  attendingAthletes: AthleteSummary[];
}

const statusStyles: Record<string, string> = {
  LULUS: "bg-green-100 text-green-700 border-green-200",
  GAGAL: "bg-red-100 text-red-700 border-red-200",
  "DALAM PROSES": "bg-yellow-100 text-yellow-700 border-yellow-200",
};

export function FitnessTestsGroupedTable({
  kemId,
  tests,
  attendingAthletes,
}: FitnessTestsGroupedTableProps) {
  const { t } = useLanguage();

  // Group tests by athlete
  const grouped = new Map<string, FitnessTestWithAthlete[]>();
  for (const test of tests) {
    const existing = grouped.get(test.athlete_id) ?? [];
    grouped.set(test.athlete_id, [...existing, test]);
  }

  // All athletes who should appear (those who attended)
  const allAthletes = attendingAthletes;

  if (allAthletes.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
        {t.attendance.noAthletes}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {allAthletes.map((athlete) => {
        const athleteTests = grouped.get(athlete.id) ?? [];
        const hasTests = athleteTests.length > 0;

        return (
          <div key={athlete.id} className="rounded-xl border bg-white overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {athlete.nama_atlet}
                </p>
                <p className="text-xs text-gray-500">{athlete.acara}</p>
              </div>
              <Link
                href={`/training-camps/${kemId}/ujian-kecergasan/${athlete.id}`}
                className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:text-blue-800"
              >
                {hasTests ? (
                  <>
                    <Pencil className="w-3.5 h-3.5" />
                    {t.fitnessTests.editTests}
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    {t.fitnessTests.addTest}
                  </>
                )}
              </Link>
            </div>

            {hasTests ? (
              <div className="divide-y">
                {athleteTests.map((test) => (
                  <div
                    key={test.id}
                    className="flex items-center justify-between px-4 py-2.5 text-sm"
                  >
                    <span className="text-gray-800">{test.jenis_ujian}</span>
                    <div className="flex items-center gap-3">
                      {test.keputusan && (
                        <span className="text-gray-600">{test.keputusan}</span>
                      )}
                      {test.status && (
                        <Badge
                          className={`text-xs ${statusStyles[test.status] ?? ""}`}
                        >
                          {t.status[test.status]}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-3 text-sm text-gray-400 italic">
                {t.fitnessTests.noTests}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
