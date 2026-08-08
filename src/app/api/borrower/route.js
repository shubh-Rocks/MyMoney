import { verifyToken } from "@/lib/auth";
import { authService } from "@/services/auth.service";
import { borrowerService } from "@/services/borrower.service";
import { createBorrowerWithLoanSchema } from "@/validations/borrower.validation";
import { NextResponse } from "next/server";
import { success } from "zod";

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({
        error: "unauthorized",
      });
    }

    const decodePayload = await verifyToken(token);
    const userId = decodePayload.id;
    const body = await req.json();

    const validateData = createBorrowerWithLoanSchema.safeParse(body);

    if (!validateData.success) {
      return NextResponse.json({
        error: "validation error",
        details: z.flattrnError(validateData.error),
      });
    }
    
    const currentUser = await authService.getCurrentUser(decoded.id);
    const borrower = await borrowerService.createBorrower({
      userId: currentUser.id,
      ...validateData.data,
    });
  } catch (error) {}
}
