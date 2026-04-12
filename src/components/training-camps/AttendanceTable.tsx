"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/context/LanguageContext";
import type { AthleteSummary } from "@/types/athlete";
import type { CampAttendanceWithAthlete, HadirStatus } from "@/types/training-camp";

interface AttendanceRow {
  status_hadir: HadirStatus;
  catatan: string;
}

interface AttendanceTableProps {
  kemId: string;
  athletes: AthleteSummary[];
  existingAttendance: CampAttendanceWithAthlete[];
}

export function AttendanceTable({
  kemId,
  athletes,
  existingAttendance,
}: AttendanceTableProps) {
  const { t } = useLanguage();
  const router = useRouter();

  const initialState: Record<string, AttendanceRow> = {};
  for (const athlete of athletes) {
    const existing = existingAttendance.find((a) => a.athlete_id === athlete.id);
    initialState[athlete.id] = {
      status_hadir: existing?.status_hadir ?? "HADIR",
      catatan: existing?.catatan ?? "",
    };
  }

  const [rows, setRows] = useState<Record<string, AttendanceRow>>(initialState);
  const [saving, setSaving] = useState(false);

  function toggleStatus(athleteId: string) {
    setRows((prev) => ({
      ...prev,
      [athleteId]: {
        ...prev[athleteId],
        status_hadir:
          prev[athleteId].status_hadir === "HADIR" ? "TIDAK HADIR" : "HADIR",
      },
    }));
  }

  function setCatatan(athleteId: string, value: string) {
    setRows((prev) => ({
      ...prev,
      [athleteId]: { ...prev[athleteId], catatan: value },
    }));
  }

  const totalHadir = Object.values(rows).filter(
    (r) => r.status_hadir === "HADIR"
  ).length;

  async function handleSave() {
    setSaving(true);
    try {
      const supabase = createClient();
      const upsertRows = athletes.map((athlete) => ({
        kem_id: kemId,
        athlete_id: athlete.id,
        status_hadir: rows[athlete.id].status_hadir,
        catatan: rows[athlete.id].catatan || null,
      }));

      const { error } = await supabase
        .from("camp_attendance")
        .upsert(upsertRows, { onConflict: "kem_id,athlete_id" });

      if (error) throw error;
      toast.success("Kehadiran berjaya disimpan!");
      router.refresh();
    } catch {
      toast.error("Ralat berlaku. Sila cuba semula.");
    } finally {
      setSaving(false);
    }
  }

  if (athletes.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
        {t.attendance.noAthletes}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {t.attendance.totalHadir}:{" "}
          <span className="font-semibold text-gray-900">
            {totalHadir} / {athletes.length}
          </span>
        </p>
        <Button onClick={handleSave} disabled={saving} size="sm">
          {saving ? t.common.loading : t.attendance.saveAttendance}
        </Button>
      </div>

      <div className="rounded-xl border bg-white overflow-hidden">
        <div className="divide-y">
          {athletes.map((athlete) => {
            const row = rows[athlete.id];
            const isHadir = row.status_hadir === "HADIR";

            return (
              <div
                key={athlete.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/50"
              >
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
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

                {/* Name + acara */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {athlete.nama_atlet}
                  </p>
                  <p className="text-xs text-gray-500">{athlete.acara}</p>
                </div>

                {/* Catatan */}
                <Input
                  className="hidden sm:block w-40 h-8 text-xs"
                  placeholder={t.attendance.catatan}
                  value={row.catatan}
                  onChange={(e) => setCatatan(athlete.id, e.target.value)}
                />

                {/* Toggle */}
                <button
                  type="button"
                  onClick={() => toggleStatus(athlete.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isHadir
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-red-100 text-red-700 hover:bg-red-200"
                  }`}
                >
                  {isHadir ? t.attendance.hadir : t.attendance.tidakHadir}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? t.common.loading : t.attendance.saveAttendance}
        </Button>
      </div>
    </div>
  );
}
