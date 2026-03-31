import type { Acara, Negeri } from "@/types/athlete";

export const NEGERI_LIST: Negeri[] = [
  "JOHOR",
  "KEDAH",
  "KELANTAN",
  "MELAKA",
  "NEGERI SEMBILAN",
  "PAHANG",
  "PERAK",
  "PERLIS",
  "PULAU PINANG",
  "SABAH",
  "SARAWAK",
  "SELANGOR",
  "TERENGGANU",
  "WP KUALA LUMPUR",
  "WP LABUAN",
  "WP PUTRAJAYA",
];

export const ACARA_LIST: Acara[] = [
  "RECURVE LELAKI",
  "RECURVE PEREMPUAN",
  "COMPOUND LELAKI",
  "COMPOUND PEREMPUAN",
];

export const ASSESSMENT_STATUS_LIST = [
  "LULUS",
  "GAGAL",
  "DALAM PROSES",
] as const;
