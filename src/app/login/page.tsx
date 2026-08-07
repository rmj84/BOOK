import { signIn } from "@/lib/auth";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center gap-6 py-20 text-center">
      <h1 className="text-2xl font-semibold">북로그에 로그인</h1>
      <p className="text-neutral-500">
        읽은 책의 후기를 기록하고 다른 사람들과 공유해보세요.
      </p>
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/feed" });
        }}
      >
        <button
          type="submit"
          className="rounded bg-neutral-900 text-white px-5 py-2.5 font-medium"
        >
          Google로 로그인
        </button>
      </form>
    </div>
  );
}
