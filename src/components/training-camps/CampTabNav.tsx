"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, Dumbbell, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface CampTabNavProps {
  kemId: string;
}

export function CampTabNav({ kemId }: CampTabNavProps) {
  const { t } = useLanguage();
  const pathname = usePathname();

  const tabs = [
    {
      href: `/training-camps/${kemId}/kehadiran`,
      label: t.trainingCamp.tabKehadiran,
      icon: ClipboardList,
    },
    {
      href: `/training-camps/${kemId}/ujian-kecergasan`,
      label: t.trainingCamp.tabUjian,
      icon: Dumbbell,
    },
    {
      href: `/training-camps/${kemId}/laporan`,
      label: t.trainingCamp.tabLaporan,
      icon: FileText,
    },
  ];

  return (
    <div className="flex gap-1 bg-white rounded-xl border p-1">
      {tabs.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium flex-1 justify-center transition-colors",
              active
                ? "bg-blue-700 text-white"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
          </Link>
        );
      })}
    </div>
  );
}
