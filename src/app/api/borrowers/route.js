import { AppError } from "@/errors/app-error";
import { verifyToken } from "@/lib/auth";
import { authService } from "@/services/auth.service";
import { borrowerService } from "@/services/borrower.service";
import { createBorrowerWithLoanSchema } from "@/validations/borrower.validation";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import z from "zod";

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

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

    const body = await req.json();

    const validateData = createBorrowerWithLoanSchema.safeParse(body);

    if (!validateData.success) {
      return NextResponse.json(
        {
          error: "validation error",
          details: z.flattenError(validateData.error),
        },
        { status: 400 },
      );
    }

    const currentUser = await authService.getCurrentUser(userId);

    const borrower = await borrowerService.createBorrower({
      userId: currentUser.id,
      ...validateData.data,
    });

    return NextResponse.json(
      {
        message: "borrower created successfully",
        borrower,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "validation error",
            message: "invalid borrower data",
            details: error.message,
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



    
    return NextResponse.json(
      {
        message: "borrower and loan fetch sucessfully",
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
      { status: 500 },
    );
  }
}
