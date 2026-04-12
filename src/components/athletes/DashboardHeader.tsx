"use client";

import { Users } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { UserPlus } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function DashboardHeader() {
  const { t } = useLanguage();
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
          <Users className="w-5 h-5 text-blue-700" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{t.dashboard.title}</h1>
          <p className="text-xs text-gray-500">
            {t.athlete.subtitle}
          </p>
        </div>
      </div>
      <LinkButton href="/athletes/new" size="sm">
        <UserPlus className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">{t.dashboard.registerNew}</span>
        <span className="sm:hidden">{t.common.submit}</span>
      </LinkButton>
    </div>
  );
}
