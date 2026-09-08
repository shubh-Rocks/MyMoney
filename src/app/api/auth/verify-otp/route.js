import { AppError } from "@/errors/app-error";
import { authService } from "@/services/auth.service";
import { verifyOtpSchema } from "@/validations/auth.validations";
import { NextResponse } from "next/server";
import z, { ZodError } from "zod";

export async function POST(req) {
  try {
    const body = await req.json();

    const validatedData = verifyOtpSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: z.flattenError(validatedData.error),
        },
        { status: 400 },
      );
    }

    const { user, token } = await authService.verifyOtp(validatedData.data);

    const response = NextResponse.json(
      { success: true, data: { user } },
      { status: 200 },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({
        success: false,
        error: {
          code: "validation error",
          message: "invalid otp data",
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

    console.log("post/api/auth/verify-otp failed:", error);

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
