import { z } from "zod";

export const fullKejohananSchema = z.object({
  nama_kejohanan: z.string().min(2, "Nama kejohanan diperlukan"),
  lokasi: z.string().min(2, "Lokasi diperlukan"),
  tarikh_mula: z
    .string()
    .refine((d) => !isNaN(Date.parse(d)), "Tarikh tidak sah"),
  tarikh_tamat: z
    .string()
    .refine((d) => !isNaN(Date.parse(d)), "Tarikh tidak sah"),
  penerangan: z.string().optional().nullable(),
  status: z.enum(["AKAN DATANG", "SEDANG BERLANGSUNG", "SELESAI"]),
});

export type FullKejohananForm = z.infer<typeof fullKejohananSchema>;

export const squadBatchSchema = z.object({
  athlete_ids: z.array(z.string().uuid()),
});

export type SquadBatchForm = z.infer<typeof squadBatchSchema>;

export const kejohananResultSchema = z.object({
  athlete_id: z.string().uuid(),
  placement: z.number().int().positive().optional().nullable(),
  skor: z.string().optional().nullable(),
  pingat: z.enum(["EMAS", "PERAK", "GANGSA", "TIADA"]).optional().nullable(),
});

export type KejohananResultForm = z.infer<typeof kejohananResultSchema>;

export const kejohananReportSchema = z.object({
  athlete_id: z.string().uuid(),
  ringkasan: z.string().optional().nullable(),
  catatan: z.string().optional().nullable(),
});

export type KejohananReportForm = z.infer<typeof kejohananReportSchema>;
