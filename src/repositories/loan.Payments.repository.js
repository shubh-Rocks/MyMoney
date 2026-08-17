import prisma from "@/lib/prisma";

class LoanPaymentRepository {
  createPayment(tx, paymentData) {
    return tx.loanPayment.create({
      data: paymentData,
    });
  }

  recentPayments(userId) {
    return prisma.loanPayment.findMany({
      where: {
        userId: userId,
      },

      select: {
        id: true,
        amount: true,
        paymentDate: true,
        paymentMethod: true,

        loan: {
          select: {
            borrower: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        paymentDate: "desc",
      },
      take: 5,
    });
  }

  paymentsMethods(userId) {
    return prisma.loanPayment.groupBy({
      by: ["paymentMethod"],
      where: {
        userId: userId,
      },
      _count: {
        _all: true,
      },
    });
  }
}

export const loanPaymentRepository = new LoanPaymentRepository();
