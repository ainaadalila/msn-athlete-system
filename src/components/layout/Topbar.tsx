"use client";

import { useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";

export function Topbar({ title }: { title?: string }) {
  const { t, lang, setLang } = useLanguage();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="no-print flex items-center justify-between h-14 px-4 bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        {/* Mobile menu placeholder */}
        <button className="md:hidden p-1.5 rounded hover:bg-gray-100">
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        {title && (
          <h1 className="text-base font-semibold text-gray-800">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Language toggle */}
        <button
          onClick={() => setLang(lang === "bm" ? "en" : "bm")}
          className="text-xs font-medium px-2.5 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
        >
          {lang === "bm" ? "EN" : "BM"}
        </button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-gray-600 hover:text-red-600"
        >
          <LogOut className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline text-xs">{t.nav.logout}</span>
        </Button>
      </div>
    </header>
  );
}
