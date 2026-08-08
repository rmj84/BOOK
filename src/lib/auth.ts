import { cache } from "react";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const {
  handlers,
  auth: uncachedAuth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  session: { strategy: "database" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});

// "database" 세션 전략은 auth()를 호출할 때마다 DB 조회가 발생한다.
// 레이아웃과 각 페이지가 매 요청마다 auth()를 각각 호출하므로,
// React의 요청 단위 캐시로 감싸 같은 요청 안에서는 한 번만 조회하게 한다.
const auth = cache(uncachedAuth);

export { handlers, auth, signIn, signOut };
