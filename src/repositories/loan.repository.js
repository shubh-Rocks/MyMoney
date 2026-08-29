import prisma from "@/lib/prisma";

class LoanRepository {
  findByLoanId(loanId) {
    return prisma.loan.findUnique({
      where: {
        id: loanId,
      },
    });
  }

  createLoan(tx, data) {
    return tx.loan.create({
      data,
    });
  }

  updateLoan(tx, loanId, data) {
    return tx.loan.update({
      where: { id: loanId },
      data,
    });
  }

  async settleLoan(loanId, userId, paymentMethod, loan, settlementAmount) {
    return prisma.$transaction(async (tx) => {
      const payment = await tx.loanPayment.create({
        data: {
          loanId: loan.id,
          userId: userId,
          amount: settlementAmount,
          paymentDate: new Date(),
          paymentMethod: paymentMethod,
        },
      });

      const updateLoan = await tx.loan.update({
        where: {
          id: loan.id,
        },
        data: {
          totalPaid: { increment: settlementAmount },
          remainingAmount: 0,
          status: "PAID",
        },
      });
      return { payment, loan: updateLoan };
    });
  }
}

export const loanRepository = new LoanRepository();
