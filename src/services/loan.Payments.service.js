import { AppError } from "@/errors/app-error";
import prisma from "@/lib/prisma";
import { loanPaymentRepository } from "@/repositories/loan.payments.repository";
import { loanRepository } from "@/repositories/loan.repository";

class LoanPaymentService {
  async createPayment({
    userId,
    loanId,
    amount,
    paymentDate,
    paymentMethod,
    notes,
  }) {
    console.log("PAYMENT SERVICE DATA:", {
      userId,
      loanId,
      amount,
      paymentDate,
      paymentMethod,
      notes,
    });
    const loan = await loanRepository.findByLoanId(loanId);

    if (!loan) {
      throw new AppError("Loan not found", 404, "LOAN_NOT_FOUND");
    }
    if (loan.userId !== userId) {
      throw new AppError(
        "you don't have accses to this loan",
        404,
        "FORBIDDEN",
      );
    }

    if (loan.status === "PAID") {
      throw new AppError(
        "loan is already fully paid",
        400,
        "LOAN_ALREADY_PAID",
      );
    }

    if (amount > loan.remainingAmount) {
      throw new AppError(
        "payment exceeds remaining amount",
        400,
        "PAYMENT_EXCEEDS_BALANCE",
      );
    }

    const newTotalPaid = loan.totalPaid.plus(amount);

    const newRemainingAmount = loan.remainingAmount.minus(amount);

    const newStatus = newRemainingAmount.equals(0) ? "PAID" : "PARTIALLY_PAID";

    const paymentData = {
      userId,
      loanId,
      amount,
      paymentDate,
      paymentMethod,
      notes,
    };
    return prisma.$transaction(async (tx) => {
      const payment = await loanPaymentRepository.createPayment(
        tx,
        paymentData,
      );

      await loanRepository.updateLoan(tx, loan.id, {
        totalPaid: newTotalPaid,
        remainingAmount: newRemainingAmount,
        status: newStatus,
      });

      return {
        payment,
        totalPaid: newTotalPaid,
        remainingAmount: newRemainingAmount,
        status: newStatus,
      };
    });
  }
}

export const loanPaymentService = new LoanPaymentService();
