import { createClient } from "@/lib/supabase/server";
import type { FullAthleteForm } from "@/lib/validations/athlete.schema";
import type { AthleteWithRelations } from "@/types/athlete";

export interface AthleteFilters {
  search?: string;
  negeri?: string;
  acara?: string;
}

export async function getAthletes(filters: AthleteFilters = {}) {
  const supabase = await createClient();
  let query = supabase
    .from("athlete_summary")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters.search) {
    query = query.ilike("nama_atlet", `%${filters.search}%`);
  }
  if (filters.negeri && filters.negeri !== "ALL") {
    query = query.eq("negeri", filters.negeri);
  }
  if (filters.acara && filters.acara !== "ALL") {
    query = query.eq("acara", filters.acara);
  }

  return query;
}

export async function getAthleteById(
  id: string
): Promise<AthleteWithRelations | null> {
  const supabase = await createClient();

  const [athleteRes, achievementsRes, assessmentsRes] = await Promise.all([
    supabase.from("athletes").select("*").eq("id", id).single(),
    supabase
      .from("achievements")
      .select("*")
      .eq("athlete_id", id)
      .order("urutan"),
    supabase
      .from("assessments")
      .select("*")
      .eq("athlete_id", id)
      .order("no"),
  ]);

  if (!athleteRes.data) return null;

  return {
    ...athleteRes.data,
    achievements: achievementsRes.data ?? [],
    assessments: assessmentsRes.data ?? [],
  };
}

export async function createAthlete(
  data: FullAthleteForm & { gambar_url?: string | null }
) {
  const supabase = await createClient();

  const { achievements, assessments, ...athleteData } = data;

  const { data: athlete, error } = await supabase
    .from("athletes")
    .insert(athleteData)
    .select()
    .single();

  if (error) throw error;

  if (achievements && achievements.length > 0) {
    const { error: achError } = await supabase.from("achievements").insert(
      achievements.map((a) => ({ ...a, athlete_id: athlete.id }))
    );
    if (achError) throw achError;
  }

  if (assessments && assessments.length > 0) {
    const { error: assError } = await supabase.from("assessments").insert(
      assessments.map((a) => ({ ...a, athlete_id: athlete.id }))
    );
    if (assError) throw assError;
  }

  return athlete;
}

export async function updateAthlete(
  id: string,
  data: FullAthleteForm & { gambar_url?: string | null }
) {
  const supabase = await createClient();

  const { achievements, assessments, ...athleteData } = data;

  const { error } = await supabase
    .from("athletes")
    .update(athleteData)
    .eq("id", id);

  if (error) throw error;

  // Delete and re-insert related rows
  await supabase.from("achievements").delete().eq("athlete_id", id);
  await supabase.from("assessments").delete().eq("athlete_id", id);

  if (achievements && achievements.length > 0) {
    const { error: achError } = await supabase.from("achievements").insert(
      achievements.map((a) => ({ ...a, athlete_id: id }))
    );
    if (achError) throw achError;
  }

  if (assessments && assessments.length > 0) {
    const { error: assError } = await supabase.from("assessments").insert(
      assessments.map((a) => ({ ...a, athlete_id: id }))
    );
    if (assError) throw assError;
  }
}

export async function deleteAthlete(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("athletes").delete().eq("id", id);
  if (error) throw error;
}
