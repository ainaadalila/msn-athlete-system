"use client";

import Link from "next/link";
import { Pencil, Plus, CheckCircle, AlertCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { PingatBadge } from "./PingatBadge";
import type { KejohananResultWithAthlete, KejohananSquadWithAthlete } from "@/types/kejohanan";

interface KejohananResultListProps {
  kejohananId: string;
  results: KejohananResultWithAthlete[];
  squad: KejohananSquadWithAthlete[];
}

export function KejohananResultList({
  kejohananId,
  results,
  squad,
}: KejohananResultListProps) {
  const { t } = useLanguage();

  const resultMap = new Map(results.map((r) => [r.athlete_id, r]));

  if (squad.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
        Tiada atlet dalam skuad. Tambah atlet ke skuad dahulu.
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white overflow-hidden">
      <div className="divide-y">
        {squad.map(({ athlete }) => {
          const result = resultMap.get(athlete.id);
          const hasResult = !!result;

          return (
            <div
              key={athlete.id}
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50/50"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    hasResult ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  {hasResult ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {athlete.nama_atlet}
                  </p>
                  <p className="text-xs text-gray-500">{athlete.acara}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {result?.pingat && <PingatBadge pingat={result.pingat} />}
                {result?.placement && (
                  <span className="text-xs text-gray-500">
                    Tempat #{result.placement}
                  </span>
                )}
                <span
                  className={`text-xs font-medium ${
                    hasResult ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {hasResult
                    ? t.kejohananResult.hasResult
                    : t.kejohananResult.missingResult}
                </span>
                <Link
                  href={`/kejohanan/${kejohananId}/keputusan/${athlete.id}`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:text-blue-800"
                >
                  {hasResult ? (
                    <>
                      <Pencil className="w-3.5 h-3.5" />
                      {t.kejohananResult.editResult}
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      Isi Keputusan
                    </>
                  )}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
