import { AppError } from "@/errors/app-error";
import { authService } from "@/services/auth.service";
import { loginSchema } from "@/validations/auth.validations";
import { NextResponse } from "next/server";
import { Suspense } from "react";
import { success, ZodError } from "zod";

export async function POST(request) {
  try {
    const body = await request.json();

    const validatedData = loginSchema.parse(body);

    const { user, token } = await authService.login(validatedData);

    const response = NextResponse.json(
      {
        success: true,
        data: {
          user,
        },
      },
      {
        status: 200,
      },
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
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "invalid login data",
            details: error.issues,
          },
        },
        { status: 400 },
      );
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
        {
          status: error.statusCode,
        },
      );
    }

    console.error("post/api/auth/login failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "internal server error",
        },
      },
      { status: 500 },
    );
  }
}
