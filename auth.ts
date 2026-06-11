import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";

const prisma = new PrismaClient();

export const { auth, handlers, signIn, signOut } = NextAuth({

  session: {
    strategy: "jwt",
  },

  providers: [
    GitHub,
    
  ],

  
  adapter: PrismaAdapter(prisma as any),

  callbacks: {

    async jwt({ token, user }) {

      if (user) {

        token.id = user.id;
        token.name = user.name;
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {

      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
      }

      return session;
    },
  },
});