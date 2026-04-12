"use client";

import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/context/LanguageContext";
import type { FullAthleteForm } from "@/lib/validations/athlete.schema";
import { differenceInYears, parseISO } from "date-fns";

export function Step5Review() {
  const { t } = useLanguage();
  const { register, watch } = useFormContext<FullAthleteForm>();
  const values = watch();

  const umur =
    values.tarikh_lahir
      ? differenceInYears(new Date(), parseISO(values.tarikh_lahir))
      : null;

  const summaryRows = [
    { label: t.athlete.namaAtlet, value: values.nama_atlet },
    { label: t.athlete.noKp, value: values.no_kp },
    { label: t.athlete.sukan, value: values.sukan },
    { label: t.athlete.acara, value: values.acara },
    { label: t.athlete.negeri, value: values.negeri },
    { label: t.athlete.umur, value: umur ? `${umur} tahun` : "—" },
    { label: t.athlete.beratBadan, value: values.berat_badan ? `${values.berat_badan} KG` : "—" },
    { label: t.athlete.tinggi, value: values.tinggi ? `${values.tinggi} CM` : "—" },
    { label: t.athlete.sekolah, value: values.sekolah || "—" },
    { label: t.athlete.jurulatih, value: values.jurulatih || "—" },
    { label: t.athlete.noPerhubungan, value: values.no_perhubungan || "—" },
  ];

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          {t.steps.summaryTitle}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
          {summaryRows.map(({ label, value }) => (
            <div key={label} className="flex gap-2 text-sm">
              <span className="text-gray-500 min-w-[140px]">{label}:</span>
              <span className="font-medium text-gray-800">{value || "—"}</span>
            </div>
          ))}
        </div>

        {values.achievements && values.achievements.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-1">
              {t.achievements.title}: {values.achievements.length} rekod
            </p>
          </div>
        )}
        {values.assessments && values.assessments.length > 0 && (
          <div>
            <p className="text-xs text-gray-500">
              {t.assessments.title}: {values.assessments.length} rekod
            </p>
          </div>
        )}
      </div>

      {/* Ulasan Prestasi */}
      <div className="space-y-1.5">
        <Label htmlFor="ulasan_prestasi">{t.athlete.ulasanPrestasi}</Label>
        <Textarea
          id="ulasan_prestasi"
          {...register("ulasan_prestasi")}
          rows={6}
          placeholder="Tulis ulasan prestasi keseluruhan atlet di sini..."
          className="resize-none"
        />
      </div>
    </div>
  );
}
