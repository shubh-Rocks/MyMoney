import { AppError } from "@/errors/app-error";
import { verifyToken } from "@/lib/auth";
import { authService } from "@/services/auth.service";
import { loanPaymentService } from "@/services/loan.Payments.service";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const cookiesStore = await cookies();
    const token = cookiesStore.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        {
          message: "unauthorized",
        },
        { status: 401 },
      );
    }

    const decodePayload = await verifyToken(token);
    const userId = decodePayload.id;
    const currentUser = await authService.getCurrentUser(userId);

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = 5;

    const recentPay = await loanPaymentService.recentPayments(
      currentUser.id,
      page,
      limit,
    );

    return NextResponse.json(
      {
        message: "recent Payments fetched successfully",
        recentPay,
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
            details: error.message,
          },
        },
        { status: error.statusCode },
      );
    }
    return NextResponse.json(
      {
        message: "internal server error",
      },
      { status: 500 },
    );
  }
}
