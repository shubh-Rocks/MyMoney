import { AppError } from "@/errors/app-error";
import { verifyToken } from "@/lib/auth";
import { authService } from "@/services/auth.service";
import { dashboardService } from "@/services/dashboard.service";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        {
          message: "unauthorized",
        },
        { status: 401 },
      );
    }

    const decodedPayload = await verifyToken(token);
    const userId = decodedPayload.id;
    const currentUser = await authService.getCurrentUser(userId);

    const BorrowersLoanSummary = await dashboardService.dashboardDetails(
      currentUser.id,
    );

    return NextResponse.json(
      {
        message: "dashboard data fetch sucessfully",
        BorrowersLoanSummary,
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
            error: error.message,
          },
        },
        { status: error.statusCode },
      );
    }

    return NextResponse.json(
      {
        message: "internal server error",
      },
      {
        status: 500,
      },
    );
  }
}
