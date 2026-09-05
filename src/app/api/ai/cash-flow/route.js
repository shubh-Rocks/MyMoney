import { NextResponse } from "next/server";

import { verifyToken } from "@/lib/auth";
import { authService } from "@/services/auth.service";
import { cashFlowService } from "@/services/cash.flow.service";
import { cookies } from "next/headers";
import { AppError } from "@/errors/app-error";
import { success } from "zod";

export async function GET(req) {
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

    const currentUser = await authService.getCurrentUser(userId);

    const { searchParams } = new URL(req.url);

    const rangeParam = searchParams.get("range") || "30";

    const range = Number(rangeParam);

    if (![30, 60, 90].includes(range)) {
      return NextResponse.json(
        {
          success: false,
          error: "Range must be 30, 60 or 90 days",
        },
        { status: 400 },
      );
    }
    const forecast = await cashFlowService.generateForcast(
      currentUser.id,
      range,
    );

    return NextResponse.json({
      success: true,
      message: "Cash flow forecast generated successfully",
      data: forecast,
    });
  } catch (error) {
    console.error("Cash flow forecast error:", error);

    if (error instanceof AppError) {
      return NextResponse.json({
        success: false,
        error: {
          code: error.code,
          error: error.message,
        },
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to generate cash flow forecast",
      },
      { status: 500 },
    );
  }
}
