"use client";

import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";
import type { KemStatus } from "@/types/training-camp";

const statusStyles: Record<KemStatus, string> = {
  AKTIF: "bg-green-100 text-green-700 border-green-200",
  SELESAI: "bg-blue-100 text-blue-700 border-blue-200",
  DIBATALKAN: "bg-red-100 text-red-700 border-red-200",
};

export function CampStatusBadge({ status }: { status: KemStatus }) {
  const { t } = useLanguage();
  return (
    <Badge className={`text-xs font-medium ${statusStyles[status]}`}>
      {t.trainingCamp.kemStatus[status]}
    </Badge>
  );
}
