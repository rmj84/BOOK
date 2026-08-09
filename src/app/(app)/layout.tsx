import { auth } from "@/lib/auth";
import AppShell from "@/components/app-shell";

export default async function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return <AppShell user={session?.user ?? null}>{children}</AppShell>;
}
