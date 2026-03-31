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

export function AchievementsTable({ achievements }: AchievementsTableProps) {
  const { t } = useLanguage();

  const rows = Array.from({ length: 7 }, (_, i) => achievements[i] ?? null);

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
              <TableHead className="text-white text-xs font-semibold w-28">
                {t.achievements.tarikh}
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
            {rows.map((row, i) => (
              <TableRow key={i} className="text-sm">
                <TableCell>{row?.kejohanan ?? ""}</TableCell>
                <TableCell className="text-gray-500">
                  {row?.tarikh ? format(new Date(row.tarikh), "dd/MM/yyyy") : ""}
                </TableCell>
                <TableCell className="text-gray-500">{row?.acara ?? ""}</TableCell>
                <TableCell className="text-gray-500">{row?.catatan ?? ""}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
