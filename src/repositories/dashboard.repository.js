import prisma from "@/lib/prisma";

class DasboardRepository {
  getTotalLentAmount(userId) {
    return prisma.loan.aggregate({
      where: {
        userId: userId,
        isDeleted: false,
      },
      _sum: {
        amount: true,
      },
    });
  }

  getTotalPendingAmount(userId) {
    return prisma.loan.aggregate({
      where: {
        userId: userId,
        isDeleted: false,
        status: {
          not: "PAID",
        },
      },

      _sum: {
        remainingAmount: true,
      },
    });
  }

  async getTodayDueAmount(userId) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const result = await prisma.loan.aggregate({
      where: {
        userId: userId,
        isDeleted: false,

        dueDate: {
          gte: startOfDay,
          lte: endOfDay,
        },

        status: {
          not: "PAID",
        },
      },
      _sum: {
        remainingAmount: true,
      },
    });

    return result._sum.remainingAmount ?? 0;
  }

  async getOverdueAmount(userId) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const result = await prisma.loan.aggregate({
      where: {
        userId: userId,
        isDeleted: false,
        dueDate: {
          lt: startOfDay,
        },
        status: {
          not: "PAID",
        },
      },

      _sum: {
        remainingAmount: true,
      },
    });

    return result._sum.remainingAmount ?? 0;
  }

  getActiveBorrowersCount(userId) {
    const count = prisma.borrower.count({
      where: {
        userId: userId,
        isDeleted: false,
        loans: {
          some: {
            status: {
              in: ["ACTIVE", "PARTIALLY_PAID"],
            },
            isDeleted: false,
          },
        },
      },
    });

    return count;
  }

  getTodayDueBorrowerscount(userId) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const dueCount = prisma.borrower.count({
      where: {
        userId: userId,
        isDeleted: false,

        loans: {
          some: {
            dueDate: {
              gte: startOfDay,
              lte: endOfDay,
            },
            status: {
              not: "PAID",
            },
            isDeleted: false,
          },
        },
      },
    });

    return dueCount;
  }

  getOverdueBorrowers(userId) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const overdueCount = prisma.borrower.count({
      where: {
        userId: userId,
        isDeleted: false,
        loans: {
          some: {
            dueDate: {
              lt: startOfDay,
            },
            status: {
              not: "PAID",
            },
            isDeleted: false,
          },
        },
      },
    });

    return overdueCount;
  }
}

export const dashboardRepository = new DasboardRepository();
