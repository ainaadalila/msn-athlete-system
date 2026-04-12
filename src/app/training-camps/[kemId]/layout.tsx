import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { CampHeader } from "@/components/training-camps/CampHeader";
import { CampTabNav } from "@/components/training-camps/CampTabNav";
import { DeleteCampDialog } from "@/components/training-camps/DeleteCampDialog";
import { getCampById } from "@/lib/queries/training-camps";

interface LayoutProps {
  params: Promise<{ kemId: string }>;
  children: React.ReactNode;
}

export default async function CampDetailLayout({
  params,
  children,
}: LayoutProps) {
  const { kemId } = await params;
  const camp = await getCampById(kemId);

  if (!camp) notFound();

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Actions bar */}
      <div className="flex items-center justify-between">
        <LinkButton href="/training-camps" variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Kembali
        </LinkButton>
        <div className="flex items-center gap-2">
          <LinkButton
            href={`/training-camps/${kemId}/edit`}
            variant="outline"
            size="sm"
          >
            <Pencil className="w-4 h-4 mr-1" />
            Kemaskini
          </LinkButton>
          <DeleteCampDialog kemId={kemId} />
        </div>
      </div>

      <CampHeader camp={camp} />
      <CampTabNav kemId={kemId} />

      {children}
    </div>
  );
}
