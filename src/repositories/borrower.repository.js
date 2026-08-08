import prisma from "@/lib/prisma";

class BorrowerRepositry {
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
