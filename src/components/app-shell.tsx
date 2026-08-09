import Header from "@/components/header";

type ShellUser = {
  id: string;
  name?: string | null;
  image?: string | null;
} | null;

export default function AppShell({
  user,
  children,
}: {
  user: ShellUser;
  children: React.ReactNode;
}) {
  return (
    <>
      <Header user={user} />
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6">
        {children}
      </main>
    </>
  );
}
