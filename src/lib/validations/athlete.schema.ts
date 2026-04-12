import { z } from "zod";

export const step1Schema = z.object({
  nama_atlet: z.string().min(2, "Nama diperlukan"),
  no_kp: z
    .string()
    .regex(/^\d{6}-\d{2}-\d{4}$/, "Format: XXXXXX-XX-XXXX"),
  sukan: z.literal("MEMANAH"),
  acara: z.enum([
    "RECURVE LELAKI",
    "RECURVE PEREMPUAN",
    "COMPOUND LELAKI",
    "COMPOUND PEREMPUAN",
  ]),
  gambar_url: z.string().nullable().optional(),
});

export const step2Schema = z.object({
  negeri: z.string().min(1, "Sila pilih negeri"),
  tarikh_lahir: z
    .string()
    .refine((d) => !isNaN(Date.parse(d)), "Tarikh tidak sah"),
  berat_badan: z.coerce
    .number()
    .positive()
    .max(200)
    .nullable()
    .optional(),
  tinggi: z.coerce.number().positive().max(250).nullable().optional(),
  sekolah: z.string().optional().nullable(),
  jurulatih: z.string().optional().nullable(),
  no_perhubungan: z.string().optional().nullable(),
});

export const achievementRowSchema = z.object({
  urutan: z.number().min(1),
  kejohanan: z.string().min(1, "Nama kejohanan diperlukan"),
  tarikh_mula: z.string().optional().nullable(),
  tarikh_tamat: z.string().optional().nullable(),
  acara: z.string().optional().nullable(),
  catatan: z.string().optional().nullable(),
});

export const step3Schema = z.object({
  achievements: z.array(achievementRowSchema),
});

export const assessmentRowSchema = z.object({
  no: z.number().min(1).max(5),
  jenis_ujian: z.string().min(1, "Jenis ujian diperlukan"),
  keputusan: z.string().optional().nullable(),
  status: z
    .enum(["LULUS", "GAGAL", "DALAM PROSES"])
    .optional()
    .nullable(),
});

export const step4Schema = z.object({
  assessments: z.array(assessmentRowSchema).max(5),
});

export const step5Schema = z.object({
  ulasan_prestasi: z.string().optional().nullable(),
});

export const fullAthleteSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema)
  .merge(step5Schema);

export type FullAthleteForm = z.infer<typeof fullAthleteSchema>;
export type Step1Form = z.infer<typeof step1Schema>;
export type Step2Form = z.infer<typeof step2Schema>;
export type Step3Form = z.infer<typeof step3Schema>;
export type Step4Form = z.infer<typeof step4Schema>;
export type Step5Form = z.infer<typeof step5Schema>;
