export type KejohananStatus = "AKAN DATANG" | "SEDANG BERLANGSUNG" | "SELESAI";
export type PingatType = "EMAS" | "PERAK" | "GANGSA" | "TIADA";

export interface Kejohanan {
  id: string;
  nama_kejohanan: string;
  lokasi: string;
  tarikh_mula: string;
  tarikh_tamat: string;
  penerangan: string | null;
  status: KejohananStatus;
  created_at: string;
  updated_at: string;
}

export interface KejohananSquad {
  id: string;
  kejohanan_id: string;
  athlete_id: string;
  created_at: string;
}

export interface KejohananResult {
  id: string;
  kejohanan_id: string;
  athlete_id: string;
  placement: number | null;
  skor: string | null;
  pingat: PingatType | null;
  created_at: string;
  updated_at: string;
}

export interface KejohananReport {
  id: string;
  kejohanan_id: string;
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

export interface KejohananSquadWithAthlete extends KejohananSquad {
  athlete: AthleteRef;
}

export interface KejohananResultWithAthlete extends KejohananResult {
  athlete: AthleteRef;
}

export interface KejohananReportWithAthlete extends KejohananReport {
  athlete: AthleteRef;
}

export interface KejohananWithCounts extends Kejohanan {
  squad_count: number;
}

export interface KejohananStatistik {
  jumlah_atlet: number;
  pingat_emas: number;
  pingat_perak: number;
  pingat_gangsa: number;
  tiada_pingat: number;
  keputusan: KejohananResultWithAthlete[];
}
