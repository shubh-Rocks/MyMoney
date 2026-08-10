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
}

export const loanRepository = new LoanRepository();
