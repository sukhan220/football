

"use client";

import { signIn, signOut } from "next-auth/react";

/**
 * 🔐 ডাইনামিক সোশ্যাল লগইন ফাংশন
 * @param provider 'google' | 'facebook'
 */
export const login = async (provider: "google" | "facebook") => {
  try {
    await signIn(provider, {
      callbackUrl: "/", // লগইন সফল হওয়ার পর ইউজারকে হোমপেজে রিডাইরেক্ট করবে
    });
  } catch (error) {
    console.error(`${provider} login error:`, error);
  }
};

/**
 * 🚪 লগআউট ফাংশন
 */
export const logout = async () => {
  try {
    await signOut({
      callbackUrl: "/", // লগআউট করার পর হোমপেজে ব্যাক করবে (আপনি চাইলে অন্য পাথও দিতে পারেন)
    });
  } catch (error) {
    console.error("Logout error:", error);
  }
};