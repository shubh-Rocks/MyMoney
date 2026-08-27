import { AppError } from "@/errors/app-error";
import { verifyToken } from "@/lib/auth";
import { authService } from "@/services/auth.service";
import { loanPaymentService } from "@/services/loan.Payments.service";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    // 1. Get token from cookies
    const cookiesStore = await cookies();
    const token = cookiesStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    // 2. Verify token
    const decodePayload = await verifyToken(token);

    // 3. Get current user
    const currentUser = await authService.getCurrentUser(decodePayload.id);

    const userId = currentUser.id;

    const { loanId } = await params;

    const parsedLoanId = Number(loanId);

    if (!Number.isInteger(parsedLoanId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid loan ID",
        },
        { status: 400 },
      );
    }

    // 5. Get payment method from request body
    const body = await req.json();

    const { paymentMethod } = body;

    if (!paymentMethod) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment method is required",
        },
        { status: 400 },
      );
    }

    // 6. Settle loan
    const settledLoan = await loanPaymentService.settleLoan(
      parsedLoanId,
      userId,
      paymentMethod,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Loan settled successfully",
        loan: settledLoan,
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

    console.error("Settle loan error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
