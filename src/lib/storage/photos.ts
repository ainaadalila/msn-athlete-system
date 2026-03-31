import { createClient } from "@/lib/supabase/client";

const BUCKET = "athlete-photos";

export async function uploadAthletePhoto(
  athleteId: string,
  file: File
): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${athleteId}/profile.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) throw error;

  const { data } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, 60 * 60 * 24 * 365);

  return data!.signedUrl;
}

export async function getAthletePhotoUrl(path: string): Promise<string> {
  const supabase = createClient();
  const { data } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, 60 * 60 * 24 * 7);
  return data?.signedUrl ?? "";
}

export async function deleteAthletePhoto(athleteId: string): Promise<void> {
  const supabase = createClient();
  const { data: files } = await supabase.storage
    .from(BUCKET)
    .list(athleteId);
  if (files && files.length > 0) {
    const paths = files.map((f) => `${athleteId}/${f.name}`);
    await supabase.storage.from(BUCKET).remove(paths);
  }
}
