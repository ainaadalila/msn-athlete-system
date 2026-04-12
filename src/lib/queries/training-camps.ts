import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type {
  FullCampForm,
  AttendanceBatchForm,
  FitnessTestsBatchForm,
  CampReportForm,
} from "@/lib/validations/training-camp.schema";
import type {
  TrainingCampWithCounts,
  CampAttendanceWithAthlete,
  FitnessTestWithAthlete,
  CampReportWithAthlete,
} from "@/types/training-camp";

export interface CampFilters {
  search?: string;
  status?: string;
}

// ── Camps ─────────────────────────────────────────────────────────────────

export async function getCamps(filters: CampFilters = {}) {
  const supabase = createAdminClient();
  let query = supabase
    .from("training_camps")
    .select("*, athlete_count:camp_attendance(count)")
    .order("tarikh_mula", { ascending: false });

  if (filters.search) {
    query = query.ilike("nama_kem", `%${filters.search}%`);
  }
  if (filters.status && filters.status !== "ALL") {
    query = query.eq("status", filters.status);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((camp) => ({
    ...camp,
    athlete_count: (camp.athlete_count as unknown as { count: number }[])?.[0]
      ?.count ?? 0,
  })) as TrainingCampWithCounts[];
}

export async function getCampById(
  id: string
): Promise<TrainingCampWithCounts | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("training_camps")
    .select("*, athlete_count:camp_attendance(count)")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return {
    ...data,
    athlete_count:
      (data.athlete_count as unknown as { count: number }[])?.[0]?.count ?? 0,
  } as TrainingCampWithCounts;
}

export async function createCamp(data: FullCampForm): Promise<{ id: string }> {
  const supabase = await createClient();
  const { data: camp, error } = await supabase
    .from("training_camps")
    .insert(data)
    .select("id")
    .single();
  if (error) throw error;
  return camp;
}

export async function updateCamp(
  id: string,
  data: FullCampForm
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("training_camps")
    .update(data)
    .eq("id", id);
  if (error) throw error;
}

export async function deleteCamp(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("training_camps")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

// ── Attendance ─────────────────────────────────────────────────────────────

export async function getAttendanceByCamp(
  kemId: string
): Promise<CampAttendanceWithAthlete[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("camp_attendance")
    .select("*, athlete:athletes(id, nama_atlet, acara, negeri, gambar_url)")
    .eq("kem_id", kemId)
    .order("created_at");

  if (error) throw error;
  return (data ?? []) as unknown as CampAttendanceWithAthlete[];
}

export async function upsertAttendance(
  kemId: string,
  data: AttendanceBatchForm
): Promise<void> {
  const supabase = await createClient();
  const rows = data.kehadiran.map((row) => ({
    kem_id: kemId,
    athlete_id: row.athlete_id,
    status_hadir: row.status_hadir,
    catatan: row.catatan ?? null,
  }));

  const { error } = await supabase
    .from("camp_attendance")
    .upsert(rows, { onConflict: "kem_id,athlete_id" });
  if (error) throw error;
}

// ── Fitness Tests ──────────────────────────────────────────────────────────

export async function getFitnessTestsByCamp(
  kemId: string
): Promise<FitnessTestWithAthlete[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("fitness_tests")
    .select("*, athlete:athletes(id, nama_atlet)")
    .eq("kem_id", kemId)
    .order("urutan");

  if (error) throw error;
  return (data ?? []) as unknown as FitnessTestWithAthlete[];
}

export async function getFitnessTestsByAthleteCamp(
  kemId: string,
  athleteId: string
): Promise<FitnessTestWithAthlete[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("fitness_tests")
    .select("*, athlete:athletes(id, nama_atlet)")
    .eq("kem_id", kemId)
    .eq("athlete_id", athleteId)
    .order("urutan");

  if (error) throw error;
  return (data ?? []) as unknown as FitnessTestWithAthlete[];
}

export async function saveFitnessTests(
  kemId: string,
  data: FitnessTestsBatchForm
): Promise<void> {
  const supabase = await createClient();

  await supabase
    .from("fitness_tests")
    .delete()
    .eq("kem_id", kemId)
    .eq("athlete_id", data.athlete_id);

  if (data.ujian.length > 0) {
    const { error } = await supabase.from("fitness_tests").insert(
      data.ujian.map((u, i) => ({
        kem_id: kemId,
        athlete_id: data.athlete_id,
        jenis_ujian: u.jenis_ujian,
        keputusan: u.keputusan ?? null,
        status: u.status ?? null,
        urutan: i + 1,
      }))
    );
    if (error) throw error;
  }
}

// ── Camp Reports ───────────────────────────────────────────────────────────

export async function getReportsByCamp(
  kemId: string
): Promise<CampReportWithAthlete[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("camp_reports")
    .select(
      "*, athlete:athletes(id, nama_atlet, acara, negeri, gambar_url)"
    )
    .eq("kem_id", kemId)
    .order("created_at");

  if (error) throw error;
  return (data ?? []) as unknown as CampReportWithAthlete[];
}

export async function getReportByAthleteAndCamp(
  kemId: string,
  athleteId: string
): Promise<CampReportWithAthlete | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("camp_reports")
    .select(
      "*, athlete:athletes(id, nama_atlet, acara, negeri, gambar_url)"
    )
    .eq("kem_id", kemId)
    .eq("athlete_id", athleteId)
    .maybeSingle();

  if (error) throw error;
  return data as unknown as CampReportWithAthlete | null;
}

export async function upsertReport(
  kemId: string,
  data: CampReportForm
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("camp_reports").upsert(
    {
      kem_id: kemId,
      athlete_id: data.athlete_id,
      ringkasan: data.ringkasan ?? null,
      catatan: data.catatan ?? null,
    },
    { onConflict: "kem_id,athlete_id" }
  );
  if (error) throw error;
}
