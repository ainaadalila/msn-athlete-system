import { AppShell } from "@/components/shared/AppShell";

export default function TrainingCampsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
