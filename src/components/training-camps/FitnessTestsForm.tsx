"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  fitnessTestsBatchSchema,
  type FitnessTestsBatchForm,
} from "@/lib/validations/training-camp.schema";
import { ASSESSMENT_STATUS_LIST } from "@/lib/constants";
import type { AssessmentStatus } from "@/types/athlete";
import type { FitnessTestWithAthlete } from "@/types/training-camp";

interface FitnessTestsFormProps {
  kemId: string;
  athleteId: string;
  athleteName: string;
  defaultValues?: FitnessTestWithAthlete[];
}

export function FitnessTestsForm({
  kemId,
  athleteId,
  athleteName,
  defaultValues = [],
}: FitnessTestsFormProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const { register, control, setValue, handleSubmit, formState: { errors } } =
    useForm<FitnessTestsBatchForm>({
      resolver: zodResolver(fitnessTestsBatchSchema),
      defaultValues: {
        athlete_id: athleteId,
        ujian: defaultValues.map((ft) => ({
          jenis_ujian: ft.jenis_ujian,
          keputusan: ft.keputusan,
          status: ft.status,
        })),
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ujian",
  });

  async function onSubmit(data: FitnessTestsBatchForm) {
    setSaving(true);
    try {
      const supabase = createClient();

      // Delete existing tests for this athlete in this camp
      await supabase
        .from("fitness_tests")
        .delete()
        .eq("kem_id", kemId)
        .eq("athlete_id", athleteId);

      // Re-insert
      if (data.ujian.length > 0) {
        const { error } = await supabase.from("fitness_tests").insert(
          data.ujian.map((u, i) => ({
            kem_id: kemId,
            athlete_id: athleteId,
            jenis_ujian: u.jenis_ujian,
            keputusan: u.keputusan ?? null,
            status: u.status ?? null,
            urutan: i + 1,
          }))
        );
        if (error) throw error;
      }

      toast.success("Ujian kecergasan berjaya disimpan!");
      router.push(`/training-camps/${kemId}/ujian-kecergasan`);
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
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{athleteName}</h3>
        </div>

        {fields.length === 0 && (
          <div className="text-center py-8 text-gray-400 border-2 border-dashed rounded-lg">
            {t.fitnessTests.noTests}
          </div>
        )}

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 bg-gray-50 rounded-lg"
          >
            <div className="sm:col-span-2 space-y-1.5">
              <Label className="text-xs">{t.fitnessTests.jenisUjian} *</Label>
              <Input
                {...register(`ujian.${index}.jenis_ujian`)}
                placeholder="Cth: Lari 100m"
                className="bg-white"
              />
              {errors.ujian?.[index]?.jenis_ujian && (
                <p className="text-xs text-red-500">
                  {errors.ujian[index].jenis_ujian?.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{t.fitnessTests.keputusan}</Label>
              <Input
                {...register(`ujian.${index}.keputusan`)}
                placeholder="Cth: 11.2s"
                className="bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{t.fitnessTests.status}</Label>
              <Select
                defaultValue={field.status ?? ""}
                onValueChange={(v) =>
                  setValue(`ujian.${index}.status`, v as AssessmentStatus, {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {ASSESSMENT_STATUS_LIST.map((s) => (
                    <SelectItem key={s} value={s}>
                      {t.status[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end sm:col-start-4 sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                className="text-red-400 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({ jenis_ujian: "", keputusan: null, status: null })
          }
        >
          <Plus className="w-4 h-4 mr-2" />
          {t.fitnessTests.addTest}
        </Button>
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          {t.common.cancel}
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? t.common.loading : t.fitnessTests.saveTests}
        </Button>
      </div>
    </form>
  );
}
