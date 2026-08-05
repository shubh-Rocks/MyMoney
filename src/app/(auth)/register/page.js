"use client";
import { apiCLient } from "@/lib/api.Client";
import { registerSchema } from "@/validations/auth.validations";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [state, registerAction, isPending] = useActionState(
    async (prev, formData) => {
      const rawData = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        phone: formData.get("phone"),
      };

      const validatedFields = registerSchema.safeParse(rawData);

      if (!validatedFields.success) {
        return {
          error: "Please fix the validation error below.",
          fieldErrors: validatedFields.error.flatten().fieldErrors,
        };
      }
      try {
        await apiCLient.register(validatedFields.data);
        router.push("/dashboard");
      } catch (error) {
        return {
          error: error.message || "registration failed. Please try again.",
          fieldErrors: error.details?.fieldErrors || null,
        };
      }
    },
    { error: undefined, success: undefined, fieldErrors: undefined },
  );
  return (
    <div className="min-h-screen bg-[#0E3B53] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#FAF7EF] rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#0E3B53] mb-2 tracking-tight">
            Create Account
          </h2>
          <p className="text-[#0E3B53]/70 text-sm font-medium">
            Sign up to get started instantly.
          </p>
        </div>
        <form action={registerAction} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-[#0E3B53] mb-1.5 ml-1">
              Full name
            </label>
            <input
              name="name"
              type="text"
              placeholder="Enter your full name"
              className="w-full px-4 py-3 bg-white border border-[#0E3B53]/20 rounded-xl text-[#0E3B53] placeholder-[#0E3B53]/40 focus:outline-none focus:border-[#1F9D55] focus:ring-2 focus:ring-[#1F9D55]/30 transition-all shadow-sm"
            />
            {state?.fieldErrors?.name && (
              <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">
                {state.fieldErrors.name[0]}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold text-[#0E3B53] mb-1.5 ml-1">
              Email
            </label>
            <input
              type="Email"
              name="email"
              placeholder="Example@gmail.com"
              className="w-full px-4 py-3 bg-white border border-[#0E3B53]/20 rounded-xl text-[#0E3B53] placeholder-[#0E3B53]/40 focus:outline-none focus:border-[#1F9D55] focus:ring-2 focus:ring-[#1F9D55]/30 transition-all shadow-sm"
            />
            {state?.fieldErrors?.email && (
              <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">
                {state.fieldErrors.email[0]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-[#0E3B53] mb-1.5 ml-1">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="9383422872"
              className="w-full px-4 py-3 bg-white border border-[#0E3B53]/20 rounded-xl text-[#0E3B53] placeholder-[#0E3B53]/40 focus:outline-none focus:border-[#1F9D55] focus:ring-2 focus:ring-[#1F9D55]/30 transition-all shadow-sm"
            />
            {state?.fieldErrors?.phone && (
              <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">
                {state.fieldErrors.phone[0]}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold text-[#0E3B53] mb-1.5 ml-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="create a strong password"
              className="w-full px-4 py-3 bg-white border border-[#0E3B53]/20 rounded-xl text-[#0E3B53] placeholder-[#0E3B53]/40 focus:outline-none focus:border-[#1F9D55] focus:ring-2 focus:ring-[#1F9D55]/30 transition-all shadow-sm"
            />
            {state?.fieldErrors?.password && (
              <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">
                {state.fieldErrors.password[0]}
              </p>
            )}
          </div>
          {state?.error && !state?.fieldErrors && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center font-medium">
              {state.error}
            </div>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-4 py-3.5 px-4 bg-[#1F9D55] hover:bg-[#1A8A4A] text-[#FAF7EF] font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
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
          <p className="text-center text-[#0E3B53]/80 text-sm mt-6 font-medium">
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
