"use client";

import { login } from "@/lib/auth";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#f8fafc]">
      <div className="w-full max-w-[400px] rounded-2xl bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
        
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Welcome to JobList
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to post jobs or apply for opportunities
          </p>
        </div>

        <div className="mt-8">
          <button 
            onClick={login} 
            // এখানে hover:scale-[1.02], active:scale-[0.98] এবং shadow ইফেক্ট যোগ করা হয়েছে
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 hover:shadow-md hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 ease-in-out group"
          >
            <svg
              className="w-5 h-5 text-gray-900 group-hover:scale-110 transition-transform duration-200"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.026 2.747-1.026.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-base font-medium">Continue with GitHub</span>
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[12px] text-gray-400 leading-relaxed px-4">
            By signing in, you agree to our{" "}
            <a href="/terms" className="text-indigo-600 hover:text-indigo-700 hover:underline transition-colors">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-indigo-600 hover:text-indigo-700 hover:underline transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}