"use client";

import { useLanguage } from "@/context/LanguageContext";

export function NewAthleteHeader() {
  const { t } = useLanguage();
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900">{t.nav.newAthlete}</h1>
      <p className="text-sm text-gray-500 mt-1">{t.athlete.subtitle}</p>
    </div>
  );
}
