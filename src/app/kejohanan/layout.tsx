import { AppShell } from "@/components/shared/AppShell";

export default function KejohananLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
