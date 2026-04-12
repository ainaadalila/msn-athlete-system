"use client";

import { Users, Tent, Trophy, Medal } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface StatCardsProps {
  totalAthletes: number;
  activeCamps: number;
  upcomingTournaments: number;
  totalMedals: number;
}

export function StatCards({
  totalAthletes,
  activeCamps,
  upcomingTournaments,
  totalMedals,
}: StatCardsProps) {
  const { t } = useLanguage();

  const cards = [
    {
      label: t.dashboard.totalAthletes,
      value: totalAthletes,
      icon: Users,
      bg: "bg-blue-100",
      iconColor: "text-blue-700",
    },
    {
      label: t.dashboard.activeCamps,
      value: activeCamps,
      icon: Tent,
      bg: "bg-green-100",
      iconColor: "text-green-700",
    },
    {
      label: t.dashboard.upcomingTournaments,
      value: upcomingTournaments,
      icon: Trophy,
      bg: "bg-purple-100",
      iconColor: "text-purple-700",
    },
    {
      label: t.dashboard.totalMedals,
      value: totalMedals,
      icon: Medal,
      bg: "bg-amber-100",
      iconColor: "text-amber-700",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon, bg, iconColor }) => (
        <div
          key={label}
          className="rounded-xl border bg-white p-4 flex items-center gap-3"
        >
          <div
            className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center shrink-0`}
          >
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <div>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
