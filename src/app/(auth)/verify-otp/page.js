"use client";
import { apiClient } from "@/lib/api.Client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useActionState, useEffect, useState } from "react";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [resendMsg, setResendMsg] = useState("");
  const [resending, setResending] = useState(false);

  const [state, verifyAction, isPending] = useActionState(
    async (prev, formData) => {
      const otp = formData.get("otp");

      if (!email) {
        return { error: "Email is missing. Please register again.", success: false };
      }

      if (!otp || otp.length !== 6) {
        return { error: "Please enter the 6-digit OTP.", success: false };
      }

      try {
        await apiClient.verifyOtp(email, otp);
        return { error: null, success: true };
      } catch (error) {
        return {
          error: error.message || "Verification failed. Please try again.",
          success: false,
        };
      }
    },
    { error: undefined, success: false },
  );

  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard");
    }
  }, [state?.success, router]);

  const handleResend = async () => {
    if (!email) {
      setResendMsg("Email is missing. Please register again.");
      return;
    }

    setResending(true);
    setResendMsg("");
    try {
      await apiClient.resendOtp(email);
      setResendMsg("OTP resent to your email.");
    } catch (error) {
      setResendMsg(error.message || "Could not resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8fa] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#f6f2f2] rounded-2xl p-6 md:p-8 shadow-xl border border-[#0E3B53]/10">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0E3B53] mb-1 tracking-tight">
            Verify Your Email
          </h2>
          <p className="text-[#0E3B53]/70 text-xs md:text-sm font-medium">
            We sent a 6-digit code to{" "}
            <span className="font-bold">{email || "your email"}</span>
          </p>
        </div>

        <form action={verifyAction} className="space-y-3.5">
          <div>
            <label className="block text-xs md:text-sm font-bold text-[#0E3B53] mb-1 ml-1">
              OTP Code
            </label>
            <input
              name="otp"
              type="number"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              className="w-full px-3.5 py-2.5 bg-white border border-[#0E3B53]/20 rounded-xl text-sm text-center tracking-[0.5em] text-[#0E3B53] placeholder-[#0E3B53]/40 focus:outline-none focus:border-[#1F9D55] focus:ring-2 focus:ring-[#1F9D55]/30 transition-all shadow-sm"
            />
          </div>

          {state?.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs md:text-sm text-center font-medium">
              {state.error}
            </div>
          )}

          {resendMsg && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-xs md:text-sm text-center font-medium">
              {resendMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending || !email}
            className="w-full mt-2 py-3 px-4 bg-[#1F9D55] hover:bg-[#1A8A4A] text-[#FAF7EF] font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center text-sm"
          >
            {isPending ? "Verifying..." : "Verify"}
          </button>

          <p className="text-center text-[#0E3B53]/80 text-xs md:text-sm mt-4 font-medium">
            Didn&apos;t get the code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={resending || !email}
              className="text-[#1F9D55] font-bold hover:underline transition-all disabled:opacity-60"
            >
              {resending ? "Sending..." : "Resend OTP"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpContent />
    </Suspense>
  );
}
