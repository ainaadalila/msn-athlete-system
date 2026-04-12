"use client";

import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";
import type { PingatType } from "@/types/kejohanan";

const pingatStyles: Record<PingatType, string> = {
  EMAS: "bg-yellow-100 text-yellow-700 border-yellow-300",
  PERAK: "bg-gray-100 text-gray-600 border-gray-300",
  GANGSA: "bg-orange-100 text-orange-700 border-orange-300",
  TIADA: "bg-gray-50 text-gray-400 border-gray-200",
};

export function PingatBadge({ pingat }: { pingat: PingatType }) {
  const { t } = useLanguage();
  return (
    <Badge className={`text-xs font-medium ${pingatStyles[pingat]}`}>
      {t.kejohananResult.pingatTypes[pingat]}
    </Badge>
  );
}
