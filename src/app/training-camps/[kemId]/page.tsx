import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ kemId: string }>;
}

export default async function CampDetailPage({ params }: PageProps) {
  const { kemId } = await params;
  redirect(`/training-camps/${kemId}/kehadiran`);
}
