import { AppError } from "@/errors/app-error";
import { verifyToken } from "@/lib/auth";
import { authService } from "@/services/auth.service";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "UNAUTHENTICATED",
          message: "you are not authenticated",
        },
        { status: 401 },
      );
    }

    const decoded = await verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID TOKEN",
            message: "you are not authenticated",
          },
        },
        { status: 401 },
      );
    }

    const user = await authService.getCurrentUser(decoded.id);

    return NextResponse.json(
      {
        success: true,
        data: {
          user,
        },
      },
      { status: 200 },
    );
  } catch (error) {
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
  }
}
