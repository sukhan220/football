"use client";

import { login } from "@/lib/auth";

export default function SignInPage() {
  return (
    <div className="flex justify-center py-10 px-4">
      <div className="w-full max-w-[340px] text-center">

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full border shadow-sm flex items-center justify-center">
            <span className="font-bold text-lg">DA</span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-xl">
          Welcome to Dugout Adda
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Discover premium football talent management and unlock elite career opportunities.
        </p>

        {/* Buttons */}
        <div className="mt-8 space-y-3">

          

          <button
            onClick={() => login("google")}
            className="w-full h-12 rounded-xl border border-zinc-300 bg-white font-semibold flex items-center justify-center gap-2 hover:bg-zinc-50"
          >
            <img
              src="https://authjs.dev/img/providers/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Sign in with Google
          </button>

          <button
            onClick={() => login("facebook")}
            className="w-full h-12 rounded-xl border border-zinc-300 bg-[#1877F2]  border-zinc-300 bg-white font-semibold flex items-center justify-center gap-2"
          >
            <img
              src="https://authjs.dev/img/providers/facebook.svg"
              alt="Facebook"
              className="w-5 h-5 brightness-0 invert"
            />
           Sign in with Facebook
          </button>

        </div>

        <p className="mt-6 text-xs text-zinc-500">
          By signing in, you agree to our Terms and Privacy Policy.
        </p>

      </div>
    </div>
  );
}