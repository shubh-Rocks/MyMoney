import prisma from "@/lib/prisma";

class ExcelExportRepository {
  async getBorrowersByDateRange({ userId, startDate, endDate, paymentType }) {
    const borrowers = await prisma.borrower.findMany({
      where: {
        userId: userId,

        loans: {
          some: {
            lentDate: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          },
        },
      },

      include: {
        loans: {
          where: {
            lentDate: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return borrowers;
  }
}

export const excelExportRepository = new ExcelExportRepository();
