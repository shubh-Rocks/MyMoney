import { AppError } from "@/errors/app-error";
import prisma from "@/lib/prisma";
import { loanPaymentRepository } from "@/repositories/loan.Payment.repository";
import { loanRepository } from "@/repositories/loan.repository";

class LoanPayment {
  async loanPaymentService(
    userId,
    loanId,
    amount,
    paymentDate,
    paymentMethod,
    notes,
  ) {
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

    const newTotalPaid = loan.totalPaid + amount;

    const newRemainingAmount = loan.remainingAmount - amount;

    const newStatus = newRemainingAmount === 0 ? "PAID" : "PARTIALLY_PAID";

    return prisma.$transaction(async (tx) => {
      const payment = await loanPaymentRepository.createPayment(tx, {
        userId,
        loanId,
        amount,
        paymentDate,
        paymentMethod,
        notes,
      });

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

export const loanPaymentService = new LoanPayment();
