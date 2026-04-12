import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ kejohananId: string }>;
}

export default async function KejohananDetailPage({ params }: PageProps) {
  const { kejohananId } = await params;
  redirect(`/kejohanan/${kejohananId}/squad`);
}
