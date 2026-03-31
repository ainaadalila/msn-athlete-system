"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, UserPlus } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, key: "dashboard" as const },
  { href: "/athletes/new", icon: UserPlus, key: "newAthlete" as const },
];

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <aside className="no-print hidden md:flex w-56 flex-col bg-blue-900 text-white min-h-screen">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-blue-800">
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-white flex items-center justify-center text-blue-900 font-bold text-sm">
          MSN
        </div>
        <div className="leading-tight">
          <p className="text-xs font-semibold">Majlis Sukan Negara</p>
          <p className="text-[10px] text-blue-300">Profil Atlet</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1 px-3">
        {navItems.map(({ href, icon: Icon, key }) => {
          const active =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-blue-700 text-white"
                  : "text-blue-200 hover:bg-blue-800 hover:text-white"
              )}
            >
              <Icon className="w-4 h-4" />
              {t.nav[key]}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t border-blue-800">
        <p className="text-[10px] text-blue-400 text-center">
          Program Pembangunan Sukan Olimpik
        </p>
      </div>
    </aside>
  );
}
