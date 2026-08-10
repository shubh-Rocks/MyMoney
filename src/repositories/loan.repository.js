import prisma from "@/lib/prisma";

/**
 * @param {import('@prisma/client').Prisma.TransactionClient} tx
 */
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
}

export const loanRepository = new LoanRepository();
