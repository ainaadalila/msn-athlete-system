export type Acara =
  | "RECURVE LELAKI"
  | "RECURVE PEREMPUAN"
  | "COMPOUND LELAKI"
  | "COMPOUND PEREMPUAN";

export type Negeri =
  | "JOHOR"
  | "KEDAH"
  | "KELANTAN"
  | "MELAKA"
  | "NEGERI SEMBILAN"
  | "PAHANG"
  | "PERAK"
  | "PERLIS"
  | "PULAU PINANG"
  | "SABAH"
  | "SARAWAK"
  | "SELANGOR"
  | "TERENGGANU"
  | "WP KUALA LUMPUR"
  | "WP LABUAN"
  | "WP PUTRAJAYA";

export type AssessmentStatus = "LULUS" | "GAGAL" | "DALAM PROSES";

export interface Athlete {
  id: string;
  nama_atlet: string;
  no_kp: string;
  sukan: string;
  acara: Acara;
  gambar_url: string | null;
  negeri: Negeri | null;
  tarikh_lahir: string | null;
  berat_badan: number | null;
  tinggi: number | null;
  sekolah: string | null;
  jurulatih: string | null;
  no_perhubungan: string | null;
  ulasan_prestasi: string | null;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  athlete_id: string;
  urutan: number;
  kejohanan: string;
  tarikh: string | null;
  acara: string | null;
  catatan: string | null;
}

export interface Assessment {
  id: string;
  athlete_id: string;
  no: number;
  jenis_ujian: string;
  keputusan: string | null;
  status: AssessmentStatus | null;
}

export interface AthleteSummary {
  id: string;
  nama_atlet: string;
  no_kp: string;
  acara: Acara;
  negeri: Negeri | null;
  gambar_url: string | null;
  jurulatih: string | null;
  umur: number | null;
  created_at: string;
  updated_at: string;
}

export interface AthleteWithRelations extends Athlete {
  achievements: Achievement[];
  assessments: Assessment[];
}
