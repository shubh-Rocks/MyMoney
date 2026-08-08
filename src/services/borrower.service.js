import { AppError } from "@/errors/app-error";
import { borrowerRepositry } from "@/repositories/borrower.repository";

class BorrowerService {
  async createBorrower({
    userId,
    name,
    email,
    phone,
    street,
    city,
    state,
    pincode,
  }) {
    const existingEmail = await borrowerRepositry.findByEmail(email);
    if (existingEmail) {
      throw new AppError("Email already exists", 409, "EMAIL_ALREADY_EXISTS");
    }

    const existingPhone = await borrowerRepositry.findByPhone(phone);
    if (existingPhone) {
      throw new AppError(
        "Phone number already exists please give different number",
        409,
        "PHONE_ALREADY_EXISTS",
      );
    }
    const borrower = await borrowerRepositry.createBorrower({
      userId,
      name,
      email,
      phone,
      street,
      city,
      state,
      pincode,
    });

    return borrower;
  }
}

export const borrowerService = new BorrowerService();
