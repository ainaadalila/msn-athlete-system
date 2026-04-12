import type { AssessmentStatus } from "./athlete";

export type KemStatus = "AKTIF" | "SELESAI" | "DIBATALKAN";
export type HadirStatus = "HADIR" | "TIDAK HADIR";

export interface TrainingCamp {
  id: string;
  nama_kem: string;
  lokasi: string;
  tarikh_mula: string;
  tarikh_tamat: string;
  penerangan: string | null;
  status: KemStatus;
  created_at: string;
  updated_at: string;
}

export interface CampAttendance {
  id: string;
  kem_id: string;
  athlete_id: string;
  status_hadir: HadirStatus;
  catatan: string | null;
  created_at: string;
  updated_at: string;
}

export interface FitnessTest {
  id: string;
  kem_id: string;
  athlete_id: string;
  jenis_ujian: string;
  keputusan: string | null;
  status: AssessmentStatus | null;
  urutan: number;
  created_at: string;
}

export interface CampReport {
  id: string;
  kem_id: string;
  athlete_id: string;
  ringkasan: string | null;
  catatan: string | null;
  created_at: string;
  updated_at: string;
}

export interface AthleteRef {
  id: string;
  nama_atlet: string;
  acara: string;
  negeri: string | null;
  gambar_url: string | null;
}

export interface CampAttendanceWithAthlete extends CampAttendance {
  athlete: AthleteRef;
}

export interface FitnessTestWithAthlete extends FitnessTest {
  athlete: { id: string; nama_atlet: string };
}

export interface CampReportWithAthlete extends CampReport {
  athlete: AthleteRef;
}

export interface TrainingCampWithCounts extends TrainingCamp {
  athlete_count: number;
}
