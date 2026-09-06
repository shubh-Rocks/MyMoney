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
        id: true,
        amount: true,
        paymentDate: true,
        userId: true,
      },
      orderBy: {
        paymentDate: "asc",
      },
    });


    const paymentMap = {};

    for (const payment of payments) {
      const date = payment.paymentDate.toISOString().split("T")[0];

      if (!paymentMap[date]) {
        paymentMap[date] = 0;
      }

      paymentMap[date] += Number(payment.amount);
    }

    const dailyCollections = [];

    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const date = currentDate.toISOString().split("T")[0];

      dailyCollections.push({
        date,
        amount: paymentMap[date] || 0,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log("DAILY COLLECTIONS:", dailyCollections);

    return dailyCollections;
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
