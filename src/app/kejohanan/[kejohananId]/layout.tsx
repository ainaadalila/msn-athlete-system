import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { KejohananHeader } from "@/components/kejohanan/KejohananHeader";
import { KejohananTabNav } from "@/components/kejohanan/KejohananTabNav";
import { DeleteKejohananDialog } from "@/components/kejohanan/DeleteKejohananDialog";
import { getKejohananById } from "@/lib/queries/kejohanan";

interface LayoutProps {
  params: Promise<{ kejohananId: string }>;
  children: React.ReactNode;
}

export default async function KejohananDetailLayout({
  params,
  children,
}: LayoutProps) {
  const { kejohananId } = await params;
  const kejohanan = await getKejohananById(kejohananId);

  if (!kejohanan) notFound();

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <LinkButton href="/kejohanan" variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Kembali
        </LinkButton>
        <div className="flex items-center gap-2">
          <LinkButton
            href={`/kejohanan/${kejohananId}/edit`}
            variant="outline"
            size="sm"
          >
            <Pencil className="w-4 h-4 mr-1" />
            Kemaskini
          </LinkButton>
          <DeleteKejohananDialog kejohananId={kejohananId} />
        </div>
      </div>

      <KejohananHeader kejohanan={kejohanan} />
      <KejohananTabNav kejohananId={kejohananId} />

      {children}
    </div>
  );
}
