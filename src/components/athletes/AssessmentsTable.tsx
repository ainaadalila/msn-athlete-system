"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useLanguage } from "@/context/LanguageContext";
import type { Assessment } from "@/types/athlete";

interface AssessmentsTableProps {
  assessments: Assessment[];
}

export function AssessmentsTable({ assessments }: AssessmentsTableProps) {
  const { t } = useLanguage();

  const rows = Array.from({ length: 5 }, (_, i) => assessments[i] ?? null);

  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700 mb-2">
        {t.assessments.title}
      </h3>
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-700 hover:bg-blue-700">
              <TableHead className="text-white text-xs font-semibold w-12">
                {t.assessments.no}
              </TableHead>
              <TableHead className="text-white text-xs font-semibold">
                {t.assessments.jenisUjian}
              </TableHead>
              <TableHead className="text-white text-xs font-semibold w-32">
                {t.assessments.keputusan}
              </TableHead>
              <TableHead className="text-white text-xs font-semibold w-32">
                {t.assessments.status}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={i} className="text-sm">
                <TableCell className="text-center text-gray-500">
                  {i + 1}
                </TableCell>
                <TableCell>{row?.jenis_ujian ?? ""}</TableCell>
                <TableCell className="text-gray-500">
                  {row?.keputusan ?? ""}
                </TableCell>
                <TableCell>
                  <StatusBadge status={row?.status ?? null} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
