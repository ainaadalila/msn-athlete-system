"use client";

import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhotoUpload } from "@/components/athletes/PhotoUpload";
import { useLanguage } from "@/context/LanguageContext";
import { ACARA_LIST } from "@/lib/constants";
import type { FullAthleteForm } from "@/lib/validations/athlete.schema";

interface Step1Props {
  pendingPhotoFile: File | null;
  onPhotoChange: (file: File | null, previewUrl: string | null) => void;
}

export function Step1PersonalId({ pendingPhotoFile: _pendingPhotoFile, onPhotoChange }: Step1Props) {
  const { t } = useLanguage();
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<FullAthleteForm>();

  const gambarUrl = watch("gambar_url");

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Photo */}
        <div className="space-y-1.5">
          <Label>{t.athlete.gambar}</Label>
          <PhotoUpload
            value={gambarUrl}
            onChange={(file, previewUrl) => {
              onPhotoChange(file, previewUrl);
              setValue("gambar_url", previewUrl);
            }}
          />
        </div>

        {/* Fields */}
        <div className="flex-1 space-y-4">
          {/* Nama Atlet */}
          <div className="space-y-1.5">
            <Label htmlFor="nama_atlet">{t.athlete.namaAtlet} *</Label>
            <Input
              id="nama_atlet"
              {...register("nama_atlet")}
              placeholder="Cth: AHMAD BIN ALI"
              onChange={(e) =>
                setValue("nama_atlet", e.target.value.toUpperCase(), {
                  shouldValidate: true,
                })
              }
            />
            {errors.nama_atlet && (
              <p className="text-xs text-red-500">{errors.nama_atlet.message}</p>
            )}
          </div>

          {/* No K/P */}
          <div className="space-y-1.5">
            <Label htmlFor="no_kp">{t.athlete.noKp} *</Label>
            <Input
              id="no_kp"
              {...register("no_kp")}
              placeholder="000000-00-0000"
              onChange={(e) => {
                const val = e.target.value;
                setValue("no_kp", val, { shouldValidate: true });
                const digits = val.replace(/-/g, "");
                if (digits.length >= 6) {
                  const yy = parseInt(digits.slice(0, 2), 10);
                  const mm = digits.slice(2, 4);
                  const dd = digits.slice(4, 6);
                  const year = yy <= new Date().getFullYear() % 100 ? 2000 + yy : 1900 + yy;
                  setValue("tarikh_lahir", `${year}-${mm}-${dd}`, { shouldValidate: false });
                }
              }}
            />
            {errors.no_kp && (
              <p className="text-xs text-red-500">{errors.no_kp.message}</p>
            )}
          </div>

          {/* Sukan (locked) */}
          <div className="space-y-1.5">
            <Label>{t.athlete.sukan}</Label>
            <Input value="MEMANAH" disabled className="bg-gray-50" />
            <input type="hidden" {...register("sukan")} value="MEMANAH" />
          </div>

          {/* Acara */}
          <div className="space-y-1.5">
            <Label>{t.athlete.acara} *</Label>
            <Select
              value={watch("acara") ?? ""}
              onValueChange={(v) =>
                setValue("acara", v as FullAthleteForm["acara"], {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih acara..." />
              </SelectTrigger>
              <SelectContent>
                {ACARA_LIST.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.acara && (
              <p className="text-xs text-red-500">{errors.acara.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
