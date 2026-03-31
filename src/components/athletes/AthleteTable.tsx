"use client";

import Image from "next/image";
import { Eye, Pencil } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import { useLanguage } from "@/context/LanguageContext";
import type { AthleteSummary } from "@/types/athlete";

interface AthleteTableProps {
  athletes: AthleteSummary[];
}

export function AthleteTable({ athletes }: AthleteTableProps) {
  const { t } = useLanguage();

  return (
    <div className="rounded-xl border bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-12"></TableHead>
            <TableHead>{t.athlete.namaAtlet}</TableHead>
            <TableHead className="hidden sm:table-cell">{t.athlete.acara}</TableHead>
            <TableHead className="hidden md:table-cell">{t.athlete.negeri}</TableHead>
            <TableHead className="hidden lg:table-cell">{t.athlete.jurulatih}</TableHead>
            <TableHead className="hidden lg:table-cell text-center">{t.athlete.umur}</TableHead>
            <TableHead className="w-24 text-right">Tindakan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {athletes.map((athlete) => (
            <TableRow key={athlete.id} className="hover:bg-gray-50/50">
              <TableCell>
                <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  {athlete.gambar_url ? (
                    <Image
                      src={athlete.gambar_url}
                      alt={athlete.nama_atlet}
                      width={36}
                      height={36}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-xs font-bold text-gray-400">
                      {athlete.nama_atlet.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium">{athlete.nama_atlet}</TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge variant="secondary" className="text-xs">
                  {athlete.acara}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell text-sm text-gray-600">
                {athlete.negeri ?? "—"}
              </TableCell>
              <TableCell className="hidden lg:table-cell text-sm text-gray-600">
                {athlete.jurulatih ?? "—"}
              </TableCell>
              <TableCell className="hidden lg:table-cell text-center text-sm text-gray-600">
                {athlete.umur ?? "—"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <LinkButton
                    href={`/athletes/${athlete.id}`}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <Eye className="w-4 h-4" />
                  </LinkButton>
                  <LinkButton
                    href={`/athletes/${athlete.id}/edit`}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <Pencil className="w-4 h-4" />
                  </LinkButton>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
