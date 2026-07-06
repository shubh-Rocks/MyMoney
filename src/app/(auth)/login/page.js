"use client";
import Link from "next/link";
import { useAuth } from "@/provider/AuthProvider"; // Apna sahi path confirm kar lein

export default function LoginPage() {
  const { login, loginState, isLoginPending } = useAuth();

  return (
    <div className="min-h-screen bg-[#e5f7db] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#FAF7EF] rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#0E3B53] mb-2 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-[#0E3B53]/70 text-sm font-medium">
            Please enter your details to sign in.
          </p>
        </div>

        <form action={login} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-[#0E3B53] mb-1.5 ml-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="hello@gmail.com"
              className="w-full px-4 py-3.5 bg-white border border-[#0e3b53]/20 rounded-xl text-[#0E3b53] placeholder-[#0E3b53]/40 focus:outline-none focus:border-[#1f9d55] focus:ring-2 focus:ring-[#1f9d55]/30 transition-all shadow-sm"
            />
            {loginState?.fieldErrors?.email && (
              <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">
                {loginState.fieldErrors.email[0]}
              </p>
            )}
          </div>
          <div>
            <div className="flex justify-between items-center mb-1.5 ml-1 mr-1">
              <label className="block text-sm font-bold text-[#0E3B53]">
                Password
              </label>
              <Link
                href="#"
                className="text-xs font-semibold text-[#1F9d55] hover:underline"
              >
                Forget Password
              </Link>
            </div>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="w-full px-4 py-3.5 border border-[#0E3B53]/20 rounded-xl text-[#0E3B53] placeholder-[#0E3B53]/40 focus:outline-none focus:border-[#1F9D55] focus:ring-2 focus:ring-[#1F9D55]/30 transition-all shadow-sm"
            />
            {loginState?.fieldErrors?.password && (
              <p className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center font-medium">
                {loginState.fieldErrors.password[0]}
              </p>
            )}
            <button
              type="submit"
              disabled={isLoginPending}
              className="w-full mt-2 py-3.5 px-4 bg-[#1F9D55] hover:bg-[#1A8A4A] text-[#FAF7EF] font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {isLoginPending ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-[#FAF7EF]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
          <p className="text-center text-[#0E3B53]/80 text-sm mt-6 font-medium">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-[#1F9D55] font-bold hover:underline transition-all"
            >
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
