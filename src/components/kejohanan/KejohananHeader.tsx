"use client";

import { Calendar, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { useLanguage } from "@/context/LanguageContext";
import { KejohananStatusBadge } from "./KejohananStatusBadge";
import type { KejohananWithCounts } from "@/types/kejohanan";

export function KejohananHeader({ kejohanan }: { kejohanan: KejohananWithCounts }) {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-xl border p-5">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-gray-900">
              {kejohanan.nama_kejohanan}
            </h1>
            <KejohananStatusBadge status={kejohanan.status} />
          </div>
          {kejohanan.penerangan && (
            <p className="text-sm text-gray-500">{kejohanan.penerangan}</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
        <span className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-gray-400" />
          {kejohanan.lokasi}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-gray-400" />
          {format(new Date(kejohanan.tarikh_mula), "dd/MM/yyyy")} —{" "}
          {format(new Date(kejohanan.tarikh_tamat), "dd/MM/yyyy")}
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-gray-400" />
          {kejohanan.squad_count} {t.squad.title !== "Tournament Squad" ? "atlet" : "athletes"}
        </span>
      </div>
    </div>
  );
}
