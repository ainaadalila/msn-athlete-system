"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/context/LanguageContext";

export function DeleteKejohananDialog({ kejohananId }: { kejohananId: string }) {
  const { t } = useLanguage();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("kejohanan")
        .delete()
        .eq("id", kejohananId);
      if (error) throw error;
      toast.success("Kejohanan berjaya dipadam.");
      setOpen(false);
      router.push("/kejohanan");
      router.refresh();
    } catch {
      toast.error("Ralat semasa memadam. Sila cuba semula.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <span className="inline-flex items-center gap-1 h-7 px-2.5 text-[0.8rem] font-medium rounded-[min(var(--radius-md),12px)] bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors cursor-pointer select-none">
          <Trash2 className="w-3.5 h-3.5" />
          {t.kejohanan.deleteKejohanan}
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.common.confirmDelete}</DialogTitle>
          <DialogDescription>{t.kejohanan.confirmDeleteMsg}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t.common.cancel}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? t.common.loading : t.common.yes}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
