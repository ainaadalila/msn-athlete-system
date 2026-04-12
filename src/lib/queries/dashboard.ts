import { createAdminClient } from "@/lib/supabase/admin";

export async function getDashboardStats() {
  const supabase = createAdminClient();
  const [athletes, camps, kejohanan, medals] = await Promise.all([
    supabase.from("athletes").select("*", { count: "exact", head: true }),
    supabase
      .from("training_camps")
      .select("*", { count: "exact", head: true })
      .eq("status", "AKTIF"),
    supabase
      .from("kejohanan")
      .select("*", { count: "exact", head: true })
      .in("status", ["AKAN DATANG", "SEDANG BERLANGSUNG"]),
    supabase
      .from("kejohanan_result")
      .select("*", { count: "exact", head: true })
      .neq("pingat", "TIADA"),
  ]);
  return {
    totalAthletes: athletes.count ?? 0,
    activeCamps: camps.count ?? 0,
    upcomingTournaments: kejohanan.count ?? 0,
    totalMedals: medals.count ?? 0,
  };
}
