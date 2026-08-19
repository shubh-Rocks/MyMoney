import { AppError } from "@/errors/app-error";
import { verifyToken } from "@/lib/auth";
import { authService } from "@/services/auth.service";
import { loanPaymentService } from "@/services/loan.Payments.service";
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

    const decodePayload = await verifyToken(token);
    const userId = decodePayload.id;
    const CurrentUser = await authService.getCurrentUser(userId);
    const methods = await loanPaymentService.getPaymentsMethod(CurrentUser.id);

    return NextResponse.json(
      {
        message: "success", 
        methods,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    if (error instanceof AppError) {
      return NextResponse.json(
        {
          error: {
            code: error.code,
            details: error.message,
          },
        },
        { status: error.statusCode },
      );
    }
  }
}
