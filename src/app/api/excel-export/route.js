import { AppError } from "@/errors/app-error";
import { verifyToken } from "@/lib/auth";
import { authService } from "@/services/auth.service";
import { excelExportService } from "@/services/excel.export.service";
import { excelFormValidationSchema } from "@/validations/excelForm.validations";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import z, { ZodError } from "zod";
export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "unauthorized",
        },
        { status: 401 },
      );
    }

    const decodedPayload = await verifyToken(token);
    const userId = decodedPayload.id;

    const body = await req.json();

    const validateData = excelFormValidationSchema.safeParse(body);

    if (!validateData.success) {
      return NextResponse.json(
        {
          message: "validation Error",
          error: z.flattenError(validateData.error),
        },
        { status: 400 },
      );
    }

    const currentUser = await authService.getCurrentUser(userId);

    const excelExport = await excelExportService.getDetails({
      userId: currentUser.id,
      ...validateData.data,
    });

    return NextResponse.json(
      {
        message: "true",
        excelExport,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("FULL ERROR:", error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "validation error",
            message: "invalid form details",
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
      { status: 500 },
    );
  }
}
