"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/context/LanguageContext";
import {
  campReportSchema,
  type CampReportForm as CampReportFormType,
} from "@/lib/validations/training-camp.schema";

interface CampReportFormProps {
  kemId: string;
  athleteId: string;
  athleteName: string;
  defaultValues?: Partial<CampReportFormType>;
}

export function CampReportForm({
  kemId,
  athleteId,
  athleteName,
  defaultValues,
}: CampReportFormProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit } = useForm<CampReportFormType>({
    resolver: zodResolver(campReportSchema),
    defaultValues: {
      athlete_id: athleteId,
      ringkasan: defaultValues?.ringkasan ?? "",
      catatan: defaultValues?.catatan ?? "",
    },
  });

  async function onSubmit(data: CampReportFormType) {
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("camp_reports").upsert(
        {
          kem_id: kemId,
          athlete_id: data.athlete_id,
          ringkasan: data.ringkasan ?? null,
          catatan: data.catatan ?? null,
        },
        { onConflict: "kem_id,athlete_id" }
      );
      if (error) throw error;
      toast.success("Laporan berjaya disimpan!");
      router.push(`/training-camps/${kemId}/laporan`);
      router.refresh();
    } catch {
      toast.error("Ralat berlaku. Sila cuba semula.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="rounded-xl border bg-white p-5 space-y-4">
        <h3 className="font-semibold text-gray-900">{athleteName}</h3>

        <div className="space-y-1.5">
          <Label htmlFor="ringkasan">{t.campReport.ringkasan}</Label>
          <Textarea
            id="ringkasan"
            {...register("ringkasan")}
            placeholder="Ringkasan prestasi atlet semasa kem..."
            rows={4}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="catatan">{t.campReport.catatan}</Label>
          <Textarea
            id="catatan"
            {...register("catatan")}
            placeholder="Catatan jurulatih..."
            rows={4}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          {t.common.cancel}
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? t.common.loading : t.campReport.saveReport}
        </Button>
      </div>
    </form>
  );
}
