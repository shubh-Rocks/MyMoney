import prisma from "@/lib/prisma";

class CashFlowRepository {
  async getDailyCollections(userId, startDate, endDate) {
    const payments = await prisma.loanPayment.findMany({
      where: {
        userId,
        paymentDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        amount: true,
        paymentDate: true,
      },
      orderBy: {
        paymentDate: "asc",
      },
    });

    const dailyColloection = {};
    for (const payment of payments) {
      const date = payment.paymentDate.toISOString().split("T")[0];

      if (!dailyColloection[date]) {
        dailyColloection[date] = 0;
      }

      dailyColloection[date] += Number(payment.amount);
    }
    return Object.entries(dailyColloection).map(([date, amount]) => ({
      date,
      amount,
    }));
  }

  async getUpcomingDueLoans(userId, startDate, endDate) {
    const loans = await prisma.loan.findMany({
      where: {
        userId,
        isDeleted: false,
        status: {
          not: "PAID",
        },
        dueDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        remainingAmount: true,
        dueDate: true,
        status: true,
        borrower: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        dueDate: "asc",
      },
    });
    return loans.map((loan) => ({
      loanId: loan.id,
      borrowerId: loan.borrower.id,
      borrowerName: loan.borrower.name,
      dueDate: loan.dueDate,
      remainingAmount: Number(loan.remainingAmount),
      status: loan.status,
    }));
  }
}

export const cashFlowRepository = new CashFlowRepository();
