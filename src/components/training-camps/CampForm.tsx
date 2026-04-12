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
import { fullCampSchema, type FullCampForm } from "@/lib/validations/training-camp.schema";
import { createClient } from "@/lib/supabase/client";

const STATUS_LIST = ["AKTIF", "SELESAI", "DIBATALKAN"] as const;

interface CampFormProps {
  mode: "create" | "edit";
  kemId?: string;
  defaultValues?: Partial<FullCampForm>;
}

export function CampForm({ mode, kemId, defaultValues }: CampFormProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FullCampForm>({
    resolver: zodResolver(fullCampSchema),
    defaultValues: {
      status: "AKTIF",
      ...defaultValues,
    },
  });

  async function onSubmit(data: FullCampForm) {
    setSaving(true);
    try {
      const supabase = createClient();
      if (mode === "create") {
        const { data: camp, error } = await supabase
          .from("training_camps")
          .insert(data)
          .select("id")
          .single();
        if (error) throw error;
        toast.success("Kem latihan berjaya didaftarkan!");
        router.push(`/training-camps/${camp.id}`);
      } else {
        const { error } = await supabase
          .from("training_camps")
          .update(data)
          .eq("id", kemId!);
        if (error) throw error;
        toast.success("Kem latihan berjaya dikemaskini!");
        router.push(`/training-camps/${kemId}`);
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
        {/* Nama Kem */}
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="nama_kem">{t.trainingCamp.namaKem} *</Label>
          <Input
            id="nama_kem"
            {...register("nama_kem")}
            placeholder="Cth: Kem Latihan Intensif April 2026"
          />
          {errors.nama_kem && (
            <p className="text-xs text-red-500">{errors.nama_kem.message}</p>
          )}
        </div>

        {/* Lokasi */}
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="lokasi">{t.trainingCamp.lokasi} *</Label>
          <Input
            id="lokasi"
            {...register("lokasi")}
            placeholder="Cth: Pusat Sukan Kebangsaan, Bukit Jalil"
          />
          {errors.lokasi && (
            <p className="text-xs text-red-500">{errors.lokasi.message}</p>
          )}
        </div>

        {/* Tarikh Mula */}
        <div className="space-y-1.5">
          <Label htmlFor="tarikh_mula">{t.trainingCamp.tarikhMula} *</Label>
          <Input id="tarikh_mula" type="date" {...register("tarikh_mula")} />
          {errors.tarikh_mula && (
            <p className="text-xs text-red-500">{errors.tarikh_mula.message}</p>
          )}
        </div>

        {/* Tarikh Tamat */}
        <div className="space-y-1.5">
          <Label htmlFor="tarikh_tamat">{t.trainingCamp.tarikhTamat} *</Label>
          <Input id="tarikh_tamat" type="date" {...register("tarikh_tamat")} />
          {errors.tarikh_tamat && (
            <p className="text-xs text-red-500">{errors.tarikh_tamat.message}</p>
          )}
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <Label>{t.trainingCamp.status}</Label>
          <Select
            value={watch("status") ?? "AKTIF"}
            onValueChange={(v) =>
              setValue("status", v as FullCampForm["status"], { shouldValidate: true })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_LIST.map((s) => (
                <SelectItem key={s} value={s}>
                  {t.trainingCamp.kemStatus[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Penerangan */}
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="penerangan">{t.trainingCamp.penerangan}</Label>
          <Textarea
            id="penerangan"
            {...register("penerangan")}
            placeholder="Penerangan kem latihan..."
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
