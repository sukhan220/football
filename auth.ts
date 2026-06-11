// import NextAuth from "next-auth";
// import GitHub from "next-auth/providers/github";
// import { PrismaClient } from "@/app/generated/prisma/client";
// import { PrismaAdapter } from "@auth/prisma-adapter";

// const prisma = new PrismaClient();

// export const { auth, handlers, signIn, signOut } = NextAuth({

//   session: {
//     strategy: "jwt",
//   },

//   providers: [
//     GitHub,
    
//   ],

  
//   adapter: PrismaAdapter(prisma as any),

//   callbacks: {

//     async jwt({ token, user }) {

//       if (user) {

//         token.id = user.id;
//         token.name = user.name;
//         token.role = user.role;
//       }

//       return token;
//     },

//     async session({ session, token }) {

//       if (session.user) {
//         session.user.id = token.id as string;
//         session.user.name = token.name as string;
//         session.user.role = token.role as string;
//       }

//       return session;
//     },
//   },
// });

import NextAuth, { type DefaultSession, type User } from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { JWT } from "next-auth/jwt";

const prisma = new PrismaClient();

// ===================================================
// ⚡ টাইপস্ক্রিপ্টকে 'role' এবং 'id' চেনানোর জন্য টাইপ অগমেন্টেশন
// ===================================================
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}

// ===================================================
// ⚽ NEXT AUTH CONFIGURATION
// ===================================================
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
        // ⚡ এখন টাইপস্ক্রিপ্ট এখানে আর লাল দাগ দেবে না
        token.role = user.role; 
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        // ⚡ সেশন অবজেক্টেও টাইপ সেফলি সেট হবে
        session.user.role = token.role as string; 
      }
      return session;
    },
  },
});