"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";
import {
  fullKejohananSchema,
  type FullKejohananForm,
} from "@/lib/validations/kejohanan.schema";
import { createClient } from "@/lib/supabase/client";

const STATUS_LIST = ["AKAN DATANG", "SEDANG BERLANGSUNG", "SELESAI"] as const;

interface KejohananFormProps {
  mode: "create" | "edit";
  kejohananId?: string;
  defaultValues?: Partial<FullKejohananForm>;
}

export function KejohananForm({
  mode,
  kejohananId,
  defaultValues,
}: KejohananFormProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FullKejohananForm>({
    resolver: zodResolver(fullKejohananSchema),
    defaultValues: {
      status: "AKAN DATANG",
      ...defaultValues,
    },
  });

  async function onSubmit(data: FullKejohananForm) {
    setSaving(true);
    try {
      const supabase = createClient();
      if (mode === "create") {
        const { data: k, error } = await supabase
          .from("kejohanan")
          .insert(data)
          .select("id")
          .single();
        if (error) throw error;
        toast.success("Kejohanan berjaya didaftarkan!");
        router.push(`/kejohanan/${k.id}`);
      } else {
        const { error } = await supabase
          .from("kejohanan")
          .update(data)
          .eq("id", kejohananId!);
        if (error) throw error;
        toast.success("Kejohanan berjaya dikemaskini!");
        router.push(`/kejohanan/${kejohananId}`);
        router.refresh();
      }
    } catch {
      toast.error("Ralat berlaku. Sila cuba semula.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="nama_kejohanan">{t.kejohanan.namaKejohanan} *</Label>
          <Input
            id="nama_kejohanan"
            {...register("nama_kejohanan")}
            placeholder="Cth: Kejohanan Memanah Kebangsaan 2026"
          />
          {errors.nama_kejohanan && (
            <p className="text-xs text-red-500">{errors.nama_kejohanan.message}</p>
          )}
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="lokasi">{t.kejohanan.lokasi} *</Label>
          <Input
            id="lokasi"
            {...register("lokasi")}
            placeholder="Cth: Stadium Panah Kebangsaan, Putrajaya"
          />
          {errors.lokasi && (
            <p className="text-xs text-red-500">{errors.lokasi.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tarikh_mula">{t.kejohanan.tarikhMula} *</Label>
          <Input id="tarikh_mula" type="date" {...register("tarikh_mula")} />
          {errors.tarikh_mula && (
            <p className="text-xs text-red-500">{errors.tarikh_mula.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tarikh_tamat">{t.kejohanan.tarikhTamat} *</Label>
          <Input id="tarikh_tamat" type="date" {...register("tarikh_tamat")} />
          {errors.tarikh_tamat && (
            <p className="text-xs text-red-500">{errors.tarikh_tamat.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>{t.kejohanan.status}</Label>
          <Select
            value={watch("status") ?? "AKAN DATANG"}
            onValueChange={(v) =>
              setValue("status", v as FullKejohananForm["status"], {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_LIST.map((s) => (
                <SelectItem key={s} value={s}>
                  {t.kejohanan.tournamentStatus[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="penerangan">{t.kejohanan.penerangan}</Label>
          <Textarea
            id="penerangan"
            {...register("penerangan")}
            placeholder="Penerangan kejohanan..."
            rows={3}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          {t.common.cancel}
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? t.common.loading : t.common.save}
        </Button>
      </div>
    </form>
  );
}
