"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLanguage } from "@/context/LanguageContext";
import type { Achievement } from "@/types/athlete";
import { format } from "date-fns";

interface AchievementsTableProps {
  achievements: Achievement[];
}

function formatDateRange(mula: string | null, tamat: string | null): string {
  const fmt = (d: string) => format(new Date(d), "dd/MM/yyyy");
  if (mula && tamat) return `${fmt(mula)} – ${fmt(tamat)}`;
  if (mula) return fmt(mula);
  if (tamat) return fmt(tamat);
  return "";
}

export function AchievementsTable({ achievements }: AchievementsTableProps) {
  const { t } = useLanguage();

  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700 mb-2">
        {t.achievements.title}
      </h3>
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-700 hover:bg-blue-700">
              <TableHead className="text-white text-xs font-semibold">
                {t.achievements.kejohanan}
              </TableHead>
              <TableHead className="text-white text-xs font-semibold w-44">
                {t.achievements.tarikhMula} – {t.achievements.tarikhTamat}
              </TableHead>
              <TableHead className="text-white text-xs font-semibold w-36">
                {t.achievements.acara}
              </TableHead>
              <TableHead className="text-white text-xs font-semibold w-36">
                {t.achievements.catatan}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {achievements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-400 py-6">
                  {t.achievements.noAchievements}
                </TableCell>
              </TableRow>
            ) : (
              achievements.map((row, i) => (
                <TableRow key={i} className="text-sm">
                  <TableCell>{row.kejohanan}</TableCell>
                  <TableCell className="text-gray-500">
                    {formatDateRange(row.tarikh_mula, row.tarikh_tamat)}
                  </TableCell>
                  <TableCell className="text-gray-500">{row.acara ?? ""}</TableCell>
                  <TableCell className="text-gray-500">{row.catatan ?? ""}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
