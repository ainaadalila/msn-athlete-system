"use client";

import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";
import type { AssessmentStatus } from "@/types/athlete";

const STATUS_COLORS: Record<AssessmentStatus, string> = {
  LULUS: "bg-green-100 text-green-800 border-green-200",
  GAGAL: "bg-red-100 text-red-800 border-red-200",
  "DALAM PROSES": "bg-yellow-100 text-yellow-800 border-yellow-200",
};

export function StatusBadge({ status }: { status: AssessmentStatus | null }) {
  const { t } = useLanguage();
  if (!status) return <span className="text-gray-400">—</span>;

  return (
    <Badge
      variant="outline"
      className={`text-xs font-medium ${STATUS_COLORS[status]}`}
    >
      {t.status[status]}
    </Badge>
  );
}
