"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

export function PrintButton() {
  const { t } = useLanguage();
  return (
    <Button variant="outline" size="sm" onClick={() => window.print()}>
      <Printer className="w-4 h-4 mr-1" />
      {t.common.print}
    </Button>
  );
}
