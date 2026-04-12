"use client";

import Link from "next/link";
import { Pencil, Plus, CheckCircle, AlertCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { KejohananReportWithAthlete, KejohananSquadWithAthlete } from "@/types/kejohanan";

interface KejohananReportListProps {
  kejohananId: string;
  reports: KejohananReportWithAthlete[];
  squad: KejohananSquadWithAthlete[];
}

export function KejohananReportList({
  kejohananId,
  reports,
  squad,
}: KejohananReportListProps) {
  const { t } = useLanguage();

  const reportMap = new Map(reports.map((r) => [r.athlete_id, r]));

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
          const report = reportMap.get(athlete.id);
          const hasReport = !!report;

          return (
            <div
              key={athlete.id}
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50/50"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    hasReport ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  {hasReport ? (
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
                <span
                  className={`text-xs font-medium ${
                    hasReport ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {hasReport
                    ? t.kejohananReport.hasReport
                    : t.kejohananReport.missingReport}
                </span>
                <Link
                  href={`/kejohanan/${kejohananId}/laporan/${athlete.id}`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:text-blue-800"
                >
                  {hasReport ? (
                    <>
                      <Pencil className="w-3.5 h-3.5" />
                      {t.kejohananReport.editReport}
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      Isi Laporan
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
