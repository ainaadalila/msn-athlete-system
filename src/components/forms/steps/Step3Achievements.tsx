"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/context/LanguageContext";
import type { FullAthleteForm } from "@/lib/validations/athlete.schema";

export function Step3Achievements() {
  const { t } = useLanguage();
  const { register, control } = useFormContext<FullAthleteForm>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "achievements",
  });

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Rekodkan sehingga 7 kejohanan / Record up to 7 tournaments
      </p>

      {fields.length === 0 && (
        <div className="text-center py-8 text-gray-400 border-2 border-dashed rounded-lg">
          {t.achievements.noAchievements}
        </div>
      )}

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 bg-gray-50 rounded-lg relative"
        >
          <div className="sm:col-span-2 space-y-1.5">
            <Label className="text-xs">{t.achievements.kejohanan} *</Label>
            <Input
              {...register(`achievements.${index}.kejohanan`)}
              placeholder="Nama kejohanan"
              className="bg-white"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">{t.achievements.tarikh}</Label>
            <Input
              {...register(`achievements.${index}.tarikh`)}
              type="date"
              className="bg-white"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">{t.achievements.acara}</Label>
            <Input
              {...register(`achievements.${index}.acara`)}
              placeholder="Acara"
              className="bg-white"
            />
          </div>
          <div className="sm:col-span-3 space-y-1.5">
            <Label className="text-xs">{t.achievements.catatan}</Label>
            <Input
              {...register(`achievements.${index}.catatan`)}
              placeholder="Cth: 6 EMAS, RANK 6 - 1278"
              className="bg-white"
            />
          </div>
          <div className="flex items-end">
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
          <input
            type="hidden"
            {...register(`achievements.${index}.urutan`)}
            value={index + 1}
          />
        </div>
      ))}

      {fields.length < 7 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              urutan: fields.length + 1,
              kejohanan: "",
              tarikh: null,
              acara: null,
              catatan: null,
            })
          }
        >
          <Plus className="w-4 h-4 mr-2" />
          {t.achievements.addAchievement}
        </Button>
      )}
    </div>
  );
}
