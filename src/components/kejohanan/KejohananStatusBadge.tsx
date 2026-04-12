"use client";

import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";
import type { KejohananStatus } from "@/types/kejohanan";

const statusStyles: Record<KejohananStatus, string> = {
  "AKAN DATANG": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "SEDANG BERLANGSUNG": "bg-green-100 text-green-700 border-green-200",
  SELESAI: "bg-blue-100 text-blue-700 border-blue-200",
};

export function KejohananStatusBadge({ status }: { status: KejohananStatus }) {
  const { t } = useLanguage();
  return (
    <Badge className={`text-xs font-medium ${statusStyles[status]}`}>
      {t.kejohanan.tournamentStatus[status]}
    </Badge>
  );
}
