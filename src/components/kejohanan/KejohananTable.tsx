"use client";

import { Eye, Pencil, Calendar, MapPin, Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LinkButton } from "@/components/ui/link-button";
import { useLanguage } from "@/context/LanguageContext";
import { KejohananStatusBadge } from "./KejohananStatusBadge";
import type { KejohananWithCounts } from "@/types/kejohanan";
import { format } from "date-fns";

interface KejohananTableProps {
  kejohananList: KejohananWithCounts[];
}

export function KejohananTable({ kejohananList }: KejohananTableProps) {
  const { t } = useLanguage();

  return (
    <div className="rounded-xl border bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>{t.kejohanan.namaKejohanan}</TableHead>
            <TableHead className="hidden sm:table-cell">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {t.kejohanan.lokasi}
              </span>
            </TableHead>
            <TableHead className="hidden md:table-cell">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {t.kejohanan.tarikhMula}
              </span>
            </TableHead>
            <TableHead className="hidden md:table-cell">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {t.kejohanan.tarikhTamat}
              </span>
            </TableHead>
            <TableHead className="hidden lg:table-cell text-center">
              <span className="flex items-center justify-center gap-1">
                <Users className="w-3.5 h-3.5" />
                Skuad
              </span>
            </TableHead>
            <TableHead>{t.kejohanan.status}</TableHead>
            <TableHead className="w-24 text-right">Tindakan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {kejohananList.map((k) => (
            <TableRow key={k.id} className="hover:bg-gray-50/50">
              <TableCell className="font-medium">{k.nama_kejohanan}</TableCell>
              <TableCell className="hidden sm:table-cell text-sm text-gray-600">
                {k.lokasi}
              </TableCell>
              <TableCell className="hidden md:table-cell text-sm text-gray-600">
                {format(new Date(k.tarikh_mula), "dd/MM/yyyy")}
              </TableCell>
              <TableCell className="hidden md:table-cell text-sm text-gray-600">
                {format(new Date(k.tarikh_tamat), "dd/MM/yyyy")}
              </TableCell>
              <TableCell className="hidden lg:table-cell text-center text-sm text-gray-600">
                {k.squad_count}
              </TableCell>
              <TableCell>
                <KejohananStatusBadge status={k.status} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <LinkButton
                    href={`/kejohanan/${k.id}`}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <Eye className="w-4 h-4" />
                  </LinkButton>
                  <LinkButton
                    href={`/kejohanan/${k.id}/edit`}
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
