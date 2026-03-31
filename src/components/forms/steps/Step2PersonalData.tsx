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
import { useLanguage } from "@/context/LanguageContext";
import { NEGERI_LIST } from "@/lib/constants";
import type { FullAthleteForm } from "@/lib/validations/athlete.schema";

export function Step2PersonalData() {
  const { t } = useLanguage();
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<FullAthleteForm>();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Negeri */}
      <div className="space-y-1.5">
        <Label>{t.athlete.negeri} *</Label>
        <Select
          defaultValue={(watch("negeri") ?? "") as string}
          onValueChange={(v) =>
            setValue("negeri", v ?? "", { shouldValidate: true })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih negeri..." />
          </SelectTrigger>
          <SelectContent>
            {NEGERI_LIST.map((n) => (
              <SelectItem key={n} value={n}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.negeri && (
          <p className="text-xs text-red-500">{errors.negeri.message}</p>
        )}
      </div>

      {/* Tarikh Lahir */}
      <div className="space-y-1.5">
        <Label htmlFor="tarikh_lahir">{t.athlete.tarikhLahir} *</Label>
        <Input id="tarikh_lahir" type="date" {...register("tarikh_lahir")} />
        {errors.tarikh_lahir && (
          <p className="text-xs text-red-500">{errors.tarikh_lahir.message}</p>
        )}
      </div>

      {/* Berat Badan */}
      <div className="space-y-1.5">
        <Label htmlFor="berat_badan">{t.athlete.beratBadan}</Label>
        <Input
          id="berat_badan"
          type="number"
          step="0.1"
          min="0"
          max="200"
          {...register("berat_badan")}
          placeholder="60.0"
        />
        {errors.berat_badan && (
          <p className="text-xs text-red-500">{errors.berat_badan.message}</p>
        )}
      </div>

      {/* Tinggi */}
      <div className="space-y-1.5">
        <Label htmlFor="tinggi">{t.athlete.tinggi}</Label>
        <Input
          id="tinggi"
          type="number"
          step="0.1"
          min="0"
          max="250"
          {...register("tinggi")}
          placeholder="165.0"
        />
        {errors.tinggi && (
          <p className="text-xs text-red-500">{errors.tinggi.message}</p>
        )}
      </div>

      {/* Sekolah */}
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="sekolah">{t.athlete.sekolah}</Label>
        <Input
          id="sekolah"
          {...register("sekolah")}
          placeholder="Cth: SMK Ahmad, Kuantan"
        />
      </div>

      {/* Jurulatih */}
      <div className="space-y-1.5">
        <Label htmlFor="jurulatih">{t.athlete.jurulatih}</Label>
        <Input
          id="jurulatih"
          {...register("jurulatih")}
          placeholder="Nama jurulatih"
        />
      </div>

      {/* No Perhubungan */}
      <div className="space-y-1.5">
        <Label htmlFor="no_perhubungan">{t.athlete.noPerhubungan}</Label>
        <Input
          id="no_perhubungan"
          {...register("no_perhubungan")}
          placeholder="01X-XXXXXXX"
        />
      </div>
    </div>
  );
}
