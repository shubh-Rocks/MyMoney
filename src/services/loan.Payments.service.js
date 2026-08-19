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

  async recentPayments(userId, page, limit) {
    const getAllRecentPayments = await loanPaymentRepository.recentPayments(
      userId,
      page,
      limit,
    );

    const totalPages = Math.ceil(getAllRecentPayments.totalPayments / limit);

    return {
      payments: getAllRecentPayments.payments,
      pagination: {
        currentPage: page,
        limit,
        totalPayments: getAllRecentPayments.totalPayments,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async getPaymentsMethod(userId) {
    const getAllPaymentsMethod =
      await loanPaymentRepository.paymentsMethods(userId);

    const payments = {
      UPI: { amount: 0, count: 0 },
      CASH: { amount: 0, count: 0 },
      BANK_TRANSFER: { amount: 0, count: 0 },
      CHEQUE: { amount: 0, count: 0 },
    };
    getAllPaymentsMethod.forEach((items) => {
      payments[items.paymentMethod] = {
        amount: Number(items._sum.amount ?? 0),
        count: items._count._all,
      };
    });
    const total = Object.values(payments).reduce(
      (sum, payment) => sum + payment.amount,
      0,
    );
    return {
      UPI: {
        amount: payments.UPI.amount,
        count: payments.UPI.count,
        percentages: total > 0 ? Math.round((payments.UPI / total) * 100) : 0,
      },
      CASH: {
        amount: payments.CASH.amount,
        count: payments.CASH.count,
        percentages: total > 0 ? Math.round((payments.CASH / total) * 100) : 0,
      },
      BANK_TRANSFER: {
        amount: payments.BANK_TRANSFER.amount,
        count: payments.BANK_TRANSFER.count,
        percentages:
          total > 0 ? Math.round((payments.BANK_TRANSFER / total) * 100) : 0,
      },
      CHEQUE: {
        amount: payments.CHEQUE.amount,
        count: payments.CHEQUE.count,
        percentages:
          total > 0 ? Math.round((payments.CHEQUE / total) * 100) : 0,
      },
      total,
    };
  }
}

export const loanPaymentService = new LoanPaymentService();
