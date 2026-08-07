import Link from "next/link";
import { signIn, signOut } from "@/lib/auth";

type HeaderUser = {
  id: string;
  name?: string | null;
  image?: string | null;
} | null;

export default function Header({ user }: { user: HeaderUser }) {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="max-w-2xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-2">
        <Link href="/" className="font-semibold text-lg shrink-0">
          북로그
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm overflow-x-auto whitespace-nowrap">
          <Link href="/feed">피드</Link>
          <Link href="/reviews/new">후기 쓰기</Link>
          {user ? (
            <>
              <Link href={`/u/${user.id}`}>내 프로필</Link>
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <button type="submit" className="text-neutral-500 shrink-0">
                  로그아웃
                </button>
              </form>
            </>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn("google");
              }}
              className="shrink-0"
            >
              <button
                type="submit"
                className="rounded bg-neutral-900 text-white px-3 py-1.5"
              >
                로그인
              </button>
            </form>
          )}
        </nav>
      </div>
    </header>
  );
}
