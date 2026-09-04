import { AppError } from "@/errors/app-error";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { authService } from "@/services/auth.service";
import { profileUpdate } from "@/services/profile.update.service";
import { updateProfileSchema } from "@/validations/profile.validation";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodePayload = await verifyToken(token);
    const userId = decodePayload.id;

    const body = await request.json();

    const result = updateProfileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "validation failed",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }
    const updatedProfile = await profileUpdate.profileUpdate(
      userId,
      result.data,
    );

    return NextResponse.json({
      message: "profile update successfully",
      data: updatedProfile,
    });
  } catch (error) {
    console.log("profile update failed", error);

    return NextResponse.json(
      {
        error: "Something went wrong while updating profile",
      },
      { status: 500 },
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
        { status: 400 },
      );
    }

    const decodePayload = await verifyToken(token);
    const userId = decodePayload.id;

    const currentUser = await authService.getCurrentUser(userId);
    const profile = await profileUpdate.getprofile(currentUser.id);
    const responseData = {
      fullName: profile?.fullName || currentUser?.name,
      email: currentUser?.email || profile?.email, // <-- Email yahan ensure karein
      phone: profile?.phone || currentUser?.phone,
      gender: profile?.gender,
      businessName: profile?.businessName || profile?.bussinessName,
      isEmailVerified: currentUser?.isEmailVerified || false,
    };
    return NextResponse.json(
      {
        message: "Success",
        method: responseData,
      },
      { status: 200 },
    );
  } catch (error) {
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

    return NextResponse.json(
      {
        message: "internal server error",
      },
      { status: 500 },
    );
  }
}
