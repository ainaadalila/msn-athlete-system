"use client";

import { Calendar, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { useLanguage } from "@/context/LanguageContext";
import { CampStatusBadge } from "./CampStatusBadge";
import type { TrainingCampWithCounts } from "@/types/training-camp";

export function CampHeader({ camp }: { camp: TrainingCampWithCounts }) {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-xl border p-5">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-gray-900">{camp.nama_kem}</h1>
            <CampStatusBadge status={camp.status} />
          </div>
          {camp.penerangan && (
            <p className="text-sm text-gray-500">{camp.penerangan}</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
        <span className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-gray-400" />
          {camp.lokasi}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-gray-400" />
          {format(new Date(camp.tarikh_mula), "dd/MM/yyyy")} —{" "}
          {format(new Date(camp.tarikh_tamat), "dd/MM/yyyy")}
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-gray-400" />
          {camp.athlete_count} {t.common.all !== "All" ? "atlet" : "athletes"}
        </span>
      </div>
    </div>
  );
}
