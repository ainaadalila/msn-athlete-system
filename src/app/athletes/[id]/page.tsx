import { notFound } from "next/navigation";
import { Pencil, ArrowLeft } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { AthleteProfileCard } from "@/components/athletes/AthleteProfileCard";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
import { PrintButton } from "@/components/shared/PrintButton";
import { getAthleteById } from "@/lib/queries/athletes";

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function AthleteProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const athlete = await getAthleteById(id);

  if (!athlete) notFound();

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Actions bar */}
      <div className="flex items-center justify-between no-print">
        <LinkButton href="/dashboard" variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Kembali / Back
        </LinkButton>
        <div className="flex items-center gap-2">
          <PrintButton />
          <LinkButton href={`/athletes/${id}/edit`} variant="outline" size="sm">
            <Pencil className="w-4 h-4 mr-1" />
            Kemaskini / Edit
          </LinkButton>
          <ConfirmDeleteDialog athleteId={id} />
        </div>
      </div>

      <AthleteProfileCard athlete={athlete} />
    </div>
  );
}
