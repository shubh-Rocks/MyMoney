import prisma from "@/lib/prisma";

class LoanPaymentRepository {
  createPayment(tx, paymentData) {
    return tx.loanPayment.create({
      data: paymentData,
    });
  }

  async recentPayments(userId, page = 1, limit = 5) {
    const skip = (page - 1) * limit;
    const [payments, totalPayments] = await prisma.$transaction([
      prisma.loanPayment.findMany({
        where: {
          userId: userId,
        },

        select: {
          id: true,
          amount: true,
          paymentDate: true,
          paymentMethod: true,
          notes: true,

          loan: {
            select: {
              status: true,
              borrower: {
                select: {
                  name: true,
                  phone: true,
                 
                },
              },
            },
          },
        },
        orderBy: [
          {
            paymentDate: "desc",
          },
          {
            id: "desc",
          },
        ],
        skip: skip,
        take: limit,
      }),
      prisma.loanPayment.count({
        where: {
          userId: userId,
        },
      }),
    ]);

    return {
      payments,
      totalPayments,
    };
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
