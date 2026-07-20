import { hashPassword, verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { updateProfileSchema } from "@/lib/validations";
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
        { error: "validation failed", details: z.flattenError(result.error) },
        { status: 400 },
      );
    }

    const { name, phone, password } = result.data;
    const updateData = {};
    if (name) updateData.name = name;

    if (password) {
      updateData.password = await hashPassword(password);
    }

    if (phone && phone !== "") {
      const existingPhone = await prisma.user.findFirst({
        where: {
          phone,
          NOT: { id: userId },
        },
      });
      if (existingPhone) {
        return NextResponse.json(
          {
            error: "phone number already used by another account  ",
          },
          { status: 409 },
        );
      }
      updateData.phone = phone;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({
      message: "profile update successfully",
      user: { name: updatedUser.name, phone: updatedUser.phone },
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
