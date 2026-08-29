"use client";
import { apiClient } from "@/lib/api.Client";
import { registerSchema } from "@/validations/auth.validations";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [state, registerAction, isPending] = useActionState(
    async (prev, formData) => {
      const rawData = {
        fullName: formData.get("fullName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        businessName: formData.get("businessName"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
      };

      const validatedFields = registerSchema.safeParse(rawData);
      console.log("Validation Result:", validatedFields);

      if (!validatedFields.success) {
        return {
          error: "Please fix the validation errors below.",
          fieldErrors: validatedFields.error.flatten().fieldErrors,
          success: false,
        };
      }

      try {
        await apiClient.register(validatedFields.data);
        return { error: null, fieldErrors: null, success: true };
      } catch (error) {
        return {
          error: error.message || "Registration failed. Please try again.",
          fieldErrors: error.details?.fieldErrors || null,
          success: false,
        };
      }
    },
    { error: undefined, success: false, fieldErrors: undefined },
  );

  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard");
    }
  }, [state?.success, router]);

  return (
    <div className="min-h-screen bg-[#f6f8fa] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#f6f2f2] rounded-2xl p-6 md:p-8 shadow-xl border border-[#0E3B53]/10">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0E3B53] mb-1 tracking-tight">
            Create Account
          </h2>
          <p className="text-[#0E3B53]/70 text-xs md:text-sm font-medium">
            Sign up to get started instantly.
          </p>
        </div>

        <form action={registerAction} className="space-y-3.5">
          <div>
            <label className="block text-xs md:text-sm font-bold text-[#0E3B53] mb-1 ml-1">
              Full Name
            </label>
            <input
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              className="w-full px-3.5 py-2.5 bg-white border border-[#0E3B53]/20 rounded-xl text-sm text-[#0E3B53] placeholder-[#0E3B53]/40 focus:outline-none focus:border-[#1F9D55] focus:ring-2 focus:ring-[#1F9D55]/30 transition-all shadow-sm"
            />
            {state?.fieldErrors?.fullName && (
              <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
                {state.fieldErrors.fullName[0]}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs md:text-sm font-bold text-[#0E3B53] mb-1 ml-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 bg-white border border-[#0E3B53]/20 rounded-xl text-sm text-[#0E3B53] placeholder-[#0E3B53]/40 focus:outline-none focus:border-[#1F9D55] focus:ring-2 focus:ring-[#1F9D55]/30 transition-all shadow-sm"
              />
              {state?.fieldErrors?.email && (
                <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
                  {state.fieldErrors.email[0]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs md:text-sm font-bold text-[#0E3B53] mb-1 ml-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="9383422872"
                className="w-full px-3.5 py-2.5 bg-white border border-[#0E3B53]/20 rounded-xl text-sm text-[#0E3B53] placeholder-[#0E3B53]/40 focus:outline-none focus:border-[#1F9D55] focus:ring-2 focus:ring-[#1F9D55]/30 transition-all shadow-sm"
              />
              {state?.fieldErrors?.phone && (
                <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
                  {state.fieldErrors.phone[0]}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs md:text-sm font-bold text-[#0E3B53] mb-1 ml-1">
              Business Name
            </label>
            <input
              type="text"
              name="businessName"
              placeholder="Enter your business name"
              className="w-full px-3.5 py-2.5 bg-white border border-[#0E3B53]/20 rounded-xl text-sm text-[#0E3B53] placeholder-[#0E3B53]/40 focus:outline-none focus:border-[#1F9D55] focus:ring-2 focus:ring-[#1F9D55]/30 transition-all shadow-sm"
            />
            {state?.fieldErrors?.businessName && (
              <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
                {state.fieldErrors.businessName[0]}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs md:text-sm font-bold text-[#0E3B53] mb-1 ml-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-white border border-[#0E3B53]/20 rounded-xl text-sm text-[#0E3B53] placeholder-[#0E3B53]/40 focus:outline-none focus:border-[#1F9D55] focus:ring-2 focus:ring-[#1F9D55]/30 transition-all shadow-sm"
              />
              {state?.fieldErrors?.password && (
                <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
                  {state.fieldErrors.password[0]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs md:text-sm font-bold text-[#0E3B53] mb-1 ml-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-white border border-[#0E3B53]/20 rounded-xl text-sm text-[#0E3B53] placeholder-[#0E3B53]/40 focus:outline-none focus:border-[#1F9D55] focus:ring-2 focus:ring-[#1F9D55]/30 transition-all shadow-sm"
              />
              {state?.fieldErrors?.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
                  {state.fieldErrors.confirmPassword[0]}
                </p>
              )}
            </div>
          </div>

          {state?.error && !state?.fieldErrors && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs md:text-sm text-center font-medium">
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-2 py-3 px-4 bg-[#1F9D55] hover:bg-[#1A8A4A] text-[#FAF7EF] font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center text-sm"
          >
            {isPending ? (
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
                Creating account...
              </span>
            ) : (
              "Sign Up"
            )}
          </button>

          <p className="text-center text-[#0E3B53]/80 text-xs md:text-sm mt-4 font-medium">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#1F9D55] font-bold hover:underline transition-all"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
