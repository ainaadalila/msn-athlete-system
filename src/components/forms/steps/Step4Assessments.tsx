"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
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
import { useLanguage } from "@/context/LanguageContext";
import { ASSESSMENT_STATUS_LIST } from "@/lib/constants";
import type { FullAthleteForm } from "@/lib/validations/athlete.schema";
import type { AssessmentStatus } from "@/types/athlete";

export function Step4Assessments() {
  const { t } = useLanguage();
  const { register, control, setValue } = useFormContext<FullAthleteForm>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "assessments",
  });

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        {t.assessments.subtitle}
      </p>

      {fields.length === 0 && (
        <div className="text-center py-8 text-gray-400 border-2 border-dashed rounded-lg">
          {t.assessments.noAssessments}
        </div>
      )}

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 bg-gray-50 rounded-lg"
        >
          <div className="sm:col-span-2 space-y-1.5">
            <Label className="text-xs">{t.assessments.jenisUjian} *</Label>
            <Input
              {...register(`assessments.${index}.jenis_ujian`)}
              placeholder="Jenis ujian"
              className="bg-white"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">{t.assessments.keputusan}</Label>
            <Input
              {...register(`assessments.${index}.keputusan`)}
              placeholder="Keputusan"
              className="bg-white"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">{t.assessments.status}</Label>
            <Select
              defaultValue={field.status ?? ""}
              onValueChange={(v) =>
                setValue(
                  `assessments.${index}.status`,
                  v as AssessmentStatus,
                  { shouldValidate: true }
                )
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
          <input
            type="hidden"
            {...register(`assessments.${index}.no`)}
            value={index + 1}
          />
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

      {fields.length < 5 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              no: fields.length + 1,
              jenis_ujian: "",
              keputusan: null,
              status: null,
            })
          }
        >
          <Plus className="w-4 h-4 mr-2" />
          {t.assessments.addAssessment}
        </Button>
      )}
    </div>
  );
}
