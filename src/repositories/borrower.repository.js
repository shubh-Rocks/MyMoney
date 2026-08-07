import prisma from "@/lib/prisma";

class BorrowerRepositry {
  createBorrower(data) {
    return prisma.borrower.create({
      data,
    });
  }
}

export const borrowerRepositry = new BorrowerRepositry();
