import prisma from "@/lib/prisma";

class BorrowerRepositry {
  async findByEmail(email) {
    return await prisma.borrower.findUnique({
      where: {
        email,
      },
    });
  }

  async findByPhone(phone) {
    return await prisma.borrower.findUnique({
      where: {
        phone,
      },
    });
  }
  

  createBorrower(data) {
    return prisma.borrower.create({
      data,
    });
  }
}

export const borrowerRepositry = new BorrowerRepositry();
