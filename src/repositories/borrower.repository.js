import prisma from "@/lib/prisma";

class BorrowerRepositry {
  findAllByUser(userId) {
    return prisma.borrower.findMany({
      where: {
        userId: userId,
        isDeleted: false,
      },
      include: {
        loans: {
          select: {
            id: true,
            amount: true,
            totalPaid: true,
            remainingAmount: true,
            status: true,
            lentDate: true,
            dueDate: true,
          },
        },
      },
    });
  }

  findByEmail(userId, email) {
    return prisma.borrower.findUnique({
      where: {
        userId_email: {
          userId,
          email,
        },
      },
    });
  }

  findByPhone(userId, phone) {
    return prisma.borrower.findUnique({
      where: {
        userId_phone: { userId, phone },
      },
    });
  }

  createBorrower(tx, data) {
    return tx.borrower.create({
      data,
    });
  }
}

export const borrowerRepositry = new BorrowerRepositry();
