import { AppError } from "@/errors/app-error";
import { verifyToken } from "@/lib/auth";
import { authService } from "@/services/auth.service";
import { loanPaymentService } from "@/services/loan.Payments.service";
import { loanPaymentSchema } from "@/validations/loan.Payments.validation";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import z, { ZodError } from "zod";

export async function POST(req) {
  try {
    const cookiesStore = await cookies();
    const token = cookiesStore.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        {
          error: "unauthorized",
        },
        { status: 401 },
      );
    }

    const decodePayload = await verifyToken(token);
    const userId = decodePayload.id;
    const currentUser = await authService.getCurrentUser(userId);

    const body = await req.json();

    const validateData = loanPaymentSchema.safeParse(body);

    if (!validateData.success) {
      return NextResponse.json(
        {
          error: "validation error",
          details: z.flattenError(validateData.error),
        },
        { status: 400 },
      );
    }

    const createPayment = await loanPaymentService.createPayment({
      userId: currentUser.id,
      ...validateData.data,
    });

    return NextResponse.json(
      {
        message: " loan payment created successfully",
        createPayment,
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("payment Api error", error);
    console.log("payment Api error", error?.message);
    console.log("payment Api error", error?.stack);
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "validation error",
            message: "invalid loan details",
            details: z.flattenError(error),
          },
        },
        { status: 401 },
      );
    }

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
      { status: 500 },
    );
  }
}
