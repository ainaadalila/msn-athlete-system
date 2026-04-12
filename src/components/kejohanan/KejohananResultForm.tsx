"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/context/LanguageContext";
import {
  kejohananResultSchema,
  type KejohananResultForm as KejohananResultFormType,
} from "@/lib/validations/kejohanan.schema";

const PINGAT_LIST = ["EMAS", "PERAK", "GANGSA", "TIADA"] as const;

interface KejohananResultFormProps {
  kejohananId: string;
  athleteId: string;
  athleteName: string;
  defaultValues?: Partial<KejohananResultFormType>;
}

export function KejohananResultForm({
  kejohananId,
  athleteId,
  athleteName,
  defaultValues,
}: KejohananResultFormProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, setValue, watch } =
    useForm<KejohananResultFormType>({
      resolver: zodResolver(kejohananResultSchema),
      defaultValues: {
        athlete_id: athleteId,
        placement: defaultValues?.placement ?? undefined,
        skor: defaultValues?.skor ?? "",
        pingat: defaultValues?.pingat ?? undefined,
      },
    });

  async function onSubmit(data: KejohananResultFormType) {
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("kejohanan_result").upsert(
        {
          kejohanan_id: kejohananId,
          athlete_id: data.athlete_id,
          placement: data.placement ?? null,
          skor: data.skor ?? null,
          pingat: data.pingat ?? null,
        },
        { onConflict: "kejohanan_id,athlete_id" }
      );
      if (error) throw error;
      toast.success("Keputusan berjaya disimpan!");
      router.push(`/kejohanan/${kejohananId}/keputusan`);
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="placement">{t.kejohananResult.placement}</Label>
            <Input
              id="placement"
              type="number"
              min={1}
              {...register("placement", { valueAsNumber: true })}
              placeholder="Cth: 1"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="skor">{t.kejohananResult.skor}</Label>
            <Input
              id="skor"
              {...register("skor")}
              placeholder="Cth: 672pts"
            />
          </div>

          <div className="space-y-1.5">
            <Label>{t.kejohananResult.pingat}</Label>
            <Select
              value={watch("pingat") ?? ""}
              onValueChange={(v) =>
                setValue(
                  "pingat",
                  v as KejohananResultFormType["pingat"],
                  { shouldValidate: true }
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih pingat..." />
              </SelectTrigger>
              <SelectContent>
                {PINGAT_LIST.map((p) => (
                  <SelectItem key={p} value={p}>
                    {t.kejohananResult.pingatTypes[p]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          {t.common.cancel}
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? t.common.loading : t.kejohananResult.saveResult}
        </Button>
      </div>
    </form>
  );
}
