"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/context/LanguageContext";
import type { AthleteSummary } from "@/types/athlete";
import type { KejohananSquadWithAthlete } from "@/types/kejohanan";

interface SquadManagerProps {
  kejohananId: string;
  athletes: AthleteSummary[];
  existingSquad: KejohananSquadWithAthlete[];
}

export function SquadManager({
  kejohananId,
  athletes,
  existingSquad,
}: SquadManagerProps) {
  const { t } = useLanguage();
  const router = useRouter();

  const initialSelected = new Set(existingSquad.map((s) => s.athlete_id));
  const [selected, setSelected] = useState<Set<string>>(initialSelected);
  const [saving, setSaving] = useState(false);

  function toggleAthlete(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      const supabase = createClient();

      await supabase
        .from("kejohanan_squad")
        .delete()
        .eq("kejohanan_id", kejohananId);

      const athlete_ids = Array.from(selected);
      if (athlete_ids.length > 0) {
        const { error } = await supabase.from("kejohanan_squad").insert(
          athlete_ids.map((athlete_id) => ({
            kejohanan_id: kejohananId,
            athlete_id,
          }))
        );
        if (error) throw error;
      }

      toast.success("Skuad berjaya disimpan!");
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
        {t.squad.noAthletes}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {t.squad.totalSelected}:{" "}
          <span className="font-semibold text-gray-900">{selected.size} / {athletes.length}</span>
        </p>
        <Button onClick={handleSave} disabled={saving} size="sm">
          {saving ? t.common.loading : t.squad.saveSquad}
        </Button>
      </div>

      <div className="rounded-xl border bg-white overflow-hidden">
        <div className="divide-y">
          {athletes.map((athlete) => {
            const isSelected = selected.has(athlete.id);

            return (
              <div
                key={athlete.id}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                  isSelected ? "bg-blue-50 hover:bg-blue-50" : "hover:bg-gray-50/50"
                }`}
                onClick={() => toggleAthlete(athlete.id)}
              >
                {/* Checkbox */}
                <div
                  className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                    isSelected
                      ? "bg-blue-700 border-blue-700"
                      : "border-gray-300"
                  }`}
                >
                  {isSelected && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>

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

                <span
                  className={`text-xs font-medium flex-shrink-0 ${
                    isSelected ? "text-blue-700" : "text-gray-400"
                  }`}
                >
                  {isSelected ? t.squad.inSquad : t.squad.notInSquad}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? t.common.loading : t.squad.saveSquad}
        </Button>
      </div>
    </div>
  );
}
