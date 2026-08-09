import { verifyToken } from "@/lib/auth";
import { authService } from "@/services/auth.service";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function Post(req) {
  try {
    const cookiesStore = await cookies();
    const token = cookiesStore.get("token")?.value;
    if (!token) {
      NextResponse.json(
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
    const validateData = 
  } catch (error) {}
}
