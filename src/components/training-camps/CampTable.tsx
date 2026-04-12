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
import { CampStatusBadge } from "./CampStatusBadge";
import type { TrainingCampWithCounts } from "@/types/training-camp";
import { format } from "date-fns";

interface CampTableProps {
  camps: TrainingCampWithCounts[];
}

export function CampTable({ camps }: CampTableProps) {
  const { t } = useLanguage();

  return (
    <div className="rounded-xl border bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>{t.trainingCamp.namaKem}</TableHead>
            <TableHead className="hidden sm:table-cell">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {t.trainingCamp.lokasi}
              </span>
            </TableHead>
            <TableHead className="hidden md:table-cell">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {t.trainingCamp.tarikhMula}
              </span>
            </TableHead>
            <TableHead className="hidden md:table-cell">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {t.trainingCamp.tarikhTamat}
              </span>
            </TableHead>
            <TableHead className="hidden lg:table-cell text-center">
              <span className="flex items-center justify-center gap-1">
                <Users className="w-3.5 h-3.5" />
                Atlet
              </span>
            </TableHead>
            <TableHead>{t.trainingCamp.status}</TableHead>
            <TableHead className="w-24 text-right">Tindakan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {camps.map((camp) => (
            <TableRow key={camp.id} className="hover:bg-gray-50/50">
              <TableCell className="font-medium">{camp.nama_kem}</TableCell>
              <TableCell className="hidden sm:table-cell text-sm text-gray-600">
                {camp.lokasi}
              </TableCell>
              <TableCell className="hidden md:table-cell text-sm text-gray-600">
                {format(new Date(camp.tarikh_mula), "dd/MM/yyyy")}
              </TableCell>
              <TableCell className="hidden md:table-cell text-sm text-gray-600">
                {format(new Date(camp.tarikh_tamat), "dd/MM/yyyy")}
              </TableCell>
              <TableCell className="hidden lg:table-cell text-center text-sm text-gray-600">
                {camp.athlete_count}
              </TableCell>
              <TableCell>
                <CampStatusBadge status={camp.status} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <LinkButton
                    href={`/training-camps/${camp.id}`}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <Eye className="w-4 h-4" />
                  </LinkButton>
                  <LinkButton
                    href={`/training-camps/${camp.id}/edit`}
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
