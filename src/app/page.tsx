import { redirect } from "next/navigation";
import { auth, signIn } from "@/lib/auth";

export default async function Home() {
  const session = await auth();
  if (session?.user) redirect("/shelf");

  return (
    <div className="flex flex-col items-center gap-6 py-24 text-center">
      <h1 className="text-3xl font-bold">읽은 책, 기록하고 공유하세요</h1>
      <p className="text-neutral-500 max-w-md">
        내가 읽은 책에 별점과 후기를 남기고, 친구들의 독서 기록도 팔로우해서
        받아보세요.
      </p>
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/shelf" });
        }}
      >
        <button
          type="submit"
          className="rounded bg-neutral-900 text-white px-5 py-2.5 font-medium"
        >
          Google로 시작하기
        </button>
      </form>
    </div>
  );
}
