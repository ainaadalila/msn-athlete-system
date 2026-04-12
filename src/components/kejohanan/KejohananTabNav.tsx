"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Medal, BarChart3, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface KejohananTabNavProps {
  kejohananId: string;
}

export function KejohananTabNav({ kejohananId }: KejohananTabNavProps) {
  const { t } = useLanguage();
  const pathname = usePathname();

  const tabs = [
    {
      href: `/kejohanan/${kejohananId}/squad`,
      label: t.kejohanan.tabSquad,
      icon: Users,
    },
    {
      href: `/kejohanan/${kejohananId}/keputusan`,
      label: t.kejohanan.tabKeputusan,
      icon: Medal,
    },
    {
      href: `/kejohanan/${kejohananId}/statistik`,
      label: t.kejohanan.tabStatistik,
      icon: BarChart3,
    },
    {
      href: `/kejohanan/${kejohananId}/laporan`,
      label: t.kejohanan.tabLaporan,
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
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium flex-1 justify-center transition-colors",
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
