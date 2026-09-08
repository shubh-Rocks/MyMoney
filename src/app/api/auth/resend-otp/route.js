import { AppError } from "@/errors/app-error";
import { authService } from "@/services/auth.service";
import { resendOtpSchema } from "@/validations/auth.validations";
import { NextResponse } from "next/server";
import z, { ZodError } from "zod";

export async function POST(req) {
  try {
    const body = await req.json();

    const validatedData = resendOtpSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: z.flattenError(validatedData.error),
        },
        { status: 400 },
      );
    }

    const result = await authService.resendOtp(validatedData.data);

    return NextResponse.json(
      { success: true, message: result.message },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({
        success: false,
        error: {
          code: "validation error",
          message: "invalid data",
          details: error.issues,
        },
      });
    }
    if (error instanceof AppError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message,
          },
        },
        { status: error.statusCode },
      );
    }

    console.log("post/api/auth/resend-otp failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNALS_ERROR",
          message: "internal server error",
        },
      },
      { status: 500 },
    );
  }
}
