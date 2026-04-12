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
  kejohananReportSchema,
  type KejohananReportForm as KejohananReportFormType,
} from "@/lib/validations/kejohanan.schema";

interface KejohananReportFormProps {
  kejohananId: string;
  athleteId: string;
  athleteName: string;
  defaultValues?: Partial<KejohananReportFormType>;
}

export function KejohananReportForm({
  kejohananId,
  athleteId,
  athleteName,
  defaultValues,
}: KejohananReportFormProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit } = useForm<KejohananReportFormType>({
    resolver: zodResolver(kejohananReportSchema),
    defaultValues: {
      athlete_id: athleteId,
      ringkasan: defaultValues?.ringkasan ?? "",
      catatan: defaultValues?.catatan ?? "",
    },
  });

  async function onSubmit(data: KejohananReportFormType) {
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("kejohanan_report").upsert(
        {
          kejohanan_id: kejohananId,
          athlete_id: data.athlete_id,
          ringkasan: data.ringkasan ?? null,
          catatan: data.catatan ?? null,
        },
        { onConflict: "kejohanan_id,athlete_id" }
      );
      if (error) throw error;
      toast.success("Laporan berjaya disimpan!");
      router.push(`/kejohanan/${kejohananId}/laporan`);
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
          <Label htmlFor="ringkasan">{t.kejohananReport.ringkasan}</Label>
          <Textarea
            id="ringkasan"
            {...register("ringkasan")}
            placeholder="Ringkasan prestasi atlet semasa kejohanan..."
            rows={4}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="catatan">{t.kejohananReport.catatan}</Label>
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
          {saving ? t.common.loading : t.kejohananReport.saveReport}
        </Button>
      </div>
    </form>
  );
}
