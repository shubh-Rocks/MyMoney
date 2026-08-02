import prisma from "@/lib/prisma";

class UserRepositry {
  findByEmail(email) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  findById(id) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
}

export const userRepository = new UserRepositry();
