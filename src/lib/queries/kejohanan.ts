import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type {
  FullKejohananForm,
  SquadBatchForm,
  KejohananResultForm,
  KejohananReportForm,
} from "@/lib/validations/kejohanan.schema";
import type {
  KejohananWithCounts,
  KejohananSquadWithAthlete,
  KejohananResultWithAthlete,
  KejohananReportWithAthlete,
} from "@/types/kejohanan";

export interface KejohananFilters {
  search?: string;
  status?: string;
}

// ── Kejohanan CRUD ─────────────────────────────────────────────────────────

export async function getKejohananList(
  filters: KejohananFilters = {}
): Promise<KejohananWithCounts[]> {
  const supabase = createAdminClient();
  let query = supabase
    .from("kejohanan")
    .select("*, squad_count:kejohanan_squad(count)")
    .order("tarikh_mula", { ascending: false });

  if (filters.search) {
    query = query.ilike("nama_kejohanan", `%${filters.search}%`);
  }
  if (filters.status && filters.status !== "ALL") {
    query = query.eq("status", filters.status);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((k) => ({
    ...k,
    squad_count:
      (k.squad_count as unknown as { count: number }[])?.[0]?.count ?? 0,
  })) as KejohananWithCounts[];
}

export async function getKejohananById(
  id: string
): Promise<KejohananWithCounts | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("kejohanan")
    .select("*, squad_count:kejohanan_squad(count)")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return {
    ...data,
    squad_count:
      (data.squad_count as unknown as { count: number }[])?.[0]?.count ?? 0,
  } as KejohananWithCounts;
}

export async function createKejohanan(
  data: FullKejohananForm
): Promise<{ id: string }> {
  const supabase = await createClient();
  const { data: k, error } = await supabase
    .from("kejohanan")
    .insert(data)
    .select("id")
    .single();
  if (error) throw error;
  return k;
}

export async function updateKejohanan(
  id: string,
  data: FullKejohananForm
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("kejohanan")
    .update(data)
    .eq("id", id);
  if (error) throw error;
}

export async function deleteKejohanan(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("kejohanan").delete().eq("id", id);
  if (error) throw error;
}

// ── Squad ─────────────────────────────────────────────────────────────────

export async function getSquadByKejohanan(
  kejohananId: string
): Promise<KejohananSquadWithAthlete[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("kejohanan_squad")
    .select("*, athlete:athletes(id, nama_atlet, acara, negeri, gambar_url)")
    .eq("kejohanan_id", kejohananId)
    .order("created_at");

  if (error) throw error;
  return (data ?? []) as unknown as KejohananSquadWithAthlete[];
}

export async function saveSquad(
  kejohananId: string,
  data: SquadBatchForm
): Promise<void> {
  const supabase = await createClient();

  await supabase
    .from("kejohanan_squad")
    .delete()
    .eq("kejohanan_id", kejohananId);

  if (data.athlete_ids.length > 0) {
    const { error } = await supabase.from("kejohanan_squad").insert(
      data.athlete_ids.map((athlete_id) => ({
        kejohanan_id: kejohananId,
        athlete_id,
      }))
    );
    if (error) throw error;
  }
}

// ── Results ───────────────────────────────────────────────────────────────

export async function getResultsByKejohanan(
  kejohananId: string
): Promise<KejohananResultWithAthlete[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("kejohanan_result")
    .select("*, athlete:athletes(id, nama_atlet, acara, negeri, gambar_url)")
    .eq("kejohanan_id", kejohananId)
    .order("placement", { ascending: true, nullsFirst: false });

  if (error) throw error;
  return (data ?? []) as unknown as KejohananResultWithAthlete[];
}

export async function getResultByAthleteAndKejohanan(
  kejohananId: string,
  athleteId: string
): Promise<KejohananResultWithAthlete | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("kejohanan_result")
    .select("*, athlete:athletes(id, nama_atlet, acara, negeri, gambar_url)")
    .eq("kejohanan_id", kejohananId)
    .eq("athlete_id", athleteId)
    .maybeSingle();

  if (error) throw error;
  return data as unknown as KejohananResultWithAthlete | null;
}

export async function upsertResult(
  kejohananId: string,
  data: KejohananResultForm
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("kejohanan_result").upsert(
    {
      kejohanan_id: kejohananId,
      athlete_id: data.athlete_id,
      placement: data.placement ?? null,
      skor: data.skor ?? null,
      pingat: data.pingat ?? null,
    },
    { onConflict: "kejohanan_id,athlete_id" }
  );
  if (error) throw error;
}

// ── Reports ───────────────────────────────────────────────────────────────

export async function getReportsByKejohanan(
  kejohananId: string
): Promise<KejohananReportWithAthlete[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("kejohanan_report")
    .select("*, athlete:athletes(id, nama_atlet, acara, negeri, gambar_url)")
    .eq("kejohanan_id", kejohananId)
    .order("created_at");

  if (error) throw error;
  return (data ?? []) as unknown as KejohananReportWithAthlete[];
}

export async function getReportByAthleteAndKejohanan(
  kejohananId: string,
  athleteId: string
): Promise<KejohananReportWithAthlete | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("kejohanan_report")
    .select("*, athlete:athletes(id, nama_atlet, acara, negeri, gambar_url)")
    .eq("kejohanan_id", kejohananId)
    .eq("athlete_id", athleteId)
    .maybeSingle();

  if (error) throw error;
  return data as unknown as KejohananReportWithAthlete | null;
}

export async function upsertKejohananReport(
  kejohananId: string,
  data: KejohananReportForm
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("kejohanan_report").upsert(
    {
      kejohanan_id: kejohananId,
      athlete_id: data.athlete_id,
      ringkasan: data.ringkasan ?? null,
      catatan: data.catatan ?? null,
    },
    { onConflict: "kejohanan_id,athlete_id" }
  );
  if (error) throw error;
}
