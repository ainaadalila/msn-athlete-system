"use client";

import Image from "next/image";
import { differenceInYears, parseISO } from "date-fns";
import { AchievementsTable } from "./AchievementsTable";
import { AssessmentsTable } from "./AssessmentsTable";
import { useLanguage } from "@/context/LanguageContext";
import type { AthleteWithRelations } from "@/types/athlete";

interface AthleteProfileCardProps {
  athlete: AthleteWithRelations;
}

export function AthleteProfileCard({ athlete }: AthleteProfileCardProps) {
  const { t } = useLanguage();

  const umur = athlete.tarikh_lahir
    ? differenceInYears(new Date(), parseISO(athlete.tarikh_lahir))
    : null;

  const infoRows = [
    { label: t.athlete.namaAtlet, value: athlete.nama_atlet, bold: true },
    { label: t.athlete.noKp, value: athlete.no_kp },
    { label: t.athlete.sukan, value: athlete.sukan },
    { label: t.athlete.acara, value: athlete.acara },
    { label: t.athlete.negeri, value: athlete.negeri ?? "—" },
    {
      label: t.athlete.umur,
      value: umur ? `${umur} tahun` : "—",
    },
    {
      label: t.athlete.beratBadan,
      value: athlete.berat_badan ? `${athlete.berat_badan} KG` : "—",
    },
    {
      label: t.athlete.tinggi,
      value: athlete.tinggi ? `${athlete.tinggi} CM` : "—",
    },
    { label: t.athlete.sekolah, value: athlete.sekolah ?? "—" },
    { label: t.athlete.jurulatih, value: athlete.jurulatih ?? "—" },
    {
      label: t.athlete.noPerhubungan,
      value: athlete.no_perhubungan ?? "—",
    },
  ];

  return (
    <div className="print-card bg-white rounded-xl border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-blue-700 text-white px-6 py-4 flex items-center gap-3">
        <div className="flex flex-col leading-tight">
          <span className="text-xs font-medium opacity-80">
            MAJLIS SUKAN NEGARA
          </span>
          <span className="text-base font-bold tracking-wide">
            {t.athlete.title}
          </span>
          <span className="text-xs opacity-80">{t.athlete.subtitle} — MEMANAH</span>
        </div>
      </div>

      {/* Profile section */}
      <div className="p-6 border-b">
        <div className="flex gap-6">
          {/* Photo */}
          <div className="flex-shrink-0">
            <div className="w-28 h-36 rounded-lg overflow-hidden bg-gray-100 border flex items-center justify-center">
              {athlete.gambar_url ? (
                <Image
                  src={athlete.gambar_url}
                  alt={athlete.nama_atlet}
                  width={112}
                  height={144}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-3xl font-bold text-gray-300">
                  {athlete.nama_atlet.charAt(0)}
                </span>
              )}
            </div>
            <p className="text-center text-xs text-gray-400 mt-1">
              {t.athlete.gambar}
            </p>
          </div>

          {/* Info grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
            {infoRows.map(({ label, value, bold }) => (
              <div key={label} className="flex gap-2 text-sm">
                <span className="text-gray-500 min-w-[120px] text-xs">
                  {label}:
                </span>
                <span
                  className={`text-gray-800 text-xs ${bold ? "font-bold" : ""}`}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="p-6 border-b">
        <AchievementsTable achievements={athlete.achievements} />
      </div>

      {/* Assessments */}
      <div className="p-6 border-b">
        <AssessmentsTable assessments={athlete.assessments} />
      </div>

      {/* Ulasan Prestasi */}
      {athlete.ulasan_prestasi && (
        <div className="p-6">
          <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700 mb-3">
            {t.athlete.ulasanPrestasi}
          </h3>
          <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed bg-gray-50 rounded-lg p-4">
            {athlete.ulasan_prestasi}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t">
        <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest">
          PROFIL ATLET / PROGRAM PEMBANGUNAN SUKAN OLIMPIK
        </p>
      </div>
    </div>
  );
}
