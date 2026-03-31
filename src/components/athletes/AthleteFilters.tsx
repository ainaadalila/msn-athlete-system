"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";
import { NEGERI_LIST, ACARA_LIST } from "@/lib/constants";

export function AthleteFilters() {
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "ALL") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder={t.dashboard.searchPlaceholder}
          defaultValue={searchParams.get("search") ?? ""}
          onChange={(e) => updateParam("search", e.target.value)}
          className="pl-9"
        />
      </div>

      <Select
        defaultValue={searchParams.get("negeri") ?? "ALL"}
        onValueChange={(v) => updateParam("negeri", v ?? "ALL")}
      >
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder={t.dashboard.filterNegeri} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">{t.common.all}</SelectItem>
          {NEGERI_LIST.map((n) => (
            <SelectItem key={n} value={n}>
              {n}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue={searchParams.get("acara") ?? "ALL"}
        onValueChange={(v) => updateParam("acara", v ?? "ALL")}
      >
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder={t.dashboard.filterAcara} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">{t.common.all}</SelectItem>
          {ACARA_LIST.map((a) => (
            <SelectItem key={a} value={a}>
              {a}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
