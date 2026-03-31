"use client";

import { UserPlus } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { useLanguage } from "@/context/LanguageContext";

export function EmptyState() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <UserPlus className="w-8 h-8 text-gray-400" />
      </div>
      <p className="text-gray-600 font-medium">{t.dashboard.noAthletes}</p>
      <p className="text-sm text-gray-400 mt-1 mb-6">{t.dashboard.noAthletesHint}</p>
      <LinkButton href="/athletes/new">
        <UserPlus className="w-4 h-4 mr-2" />
        {t.dashboard.registerNew}
      </LinkButton>
    </div>
  );
}
