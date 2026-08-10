import { AppError } from "@/errors/app-error";
import prisma from "@/lib/prisma";
import { borrowerRepositry } from "@/repositories/borrower.repository";
import { loanRepository } from "@/repositories/loan.repository";

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

    amount,
    interestRate,
    interestType,
    lentDate,
    dueDate,
  }) {
    const existingEmail = await borrowerRepositry.findByEmail(userId, email);
    if (existingEmail) {
      throw new AppError("Email already exists", 409, "EMAIL_ALREADY_EXISTS");
    }

    const existingPhone = await borrowerRepositry.findByPhone(userId, phone);
    if (existingPhone) {
      throw new AppError(
        "Phone number already exists please give different number",
        409,
        "PHONE_ALREADY_EXISTS",
      );
    }
    const borrowerData = {
      userId,
      name,
      email,
      phone,
      street,
      city,
      state,
      pincode,
    };
    const loanData = {
      userId,
      amount,
      interestRate,
      interestType,
      lentDate,
      dueDate,
      remainingAmount: amount,
    };

    return prisma.$transaction(async (tx) => {
      const borrower = await borrowerRepositry.createBorrower(tx, borrowerData);

      const loan = await loanRepository.createLoan(tx, {
        ...loanData,
        borrowerId: borrower.id,
      });

      return borrower;
    });
  }
}

export const borrowerService = new BorrowerService();
