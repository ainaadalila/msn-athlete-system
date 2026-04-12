import { z } from "zod";

export const fullCampSchema = z.object({
  nama_kem: z.string().min(2, "Nama kem diperlukan"),
  lokasi: z.string().min(2, "Lokasi diperlukan"),
  tarikh_mula: z
    .string()
    .refine((d) => !isNaN(Date.parse(d)), "Tarikh tidak sah"),
  tarikh_tamat: z
    .string()
    .refine((d) => !isNaN(Date.parse(d)), "Tarikh tidak sah"),
  penerangan: z.string().optional().nullable(),
  status: z.enum(["AKTIF", "SELESAI", "DIBATALKAN"]),
});

export type FullCampForm = z.infer<typeof fullCampSchema>;

export const attendanceRowSchema = z.object({
  athlete_id: z.string().uuid(),
  status_hadir: z.enum(["HADIR", "TIDAK HADIR"]).default("HADIR"),
  catatan: z.string().optional().nullable(),
});

export const attendanceBatchSchema = z.object({
  kehadiran: z.array(attendanceRowSchema),
});

export type AttendanceBatchForm = z.infer<typeof attendanceBatchSchema>;
export type AttendanceRowForm = z.infer<typeof attendanceRowSchema>;

export const fitnessTestRowSchema = z.object({
  jenis_ujian: z.string().min(1, "Jenis ujian diperlukan"),
  keputusan: z.string().optional().nullable(),
  status: z
    .enum(["LULUS", "GAGAL", "DALAM PROSES"])
    .optional()
    .nullable(),
});

export const fitnessTestsBatchSchema = z.object({
  athlete_id: z.string().uuid(),
  ujian: z.array(fitnessTestRowSchema),
});

export type FitnessTestsBatchForm = z.infer<typeof fitnessTestsBatchSchema>;
export type FitnessTestRowForm = z.infer<typeof fitnessTestRowSchema>;

export const campReportSchema = z.object({
  athlete_id: z.string().uuid(),
  ringkasan: z.string().optional().nullable(),
  catatan: z.string().optional().nullable(),
});

export type CampReportForm = z.infer<typeof campReportSchema>;
